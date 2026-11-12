import { env } from "./env";
import { createItem, logRun } from "./db";
import type { ItemData, SectionKey } from "@/lib/section-schemas";
import { CATEGORIES } from "@/types/resource";

/**
 * The always-on gatherer (Cloudflare Cron, every 6 hours). Official, public
 * sources only. Everything lands in the review queue as `pending`; nothing is
 * published without approval. Duplicates — including anything previously
 * rejected — are skipped by the database's unique key.
 *
 * Judgement-heavy finds (great motion clips, OG cards, curated resources)
 * come from the scheduled Claude agent via /api/ingest instead.
 */
const UA = "UIArchivesBot/1.0 (+https://uiarchives.com)";

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T | null> {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/json", ...headers } });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

async function queue(section: SectionKey, origin: string, items: ItemData[]) {
  let queued = 0;
  for (const data of items) {
    try {
      if (await createItem({ section, data, source: "automation", origin })) queued++;
    } catch {}
  }
  return queued;
}

/**
 * Must read as design / frontend work. Applied to every automated find so the
 * queue isn't filled with things you'd only reject.
 */
const ON_TOPIC = /\b(ui|ux|design|designer|interface|frontend|front-end|css|tailwind|shadcn|react|component|animation|animate|motion|typograph|typeface|font|icon|svg|figma|accessib|a11y|color|colour|gradient|layout|landing page|web design)\b/i;

/** Stricter, for skills: the repo must be *about* design / frontend craft, not just use React. */
const DESIGN_SKILL = /\b(ui|ux|design|designer|frontend|front-end|css|tailwind|shadcn|animation|motion|typograph|accessib|a11y|figma|taste|visual|interface design|web design)\b/i;

/** Rotate through search terms so each run looks somewhere slightly different. */
const pick = <T,>(list: T[], seed: number, n: number) =>
  Array.from({ length: n }, (_, i) => list[(seed + i) % list.length]);

/* ---------- App icons: Apple's App Store search API ---------- */

const APP_TERMS = ["design", "productivity", "notes", "calendar", "photo editor", "finance", "weather", "journal", "habit tracker", "music", "camera", "fitness", "mail", "browser", "focus timer", "reading"];

async function appIcons(seed: number) {
  type Res = { results: { trackName: string; artistName: string; primaryGenreName: string; artworkUrl512: string; trackViewUrl: string; averageUserRating?: number; userRatingCount?: number }[] };
  const found: ItemData[] = [];
  for (const term of pick(APP_TERMS, seed, 2)) {
    const r = await getJson<Res>(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=25&country=us`);
    for (const a of r?.results ?? []) {
      // Well-loved apps only: rating ≥ 4.5 from at least 2,000 ratings.
      if ((a.averageUserRating ?? 0) < 4.5 || (a.userRatingCount ?? 0) < 2000) continue;
      found.push({
        name: a.trackName,
        developer: a.artistName,
        category: a.primaryGenreName,
        link: a.trackViewUrl.split("?")[0],
        image: a.artworkUrl512.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/, "/1024x1024bb.webp"),
        platform: ["iOS"],
      });
    }
  }
  return { found: found.length, queued: await queue("app-icons", "app-store", found.slice(0, 12)) };
}

/* ---------- Skills: GitHub repository search ---------- */

const SKILL_QUERIES = ["topic:agent-skills", "topic:claude-skills", "topic:claude-code-skills", "\"SKILL.md\" design in:readme", "\"npx skills add\" frontend in:readme"];

async function skills(seed: number) {
  type Res = { items: { full_name: string; html_url: string; description: string | null; owner: { login: string }; topics: string[]; stargazers_count: number }[] };
  const headers: Record<string, string> = env.GITHUB_TOKEN ? { authorization: `Bearer ${env.GITHUB_TOKEN}` } : {};
  const found: ItemData[] = [];
  for (const q of pick(SKILL_QUERIES, seed, 2)) {
    const r = await getJson<Res>(`https://api.github.com/search/repositories?q=${encodeURIComponent(`${q} stars:>40`)}&sort=stars&order=desc&per_page=15`, headers);
    for (const repo of r?.items ?? []) {
      // Judge on name, description and topics minus the generic agent tags.
      const about = `${repo.full_name.split("/")[1]} ${repo.description ?? ""} ${repo.topics.filter((t) => !/skill|agent|claude|codex|cursor|mcp|ai/.test(t)).join(" ")}`;
      if (!DESIGN_SKILL.test(about)) continue;
      found.push({
        name: repo.full_name.split("/")[1],
        repo: repo.html_url,
        install: `npx skills add ${repo.full_name}`,
        authorName: repo.owner.login,
        description: repo.description ?? "",
        topics: repo.topics.slice(0, 5),
        agents: ["Claude Code"],
      });
    }
  }
  return { found: found.length, queued: await queue("skills", "github", found.slice(0, 10)) };
}

/* ---------- Resources: Hacker News "Show HN", well received ---------- */

const HN_TERMS = ["UI components", "design system", "icons", "typeface", "font", "animation library", "Tailwind", "React components", "color palette", "design tool", "SVG", "CSS"];

const guessCategory = (text: string): string => {
  const t = text.toLowerCase();
  if (/icon/.test(t)) return "Icons";
  if (/font|typeface|typograph/.test(t)) return "Typography";
  if (/animat|motion/.test(t)) return "Animation";
  if (/component|ui kit|tailwind|shadcn|design system/.test(t)) return "Components";
  if (/figma|design tool|prototyp/.test(t)) return "Design Tools";
  if (/color|gradient|illustrat|svg|pattern/.test(t)) return "Graphics";
  return "Dev Tools";
};

async function resources(seed: number) {
  type Res = { hits: { title: string; url: string | null; points: number; objectID: string }[] };
  const weekAgo = Math.floor(Date.now() / 1000) - 7 * 86400;
  const found: ItemData[] = [];
  for (const term of pick(HN_TERMS, seed, 3)) {
    const r = await getJson<Res>(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(term)}&tags=show_hn&restrictSearchableAttributes=title&numericFilters=points>80,created_at_i>${weekAgo}&hitsPerPage=10`,
    );
    for (const h of r?.hits ?? []) {
      if (!h.url) continue;
      const title = h.title.replace(/^Show HN:\s*/i, "");
      if (!ON_TOPIC.test(title)) continue;
      const [name, ...rest] = title.split(/\s[–—-]\s|:\s/);
      const category = guessCategory(title);
      found.push({
        title: name.trim().slice(0, 60),
        url: h.url,
        category: (CATEGORIES as readonly string[]).includes(category) ? category : "Dev Tools",
        description: rest.join(" — ").trim() || title,
        tags: [`HN ${h.points} points`],
      });
    }
  }
  return { found: found.length, queued: await queue("resources", "hacker-news", found.slice(0, 10)) };
}

/* ---------- Runner ---------- */

const SOURCES: [string, (seed: number) => Promise<{ found: number; queued: number }>][] = [
  ["app-store", appIcons],
  ["github", skills],
  ["hacker-news", resources],
];

export async function runAutomation(_cron?: string) {
  const seed = Math.floor(Date.now() / (6 * 3600_000));
  for (const [name, run] of SOURCES) {
    try {
      const { found, queued } = await run(seed);
      await logRun(name, found, queued);
    } catch (e) {
      await logRun(name, 0, 0, (e as Error).message).catch(() => {});
    }
  }
}
