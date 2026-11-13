"use client";

import { ColorPaletteColored24 } from "@/components/icons/glass/ColorPaletteColored24";
import { CodeEditorColored24 } from "@/components/icons/glass/CodeEditorColored24";
import { ShapesColored24 } from "@/components/icons/glass/ShapesColored24";
import { WindowColored24 } from "@/components/icons/glass/WindowColored24";
import { WrenchScrewdriverColored24 } from "@/components/icons/glass/WrenchScrewdriverColored24";
import { BookOpenColored24 } from "@/components/icons/glass/BookOpenColored24";
import { GENRE_STYLE, type JournalGenre } from "@/lib/journal-genres";

/** Glass icon per Journal genre; colours live in lib/journal-genres.ts. */
const ICONS: Record<JournalGenre, typeof BookOpenColored24> = {
  Design: ColorPaletteColored24,
  Engineering: CodeEditorColored24,
  React: ShapesColored24,
  "Web Development": WindowColored24,
  Tools: WrenchScrewdriverColored24,
  Guides: BookOpenColored24,
};

export function GenreIcon({ genre, style }: { genre: JournalGenre; style?: React.CSSProperties }) {
  const Icon = ICONS[genre];
  const { from, to } = GENRE_STYLE[genre];
  return (
    <Icon
      aria-hidden="true"
      style={{ ...style, "--nc-gradient-1-color-1": from, "--nc-gradient-1-color-2": to } as React.CSSProperties}
    />
  );
}
