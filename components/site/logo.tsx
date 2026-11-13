import Link from "next/link";

/**
 * The UIArchives mark: a window (title bar + body) with a saved ribbon hanging
 * from the gap. Drawn on a 16px grid so every edge lands on a whole pixel at
 * size-4; keep it at 16px (or a multiple) to stay crisp.
 */
export function Mark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3 1H13A2 2 0 0 1 15 3V4H1V3A2 2 0 0 1 3 1ZM1 5H8V11L10 9L12 11V5H15V13A2 2 0 0 1 13 15H3A2 2 0 0 1 1 13Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="press -m-1 inline-flex items-center gap-1.5 p-1 font-medium"
      aria-label="UIArchives, home"
    >
      <Mark />
      <span>UIArchives</span>
    </Link>
  );
}
