"use client";

import { useRef } from "react";
import { CollectionView } from "@/components/collection/collection-view";
import { Tile } from "@/components/collection/tile";
import { PrimaryLink, CopyButton } from "@/components/collection/copy-button";
import { SheetRow, SheetSection, SheetTags } from "@/components/ui/sheet";
import { XTwitterGlyph32 } from "@/components/icons";
import type { Facet } from "@/lib/use-collection";
import { MOTION_KINDS, MOTION_PLATFORMS, type MotionClip } from "@/data/collections/motion";

const facets: Facet<MotionClip>[] = [
  { key: "kind", label: "Interaction", get: (c) => c.kind, order: [...MOTION_KINDS] },
  { key: "platform", label: "Platform", get: (c) => c.platform, order: [...MOTION_PLATFORMS] },
  { key: "stack", label: "Built with", get: (c) => c.stack ?? [] },
];

const text = (c: MotionClip) =>
  `${c.title} ${c.author.name} ${c.author.handle} ${c.kind.join(" ")} ${c.platform.join(" ")} ${(c.stack ?? []).join(" ")} ${c.note ?? ""}`;

/** Poster at rest; plays muted only while hovered, so a grid of clips stays calm. */
function HoverVideo({ clip }: { clip: MotionClip }) {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <video
      ref={ref}
      src={clip.video}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="none"
      onPointerEnter={(e) => e.pointerType === "mouse" && ref.current?.play().catch(() => {})}
      onPointerLeave={() => {
        const v = ref.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      }}
      className="absolute inset-0 size-full object-cover"
    />
  );
}

export function Motion({ items }: { items: MotionClip[] }) {
  return (
    <CollectionView
      items={items}
      facets={facets}
      text={text}
      getKey={(c) => c.id}
      noun={["clip", "clips"]}
      layout={{
        kind: "grid",
        columns: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
        tile: (c) => <Tile title={c.title} meta={`@${c.author.handle}`} aspect="aspect-video" media={<HoverVideo clip={c} />} />,
      }}
      empty={{
        title: "Clips are on their way.",
        body: "Short interaction studies from designers and engineers on X — hovers, transitions, gestures and loading states, filterable by what they show.",
      }}
      detail={(c) => (
        <article className="px-4 pt-8 pb-16 sm:px-8">
          <h2 id="sheet-title" className="text-[17px] font-medium tracking-[-0.01em]">{c.title}</h2>
          <p className="mt-1 text-fg-2">
            {c.author.name} <span className="text-fg-3">@{c.author.handle}</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <PrimaryLink href={c.post}>
              <XTwitterGlyph32 aria-hidden="true" className="size-3" /> View post
            </PrimaryLink>
            <CopyButton value={c.post} label="Copy link" />
          </div>
          <div className="mt-8 overflow-hidden rounded-lg bg-hover shadow-[0_0_0_1px_var(--line-strong)]">
            <video key={c.video} src={c.video} poster={c.poster} controls autoPlay muted loop playsInline className="block w-full" />
          </div>
          {c.note && (
            <SheetSection title="Why it works">
              <p className="max-w-[62ch] text-[15px] leading-[1.7] text-fg-2">{c.note}</p>
            </SheetSection>
          )}
          <SheetSection title="Details">
            <dl className="border-t">
              <SheetRow label="Interaction"><SheetTags tags={c.kind} /></SheetRow>
              <SheetRow label="Platform"><SheetTags tags={c.platform} /></SheetRow>
              {c.stack?.length ? <SheetRow label="Built with"><SheetTags tags={c.stack} /></SheetRow> : null}
              <SheetRow label="Added">
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(c.added))}
              </SheetRow>
            </dl>
          </SheetSection>
        </article>
      )}
    />
  );
}
