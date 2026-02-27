import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { getMdxComponents } from "@/components/blog/mdx-components";
import { Badge } from "@/components/blog/badge";
import Button1 from "@/components/ui-components/Button1";
import Link from "next/link";
import GoUpArrowIcon from "@/components/Icons/GoUpArrowIcon";
import { PostCard } from "@/components/blog/post-card";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uiarchives.com";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) {
    return {
      title: "Post Not Found - UIArchives",
      robots: { index: false, follow: false },
    };
  }

  const {
    title,
    description,
    excerpt,
    date,
    coverImage,
    author,
    tags,
    category,
  } = post.frontmatter;
  const metaDesc = description || excerpt || "";
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;

  const keywords = [
    ...(tags || []),
    category || "Blog",
    "UIArchives",
    "Web Development",
    "UI Design",
  ];

  return {
    title: `${title} | UIArchives Blog`,
    description: metaDesc,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author.name }] : [{ name: "UIArchives Team" }],
    creator: author ? author.name : "UIArchives",
    publisher: "UIArchives",
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${title} | UIArchives`,
      description: metaDesc,
      type: "article",
      publishedTime: date,
      modifiedTime: date,
      url: canonicalUrl,
      siteName: "UIArchives",
      locale: "en_US",
      images: coverImage
        ? [
            {
              url: `${baseUrl}${coverImage}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: `${baseUrl}/og.png`,
              width: 1200,
              height: 630,
              alt: "UIArchives Default Image",
            },
          ],
      authors: author ? [author.name] : ["UIArchives Team"],
      tags: tags,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: metaDesc,
      creator: "@pmalay694",
      site: "@pmalay694",
      images: coverImage ? [`${baseUrl}${coverImage}`] : [`${baseUrl}/og.png`],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const {
    title,
    description,
    excerpt,
    date,
    category,
    tags,
    author,
    coverImage,
  } = post.frontmatter;
  const metaDesc = description || excerpt || "";

  const allPosts = getAllPosts();
  let suggestions = allPosts.filter((p) => p.slug !== post.slug);
  const sameCategory = suggestions.filter(
    (p) => p.frontmatter.category === category,
  );
  const otherCategory = suggestions.filter(
    (p) => p.frontmatter.category !== category,
  );
  suggestions = [...sameCategory, ...otherCategory].slice(0, 2);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    headline: title,
    description: metaDesc,
    image: coverImage ? [`${baseUrl}${coverImage}`] : [`${baseUrl}/og.png`],
    datePublished: date,
    dateModified: date,
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          url: baseUrl,
        }
      : {
          "@type": "Organization",
          name: "UIArchives",
          url: baseUrl,
        },
    publisher: {
      "@type": "Organization",
      name: "UIArchives",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og.png`,
      },
    },
    keywords: tags ? tags.join(", ") : undefined,
    articleSection: category,
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 xl:max-w-4xl font-sans border-x border-zinc-800">
        <Link href="/blog">
          <Button1 className="mb-12 flex items-center gap-2 tracking-tighter font-sans font-light">
            <GoUpArrowIcon className="size-4 text-zinc-300 rotate-270" />
            Back to Blogs
          </Button1>
        </Link>
        <header className="mb-14 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <time
              dateTime={date}
              className="text-sm font-medium text-muted-foreground tabular-nums"
            >
              {formattedDate}
            </time>
            <span className="text-muted-foreground/50 text-sm">•</span>
            <span className="text-sm font-medium text-muted-foreground">
              {post.readingTime}
            </span>
            <span className="text-muted-foreground/50 text-sm">•</span>
            <Badge variant="default" className="text-xs px-3">
              {category}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold  text-foreground leading-tight max-w-3xl font-display border-b border-zinc-500">
            {title}
          </h1>

          {author && (
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-muted bg-muted shadow-sm">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-foreground">
                  {author.name}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Author
                </span>
              </div>
            </div>
          )}
        </header>

        {coverImage && (
          <div className="relative mb-16 aspect-video w-full overflow-hidden rounded-2xl border bg-muted shadow-xl">
            <Image
              src={coverImage}
              alt={`Cover Image for ${title}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none text-lg prose-a:no-underline">
          <MDXRemote
            source={post.content}
            components={getMdxComponents()}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ],
              },
            }}
          />
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-muted flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Tags:
            </span>
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </article>

      {suggestions.length > 0 && (
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 xl:max-w-4xl font-sans border-x border-t border-zinc-800">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">
            You might also like
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <PostCard key={suggestion.slug} post={suggestion} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
