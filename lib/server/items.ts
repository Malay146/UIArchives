import { getAppIcons, getDesigns, getOgImages, getResources, getSkills } from "./published";
import { withSlugs } from "@/lib/slug";
import { logoKey } from "@/types/resource";
import { shortAppName } from "@/lib/app-name";

/**
 * Every archive item with its own page: one slug per item, per section.
 * The same functions back the item pages, the sitemap and llms.txt, so links
 * always agree.
 */
export const itemPath = {
  resources: (slug: string) => `/resources/${slug}`,
  designs: (slug: string) => `/designs/${slug}`,
  "og-images": (slug: string) => `/og-images/${slug}`,
  "app-icons": (slug: string) => `/app-icons/${slug}`,
  skills: (slug: string) => `/skills/${slug}`,
};

export const resourcesWithSlugs = async () => withSlugs(await getResources(), (r) => logoKey(r));
export const designsWithSlugs = async () => withSlugs(await getDesigns(), (d) => d.title);
export const ogImagesWithSlugs = async () => withSlugs(await getOgImages(), (o) => o.title);
export const appIconsWithSlugs = async () => withSlugs(await getAppIcons(), (a) => shortAppName(a.name));
export const skillsWithSlugs = async () => withSlugs(await getSkills(), (s) => s.id.startsWith("sk-") ? s.name : s.id);

export async function findBySlug<T>(list: Promise<{ item: T; slug: string }[]>, slug: string) {
  return (await list).find((x) => x.slug === slug) ?? null;
}
