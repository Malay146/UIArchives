import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";
import { SECTIONS } from "@/lib/sections";
import { itemPath, resourcesWithSlugs, skillsWithSlugs } from "@/lib/server/items";

/**
 * /llms.txt — a plain-text map of the site for AI assistants that browse on a
 * user's behalf. Generated from the same data as the pages, so it never goes
 * stale. (It carries no ranking weight in Google; it's a convenience for agents.)
 */
export async function GET() {
  const [resources, skills] = await Promise.all([resourcesWithSlugs(), skillsWithSlugs()]);
  const posts = getAllPosts();
  const url = (p: string) => `${SITE_URL}${p}`;

  const lines = [
    "# UIArchives",
    "",
    "> A hand-picked archive of design resources for people who make interfaces: UI component libraries, design tools, fonts, icons and inspiration, plus design videos, Open Graph image examples, iOS/macOS app icons and agent skills for design. Every entry is chosen and reviewed by hand.",
    "",
    "## Sections",
    "",
    ...SECTIONS.map((s) => `- [${s.label}](${url(s.href)}): ${s.blurb}`),
    "",
    "## Journal",
    "",
    ...posts.map((p) => `- [${p.frontmatter.title}](${url(`/blog/${p.slug}`)}): ${p.frontmatter.description ?? p.frontmatter.excerpt ?? ""}`),
    "",
    "## Resources",
    "",
    ...resources.map((r) => `- [${r.item.title}](${url(itemPath.resources(r.slug))}): ${r.item.description}`),
    "",
    "## Agent skills",
    "",
    ...skills.map((s) => `- [${s.item.name}](${url(itemPath.skills(s.slug))}): ${s.item.description}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
