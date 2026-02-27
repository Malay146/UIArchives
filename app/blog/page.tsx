import { Metadata } from "next";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { BlogListingClient } from "@/components/blog/blog-listing-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uiarchives.com";

export const metadata: Metadata = {
  title: "Blog - UIArchives | Frontend Development & UI Design Articles",
  description:
    "Read the latest articles on UI design, frontend development, React components, and modern web design techniques. Stay updated with the best tools and resources.",
  keywords: [
    "UI design blog",
    "frontend development articles",
    "React components blog",
    "Tailwind CSS tutorials",
    "web design resources",
    "developer blog",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog - UIArchives | Frontend Development & UI Design",
    description:
      "Articles, tutorials, and insights for developers and designers on modern UI development and design systems.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "UIArchives",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "UIArchives Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UIArchives Blog | Frontend & Design",
    description:
      "Insights and resources for UI design and frontend development.",
    creator: "@pmalay694",
    site: "@pmalay694",
    images: [`${SITE_URL}/og.png`],
  },
};

export default function BlogListingPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  // Limit JSON-LD posts to max 10 to avoid gigantic script tags
  const topPosts = posts.slice(0, 10);

  // Blog Listing JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "UIArchives Blog",
    url: `${SITE_URL}/blog`,
    description:
      "Articles and tutorials on UI design and frontend development.",
    publisher: {
      "@type": "Organization",
      name: "UIArchives",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og.png`,
      },
    },
    blogPost: topPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.frontmatter.title,
      datePublished: post.frontmatter.date,
      dateModified: post.frontmatter.date,
      url: `${SITE_URL}/blog/${post.slug}`,
      author: post.frontmatter.author
        ? {
            "@type": "Person",
            name: post.frontmatter.author.name,
          }
        : {
            "@type": "Organization",
            name: "UIArchives",
          },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogListingClient posts={posts} categories={categories} />
    </>
  );
}
