import Link from "next/link";
import Image from "next/image";
import { type Post } from "@/types/blog";
import { Badge } from "./badge";
import { cn } from "@/utlis/cn";

export function PostCard({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const {
    title,
    description,
    date,
    category,
    tags,
    coverImage,
    author,
    sponsored,
    excerpt,
    isSponsored,
  } = post.frontmatter;

  const displayDescription = description || excerpt || "";
  const displaySponsored = sponsored || isSponsored;

  // Format date natively
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

  return (
    <article
      className={cn(
        "group relative flex flex-col items-start justify-between rounded-2xl border border-muted bg-card p-2 transition-all hover:bg-muted/30 hover:shadow-lg hover:border-zinc-800",
        className,
      )}
    >
      <div className="w-full">
        {coverImage ? (
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="default">{category}</Badge>
          {displaySponsored && <Badge variant="sponsored">Sponsored</Badge>}
          <time
            dateTime={date}
            className="text-sm font-medium text-muted-foreground tabular-nums ml-auto"
          >
            {formattedDate}
          </time>
        </div>

        <Link href={`/blog/${post.slug}`} className="block mt-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {displayDescription}
          </p>
        </Link>
      </div>

      <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-muted pt-4">
        {author ? (
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted border">
              {author.image ? (
                <Image
                  src={author.image}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary uppercase text-xs font-bold">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">
              {author.name}
            </span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {post.readingTime}
          </span>
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clickable overlay to make entire card a link for accessibility, but let individual links work */}
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">Read {title}</span>
      </Link>
    </article>
  );
}
