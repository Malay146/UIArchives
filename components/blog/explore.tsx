import Link from "next/link";
import { SECTIONS, type SectionSlug } from "@/lib/sections";
import { SectionIcon } from "@/components/site/section-icon";
import { BlogCover } from "./cover";
import { getPostBySlug } from "@/lib/blog";
import { toGenre } from "@/lib/journal-genres";
import { ArrowUpRightGlyph18 } from "@/components/icons";

/**
 * The end of a Journal post: a card into the archive section the post is
 * about, then a short "Keep reading" list of related posts with their covers.
 *
 *   <Explore section="app-icons" posts={["og-image-size-guide"]} />
 */
export function Explore({ section, posts = [] }: { section: SectionSlug; posts?: string[] }) {
  const s = SECTIONS.find((x) => x.slug === section);
  const related = posts.map((slug) => getPostBySlug(slug)).filter((p) => p !== null);
  if (!s) return null;

  return (
    <aside className="not-prose mt-14">
      <Link
        href={s.href}
        className={`tint-${s.slug} group flex items-center gap-4 rounded-xl p-4 shadow-[0_0_0_1px_var(--line-strong)] transition-colors hover:bg-hover sm:p-5`}
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-hover transition-colors group-hover:bg-bg">
          <SectionIcon slug={s.slug} className="size-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] text-fg-3">Explore the archive</span>
          <span className="mt-0.5 block font-medium text-[var(--tint)]">{s.label}</span>
          <span className="mt-0.5 block truncate text-fg-2">{s.blurb}</span>
        </span>
        <ArrowUpRightGlyph18
          aria-hidden="true"
          className="size-3.5 shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
        />
      </Link>

      {related.length > 0 && (
        <div className="mt-10">
          <p className="text-fg-3">Keep reading</p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <BlogCover
                    title={p.frontmatter.title}
                    genre={toGenre(p.frontmatter.category)}
                    className="rounded-lg shadow-[0_0_0_1px_var(--line)] transition-shadow duration-200 group-hover:shadow-[0_0_0_1px_var(--line-strong)]"
                  />
                  <span className="mt-2.5 block font-medium text-balance">{p.frontmatter.title}</span>
                  <span className="mt-0.5 block text-[13px] text-fg-3">
                    {toGenre(p.frontmatter.category)} · {p.readingTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
