"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * One way of slicing a collection, e.g. "Platform" → Web / iOS / Android.
 * `get` returns every value an item belongs to (an item can sit in several).
 */
export type Facet<T> = {
  key: string;
  label: string;
  get: (item: T) => string[];
  /** Fixed display order; values not listed are appended alphabetically. */
  order?: string[];
  /**
   * One choice at a time, with an "All" option and every value in `order`
   * always listed (even before anything is filed under it).
   */
  exclusive?: boolean;
};

export type FacetOption = { value: string; count: number; active: boolean };
export type FacetGroup = { key: string; label: string; options: FacetOption[]; active: number; exclusive?: boolean; total: number };

const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/**
 * Faceted filtering that behaves the way people expect:
 *  - inside one group, choices widen the result (OR);
 *  - across groups, they narrow it (AND);
 *  - every count shows what you'd get if you clicked it next.
 * State lives in the URL (?q=…&platform=ios,web) so any view can be shared.
 */
export function useCollection<T>({
  items,
  facets,
  text,
}: {
  items: T[];
  facets: Facet<T>[];
  /** Searchable text for an item. */
  text: (item: T) => string;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  // Read initial state from the URL once.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQuery(p.get("q") ?? "");
    const next: Record<string, string[]> = {};
    for (const f of facets) {
      const v = p.get(f.key);
      if (v) next[f.key] = v.split(",").filter(Boolean);
    }
    setSelected(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write state back to the URL without adding history entries.
  useEffect(() => {
    const url = new URL(window.location.href);
    query.trim() ? url.searchParams.set("q", query.trim()) : url.searchParams.delete("q");
    for (const f of facets) {
      const v = selected[f.key];
      v?.length ? url.searchParams.set(f.key, v.join(",")) : url.searchParams.delete(f.key);
    }
    window.history.replaceState(window.history.state, "", url);
  }, [query, selected, facets]);

  const haystack = useMemo(() => new Map(items.map((i) => [i, norm(text(i))])), [items, text]);

  const matchesQuery = useCallback(
    (item: T) => {
      const words = norm(query).split(/\s+/).filter(Boolean);
      if (!words.length) return true;
      const h = haystack.get(item) ?? "";
      return words.every((w) => h.includes(w));
    },
    [query, haystack],
  );

  const matchesFacets = useCallback(
    (item: T, skip?: string) =>
      facets.every((f) => {
        if (f.key === skip) return true;
        const want = selected[f.key];
        if (!want?.length) return true;
        const has = f.get(item);
        return want.some((w) => has.includes(w));
      }),
    [facets, selected],
  );

  const results = useMemo(
    () => items.filter((i) => matchesQuery(i) && matchesFacets(i)),
    [items, matchesQuery, matchesFacets],
  );

  const groups: FacetGroup[] = useMemo(
    () =>
      facets.map((f) => {
        const pool = items.filter((i) => matchesQuery(i) && matchesFacets(i, f.key));
        const counts = new Map<string, number>();
        if (f.exclusive) for (const v of f.order ?? []) counts.set(v, 0);
        for (const i of items) for (const v of f.get(i)) if (!counts.has(v)) counts.set(v, 0);
        for (const i of pool) for (const v of new Set(f.get(i))) counts.set(v, (counts.get(v) ?? 0) + 1);
        const order = f.order ?? [];
        const values = [...counts.keys()].sort((a, b) => {
          const ia = order.indexOf(a);
          const ib = order.indexOf(b);
          if (ia !== -1 || ib !== -1) return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
          return a.localeCompare(b);
        });
        const active = selected[f.key] ?? [];
        return {
          key: f.key,
          label: f.label,
          active: active.length,
          exclusive: f.exclusive,
          total: pool.length,
          options: values.map((value) => ({
            value,
            count: counts.get(value) ?? 0,
            active: active.includes(value),
          })),
        };
      }),
    [facets, items, matchesQuery, matchesFacets, selected],
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      const exclusive = facets.find((f) => f.key === key)?.exclusive;
      setSelected((s) => {
        const cur = s[key] ?? [];
        const next = exclusive
          ? cur.includes(value) ? [] : [value]
          : cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
        return { ...s, [key]: next };
      });
    },
    [facets],
  );

  const clearGroup = useCallback((key: string) => setSelected((s) => ({ ...s, [key]: [] })), []);
  const clearAll = useCallback(() => {
    setSelected({});
    setQuery("");
  }, []);

  const activeCount = Object.values(selected).reduce((n, v) => n + (v?.length ?? 0), 0);

  return { query, setQuery, results, groups, toggle, clearGroup, clearAll, activeCount };
}
