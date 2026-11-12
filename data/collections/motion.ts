/**
 * Motion — short interaction clips, mostly from X, kept for reference.
 *
 * To add a clip:
 *  1. Put the video in /public/motion/<id>.mp4 (H.264, muted, ≤ 10 MB) and a
 *     first-frame poster in /public/motion/<id>.webp.
 *  2. Add an entry below. `kind` and `platform` drive the filters, so use the
 *     values listed in MOTION_KINDS / MOTION_PLATFORMS where possible.
 */

export const MOTION_KINDS = [
  "Hover",
  "Click",
  "Scroll",
  "Transition",
  "Loading",
  "Gesture",
  "Text",
  "3D",
  "Layout",
] as const;

export const MOTION_PLATFORMS = ["Web", "iOS", "Android", "macOS"] as const;

export type MotionClip = {
  id: string;
  title: string;
  /** Who made it. */
  author: { name: string; handle: string };
  /** Original post, e.g. https://x.com/user/status/123 */
  post: string;
  video: string;
  poster: string;
  kind: string[];
  platform: string[];
  /** Built with, if known — e.g. "Motion", "GSAP", "SwiftUI". */
  stack?: string[];
  /** ISO date the clip was added. */
  added: string;
  note?: string;
};

export const motionClips: MotionClip[] = [];
