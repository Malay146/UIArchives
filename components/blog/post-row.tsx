import Link from "next/link";
import { type Post } from "@/types/blog";
import { formatDate } from "./format";

export const POST_GRID =
  "md:grid md:grid-cols-[8rem_minmax(0,1fr)_10rem_5rem] md:gap-6";

export function PostRow({ post }: { post: Post }) {
  const { title, description, excerpt, date, category, sponsored, isSponsored } =
    post.frontmatter;

  return (
    <li
      className={`group relative border-b px-4 py-5 transition-colors duration-150 hover:bg-hover sm:px-6 ${POST_GRID}`}
    >
      <time dateTime={date} className="text-fg-3 tabular-nums">
        {formatDate(date)}
      </time>
      <div className="mt-1 min-w-0 md:mt-0">
        <Link
          href={`/blog/${post.slug}`}
          className="font-medium outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:-outline-offset-1 focus-visible:after:outline-fg"
        >
          {title}
        </Link>
        {(sponsored || isSponsored) && (
          <span className="ml-2 text-fg-3">Sponsored</span>
        )}
        <p className="mt-1 line-clamp-2 max-w-[60ch] text-fg-2">
          {description || excerpt}
        </p>
      </div>
      <span className="mt-2 hidden text-fg-2 md:mt-0 md:block">{category}</span>
      <span className="hidden text-right text-fg-3 tabular-nums md:block">
        {post.readingTime.replace(" read", "")}
      </span>
    </li>
  );
}
