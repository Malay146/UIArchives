import { Metadata } from "next";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { BlogListingClient } from "@/components/blog/blog-listing-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uiarchives.com";

export const metadata: Metadata = {
  title: "Journal — design resource guides & UI tools",
  description:
    "Guides and notes on design resources: OG images, app icons, UI component libraries, agent skills for design and the frontend tools worth knowing. Written for designers and frontend developers.",
  alternates: { canonical: "/blog" },
  openGraph: {
    url: "/blog",
    type: "website",
    title: "Journal — UIArchives",
    description: "Guides and notes on design resources, UI tools and frontend craft.",
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
