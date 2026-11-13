import { approvedItems } from "./db";
import { identityOf, norm, uniqueBy } from "./dedupe";
import { resources as staticResources } from "@/lib/resources";
import { designClips, type DesignClip } from "@/data/collections/designs";
import { ogImages, type OgImage } from "@/data/collections/og-images";
import { appIcons, type AppIcon } from "@/data/collections/app-icons";
import { skills, type Skill } from "@/data/collections/skills";
import { normalizeResource, type UiCardData } from "@/types/resource";
import { dedupeKey, type ItemData, type SectionKey } from "@/lib/section-schemas";

/**
 * What each public section shows: the hand-curated data files plus
 * everything approved on /review (newest approvals last, so catalogue
 * numbers for existing entries never shift).
 *
 * Every list is de-duplicated by the same identity used on submit and
 * approval (website, X post, page, App Store id, repo), so nothing appears
 * twice even if it ends up in both the data files and the database. The
 * hand-curated copy wins.
 */
const s = (d: ItemData, k: string) => (typeof d[k] === "string" ? (d[k] as string) : "");
const a = (d: ItemData, k: string) => (Array.isArray(d[k]) ? (d[k] as string[]) : d[k] ? [String(d[k])] : []);
const iso = (t: number | null) => new Date(t ?? Date.now()).toISOString().slice(0, 10);

export async function getResources(): Promise<UiCardData[]> {
  const extra = (await approvedItems("resources"))
    .reverse()
    .map((it): UiCardData | null => {
      const d = it.data;
      const category = s(d, "category");
      const social = category === "Socials";
      return normalizeResource({
        title: s(d, "title"),
        description: s(d, "description"),
        tag: [category, ...a(d, "tags")].filter(Boolean),
        links: social ? { twitter: s(d, "url") } : { website: s(d, "url") },
        ...(s(d, "image") ? { image: s(d, "image") } : {}),
        ...(s(d, "logo") ? { logo: s(d, "logo") } : {}),
        ...(s(d, "headline") ? { headline: s(d, "headline") } : {}),
        ...(s(d, "metaDescription") ? { metaDescription: s(d, "metaDescription") } : {}),
      });
    })
    .filter((r): r is UiCardData => !!r);
  // Full link (not just the domain) so two curated pages on one site both show.
  return uniqueBy([...staticResources, ...extra], (r) => [dedupeKey(r.links?.website || r.links?.twitter || ""), norm(r.title)]);
}

export async function getDesigns(): Promise<DesignClip[]> {
  const extra = (await approvedItems("designs")).map((it): DesignClip => {
    const d = it.data;
    return {
      id: `m-${it.id}`,
      title: s(d, "title"),
      author: {
        name: s(d, "authorName") || s(d, "authorHandle"),
        handle: s(d, "authorHandle").replace(/^@/, ""),
        avatar: s(d, "authorAvatar") || undefined,
      },
      post: s(d, "post"),
      video: s(d, "video"),
      poster: s(d, "poster"),
      kind: a(d, "kind"),
      platform: a(d, "platform"),
      stack: a(d, "stack"),
      added: iso(it.reviewed_at),
      posted: s(d, "postedAt") || undefined,
      duration: s(d, "durationMs") ? Math.round(Number(s(d, "durationMs")) / 1000) : undefined,
      width: Number(s(d, "width")) || undefined,
      height: Number(s(d, "height")) || undefined,
      caption: s(d, "caption") || undefined,
      note: s(d, "note") || undefined,
    };
  });
  const kept = new Set(uniqueBy([...designClips, ...extra], (d) => [identityOf(d.post)]));
  return [...extra, ...designClips].filter((d) => kept.has(d));
}

export async function getOgImages(): Promise<OgImage[]> {
  const extra = (await approvedItems("og-images")).map((it): OgImage => {
    const d = it.data;
    return {
      id: `og-${it.id}`,
      title: s(d, "title"),
      url: s(d, "url"),
      image: s(d, "image"),
      width: 1200,
      height: 630,
      style: a(d, "style"),
      theme: (s(d, "theme") as OgImage["theme"]) || "Light",
      industry: s(d, "industry"),
      pageTitle: s(d, "pageTitle") || undefined,
      pageDescription: s(d, "pageDescription") || undefined,
      added: iso(it.reviewed_at),
    };
  });
  const kept = new Set(uniqueBy([...ogImages, ...extra], (o) => [identityOf(o.url)]));
  return [...extra, ...ogImages].filter((o) => kept.has(o));
}

export async function getAppIcons(): Promise<AppIcon[]> {
  const extra = (await approvedItems("app-icons")).map((it): AppIcon => {
    const d = it.data;
    return {
      id: `ai-${it.id}`,
      name: s(d, "name"),
      developer: s(d, "developer"),
      image: s(d, "image"),
      platform: a(d, "platform") as AppIcon["platform"],
      category: s(d, "category"),
      style: a(d, "style"),
      color: a(d, "color"),
      link: s(d, "link"),
      added: iso(it.reviewed_at),
    };
  });
  const kept = new Set(uniqueBy([...appIcons, ...extra], (a) => [identityOf(a.link)]));
  return [...extra, ...appIcons].filter((a) => kept.has(a));
}

export async function getSkills(): Promise<Skill[]> {
  const extra = (await approvedItems("skills")).map((it): Skill => {
    const d = it.data;
    return {
      id: `sk-${it.id}`,
      name: s(d, "name"),
      author: { name: s(d, "authorName") },
      repo: s(d, "repo"),
      install: s(d, "install"),
      description: s(d, "description"),
      topics: a(d, "topics"),
      agents: a(d, "agents"),
      skills: s(d, "skills")
        .split("\n")
        .map((line) => line.split(/\s[—–-]\s/))
        .filter(([n]) => n?.trim())
        .map(([name, ...rest]) => ({ name: name.trim(), summary: rest.join(" — ").trim() })),
    };
  });
  return uniqueBy([...skills, ...extra], (k) => [identityOf(k.repo)]).map((k) => ({
    ...k,
    // A pack never lists the same skill twice.
    skills: uniqueBy(k.skills, (x) => [norm(x.name)]),
  }));
}

export async function getSectionCounts(): Promise<Record<SectionKey, number>> {
  const [r, m, o, ai, sk] = await Promise.all([getResources(), getDesigns(), getOgImages(), getAppIcons(), getSkills()]);
  return { resources: r.length, designs: m.length, "og-images": o.length, "app-icons": ai.length, skills: sk.length };
}
