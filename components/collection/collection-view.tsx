"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type Facet, useCollection } from "@/lib/use-collection";
import { FilterBar } from "./filter-bar";
import { Masonry, type MasonryColumns } from "./masonry";
import { Sheet } from "@/components/ui/sheet";
import { MagnifierGlyph18 } from "@/components/icons";
import { useProgressive } from "@/lib/use-progressive";

const ALL = "All";

/**
 * Opens an item: a link to its own page when it has one (so crawlers and
 * ⌘/ctrl-click work), with a plain click intercepted to open the panel.
 */
function Opener({
  href,
  onOpen,
  className,
  tabIndex,
  children,
}: {
  href?: string;
  onOpen: () => void;
  className?: string;
  tabIndex?: number;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <button type="button" aria-haspopup="dialog" onClick={onOpen} className={className} tabIndex={tabIndex}>
        {children}
      </button>
    );
  }
  return (
    <a
      href={href}
      tabIndex={tabIndex}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onOpen();
      }}
    >
      {children}
    </a>
  );
}

type Props<T> = {
  items: T[];
  facets: Facet<T>[];
  text: (item: T) => string;
  /** Stable id used in the URL (?i=…) so an open item can be shared. */
  getKey: (item: T) => string;
  /** Singular / plural noun for counts, e.g. ["clip", "clips"]. */
  noun: [string, string];
  layout:
    | {
        kind: "grid";
        columns: string;
        tile: (item: T) => React.ReactNode;
        /** Caption under the tile, outside its button, so it can hold a real link. */
        caption?: (item: T) => { title: string; link?: { href: string; label: string } };
      }
    /** Row-first masonry: tiles keep their own height (see Masonry). */
    | { kind: "masonry"; columns: MasonryColumns; ratio: (item: T) => number; tile: (item: T) => React.ReactNode }
    | { kind: "list"; header: React.ReactNode; row: (item: T) => React.ReactNode };
  detail: (item: T, helpers: { list: T[]; open: (item: T) => void }) => React.ReactNode;
  /** The item's own page. Tiles become real links (crawlable, ⌘-click opens a tab); a plain click opens the panel. */
  href?: (item: T) => string;
  /** Media-first viewer: rendered centred on a dark stage, with `detail` in a right sidebar. */
  stage?: (item: T) => React.ReactNode;
  /** Shown when the collection has nothing in it yet. */
  empty: { title: string; body: string };
};

/**
 * The shared shape of every section: filters on the left, search on top,
 * content in the middle, details in a sheet. One structure everywhere, so
 * moving between sections never asks people to relearn anything.
 */
