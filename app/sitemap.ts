import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import {
  appIconsWithSlugs,
  designsWithSlugs,
  itemPath,
  ogImagesWithSlugs,
  resourcesWithSlugs,
  skillsWithSlugs,
} from "@/lib/server/items";
import { SITE_URL } from "@/lib/seo";

/**
 * Every indexable page: the sections, each archive item's own page, and the
 * Journal. `lastModified` is only set where we know a real date — Google
 * uses it when it's accurate and ignores changefreq/priority entirely.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${SITE_URL}${path}`;
  const posts = getAllPosts();
  const latestPost = posts[0]?.frontmatter.date;

  const [resources, designs, ogImages, appIcons, skills] = await Promise.all([
    resourcesWithSlugs(),
    designsWithSlugs(),
    ogImagesWithSlugs(),
    appIconsWithSlugs(),
    skillsWithSlugs(),
  ]);

  return [
    { url: url("/") },
    { url: url("/designs") },
    { url: url("/og-images") },
    { url: url("/app-icons") },
    { url: url("/skills") },
    { url: url("/blog"), ...(latestPost ? { lastModified: new Date(latestPost) } : {}) },
    { url: url("/submit") },

    ...posts.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: new Date(p.frontmatter.date) })),

    ...resources.map((r) => ({ url: url(itemPath.resources(r.slug)) })),
    ...designs.map((d) => ({ url: url(itemPath.designs(d.slug)), lastModified: new Date(d.item.added) })),
    ...ogImages.map((o) => ({ url: url(itemPath["og-images"](o.slug)), lastModified: new Date(o.item.added) })),
    ...appIcons.map((a) => ({ url: url(itemPath["app-icons"](a.slug)), lastModified: new Date(a.item.added) })),
    ...skills.map((s) => ({ url: url(itemPath.skills(s.slug)) })),
  ];
}
