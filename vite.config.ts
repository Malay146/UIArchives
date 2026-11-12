import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * @mdx-js/rollup matches on the path without its query, so it would also
 * compile `file.mdx?raw` (which must stay text). Only let plain imports in.
 */
function mdxOnlyPlainImports(): Plugin {
  const inner = mdx({
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  }) as Plugin;
  const transform = inner.transform as Function;
  return {
    ...inner,
    // Keep the standard name: vinext only skips its own auto-injected MDX
    // plugin when it finds one called "@mdx-js/rollup".
    name: "@mdx-js/rollup",
    enforce: "pre",
    transform(this: unknown, code: string, id: string, ...rest: unknown[]) {
      if (id.includes("?")) return null;
      return transform.call(this, code, id, ...rest);
    },
  } as Plugin;
}

export default defineConfig({
  plugins: [
    // Blog posts compile to components at build time. Frontmatter is
    // stripped here and read separately from the raw source (lib/blog.ts).
    mdxOnlyPlainImports(),
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
