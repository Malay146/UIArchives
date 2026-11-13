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
 * Judgement-heavy finds (great design videos, OG cards, curated resources)
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

/** Take one from each list in turn, so no single search term fills the queue. */
const interleave = <T,>(lists: T[][]): T[] => {
  const out: T[] = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
};

/** Rotate through search terms so each run looks somewhere slightly different. */
const pick = <T,>(list: T[], seed: number, n: number) =>
  Array.from({ length: n }, (_, i) => list[(seed + i) % list.length]);

/* ---------- App icons: App Store search + per-genre top charts ---------- */

const APP_TERMS = [
  "design", "productivity", "notes", "calendar", "photo editor", "finance", "weather", "journal", "habit tracker",
  "music", "camera", "fitness", "mail", "browser", "focus timer", "reading", "todo", "budget", "sleep", "meditation",
  "widget", "launcher", "scanner", "translator", "podcast", "recipes", "travel", "language learning", "drawing",
  "video editor", "password manager", "clock", "health", "running", "maps", "markdown", "ai assistant", "kids",
];

/** App Store genres whose charts are worth a look for icons. */
const APP_GENRES: Record<string, string> = {
  "6027": "Graphics & Design", "6007": "Productivity", "6008": "Photo & Video", "6002": "Utilities",
  "6012": "Lifestyle", "6013": "Health & Fitness", "6015": "Finance", "6001": "Weather", "6011": "Music",
  "6017": "Education", "6003": "Travel", "6023": "Food & Drink", "6005": "Social Networking", "6000": "Business",
};

const artwork1024 = (url: string) => url.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/, "/1024x1024bb.webp");

