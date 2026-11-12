import Link from "next/link";

/** The UIArchives mark — two interlocked strokes, drawn in currentColor. */
export function Mark({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 55"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22.6 5.7V27.2L17.7 24.4C9 19.4 3.6 10.1 3.6 0H0V24.6C0 32.6 4.6 40 11.9 43.5L22.7 48.7V27.2L27.6 30C36.3 35 41.7 44.3 41.7 54.4H45.3V29.8C45.3 21.8 40.7 14.4 33.4 10.9L22.6 5.7Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="press -m-1 inline-flex items-center gap-2 p-1 font-medium"
      aria-label="UIArchives, home"
    >
      <Mark className="h-[15px] w-auto" />
      <span>UIArchives</span>
    </Link>
  );
}
