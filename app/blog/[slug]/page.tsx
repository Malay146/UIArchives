import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug, getAllPosts, getPostComponent } from "@/lib/blog";
import { getMdxComponents } from "@/components/blog/mdx-components";
import Link from "next/link";
import { PostRow } from "@/components/blog/post-row";
import { ArrowLeftGlyph18 } from "@/components/icons";
import { formatDate } from "@/components/blog/format";

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
  const Body = getPostComponent(post.slug);

  const allPosts = getAllPosts();
  let suggestions = allPosts.filter((p) => p.slug !== post.slug);
  const sameCategory = suggestions.filter(
    (p) => p.frontmatter.category === category,
  );
  const otherCategory = suggestions.filter(
    (p) => p.frontmatter.category !== category,
  );
  suggestions = [...sameCategory, ...otherCategory].slice(0, 2);

  const formattedDate = formatDate(date, "long");

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
      <article className="mx-auto max-w-[680px] px-4 pt-12 sm:px-6 sm:pt-16">
        <Link
          href="/blog"
          className="press -ml-1 inline-flex items-center gap-1.5 p-1 text-fg-2 transition-colors hover:text-fg"
        >
          <ArrowLeftGlyph18 aria-hidden="true" className="size-3" /> Journal
        </Link>

        <header className="mt-12 border-b pb-10">
          <p className="flex flex-wrap items-center gap-x-2 text-fg-3">
            <time dateTime={date} className="tabular-nums">
              {formattedDate}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>{category}</span>
          </p>
          <h1 className="mt-3 text-[20px] leading-snug font-medium tracking-[-0.015em] text-balance">
            {title}
          </h1>
          {metaDesc && (
            <p className="mt-3 text-[15px] text-fg-2 text-pretty">{metaDesc}</p>
          )}
          {author && (
            <div className="mt-6 flex items-center gap-2.5">
              <span className="relative grid size-6 place-items-center overflow-hidden rounded-full border bg-hover text-[11px] font-medium">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt=""
                    fill
                    sizes="24px"
                    className="object-cover grayscale"
                  />
                ) : (
                  author.name.charAt(0)
                )}
              </span>
              <span>{author.name}</span>
            </div>
          )}
        </header>

        {coverImage && (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-lg border bg-hover">
            <Image
              src={coverImage}
              alt={`Cover image for ${title}`}
              fill
              sizes="(max-width: 680px) 100vw, 680px"
              className="object-cover grayscale"
              priority
            />
          </div>
        )}

        <div className="mt-10">
          {Body ? <Body components={getMdxComponents()} /> : null}
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-16 flex flex-wrap gap-x-3 gap-y-1 border-t pt-6 text-fg-3">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </article>

      {suggestions.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1600px]">
          <h2 className="border-b px-4 pb-3 text-fg-3 sm:px-6">Keep reading</h2>
          <ul>
            {suggestions.map((s) => (
              <PostRow key={s.slug} post={s} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