async function appIcons(seed: number) {
  type Search = { results: { trackName: string; artistName: string; primaryGenreName: string; artworkUrl512: string; trackViewUrl: string; averageUserRating?: number; userRatingCount?: number }[] };
  type Chart = { feed?: { entry?: { "im:name": { label: string }; "im:artist": { label: string }; "im:image": { label: string }[]; link: { attributes: { href: string } } | { attributes: { href: string; rel?: string } }[]; category: { attributes: { label: string } } }[] } };
  const buckets: ItemData[][] = [];

  // Search: 4 rotating terms, well-rated apps only (≥ 4.4 stars from ≥ 300 ratings).
  for (const term of pick(APP_TERMS, seed * 4, 4)) {
    const r = await getJson<Search>(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=40&country=us`);
    const found: ItemData[] = [];
    buckets.push(found);
    for (const a of r?.results ?? []) {
      if ((a.averageUserRating ?? 0) < 4.4 || (a.userRatingCount ?? 0) < 300) continue;
      found.push({
        name: a.trackName, developer: a.artistName, category: a.primaryGenreName,
        link: a.trackViewUrl.split("?")[0], image: artwork1024(a.artworkUrl512), platform: ["iOS"],
      });
    }
  }

  // Charts: top 25 free apps in 2 rotating genres (Apple's official RSS feed).
  const genres = Object.keys(APP_GENRES);
  for (const g of pick(genres, seed * 2, 2)) {
    const r = await getJson<Chart>(`https://itunes.apple.com/us/rss/topfreeapplications/limit=25/genre=${g}/json`);
    const found: ItemData[] = [];
    buckets.push(found);
    for (const e of r?.feed?.entry ?? []) {
      const img = e["im:image"]?.at(-1)?.label;
      // `link` is one object, or a list (page + preview video) for some apps.
      const href = (Array.isArray(e.link) ? e.link[0] : e.link)?.attributes?.href;
      if (!img || !href) continue;
      found.push({
        name: e["im:name"].label, developer: e["im:artist"].label, category: e.category?.attributes?.label ?? APP_GENRES[g],
        link: href.split("?")[0], image: artwork1024(img), platform: ["iOS"],
      });
    }
  }

  const all = interleave(buckets);
  return { found: all.length, queued: await queue("app-icons", "app-store", all.slice(0, 25)) };
}

/* ---------- Skills: GitHub repository search ---------- */

const SKILL_QUERIES = [
  "topic:agent-skills", "topic:claude-skills", "topic:claude-code-skills", "topic:skills topic:design",
  "\"SKILL.md\" design in:readme", "\"npx skills add\" frontend in:readme", "\"SKILL.md\" animation in:readme",
  "\"SKILL.md\" ui in:readme", "\"SKILL.md\" tailwind in:readme", "\"SKILL.md\" accessibility in:readme",
];

async function skills(seed: number) {
  type Res = { items: { full_name: string; html_url: string; description: string | null; owner: { login: string }; topics: string[]; stargazers_count: number }[] };
  const headers: Record<string, string> = env.GITHUB_TOKEN ? { authorization: `Bearer ${env.GITHUB_TOKEN}` } : {};
  const buckets: ItemData[][] = [];
  for (const q of pick(SKILL_QUERIES, seed * 3, 3)) {
    const r = await getJson<Res>(`https://api.github.com/search/repositories?q=${encodeURIComponent(`${q} stars:>15`)}&sort=updated&order=desc&per_page=30`, headers);
    const found: ItemData[] = [];
    buckets.push(found);
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
  const all = interleave(buckets);
  return { found: all.length, queued: await queue("skills", "github", all.slice(0, 15)) };
}

/* ---------- Resources: Hacker News "Show HN" + rising GitHub design repos ---------- */

const HN_TERMS = [
  "UI components", "design system", "icons", "typeface", "font", "animation library", "Tailwind", "React components",
  "color palette", "design tool", "SVG", "CSS", "Figma", "shadcn", "landing page", "illustrations", "gradient",
  "UI kit", "web design", "motion", "3D", "charts", "accessibility", "prototype",
];

const RESOURCE_TOPICS = [
  "design-system", "ui-components", "react-components", "tailwindcss-components", "shadcn-ui", "icons", "icon-pack",
  "fonts", "typeface", "animation-library", "css-animations", "color-palette", "svg-icons", "ui-kit", "framer-motion",
];

const guessCategory = (text: string): string => {
  const t = text.toLowerCase();
  if (/icon/.test(t)) return "Icons";
  if (/font|typeface|typograph/.test(t)) return "Typography";
  if (/animat|motion/.test(t)) return "Animation";
  if (/component|ui kit|ui-kit|tailwind|shadcn|design system|design-system/.test(t)) return "Components";
  if (/figma|design tool|prototyp/.test(t)) return "Design Tools";
  if (/color|colour|gradient|illustrat|svg|pattern|3d/.test(t)) return "Graphics";
  return "Dev Tools";
};

const asCategory = (c: string) => ((CATEGORIES as readonly string[]).includes(c) ? c : "Dev Tools");

async function resources(seed: number) {
  type Hn = { hits: { title: string; url: string | null; points: number }[] };
  type Gh = { items: { name: string; full_name: string; html_url: string; homepage: string | null; description: string | null; topics: string[]; stargazers_count: number }[] };
  const twoWeeksAgo = Math.floor(Date.now() / 1000) - 14 * 86400;
  const buckets: ItemData[][] = [];

  // Show HN from the last two weeks with 30+ points, 4 rotating terms.
  for (const term of pick(HN_TERMS, seed * 4, 4)) {
    const r = await getJson<Hn>(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(term)}&tags=show_hn&numericFilters=points>30,created_at_i>${twoWeeksAgo}&hitsPerPage=20`,
    );
    const found: ItemData[] = [];
    buckets.push(found);
    for (const h of r?.hits ?? []) {
      if (!h.url) continue;
      const title = h.title.replace(/^Show HN:\s*/i, "");
      if (!ON_TOPIC.test(title)) continue;
      const [name, ...rest] = title.split(/\s[–—-]\s|:\s/);
      found.push({
        title: name.trim().slice(0, 60),
        url: h.url,
        category: asCategory(guessCategory(title)),
        description: rest.join(" — ").trim() || title,
        tags: [`HN ${h.points} points`],
      });
    }
  }

  // GitHub: design / frontend repos with 100+ stars, active in the last 60 days, 2 rotating topics.
  const since = new Date(Date.now() - 60 * 86400_000).toISOString().slice(0, 10);
  const headers: Record<string, string> = env.GITHUB_TOKEN ? { authorization: `Bearer ${env.GITHUB_TOKEN}` } : {};
  for (const topic of pick(RESOURCE_TOPICS, seed * 2, 2)) {
    const r = await getJson<Gh>(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(`topic:${topic} stars:>100 pushed:>${since}`)}&sort=stars&order=desc&per_page=15`,
      headers,
    );
    const found: ItemData[] = [];
    buckets.push(found);
    for (const repo of r?.items ?? []) {
      const text = `${repo.name} ${repo.description ?? ""} ${repo.topics.join(" ")}`;
      found.push({
        title: repo.name,
        url: repo.homepage && /^https?:\/\//.test(repo.homepage) ? repo.homepage : repo.html_url,
        category: asCategory(guessCategory(text)),
        description: repo.description ?? "",
        tags: ["Open Source", `${repo.stargazers_count.toLocaleString("en-US")} stars`],
      });
    }
  }

  const all = interleave(buckets);
  return { found: all.length, queued: await queue("resources", "web", all.slice(0, 20)) };
}

/* ---------- Runner ---------- */

const SOURCES: [string, (seed: number) => Promise<{ found: number; queued: number }>][] = [
  ["app-store", appIcons],
  ["github", skills],
  ["web", resources],
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
