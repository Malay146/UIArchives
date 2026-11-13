"use client";

import { withSlugs } from "@/lib/slug";
import { useMemo } from "react";
import { shortAppName } from "@/lib/app-name";
import { CollectionView } from "@/components/collection/collection-view";
import { PrimaryLink, CopyButton } from "@/components/collection/copy-button";
import { SheetRow, SheetSection, SheetTags } from "@/components/ui/sheet";
import { ArrowUpRightGlyph18 } from "@/components/icons";
import type { Facet } from "@/lib/use-collection";
import { ICON_STYLES, type AppIcon } from "@/data/collections/app-icons";

const facets: Facet<AppIcon>[] = [
  { key: "style", label: "Style", get: (i) => i.style, order: [...ICON_STYLES], exclusive: true },
];

const text = (i: AppIcon) => `${i.name} ${i.developer} ${i.category} ${i.style.join(" ")} ${i.color.join(" ")}`;

/** Apple's icon corner: a continuous curve approximated at 22.37% of the size. */
const SQUIRCLE = "rounded-[22.37%]";

function Icon({ icon, className }: { icon: AppIcon; className: string }) {
  return (
    <span className={`relative block aspect-square overflow-hidden bg-hover ${SQUIRCLE} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon.image} alt="" loading="lazy" decoding="async" className="block size-full object-cover" />
    </span>
  );
}

export function AppIcons({ items }: { items: AppIcon[] }) {
  // Each item's own page (same slugs the server uses for /app-icons/[slug]).
  const slugs = useMemo(() => new Map(withSlugs(items, (a) => shortAppName(a.name)).map((x) => [x.item, x.slug])), [items]);
  return (
    <CollectionView
      href={(i) => `/app-icons/${slugs.get(i)}`}
      items={items}
      facets={facets}
      text={text}
      getKey={(i) => i.id}
      noun={["icon", "icons"]}
      layout={{
        kind: "grid",
        columns: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8",
        tile: (i) => (
          <span className="flex flex-col items-center gap-2 text-center">
            <Icon icon={i} className="w-full max-w-[96px] transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
            <span className="w-full truncate text-[13px]">{shortAppName(i.name)}</span>
          </span>
        ),
      }}
      empty={{
        title: "App icons are on their way.",
        body: "iOS and macOS logomarks, filterable by style, colour and category — glass, flat, gradient and everything between.",
      }}
      detail={(i) => (
        <article className="px-4 pt-8 pb-16 sm:px-8">
          <div className="grid place-items-center rounded-lg bg-hover py-14">
            <Icon icon={i} className="size-40" />
          </div>
          <h2 id="sheet-title" className="mt-6 text-[17px] font-medium tracking-[-0.01em]">{shortAppName(i.name)}</h2>
          <p className="mt-1 text-fg-2">{i.developer}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <PrimaryLink href={i.link}>
              View app <ArrowUpRightGlyph18 aria-hidden="true" className="size-3" />
            </PrimaryLink>
            <CopyButton value={new URL(i.image, "https://uiarchives.com").href} label="Copy image URL" />
          </div>
          <SheetSection title="Sizes">
            <div className="flex items-end gap-8">
              {[60, 40, 29].map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <span style={{ width: size, height: size }} className="block">
                    <Icon icon={i} className="size-full" />
                  </span>
                  <span className="text-[12px] text-fg-3">{size}pt</span>
                </div>
              ))}
            </div>
          </SheetSection>
          <SheetSection title="Details">
            <dl className="border-t">
              {shortAppName(i.name) !== i.name && <SheetRow label="App Store name">{i.name}</SheetRow>}
              <SheetRow label="Style"><SheetTags tags={i.style} /></SheetRow>
              <SheetRow label="Colour"><SheetTags tags={i.color} /></SheetRow>
              <SheetRow label="Category">{i.category}</SheetRow>
              <SheetRow label="Platform">{i.platform.join(", ")}</SheetRow>
            </dl>
          </SheetSection>
        </article>
      )}
    />
  );
}
