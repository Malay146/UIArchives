/** URL-safe slug: "Grit: Daily Habit" → "grit-daily-habit". */
export function slugify(s: string): string {
  return (
    s
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

/**
 * Give every item in a list a unique slug (stable for the same list order):
 * collisions get "-2", "-3"… in the order they appear.
 */
export function withSlugs<T>(list: T[], base: (item: T) => string): { item: T; slug: string }[] {
  const seen = new Map<string, number>();
  return list.map((item) => {
    const b = slugify(base(item));
    const n = (seen.get(b) ?? 0) + 1;
    seen.set(b, n);
    return { item, slug: n === 1 ? b : `${b}-${n}` };
  });
}
