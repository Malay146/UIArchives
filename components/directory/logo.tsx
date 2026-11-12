import logos from "@/data/logos.json";
import { type UiCardData, logoKey } from "@/types/resource";

type LogoInfo = {
  src: string;
  mode: "tile" | "glyph";
  tone: "light" | "dark";
  shape?: "circle";
};
const MANIFEST = logos as Record<string, LogoInfo>;

/**
 * A resource's own logo in its true colours, scraped from its site
 * (scripts/fetch-logos.ts).
 *
 * - Tiles (opaque, square artwork) fill the frame edge to edge.
 * - People (Socials) are their X profile picture, shown round.
 * - Glyphs (marks on transparency) get even padding on a backdrop that
 *   contrasts with the mark.
 *
 * The hairline sits outside the shape as a box-shadow, and nothing is painted
 * behind a tile, so no background can bleed through rounded corners.
 */
export function Logo({
  resource,
  className = "size-5",
}: {
  resource: Pick<UiCardData, "title">;
  className?: string;
}) {
  const info = MANIFEST[logoKey(resource)];
  const round = info?.shape === "circle" ? "rounded-full" : "rounded-[4px]";
  const frame = `${className} relative shrink-0 overflow-hidden ${round} shadow-[0_0_0_0.5px_var(--line-strong)]`;

  if (!info) {
    return (
      <span
        aria-hidden="true"
        className={`${frame} grid place-items-center bg-fg text-[11px] leading-none font-medium text-bg`}
      >
        {resource.title.charAt(0).toUpperCase()}
      </span>
    );
  }

  const glyph = info.mode === "glyph";
  return (
    <span
      aria-hidden="true"
      className={`${frame} ${
        glyph ? (info.tone === "light" ? "bg-[#0a0a0a] p-[3px]" : "bg-white p-[3px]") : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={info.src}
        alt=""
        width={20}
        height={20}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`block size-full ${info.shape === "circle" ? "object-cover" : "object-contain"}`}
      />
    </span>
  );
}
