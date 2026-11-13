"use client";

import { useEffect, useState } from "react";
import { GithubGlyph32 } from "@/components/icons";

const REPO = "Malay146/UIArchives";
const CACHE_KEY = "uia:stars";
const HOUR = 3600_000;

/** Star count from GitHub, cached in the visitor's browser for an hour. */
function useStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null") as { n: number; t: number } | null;
      if (cached && Date.now() - cached.t < HOUR) return setStars(cached.n);
    } catch {}
    fetch(`https://api.github.com/repos/${REPO}`, { headers: { accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? (r.json() as Promise<{ stargazers_count?: number }>) : null))
      .then((j: { stargazers_count?: number } | null) => {
        if (typeof j?.stargazers_count !== "number") return;
        setStars(j.stargazers_count);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ n: j.stargazers_count, t: Date.now() }));
        } catch {}
      })
      .catch(() => {});
  }, []);
  return stars;
}

export function GithubStar() {
  const stars = useStars();
  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Star UIArchives on GitHub${stars !== null ? ` (${stars} stars)` : ""}`}
      className="press flex h-7 items-center gap-1.5 rounded-md px-2 text-fg-2 shadow-[inset_0_0_0_1px_var(--line-strong)] transition-colors hover:bg-hover hover:text-fg"
    >
      <GithubGlyph32 aria-hidden="true" className="size-3.5" />
      <span className="hidden sm:inline">Star</span>
      {stars !== null && <span className="hidden text-fg-3 tabular-nums sm:inline">{stars.toLocaleString("en-US")}</span>}
    </a>
  );
}
