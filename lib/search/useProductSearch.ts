import { useEffect, useMemo, useState } from "react";
import MiniSearch, { type SearchOptions } from "minisearch";

export interface BaseProduct {
  title?: string;
  description?: string;
  tag?: string | string[];
  links?: { website?: string; [key: string]: string | undefined };
  [key: string]: any;
}

export interface UseProductSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  isSearching: boolean;
}

/** Lowercase, strip accents and possessives so "Café's" matches "cafe". */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]s\b/g, "");

const hostOf = (url?: string) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "").replace(/\.[a-z]+$/, "");
  } catch {
    return "";
  }
};

type SearchDoc = {
  id: number;
  title: string;
  host: string;
  tag: string;
  description: string;
};

const BOOST = { title: 6, host: 3, tag: 2, description: 1 };

/** Typos are forgiven only on longer words, where they are unambiguous. */
const fuzzy = (term: string) => (term.length >= 5 ? 0.2 : false);

/**
 * Ranked, client-side search. Precision first: every word must match
 * (title, tags, domain or description). Only when that finds nothing does it
 * forgive typos, and only then does it accept partial matches.
 */
export function createSearch<T extends BaseProduct>(products: T[]) {
  const ms = new MiniSearch<SearchDoc>({
    fields: ["title", "host", "tag", "description"],
    processTerm: (term) => {
      const t = normalize(term);
      return t.length > 0 ? t : null;
    },
  });
  ms.addAll(
    products.map((p, id) => ({
      id,
      title: p.title ?? "",
      // Domain for products, X handle for people.
      host: [hostOf(p.links?.website), p.links?.twitter?.split("/").filter(Boolean).pop() ?? ""]
        .join(" ")
        .trim(),
      tag: (Array.isArray(p.tag) ? p.tag : [p.tag ?? ""]).join(" "),
      description: p.description ?? "",
    })),
  );

  return (query: string): T[] => {
    const q = query.trim();
    if (!q) return products;

    const nq = normalize(q);
    const base: SearchOptions = {
      boost: BOOST,
      prefix: (term, i, terms) => i === terms.length - 1 || term.length >= 3,
    };

    // Title matches outrank everything: exact, then leading, then any word.
    const tier = (title: string) => {
      const t = normalize(title);
      if (t === nq) return 0;
      if (t.startsWith(nq)) return 1;
      if (t.split(/[\s/._-]+/).some((w) => w.startsWith(nq))) return 2;
      return 3;
    };

    const attempts: SearchOptions[] = [
      { ...base, combineWith: "AND" },
      { ...base, combineWith: "AND", fuzzy },
      { ...base, combineWith: "OR", fuzzy },
    ];

    for (const opts of attempts) {
      const hits = ms.search(q, opts);
      if (hits.length) {
        return hits
          .map((h, rank) => {
            const p = products[h.id];
            const title = p?.title ?? "";
            return { p, rank, tier: tier(title), len: title.length };
          })
          .sort(
            (x, y) =>
              x.tier - y.tier ||
              (x.tier === 1 ? x.len - y.len : 0) ||
              x.rank - y.rank,
          )
          .map((x) => x.p)
          .filter((p): p is T => !!p);
      }
    }
    return [];
  };
}

export function useProductSearch<T extends BaseProduct>(
  products: T[],
): UseProductSearchReturn<T> {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 80);
    return () => clearTimeout(id);
  }, [query]);

  const search = useMemo(() => createSearch(products), [products]);
  const results = useMemo(() => search(debounced), [search, debounced]);

  return { query, setQuery, results, isSearching: query !== debounced };
}
