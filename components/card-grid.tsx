"use client";

import { useEffect, useRef, useState } from "react";
import UiCard, { type UiCardData } from "./ui-card";

interface CardGridProps {
  cards: UiCardData[];
  isSearching: boolean;
}

export default function CardGrid({ cards, isSearching }: CardGridProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const loader = useRef<HTMLDivElement | null>(null);

  // Reset page when cards array changes (e.g. search query or filter changes)
  useEffect(() => {
    setPage(1);
  }, [cards]);

  const visibleCards = cards.slice(0, page * itemsPerPage);
  const hasMore = visibleCards.length < cards.length;

  // Intersection Observer for infinite scroll client-side
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" },
    );

    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [hasMore, page]);

  return (
    <>
      {/* Cards Grid */}
      <div className="Cards w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-3 mt-5 sm:mt-6 md:mt-8 font-[Inter] tracking-tight mb-3 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-0 relative">
        {isSearching && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center transition-opacity duration-300">
            <div className="text-white font-medium">Searching...</div>
          </div>
        )}

        {visibleCards.length > 0 ? (
          visibleCards.map((card, index) => (
            <UiCard key={`${card.title}-${index}`} {...card} />
          ))
        ) : !isSearching ? (
          <p className="text-zinc-500 text-center text-balance col-span-1 sm:col-span-2 lg:col-span-3 mt-5 mb-14 py-3 bg-zinc-900 rounded-2xl mx-auto px-5 w-full">
            No results found. Try a different keyword or filter.
          </p>
        ) : (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-64 bg-zinc-900 rounded-2xl animate-pulse flex items-center justify-center shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.02),inset_4px_4px_4px_rgba(0,0,0,0.5)]"
              >
                <span className="sr-only text-white text-2xl">
                  Searching...
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Infinite Scroll Loader */}
      {hasMore && visibleCards.length > 0 && (
        <div
          ref={loader}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-3 mb-8 px-4 sm:px-6 md:px-0"
        >
          {/* Minimal skeletons used mostly as boundary observer target because client render is instant */}
          {[...Array(3)].map((_, i) => (
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
