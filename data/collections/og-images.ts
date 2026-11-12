/**
 * OG Images — Open Graph cards (the image a link turns into when shared),
 * curated by hand.
 *
 * To add one:
 *  1. Save the image as WebP in /public/og-images/<id>.webp (1200 × 630 is
 *     the standard size; other sizes are shown at their own ratio).
 *  2. Add an entry below. `style`, `theme` and `industry` drive the filters.
 */

export const OG_STYLES = ["Typography", "Product Shot", "Illustration", "3D", "Photography", "Gradient", "Minimal"] as const;
export const OG_THEMES = ["Light", "Dark"] as const;

export type OgImage = {
  id: string;
  /** Product or site name. */
  title: string;
  /** The page the card belongs to. */
  url: string;
  image: string;
  width: number;
  height: number;
  style: string[];
  theme: "Light" | "Dark";
  /** e.g. "SaaS", "Developer Tools", "Design", "AI", "Portfolio". */
  industry: string;
  /** Title and description the page shares alongside the image. */
  pageTitle?: string;
  pageDescription?: string;
  added: string;
};

export const ogImages: OgImage[] = [];
