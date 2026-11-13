"use client";

import { BookOpenColored24 } from "@/components/icons/glass/BookOpenColored24";
import { StackPlayColored24 } from "@/components/icons/glass/StackPlayColored24";
import { ImageColored24 } from "@/components/icons/glass/ImageColored24";
import { Grid2Colored24 } from "@/components/icons/glass/Grid2Colored24";
import { MagicWandSparkleColored24 } from "@/components/icons/glass/MagicWandSparkleColored24";
import type { SectionSlug } from "@/lib/sections";

/**
 * Nucleo glass icons for the archive sections. Each gets one colour for its
 * back shape (two-stop gradient); the frosted front layer stays neutral.
 */
const ICONS: Record<SectionSlug, { Icon: typeof BookOpenColored24; from: string; to: string }> = {
  resources: { Icon: BookOpenColored24, from: "#7AB8FF", to: "#1F6BFF" },
  designs: { Icon: StackPlayColored24, from: "#FF8FC0", to: "#E5307A" },
  "og-images": { Icon: ImageColored24, from: "#FFC271", to: "#FF7A1A" },
  "app-icons": { Icon: Grid2Colored24, from: "#6BE59A", to: "#1FAE55" },
  skills: { Icon: MagicWandSparkleColored24, from: "#C3A2FF", to: "#7645F5" },
};

export function SectionIcon({ slug, className = "size-4" }: { slug: SectionSlug; className?: string }) {
  const { Icon, from, to } = ICONS[slug];
  return (
    <Icon
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      style={{ "--nc-gradient-1-color-1": from, "--nc-gradient-1-color-2": to } as React.CSSProperties}
    />
  );
}