export function CollectionView<T>({ items, facets, text, getKey, noun, layout, detail, stage, href, empty }: Props<T>) {
  const c = useCollection({ items, facets, text });
  const [open, setOpen] = useState<T | null>(null);
  const [frozen, setFrozen] = useState<T[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const setUrlItem = (item: T | null) => {
    const url = new URL(window.location.href);
    item ? url.searchParams.set("i", getKey(item)) : url.searchParams.delete("i");
    window.history.replaceState(window.history.state, "", url);
  };

  const openItem = useCallback(
    (item: T) => {
      setFrozen((f) => (open !== null && f.includes(item) ? f : c.results.includes(item) ? c.results : items));
      setOpen(item);
      setUrlItem(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [c.results, items, open],
  );

  const close = useCallback(() => {
    setOpen(null);
    setUrlItem(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep link: ?i=<key> opens that item.
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("i");
    const hit = key ? items.find((i) => getKey(i) === key) : null;
    if (hit) {
      setFrozen(items);
      setOpen(hit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "/" focuses search, as on the index.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
      if (e.key === "/" && !typing && !document.querySelector("[role=dialog]")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Options only appear once at least one item in the collection has them.
  const present = new Map(facets.map((f) => [f.key, new Set(items.flatMap((i) => f.get(i)))]));

  const count = c.results.length;
  // Render a screenful or two, then more as the reader nears the end.
  const { shown, sentinel } = useProgressive(c.results, layout.kind === "list" ? 60 : 24);
  // No filters until there is something to filter.
  const filtersVisible = facets.length > 0 && items.length > 0;

  return (
    <div>
      <section aria-label={noun[1]} className="min-w-0">
        {/* Toolbar */}
        <div className="sticky top-[var(--header-h)] z-30 border-b bg-bg">
          <div className="flex h-12 items-center gap-3 px-4 sm:px-6">
            <MagnifierGlyph18 aria-hidden="true" className="size-3.5 shrink-0 text-fg-3" />
            <label className="contents">
              <span className="sr-only">Search {noun[1]}</span>
              <input
                ref={inputRef}
                type="search"
                value={c.query}
                onChange={(e) => c.setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    c.setQuery("");
                    e.currentTarget.blur();
                  }
                }}
                placeholder={`Search ${items.length} ${items.length === 1 ? noun[0] : noun[1]}`}
                autoComplete="off"
                spellCheck={false}
                className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-3 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
            <span className="hidden shrink-0 text-fg-3 tabular-nums sm:block">
              {count} {count === 1 ? noun[0] : noun[1]}
            </span>
          </div>
        </div>

        {/* Filters sit right under search: one row per group */}
        {filtersVisible && (
          <FilterBar
            groups={c.groups.map((g) => ({
              ...g,
              options: [
                ...(g.exclusive ? [{ value: ALL, count: g.total, active: g.active === 0 }] : []),
                ...g.options
                  .filter((o) => o.active || present.get(g.key)?.has(o.value))
                  .map((o) => ({ ...o, disabled: !o.active && o.count === 0 })),
              ],
            }))}
            onToggle={(key, value) => (value === ALL ? c.clearGroup(key) : c.toggle(key, value))}
            onClear={c.clearGroup}
          />
        )}

        {/* Content */}
        {items.length === 0 ? (
          <div className="px-4 py-20 sm:px-6">
            <p>{empty.title}</p>
            <p className="mt-1 max-w-[460px] text-fg-2">{empty.body}</p>
            <Link href="/submit" className="link mt-4 inline-block text-fg">
              Suggest something
            </Link>
          </div>
        ) : count === 0 ? (
          <div className="px-4 py-16 sm:px-6">
            <p>Nothing matches{c.query ? ` “${c.query}”` : ""}.</p>
            <button type="button" onClick={c.clearAll} className="link mt-1 text-fg-2 hover:text-fg">
              Reset search and filters
            </button>
          </div>
        ) : layout.kind === "masonry" ? (
          <Masonry
            items={shown}
            columns={layout.columns}
            ratio={layout.ratio}
            getKey={getKey}
            render={(item) => (
              <Opener href={href?.(item)} onOpen={() => openItem(item)} className="group block w-full text-left outline-none">
                {layout.tile(item)}
              </Opener>
            )}
          />
        ) : layout.kind === "grid" ? (
          <ul className={`grid gap-x-4 gap-y-8 px-4 py-6 sm:px-6 ${layout.columns}`}>
            {shown.map((item) => (
              <li key={getKey(item)} className="group">
                <Opener href={href?.(item)} onOpen={() => openItem(item)} className="group block w-full text-left outline-none">
                  {layout.tile(item)}
                </Opener>
                {layout.caption &&
                  (() => {
                    const cap = layout.caption(item);
                    return (
                      <div className="mt-2.5 flex items-baseline justify-between gap-3">
                        <Opener href={href?.(item)} tabIndex={-1} onOpen={() => openItem(item)} className="truncate text-left font-medium">
                          {cap.title}
                        </Opener>
                        {cap.link && (
                          <a
                            href={cap.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 truncate text-[12px] text-fg-3 underline-offset-4 transition-colors hover:text-fg hover:underline"
                          >
                            {cap.link.label}
                          </a>
                        )}
                      </div>
                    );
                  })()}
              </li>
            ))}
          </ul>
        ) : (
          <>
            {layout.header}
            <ul>
              {shown.map((item) => (
                <li key={getKey(item)} className="group relative border-b transition-colors hover:bg-hover">
                  <Opener
                    href={href?.(item)}
                    onOpen={() => openItem(item)}
                    className="absolute inset-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-fg"
                  >
                    <span className="sr-only">Show details</span>
                  </Opener>
                  {layout.row(item)}
                </li>
              ))}
            </ul>
          </>
        )}
        {sentinel}
      </section>

      <Sheet item={open} list={frozen} onSelect={openItem} onClose={close} stage={stage}>
        {(item) => detail(item, { list: frozen, open: openItem })}
      </Sheet>
    </div>
  );
}
