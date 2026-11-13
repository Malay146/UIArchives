"use client";

import { withSlugs } from "@/lib/slug";
import { useMemo } from "react";
import { CollectionView } from "@/components/collection/collection-view";
import { Tile } from "@/components/collection/tile";
import { CopyButton, PrimaryLink } from "@/components/collection/copy-button";
import { SheetRow, SheetSection, SheetTags } from "@/components/ui/sheet";
import { ArrowUpRightGlyph18 } from "@/components/icons";
import type { Facet } from "@/lib/use-collection";
import { OG_STYLES, OG_THEMES, type OgImage } from "@/data/collections/og-images";

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const facets: Facet<OgImage>[] = [
  { key: "style", label: "Style", get: (i) => i.style, order: [...OG_STYLES] },
  { key: "theme", label: "Theme", get: (i) => [i.theme], order: [...OG_THEMES] },
  { key: "industry", label: "Industry", get: (i) => [i.industry] },
];

const text = (i: OgImage) =>
  `${i.title} ${host(i.url)} ${i.industry} ${i.style.join(" ")} ${i.theme} ${i.pageTitle ?? ""} ${i.pageDescription ?? ""}`;

export function OgImages({ items }: { items: OgImage[] }) {
  // Each item's own page (same slugs the server uses for /og-images/[slug]).
  const slugs = useMemo(() => new Map(withSlugs(items, (o) => o.title).map((x) => [x.item, x.slug])), [items]);
  return (
    <CollectionView
      href={(i) => `/og-images/${slugs.get(i)}`}
      items={items}
      facets={facets}
      text={text}
      getKey={(i) => i.id}
      noun={["image", "images"]}
      layout={{
        kind: "grid",
        columns: "grid-cols-1 md:grid-cols-2",
        caption: (i) => ({ title: i.title, link: { href: i.url, label: host(i.url) } }),
        tile: (i) => (
          <Tile
            media={
              // eslint-disable-next-line @next/next/no-img-element
              <img src={i.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
            }
          />
        ),
      }}
      empty={{
        title: "OG images are on their way.",
        body: "Hand-picked Open Graph cards — the image a link becomes when it's shared — filterable by style, theme and industry.",
      }}
      detail={(i, { list, open }) => (
        <article className="px-4 pt-8 pb-16 sm:px-8">
          <h2 id="sheet-title" className="text-[17px] font-medium tracking-[-0.01em]">{i.title}</h2>
          <p className="mt-1 text-fg-2">{host(i.url)}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <PrimaryLink href={i.url}>
              Visit website <ArrowUpRightGlyph18 aria-hidden="true" className="size-3" />
            </PrimaryLink>
            <CopyButton value={new URL(i.image, "https://uiarchives.com").href} label="Copy image URL" />
          </div>

          <div className="mt-8 overflow-hidden rounded-lg shadow-[0_0_0_1px_var(--line-strong)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.image} alt={`Open Graph image for ${i.title}`} width={i.width} height={i.height} className="block w-full" />
          </div>

          <SheetSection title="Details">
            <dl className="border-t">
              <SheetRow label="Website">
                <a href={i.url} target="_blank" rel="noopener noreferrer" className="link underline-offset-4 transition-colors hover:text-fg hover:underline">
                  {host(i.url)}
                </a>
              </SheetRow>
              {i.pageTitle && <SheetRow label="Shared title">{i.pageTitle}</SheetRow>}
              {i.pageDescription && <SheetRow label="Shared description">{i.pageDescription}</SheetRow>}
              <SheetRow label="Style"><SheetTags tags={i.style} /></SheetRow>
              <SheetRow label="Theme">{i.theme}</SheetRow>
              <SheetRow label="Industry">{i.industry}</SheetRow>
            </dl>
          </SheetSection>

          <More list={list.filter((x) => x !== i && x.industry === i.industry).slice(0, 4)} open={open} />
        </article>
      )}
    />
  );
}

function More({ list, open }: { list: OgImage[]; open: (i: OgImage) => void }) {
  if (!list.length) return null;
  return (
    <SheetSection title="More like this">
      <ul className="grid grid-cols-2 gap-3">
        {list.map((x) => (
          <li key={x.id}>
            <button type="button" onClick={() => open(x)} className="group block w-full text-left">
              <Tile
                title={x.title}
                meta={host(x.url)}
                media={
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={x.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                }
              />
            </button>
          </li>
        ))}
      </ul>
    </SheetSection>
  );
}
