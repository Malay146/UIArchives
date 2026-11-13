import { Mark } from "@/components/site/logo";
import { GenreIcon } from "./genre-icon";
import { GENRE_STYLE, type JournalGenre } from "@/lib/journal-genres";

/**
 * The Journal's cover, generated from the post itself, so every post gets one
 * automatically and no two look alike.
 *
 * Left: the mark, the title and the genre. Right: a 6 × 6 field of rounded
 * blocks — the post's title hashed into a mirrored pattern (like an
 * identicon) in the genre's colour at four strengths, with the genre's glass
 * icon in the 2 × 2 block at its centre.
 *
 * Sized with container units, so it is identical at any width — on the post
 * page, and at 1200 × 630 when captured as the post's share image.
 */

const COLS = 6;
const ROWS = 6;

/** FNV-1a, then a xorshift stream: stable bytes from a string. */
function bytes(seed: string, n: number): number[] {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 0x01000193) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    out.push(h & 0xff);
  }
  return out;
}

/** 0 = empty, 1–4 = genre colour from faint to full. Mirrored left ↔ right. */
function pattern(seed: string): number[][] {
  const half = Math.ceil(COLS / 2);
  const b = bytes(seed, ROWS * half);
  const level = (v: number) => (v < 90 ? 0 : v < 145 ? 1 : v < 195 ? 2 : v < 230 ? 3 : 4);
  return Array.from({ length: ROWS }, (_, r) => {
    const left = Array.from({ length: half }, (_, c) => level(b[r * half + c]));
    return [...left, ...left.slice(0, COLS - half).reverse()];
  });
}

const STRENGTH = ["", "16%", "38%", "66%", "100%"];

export function BlogCover({
  title,
  genre,
  theme,
  className = "",
}: {
  title: string;
  genre: JournalGenre;
  /** Force a theme (for the captured share image); otherwise follows the site. */
  theme?: "light" | "dark";
  className?: string;
}) {
  const g = GENRE_STYLE[genre];
  const vars =
    theme === "dark"
      ? { "--c-bg": "#000", "--c-fg": "#ededed", "--c-fg3": "#7a7a7a", "--c-block": "#141414", "--c-tint": g.tintDark }
      : theme === "light"
        ? { "--c-bg": "#fff", "--c-fg": "#0a0a0a", "--c-fg3": "#8a8a8a", "--c-block": "#f3f3f3", "--c-tint": g.tint }
        : { "--c-bg": "var(--bg)", "--c-fg": "var(--fg)", "--c-fg3": "var(--fg-3)", "--c-block": "var(--hover)", "--c-tint": "var(--g-tint)" };
  const grid = pattern(title);
  const long = title.length > 52;
  // The centre 2 × 2 holds the icon.
  const isCentre = (r: number, c: number) => (r === 2 || r === 3) && (c === 2 || c === 3);

  return (
    <div
      className={`blog-cover relative w-full overflow-hidden ${className}`}
      style={
        {
          aspectRatio: "1200 / 630",
          containerType: "inline-size",
          background: "var(--c-bg)",
          color: "var(--c-fg)",
          "--g-light": g.tint,
          "--g-dark": g.tintDark,
          ...vars,
        } as React.CSSProperties
      }
      data-genre={genre}
    >
      {/* Left: words */}
      <div
        style={{
          position: "absolute",
          top: "7.5cqw",
          bottom: "7.5cqw",
          left: "7.5cqw",
          width: "42cqw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1cqw", fontSize: "1.9cqw", fontWeight: 500, letterSpacing: "-0.01em" }}>
          <span style={{ display: "inline-flex", width: "1.9cqw", height: "1.9cqw" }}>
            <Mark className="size-full" />
          </span>
          UIArchives
          <span style={{ color: "var(--c-fg3)", fontWeight: 400 }}>Journal</span>
        </div>

        <div>
          <p
            style={{
              fontSize: long ? "3.9cqw" : "4.6cqw",
              lineHeight: 1.08,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              textWrap: "balance",
            }}
          >
            {title}
          </p>
          <p style={{ marginTop: "2.2cqw", fontSize: "1.9cqw", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--c-tint)" }}>
            {genre}
          </p>
        </div>
      </div>

      {/* Right: blocks */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "7.5cqw",
          top: "50%",
          transform: "translateY(-50%)",
          width: "37.9cqw",
          aspectRatio: "1",
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gap: "0.6cqw",
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((lvl, c) => {
            if (isCentre(r, c)) {
              if (r !== 2 || c !== 2) return null;
              return (
                <span
                  key={`${r}-${c}`}
                  style={{
                    gridRow: "3 / span 2",
                    gridColumn: "3 / span 2",
                    borderRadius: "1.4cqw",
                    background: "var(--c-bg)",
                    boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--c-tint) 28%, transparent)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <GenreIcon genre={genre} style={{ width: "6.4cqw", height: "6.4cqw" }} />
                </span>
              );
            }
            return (
              <span
                key={`${r}-${c}`}
                style={{
                  borderRadius: "0.9cqw",
                  background: lvl
                    ? `color-mix(in oklab, var(--c-tint) ${STRENGTH[lvl]}, var(--c-bg))`
                    : "var(--c-block)",
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
