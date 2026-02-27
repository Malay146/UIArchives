import { useState, useEffect, useRef, useMemo } from "react";
import MiniSearch from "minisearch";

export interface BaseProduct {
  title?: string;
  description?: string;
  tag?: string | string[];
  image?: string;
  links?: any;
  [key: string]: any;
}

export interface UseProductSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  isSearching: boolean;
}

export function useProductSearch<T extends BaseProduct>(
  products: T[],
): UseProductSearchReturn<T> {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const miniSearchRef = useRef<MiniSearch<T & { _id: number }> | null>(null);

  // We assign a stable _id to each product for MiniSearch since they might not have one.
  const productsWithId = useMemo(() => {
    return products.map((p, i) => ({ ...p, _id: i }));
  }, [products]);

  // Debounce the query input (300ms)
  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, debouncedQuery]);

  // Derive results using MiniSearch, initializing lazily
  const results = useMemo(() => {
    const trimmedQuery = debouncedQuery.trim();

    // If query is empty, return all products
    if (!trimmedQuery) {
      return products;
    }

    // Initialize index ONLY when search is first used
    if (!miniSearchRef.current) {
      miniSearchRef.current = new MiniSearch<T & { _id: number }>({
        idField: "_id",
        fields: ["title", "tag", "description"],
        storeFields: ["title", "description", "tag", "image", "links"],
        extractField: (document, fieldName) => {
          // Enhance tag extraction to properly join arrays (if tag is an array)
          if (fieldName === "tag" && Array.isArray(document.tag)) {
            return document.tag.join(" ");
          }
          return document[fieldName];
        },
        searchOptions: {
          boost: { title: 3, tag: 2, description: 2 },
          prefix: true,
          fuzzy: 0.2, // use fuzzy search as fallback and main search
        },
      });

      // Build index in memory from the products array
      if (productsWithId.length > 0) {
        miniSearchRef.current.addAll(productsWithId);
      }
    }

    // Execute strict search first (main search)
    let searchResults = miniSearchRef.current.search(trimmedQuery, {
      prefix: true,
      boost: { title: 3, tag: 2, description: 2 },
    });

    // Use fuzzy search as fallback if no results are found
    if (searchResults.length === 0) {
      searchResults = miniSearchRef.current.search(trimmedQuery, {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 3, tag: 2, description: 2 },
      });
    }

    // Map search results back to original product objects
    // Using an array look up since we used numerical index as _id
    return searchResults
      .map((res) => products[res.id])
      .filter((p): p is T => p !== undefined);
  }, [debouncedQuery, products, productsWithId]);

  // Clean up if products change significantly
  useEffect(() => {
    // Relying on the ref to hold the singleton indefinitely unless unmounted.
  }, [products]);

  return {
    query,
    setQuery,
    results,
    isSearching,
  };
}
