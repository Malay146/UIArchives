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

export const DESIGN_TYPES = [
  "Featured",
  "Component",
  "Exploration",
  "Landing Page",
  "Dashboard",
  "Mobile App",
  "Interaction",
  "Onboarding",
  "Brand",
] as const;

export const DESIGN_PLATFORMS = ["Web", "iOS", "Android", "macOS"] as const;

export type DesignClip = {
  id: string;
  title: string;
  /** Who made it. */
  author: { name: string; handle: string };
  /** Original post, e.g. https://x.com/user/status/123 */
  post: string;
  video: string;
  poster: string;
  /** Type of design — values from DESIGN_TYPES. */
  kind: string[];
  platform: string[];
  /** Built with, if known — e.g. "Figma", "Framer", "SwiftUI". */
  stack?: string[];
  /** ISO date it was added. */
  added: string;
  note?: string;
};

export const designClips: DesignClip[] = [];
