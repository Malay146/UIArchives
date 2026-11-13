/**
 * Designs — short design videos, mostly from X: components, explorations,
 * landing pages and more, kept for reference.
 *
 * To add one:
 *  1. Put the video in /public/designs/<id>.mp4 (H.264, muted, ≤ 10 MB) and a
 *     first-frame poster in /public/designs/<id>.webp.
 *  2. Add an entry below. `kind` and `platform` drive the filters, so use the
 *     values listed in DESIGN_TYPES / DESIGN_PLATFORMS where possible.
 */

/** The categories people browse Designs by — few, distinct, in this order. */
export const DESIGN_TYPES = [
  "Featured",
  "Components",
  "Interactions",
  "Landing Pages",
  "Mobile Apps",
  "Dashboards",
  "Typography",
  "3D",
  "Branding",
] as const;

export const DESIGN_PLATFORMS = ["Web", "iOS", "Android", "macOS"] as const;

export type DesignClip = {
  id: string;
  title: string;
  /** Who made it. */
  author: { name: string; handle: string; avatar?: string };
  /** Original post, e.g. https://x.com/user/status/123 */
  post: string;
  video: string;
  poster: string;
  /** Original video size, so tiles keep its aspect ratio. */
  width?: number;
  height?: number;
  /** Categories — values from DESIGN_TYPES. */
  kind: string[];
  platform: string[];
  /** Built with, if known — e.g. "Figma", "Framer", "SwiftUI". */
  stack?: string[];
  /** ISO date it was added. */
  added: string;
  /** Video length in seconds. */
  duration?: number;
  /** ISO date of the original post. */
  posted?: string;
  /** The post's own text. */
  caption?: string;
  note?: string;
};

export const designClips: DesignClip[] = [];
