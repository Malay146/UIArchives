import type { ComponentType } from "react";
import { load as parseYaml } from "js-yaml";
import readingTime from "reading-time";
import { toGenre } from "./journal-genres";
import type { Post, PostFrontmatter } from "../types/blog";

/**
 * Blog posts are bundled at build time — Cloudflare Workers have no file
 * system at runtime, and MDX is compiled ahead of time (no eval at the edge).
 *
 *  - `?raw` gives the source, for frontmatter and reading time;
 *  - the plain import is the compiled MDX component (see vite.config.ts).
 */
const SOURCES = import.meta.glob("/content/blog/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const COMPONENTS = import.meta.glob("/content/blog/*.mdx", { eager: true }) as Record<
  string,
  { default: ComponentType<{ components?: Record<string, unknown> }> }
>;

/** `---\nyaml\n---\nbody` → { data, content }. Pure JS, safe on Workers (no Buffer). */
function matter(source: string): { data: Record<string, unknown>; content: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!m) return { data: {}, content: source };
  return { data: (parseYaml(m[1]) as Record<string, unknown>) ?? {}, content: m[2] };
}

const slugOf = (path: string) => path.split("/").pop()!.replace(/\.mdx$/, "");

const POSTS: Post[] = Object.entries(SOURCES)
  .map(([path, source]) => {
    const { data, content } = matter(source);
    // Every post belongs to one Journal genre (drives filters and the cover).
    data.category = toGenre(typeof data.category === "string" ? data.category : undefined);
    return {
      slug: slugOf(path),
      frontmatter: data as unknown as PostFrontmatter,
      content,
      readingTime: readingTime(content).text,
    };
  })
  .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

export function getAllPosts(): Post[] {
  return POSTS;
}

export function getPostBySlug(slug: string): Post | null {
  return POSTS.find((p) => p.slug === slug.replace(/\.mdx$/, "")) ?? null;
}

/** The compiled MDX body for a post (server-only — components can't cross to the client). */
export function getPostComponent(slug: string) {
  const hit = Object.entries(COMPONENTS).find(([path]) => slugOf(path) === slug);
  return hit?.[1].default ?? null;
}

export function getAllCategories(): string[] {
  return [...new Set(POSTS.map((p) => p.frontmatter.category).filter(Boolean))];
}

export function getAllTags(): string[] {
  return [...new Set(POSTS.flatMap((p) => p.frontmatter.tags || []).filter(Boolean))];
}
