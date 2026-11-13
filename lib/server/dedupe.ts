import type { ItemData, SectionKey } from "@/lib/section-schemas";
import { SECTION_SCHEMAS } from "@/lib/section-schemas";
import { resources } from "@/lib/resources";
import { designClips } from "@/data/collections/designs";
import { ogImages } from "@/data/collections/og-images";
import { appIcons } from "@/data/collections/app-icons";
import { skills } from "@/data/collections/skills";

/**
 * One identity per thing, so the same tool, post, card, app or repo can never
 * be queued twice — whether it's in the built-in data files or already in the
 * review database (pending, approved or rejected).
 *
 *  - X posts → status id; App Store apps → app id.
 *  - Sites where the path is the identity (GitHub repos, X profiles, npm…) → host + path.
 *  - Everything else → the domain alone, so "ui.shadcn.com/docs" matches "ui.shadcn.com".
 */
const PATH_IS_IDENTITY = /(^|\.)(github\.com|gitlab\.com|x\.com|twitter\.com|npmjs\.com|figma\.com|dribbble\.com|behance\.net|codepen\.io|youtube\.com|medium\.com|producthunt\.com|apps\.apple\.com)$/;

export function identityOf(value: string): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase().replace(/^www\./, "").replace(/^twitter\.com$/, "x.com");
    const status = u.pathname.match(/\/status\/(\d+)/);
    if (status) return `x:${status[1]}`;
    const app = u.pathname.match(/\/id(\d+)/);
    if (host === "apps.apple.com" && app) return `appstore:${app[1]}`;
    if (PATH_IS_IDENTITY.test(host)) {
      // First two path segments: github.com/owner/repo, x.com/handle, npmjs.com/package/name
      const parts = u.pathname.split("/").filter(Boolean).slice(0, 2).join("/").toLowerCase();
      return `${host}/${parts}`;
    }
    return host;
  } catch {
    return raw.toLowerCase();
  }
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");

/** Identities and names of everything already in the built-in data files. */
function staticIndex(section: SectionKey): { ids: Set<string>; names: Set<string> } {
  const ids = new Set<string>();
  const names = new Set<string>();
  const add = (url: string | undefined, name?: string) => {
    if (url) ids.add(identityOf(url));
    if (name) names.add(norm(name));
  };
  if (section === "resources") for (const r of resources) add(r.links?.website || r.links?.twitter, r.title);
  if (section === "designs") for (const d of designClips) add(d.post);
  if (section === "og-images") for (const o of ogImages) add(o.url, o.title);
  if (section === "app-icons") for (const a of appIcons) add(a.link, a.name);
  if (section === "skills") for (const s of skills) add(s.repo, s.name);
  return { ids, names };
}

/** The value a section is identified by (website, X post, App Store link, repo…). */
export function identityFor(section: SectionKey, data: ItemData): string {
  return identityOf(String(data[SECTION_SCHEMAS[section].dedupeField] ?? ""));
}

/**
 * Is this candidate already in the archive? Checks the built-in data by
 * identity and by name (for resources, a different URL for the same named
 * product still counts). The database check happens on insert, by identity.
 */
export function inStaticArchive(section: SectionKey, data: ItemData): boolean {
  const { ids, names } = staticIndex(section);
  const id = identityFor(section, data);
  if (id && ids.has(id)) return true;
  const name = String(data[SECTION_SCHEMAS[section].titleField] ?? "");
  return section === "resources" && !!name && names.has(norm(name));
}
