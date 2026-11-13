"use client";

import { useState } from "react";
import { type Post } from "@/types/blog";
import { PostRow, POST_GRID } from "./post-row";

const ALL = "All";

export function BlogListingClient({
  posts,
  categories,
}: {
  posts: Post[];
  categories: string[];
}) {
  const [active, setActive] = useState(ALL);
  const shown =
    active === ALL
      ? posts
      : posts.filter((p) => p.frontmatter.category === active);

  return (
    <div className="mx-auto max-w-[1920px]">
      <header className="px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
        <h1 className="rise font-medium">Journal</h1>
        <p
          className="rise mt-3 max-w-[460px] text-fg-2"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Notes on interface design, frontend tooling and the resources worth
          knowing. Written slowly, kept short.
        </p>
      </header>

      <nav
        aria-label="Topics"
        className="scrollbar-none flex gap-1 overflow-x-auto border-y px-4 py-3 sm:px-6"
      >
        {[ALL, ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={active === cat}
            onClick={() => setActive(cat)}
            className={`press shrink-0 rounded-md px-2 py-1 whitespace-nowrap transition-colors duration-150 ${
              active === cat ? "bg-hover text-fg" : "text-fg-2 hover:text-fg"
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div
        className={`hidden border-b px-6 py-2 text-fg-3 md:grid ${POST_GRID}`}
        aria-hidden="true"
      >
        <span>Date</span>
        <span>Title</span>
        <span>Topic</span>
        <span className="text-right">Read</span>
      </div>

      <ul>
        {shown.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </ul>
    </div>
  );
}
