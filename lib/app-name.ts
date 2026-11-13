/**
 * App Store names often carry a keyword tail ("Grit: Daily Habit Tracker").
 * This returns just the app's own name ("Grit").
 *
 * Splits on ":", " - ", " – ", " — ", " | " or ",". When the first part is
 * only generic words ("Habit Tracker - HabitKit"), the brand is usually the
 * next part, so that one is used instead.
 */
const GENERIC = new Set(
  "habit habits tracker trackers planner daily goals goal routine routines focus app apps the a and & for to do list lists notes journal timer budget money fitness workout health calendar todo to-do reminders reminder productivity productive simple best your my".split(
    " ",
  ),
);

const isGeneric = (part: string) =>
  part
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .every((w) => GENERIC.has(w));

export function shortAppName(name: string): string {
  const parts = name
    .split(/\s*[:|,]\s*|\s+[-–—]\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return name.trim();
  return parts.find((p) => !isGeneric(p)) ?? parts[0];
}
