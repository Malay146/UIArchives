"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProductSearch } from "@/lib/search/useProductSearch";
import { CATEGORIES, type UiCardData, categoriesOf, logoKey } from "@/types/resource";
import { ResourceRow, ROW_GRID } from "./resource-row";
import { ResourceDrawer } from "./resource-drawer";
import { MagnifierGlyph18 } from "@/components/icons";
import { FilterBar } from "@/components/collection/filter-bar";
import { SET_CATEGORY } from "@/lib/command";

const ALL = "All";

export function Directory({ resources }: { resources: UiCardData[] }) {
  const { query, setQuery, results } = useProductSearch(resources);
  const [category, setCategory] = useState<string>(ALL);
  const [selected, setSelected] = useState<UiCardData | null>(null);
  // The list the drawer walks with ↑/↓ is frozen when it opens, so typing
  // or filtering behind it never reshuffles what "next" means.
  const [drawerList, setDrawerList] = useState<UiCardData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listTopRef = useRef<HTMLDivElement>(null);

  // Stable catalogue numbers, independent of search order.
  const numberOf = useMemo(() => {
    const map = new Map<UiCardData, number>();
    resources.forEach((r, i) => map.set(r, i + 1));
    return map;
  }, [resources]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { [ALL]: results.length };
    for (const cat of CATEGORIES) c[cat] = 0;
    for (const r of results) {
      for (const cat of categoriesOf(r)) c[cat]++;
    }
    return c;
  }, [results]);

  const visible = useMemo(
    () =>
      category === ALL
        ? results
        : results.filter((r) => (categoriesOf(r) as string[]).includes(category)),
    [results, category],
  );

  // ----- Detail drawer, mirrored in the URL as ?r=<key> so it can be shared.
  const setUrlResource = (r: UiCardData | null) => {
    const url = new URL(window.location.href);
    if (r) url.searchParams.set("r", logoKey(r));
    else url.searchParams.delete("r");
    window.history.replaceState(window.history.state, "", url);
  };

  const visibleRef = useRef<UiCardData[]>([]);
  visibleRef.current = visible;

  const openDrawer = useCallback((r: UiCardData) => {
    setDrawerList(visibleRef.current.includes(r) ? visibleRef.current : resources);
    setSelected(r);
    setUrlResource(r);
  }, [resources]);

  const selectInDrawer = useCallback((r: UiCardData) => {
    setDrawerList((list) => (list.includes(r) ? list : resources));
    setSelected(r);
    setUrlResource(r);
  }, [resources]);

  const closeDrawer = useCallback(() => {
    setSelected(null);
    setUrlResource(null);
  }, []);

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("r");
    const r = key ? resources.find((x) => logoKey(x) === key) : null;
    if (r) {
      setDrawerList(resources);
      setSelected(r);
    }
  }, [resources]);

  // Category can be set from the URL (?c=Fonts) or from the command menu.
  useEffect(() => {
    const valid = (c: string | null): c is string =>
      !!c && (c === ALL || (CATEGORIES as readonly string[]).includes(c));
    const fromUrl = new URLSearchParams(window.location.search).get("c");
    if (valid(fromUrl)) setCategory(fromUrl);
    const onSet = (e: Event) => {
      const c = (e as CustomEvent<string>).detail;
      if (valid(c)) setCategory(c);
    };
    window.addEventListener(SET_CATEGORY, onSet);
    return () => window.removeEventListener(SET_CATEGORY, onSet);
  }, []);

  // "/" focuses search, Escape clears it. No animation: keyboard actions stay instant.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing =
        el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
      if (e.key === "/" && !typing && !document.querySelector("[role=dialog]")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const choose = useCallback((cat: string) => {
    setCategory(cat);
    const top = listTopRef.current;
    if (top && top.getBoundingClientRect().top < 0) {
      top.scrollIntoView({ block: "start" });
    }
  }, []);

  return (
    <div>
      <section aria-label="Resources" className="min-w-0">
        <div ref={listTopRef} className="scroll-mt-[var(--header-h)]" />

        {/* Search */}
        <div className="sticky top-[var(--header-h)] z-30 border-b bg-bg">
          <label className="flex h-12 items-center gap-3 px-4 sm:px-6">
            <MagnifierGlyph18 className="size-3.5 shrink-0 text-fg-3" aria-hidden="true" />
            <span className="sr-only">Search the index</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  e.currentTarget.blur();
                }
              }}
              placeholder={`Search ${resources.length} resources`}
              autoComplete="off"
              spellCheck={false}
              className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-3 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <kbd className="hidden h-5 min-w-5 place-items-center rounded border px-1 font-sans text-[11px] text-fg-3 sm:grid">
              /
            </kbd>
          </label>
        </div>

        {/* Filters under search */}
        <FilterBar
          groups={[
            {
              key: "category",
              label: "Category",
              options: [ALL, ...CATEGORIES].map((cat) => ({
                value: cat,
                count: counts[cat],
                active: cat === category,
                disabled: cat !== category && counts[cat] === 0,
              })),
            },
          ]}
          onToggle={(_, value) => choose(value)}
        />

        {/* Column labels */}
        <div
          className={`hidden border-b px-6 py-2 text-fg-3 md:grid ${ROW_GRID}`}
          aria-hidden="true"
        >
          <span>No.</span>
          <span>Name</span>
          <span>About</span>
          <span>Category</span>
          <span className="text-right">
            {visible.length} {visible.length === 1 ? "result" : "results"}
          </span>
        </div>

        {visible.length > 0 ? (
          <ul>
            {visible.map((r) => (
              <ResourceRow
                key={numberOf.get(r)}
                resource={r}
                number={numberOf.get(r) ?? 0}
                selected={selected === r}
                onOpen={openDrawer}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-2 px-4 py-16 sm:px-6">
            <p>Nothing matches{query ? ` “${query}”` : ""}.</p>
            <p className="text-fg-2">
              Try a broader word, or{" "}
              <button
                type="button"
                className="link text-fg"
                onClick={() => {
                  setQuery("");
                  setCategory(ALL);
                  inputRef.current?.focus();
                }}
              >
                reset the index
              </button>
              .
            </p>
          </div>
        )}
      </section>

      <ResourceDrawer
        resource={selected}
        list={drawerList}
        numberOf={(r) => numberOf.get(r) ?? 0}
        onSelect={selectInDrawer}
        onClose={closeDrawer}
      />
    </div>
  );
}
