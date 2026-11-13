/**
 * A gallery tile: the media itself, a hairline, and a two-part caption.
 * No card chrome — the work is the interface.
 */
export function Tile({
  media,
  title,
  meta,
  aspect = "aspect-[1200/630]",
  round = "rounded-md",
}: {
  media: React.ReactNode;
  /** Leave out to render the media only (the caption lives outside, e.g. with a link). */
  title?: string;
  meta?: string;
  aspect?: string;
  round?: string;
}) {
  return (
    <>
      <span
        className={`relative block overflow-hidden ${round} ${aspect} bg-hover shadow-[0_0_0_1px_var(--line)] transition-shadow duration-200 group-hover:shadow-[0_0_0_1px_var(--line-strong)] group-focus-visible:shadow-[0_0_0_2px_var(--fg)]`}
      >
        {media}
      </span>
      {title && (
        <span className="mt-2.5 flex items-baseline justify-between gap-3">
          <span className="truncate font-medium">{title}</span>
          {meta && <span className="shrink-0 truncate text-[12px] text-fg-3">{meta}</span>}
        </span>
      )}
    </>
  );
}
