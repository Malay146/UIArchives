export interface UiCardData {
  title: string;
  description: string;
  tag: string | string[];
  image?: string;
  imageLink?: string;
  /** Approved entries: logo, headline and description fetched from the site. */
  logo?: string;
  headline?: string;
  metaDescription?: string;
  links?: {
    website?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
  };
}

export const CATEGORIES = [
  "Components",
  "Frameworks",
  "Animation",
  "Typography",
  "Icons",
  "Graphics",
  "Design Tools",
  "Dev Tools",
  "Inspiration",
  "Learning",
  "Socials",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Fallback mapping for free-form tags, used only when a resource carries
 * none of the directory categories itself. Ordered by priority.
 */
const ALIASES: [Category, RegExp][] = [
  ["Socials", /\b(creator|youtuber|podcast|design engineer)\b/i],
  ["Typography", /\b(fonts?|typefaces?|typography|foundry|type scale)\b/i],
  ["Icons", /\bicons?\b/i],
  ["Inspiration", /\b(inspiration|gallery|moodboards?|showcase|awards?)\b/i],
  ["Learning", /\b(tutorials?|courses?|recipes|guides?|blog)\b/i],
  ["Animation", /\b(animations?|motion|lottie|micro[- ]?interactions?)\b/i],
  ["Components", /\b(components?|blocks|ui (library|kit)|shadcn)\b/i],
  ["Graphics", /\b(illustrations?|gradients?|backgrounds?|patterns?|shapes|mockups?|3d)\b/i],
  ["Design Tools", /\b(figma|no-code|website builder|prototyping|design tool)\b/i],
  ["Dev Tools", /\b(generator|editor|performance|seo|hosting|debug\w*|developer tools?)\b/i],
  ["Frameworks", /\b(framework|library|hooks|runtime|state management)\b/i],
];

const isCategory = (t: string): t is Category =>
  (CATEGORIES as readonly string[]).includes(t);

export function tagsOf(card: Pick<UiCardData, "tag">): string[] {
  const raw = Array.isArray(card.tag) ? card.tag : [card.tag];
  return [...new Set(raw.map((t) => t?.trim()).filter(Boolean))];
}

/**
 * Directory categories a resource belongs to, deduplicated, in the order the
 * resource lists them. Curated category tags always win over inferred ones.
 */
export function categoriesOf(card: Pick<UiCardData, "tag">): Category[] {
  const tags = tagsOf(card);
  const explicit = tags.filter(isCategory);
  // People are only ever "Socials", whatever else their tags mention.
  if (explicit.includes("Socials")) return ["Socials"];
  if (explicit.length) return [...new Set(explicit)];
  for (const [cat, re] of ALIASES) {
    if (tags.some((t) => re.test(t))) return [cat];
  }
  return [];
}

/** People, not products: linked by their X profile alone. */
export function isSocial(card: Pick<UiCardData, "tag">): boolean {
  return categoriesOf(card).includes("Socials");
}

/** The category shown beside a resource. People always read as "Socials". */
export function primaryCategory(card: Pick<UiCardData, "tag">): string {
  if (isSocial(card)) return "Socials";
  return categoriesOf(card)[0] ?? tagsOf(card)[0] ?? "Uncategorized";
}

/** "@handle" from an X / Twitter profile URL. */
export function xHandle(url?: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (!/(^|\.)(x|twitter)\.com$/.test(u.hostname)) return "";
    const h = u.pathname.split("/").filter(Boolean)[0];
    return h ? `@${h}` : "";
  } catch {
    return "";
  }
}

/**
 * The one link the directory shows for a resource:
 * socials → their X profile, everything else → their website.
 * Returns null when the required link is missing, so the resource is hidden.
 */
export function normalizeResource(card: UiCardData): UiCardData | null {
  if (isSocial(card)) {
    const x = card.links?.twitter?.trim();
    if (!x || !xHandle(x)) return null;
    const { imageLink: _drop, ...rest } = card;
    return { ...rest, links: { twitter: x } };
  }
  const site = card.links?.website?.trim();
  if (!site || !hostOf(site)) return null;
  const { imageLink: _drop, ...rest } = card;
  return { ...rest, links: { website: site } };
}

/** Human label for a resource's link: "@handle" or "domain.com". */
export function linkLabel(card: UiCardData): string {
  return xHandle(card.links?.twitter) || hostOf(card.links?.website);
}

/** Where a resource leads: X for people, the website for everything else. */
export function primaryHref(card: UiCardData): string {
  const l = card.links ?? {};
  if (isSocial(card)) return l.twitter || "#";
  return l.website || "#";
}

export function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Stable file-safe key for a resource, used for its scraped logo. */
export function logoKey(card: Pick<UiCardData, "title">): string {
  return (
    card.title
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "resource"
  );
}
