"use client";

import { useState } from "react";
import { type Post } from "@/types/blog";
import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/blog/badge";
import Button1 from "@/components/ui-components/Button1";
import GoUpArrowIcon from "@/components/Icons/GoUpArrowIcon";
import Link from "next/link";

interface BlogListingClientProps {
  posts: Post[];
  categories: string[];
}

export function BlogListingClient({
  posts,
  categories,
}: BlogListingClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All Topics");

  const filteredPosts =
    activeCategory === "All Topics"
      ? posts
      : posts.filter((post) => post.frontmatter.category === activeCategory);

  return (
    <div className="container mx-auto py-12 xl:max-w-7xl font-sans relative border-x border-zinc-800 bg-zinc-950">
      <Link href="/">
        <Button1 className="mx-6 mb-12 flex items-center gap-2 tracking-tighter font-sans font-light">
          <GoUpArrowIcon className="size-4 text-zinc-300 rotate-270" />
          Back Home
        </Button1>
      </Link>
      <header className="mb-16 md:mb-16 flex flex-col items-start gap-4 max-w-3xl px-6">
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-sm tracking-tight bg-zinc-900 border-zinc-600"
        >
          UI Archives Journal
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-display">
          Engineering & Design
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-[24px] tracking-tight">
          Deep dives into modern web development, sophisticated system
          architecture, and building excellent user interfaces.
        </p>
      </header>

      <section className="mb-16">
        <div className="flex flex-wrap gap-2 py-8 border-y border-zinc-800 px-6">
          <Button1
            className="text-sm px-4 py-1"
            isActive={activeCategory === "All Topics"}
            onClick={() => setActiveCategory("All Topics")}
          >
            All Topics
          </Button1>
          {categories.map((cat) => (
            <Button1
              key={cat}
              className="hover:bg-secondary/80 cursor-pointer transition-colors text-sm px-4 py-1"
              isActive={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button1>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
