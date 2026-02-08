"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import UiCard, { type UiCardData } from "./ui-card";
import CrossIcon from "./Icons/cross-icon";

interface CardGridProps {
  selectedTag: string;
  searchQuery: string;
}

export default function CardGrid({ selectedTag, searchQuery }: CardGridProps) {
  const [cards, setCards] = useState<UiCardData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [total, setTotal] = useState(0);

  const loader = useRef<HTMLDivElement | null>(null);
  const prevFiltersRef = useRef({ selectedTag, searchQuery });

  const fetchCards = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (loading || (!hasMore && !reset)) return;

      setLoading(true);
      if (reset) setIsFiltering(true);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "12",
          tag: selectedTag,
          search: searchQuery,
        });

        const res = await fetch(`/api/cards?${params}`);
        const data = await res.json();

        setCards((prev) => (reset ? data.cards : [...prev, ...data.cards]));
        setHasMore(data.hasMore);
        setTotal(data.total);
        setPage(pageNum + 1);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
      } finally {
        setLoading(false);
        if (reset) setIsFiltering(false);
      }
    },
    [selectedTag, searchQuery, loading, hasMore]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.selectedTag !== selectedTag ||
      prevFiltersRef.current.searchQuery !== searchQuery;

    if (filtersChanged) {
      prevFiltersRef.current = { selectedTag, searchQuery };
      // Don't clear cards immediately - keep them visible while loading
      setPage(1);
      setHasMore(true);
      fetchCards(1, true);
    }
  }, [selectedTag, searchQuery, fetchCards]);

  // Initial load
  useEffect(() => {
    if (cards.length === 0) {
      fetchCards(1, true);
    }
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          fetchCards(page, false);
        }
      },
      { rootMargin: "200px" }
    );

    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchCards]);

  return (
    <>
      {/* Cards Grid */}
      <div className="Cards w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-3 mt-5 sm:mt-6 md:mt-8 font-[Inter] tracking-tight mb-3 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-0 relative">
        {/* Loading overlay for smooth transitions */}
        {isFiltering && cards.length > 0 && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center transition-opacity duration-300">
            <div className="text-white font-medium">Loading...</div>
          </div>
        )}
        {cards.length > 0 ? (
          cards.map((card, index) => <UiCard key={`${card.title}-${index}`} {...card} />)
        ) : loading && !isFiltering ? (
          // Show skeleton loader on initial load
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-64 bg-zinc-900 rounded-2xl animate-pulse flex items-center justify-center shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.02),inset_4px_4px_4px_rgba(0,0,0,0.5)]"
              >
                <span className="sr-only text-white text-2xl">Loading...</span>
              </div>
            ))}
          </>
        ) : (
          <p className="text-zinc-500 text-center text-balance col-span-1 sm:col-span-2 lg:col-span-3 mt-5 mb-14 py-3 bg-zinc-900 rounded-2xl mx-auto px-5">
            No results found. Try a different keyword or filter.
          </p>
        )}
      </div>

      {/* Infinite Scroll Loader */}
      {hasMore && cards.length > 0 && (
        <div
          ref={loader}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-3 mb-8 px-4 sm:px-6 md:px-0"
        >
          {loading &&
            [...Array(6)].map((_, i) => (
              <div
                key={`loading-skeleton-${i}`}
                className="h-64 bg-zinc-900/50 animate-pulse rounded-2xl shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.02),inset_4px_4px_4px_rgba(0,0,0,0.5)]"
              >
                <span className="sr-only text-white text-2xl">Loading...</span>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
