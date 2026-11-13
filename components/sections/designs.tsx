"use client";

import { useRef, useState } from "react";
import { CollectionView } from "@/components/collection/collection-view";
import { PrimaryLink, CopyButton } from "@/components/collection/copy-button";
import { SheetRow, SheetSection, SheetTags } from "@/components/ui/sheet";
import { XTwitterGlyph32 } from "@/components/icons";
import type { Facet } from "@/lib/use-collection";
import { DESIGN_TYPES, type DesignClip } from "@/data/collections/designs";

const facets: Facet<DesignClip>[] = [
  { key: "kind", label: "Category", get: (c) => c.kind, order: [...DESIGN_TYPES], exclusive: true },
];

const text = (c: DesignClip) =>
  `${c.title} ${c.author.name} ${c.author.handle} ${c.kind.join(" ")} ${c.platform.join(" ")} ${(c.stack ?? []).join(" ")} ${c.note ?? ""} ${c.caption ?? ""}`;

const date = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));

const profileUrl = (handle: string) => `https://x.com/${handle}`;

/** Round X profile picture; falls back to the maker's initial. */
function Avatar({ author, size }: { author: DesignClip["author"]; size: number }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size };
  if (!author.avatar || broken) {
    return (
      <span
        style={{ ...style, fontSize: size * 0.45 }}
        className="grid shrink-0 place-items-center rounded-full bg-fg-3 font-medium text-bg"
        aria-hidden="true"
      >
        {(author.name || author.handle).charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={author.avatar}
      alt=""
      width={size}
      height={size}
      style={style}
      loading="lazy"
      onError={() => setBroken(true)}
      className="shrink-0 rounded-full object-cover shadow-[0_0_0_1px_rgb(255_255_255/0.15)]"
    />
  );
}

/**
 * Poster at rest; plays muted only while hovered, so a grid of videos stays
 * calm. The poster sits on top as an image and only fades away once the video
 * is really playing, so there's never a blank frame while it loads.
 */
function HoverVideo({ clip }: { clip: DesignClip }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <video
        ref={ref}
        src={clip.video}
        muted
        loop
        playsInline
        preload="metadata"
        onPlaying={() => setPlaying(true)}
        onPointerEnter={(e) => e.pointerType === "mouse" && ref.current?.play().catch(() => {})}
        onPointerLeave={() => {
          setPlaying(false);
          const v = ref.current;
          if (v) {
            v.pause();
            v.currentTime = 0;
          }
        }}
        className="absolute inset-0 size-full object-cover"
      />
      {clip.poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={clip.poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={`pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-200 ease-out ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </>
  );
}

/**
 * A scrim that fades out along an ease curve instead of a straight line, so
 * there's no visible edge or banding where it meets the video.
 */
const SCRIM = (() => {
  const stops = 14;
  const parts = Array.from({ length: stops + 1 }, (_, i) => {
    const t = i / stops; // 0 at the bottom, 1 at the top
    const alpha = 0.55 * Math.pow(1 - t, 2.2) * (1 - t * 0.15);
    return `rgb(0 0 0 / ${alpha.toFixed(3)}) ${(t * 100).toFixed(1)}%`;
  });
  return `linear-gradient(to top, ${parts.join(", ")})`;
})();

/** Just the video, with the maker in the bottom corner. */
function DesignTile({ clip }: { clip: DesignClip }) {
  return (
    <span
      style={{ aspectRatio: clip.width && clip.height ? `${clip.width} / ${clip.height}` : "16 / 9" }}
      // isolate + translateZ keep Safari clipping the video to the rounded corners.
      className="relative isolate block overflow-hidden rounded-lg bg-hover [transform:translateZ(0)]"
    >
      <HoverVideo clip={clip} />
      <span className="sr-only">{clip.title}</span>

      {/* Progressive blur: strongest at the very bottom, masked away upwards. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_0%,black_25%,transparent_100%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
      />
      <span aria-hidden="true" style={{ backgroundImage: SCRIM }} className="pointer-events-none absolute inset-x-0 bottom-0 h-24" />

      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 pb-2.5">
        <Avatar author={clip.author} size={20} />
        <span className="truncate text-[13px] font-medium text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.25)]">{clip.author.name}</span>
      </span>

      {/* Hairline drawn inside the tile, so masonry columns can never clip it. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--line)] transition-shadow duration-200 group-hover:shadow-[inset_0_0_0_1px_var(--line-strong)] group-focus-visible:shadow-[inset_0_0_0_2px_var(--fg)]"
      />
    </span>
  );
}

/**
 * The video on the dark stage: as large as fits, never cropped, at its own
 * aspect ratio. Sized with container units so it's right before it loads.
 */
function StageVideo({ clip }: { clip: DesignClip }) {
  const ratio = clip.width && clip.height ? clip.width / clip.height : 16 / 9;
  return (
    <div className="flex size-full items-center justify-center [container-type:size]">
      <video
        key={clip.video}
        src={clip.video}
        poster={clip.poster}
        controls
        autoPlay
        muted
        loop
        playsInline
        style={{ aspectRatio: String(ratio), width: `min(100cqw, ${100 * ratio}cqh)` }}
        className="block rounded-xl bg-black shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_24px_80px_-20px_rgb(0_0_0/0.6)]"
      />
    </div>
  );
}

/** 4 columns on wide screens, 3 on laptops, 2 on tablets, 1 on phones (Tailwind xl / lg / sm). */
const COLUMNS = [
  { min: 1280, cols: 4 },
  { min: 1024, cols: 3 },
  { min: 640, cols: 2 },
  { min: 0, cols: 1 },
];

export function Designs({ items }: { items: DesignClip[] }) {
  return (
    <CollectionView
      items={items}
      facets={facets}
      text={text}
      getKey={(c) => c.id}
      noun={["design", "designs"]}
      layout={{
        kind: "masonry",
        columns: COLUMNS,
        ratio: (c) => (c.width && c.height ? c.height / c.width : 9 / 16),
        tile: (c) => <DesignTile clip={c} />,
      }}
      empty={{
        title: "Designs are on their way.",
        body: "Short design videos from designers on X — components, explorations, landing pages and more, filterable by type and platform.",
      }}
      stage={(c) => <StageVideo clip={c} />}
      detail={(c) => (
        <article className="px-4 pt-6 pb-16 sm:px-6">
          <a
            href={profileUrl(c.author.handle)}
            target="_blank"
            rel="noopener noreferrer"
            className="group/maker -m-1 inline-flex items-center gap-3 rounded-md p-1"
          >
            <Avatar author={c.author} size={40} />
            <span className="min-w-0">
              <span className="block truncate font-medium group-hover/maker:underline">{c.author.name}</span>
              <span className="block truncate text-fg-3">@{c.author.handle}</span>
            </span>
          </a>

          <h2 id="sheet-title" className="mt-6 text-[17px] font-medium tracking-[-0.01em] text-balance">{c.title}</h2>

          <div className="mt-6 flex flex-wrap gap-2">
            <PrimaryLink href={c.post}>
              <XTwitterGlyph32 aria-hidden="true" className="size-3" /> View post
            </PrimaryLink>
            <CopyButton value={c.post} label="Copy link" />
          </div>

          {c.note && (
            <SheetSection title="Why it’s good">
              <p className="text-[15px] leading-[1.7] text-fg-2">{c.note}</p>
            </SheetSection>
          )}

          {c.caption && (
            <SheetSection title="From the post">
              <blockquote className="border-l-2 pl-4 text-[15px] leading-[1.7] whitespace-pre-line text-fg-2">
                {c.caption}
              </blockquote>
            </SheetSection>
          )}

          <SheetSection title="Details">
            <dl className="border-t">
              <SheetRow label="Designer">
                <a href={profileUrl(c.author.handle)} target="_blank" rel="noopener noreferrer" className="link hover:text-fg">
                  {c.author.name} <span className="text-fg-3">@{c.author.handle}</span>
                </a>
              </SheetRow>
              <SheetRow label="Category"><SheetTags tags={c.kind} /></SheetRow>
              <SheetRow label="Platform"><SheetTags tags={c.platform} /></SheetRow>
              {c.stack?.length ? <SheetRow label="Built with"><SheetTags tags={c.stack} /></SheetRow> : null}
              {c.posted && <SheetRow label="Posted">{date(c.posted)}</SheetRow>}
              <SheetRow label="Added">{date(c.added)}</SheetRow>
            </dl>
          </SheetSection>
        </article>
      )}
    />
  );
}
