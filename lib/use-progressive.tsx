"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./use-in-view";

/**
 * Renders a long list a page at a time. The first page is in the server HTML;
 * the next one is added while the reader is still well above the end (the
 * sentinel watches ~1.5 screens ahead), so scrolling never reaches a gap.
 * A new search or filter starts again from the first page.
 */
export function useProgressive<T>(items: T[], page: number) {
  const [limit, setLimit] = useState(page);
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { rootMargin: "0px 0px 150% 0px" });

  const [prev, setPrev] = useState(items);
  if (prev !== items) {
    setPrev(items);
    setLimit(page);
  }

  useEffect(() => {
    if (near && limit < items.length) setLimit((l) => l + page);
  }, [near, limit, items.length, page]);

  const more = limit < items.length;
  return {
    shown: more ? items.slice(0, limit) : items,
    sentinel: <div ref={ref} aria-hidden="true" className={more ? "h-px" : "hidden"} />,
  };
}
