/**
 * App Icons — iOS and macOS logomarks worth studying.
 *
 * To add an icon:
 *  1. Save a 1024×1024 PNG/WebP (no rounded corners — the mask is applied in
 *     the UI) to /public/app-icons/<id>.webp.
 *  2. Add an entry below. `style`, `color` and `category` drive the filters.
 */

export const ICON_STYLES = ["Glass", "Flat", "Gradient", "3D", "Skeuomorphic", "Monochrome", "Illustrated"] as const;
export const ICON_COLORS = ["Black", "White", "Grey", "Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Multicolor"] as const;

export type AppIcon = {
  id: string;
  name: string;
  developer: string;
  image: string;
  platform: ("iOS" | "macOS")[];
  /** App Store category, e.g. "Productivity". */
  category: string;
  style: string[];
  color: string[];
  /** App Store or website link. */
  link: string;
  added: string;
};

export const appIcons: AppIcon[] = [];
