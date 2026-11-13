/**
 * The Journal's genres. Every post belongs to one; the genre picks the cover's
 * icon and colour. Older free-form categories are mapped onto these.
 */
export const JOURNAL_GENRES = ["Design", "Engineering", "React", "Web Development", "Tools", "Guides"] as const;
export type JournalGenre = (typeof JOURNAL_GENRES)[number];

/** Each genre's colours: icon gradient (from → to) and text tint per theme. */
export const GENRE_STYLE: Record<JournalGenre, { from: string; to: string; tint: string; tintDark: string }> = {
  Design: { from: "#FF8FC0", to: "#E5307A", tint: "#c4246a", tintDark: "#ff9cc8" },
  Engineering: { from: "#7AB8FF", to: "#1F6BFF", tint: "#1d5fd6", tintDark: "#8ec0ff" },
  React: { from: "#7FE6F5", to: "#0A9FC2", tint: "#0b7f9c", tintDark: "#8be3f2" },
  "Web Development": { from: "#6BE59A", to: "#1FAE55", tint: "#16843f", tintDark: "#7fe3a5" },
  Tools: { from: "#FFC271", to: "#FF7A1A", tint: "#c25a0c", tintDark: "#ffbe78" },
  Guides: { from: "#C3A2FF", to: "#7645F5", tint: "#6a3be0", tintDark: "#c8adff" },
};

const ALIASES: Record<string, JournalGenre> = {
  design: "Design",
  "ui design": "Design",
  typography: "Design",
  engineering: "Engineering",
  frontend: "Engineering",
  css: "Engineering",
  react: "React",
  "next.js": "React",
  "web development": "Web Development",
  web: "Web Development",
  apis: "Web Development",
  tools: "Tools",
  tooling: "Tools",
  guides: "Guides",
  guide: "Guides",
  tutorial: "Guides",
};

export function toGenre(category?: string): JournalGenre {
  const key = (category ?? "").trim().toLowerCase();
  return ALIASES[key] ?? JOURNAL_GENRES.find((g) => g.toLowerCase() === key) ?? "Engineering";
}
