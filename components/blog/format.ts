export function formatDate(date: string, month: "short" | "long" = "short") {
  return new Intl.DateTimeFormat("en-US", {
    month,
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
