import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import { toGenre } from "@/lib/journal-genres";
import { BlogCover } from "@/components/blog/cover";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * A post's cover alone at 1200 × 630, for `npm run covers` to capture as the
 * post's share image (public/blogs/<slug>.png). Light theme, always.
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, width: 1200, height: 630 }}>
      <BlogCover title={post.frontmatter.title} genre={toGenre(post.frontmatter.category)} theme="light" />
    </div>
  );
}
