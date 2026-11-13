"use client";

import { useEffect, useMemo, useState } from "react";

/** Column count per minimum viewport width (px), largest first. */
export type MasonryColumns = { min: number; cols: number }[];

function useColumnCount(spec: MasonryColumns, fallback: number) {
  const [cols, setCols] = useState(fallback);
  useEffect(() => {
    const pick = () => setCols(spec.find((s) => window.innerWidth >= s.min)?.cols ?? 1);
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, [spec]);
  return cols;
}

/**
 * Row-first masonry: items are placed in order, each into the currently
 * shortest column (leftmost on a tie). So the first row is always items
 * 1…n left to right, columns share one top edge, and the layout is the same
 * every time for the same list. Heights come from each item's aspect ratio,
 * so nothing has to load before it's laid out.
 */
export function Masonry<T>({
  items,
  columns,
  ratio,
  getKey,
  render,
}: {
  items: T[];
  columns: MasonryColumns;
  /** Height ÷ width of an item. */
  ratio: (item: T) => number;
  getKey: (item: T) => string;
  render: (item: T) => React.ReactNode;
}) {
  const count = useColumnCount(columns, columns[0]?.cols ?? 1);
  const cols = useMemo(() => {
    const out: T[][] = Array.from({ length: count }, () => []);
    const heights = new Array(count).fill(0);
    for (const item of items) {
      let target = 0;
      for (let c = 1; c < count; c++) if (heights[c] < heights[target] - 0.001) target = c;
      out[target].push(item);
      heights[target] += ratio(item) + 0.06; // + the gap, relative to column width
    }
    return out;
  }, [items, count, ratio]);

  return (
    <div className="flex items-start gap-4 px-4 py-6 sm:px-6">
      {cols.map((col, i) => (
        <ul key={i} className="flex min-w-0 flex-1 flex-col gap-4">
          {col.map((item) => (
            <li key={getKey(item)}>{render(item)}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}
