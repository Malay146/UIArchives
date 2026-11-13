import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImagesWithSlugs, findBySlug, itemPath } from "@/lib/server/items";
import { ItemPage, tagList, externalButton } from "@/components/seo/item-page";
import { JsonLd, abs, breadcrumbs, SITE_NAME } from "@/lib/seo";
import { hostOf } from "@/types/resource";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hit = await findBySlug(ogImagesWithSlugs(), slug);
  if (!hit) return { title: "Not found", robots: { index: false } };
  const o = hit.item;
  const desc = `The Open Graph image ${o.title} uses for ${hostOf(o.url)}: a ${o.theme.toLowerCase()}, ${o.style.join(" and ").toLowerCase()} card. See how it's built and similar OG image examples.`;
  return {
    title: `${o.title} OG image — ${o.style[0] ?? "Open Graph"} example`,
    description: desc,
    alternates: { canonical: itemPath["og-images"](slug) },
    openGraph: { url: itemPath["og-images"](slug), title: `${o.title} OG image`, description: desc, images: [{ url: o.image, width: o.width, height: o.height }] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const all = await ogImagesWithSlugs();
  const hit = all.find((x) => x.slug === slug);
  if (!hit) notFound();
  const o = hit.item;
  const path = itemPath["og-images"](slug);
  const related = all
    .filter((x) => x.item !== o)
    .sort((a, b) => Number(b.item.style.some((s) => o.style.includes(s))) - Number(a.item.style.some((s) => o.style.includes(s))))
    .slice(0, 8)
    .map((x) => ({ name: x.item.title, path: itemPath["og-images"](x.slug), meta: `${x.item.theme} · ${x.item.style.join(", ")}` }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: `${o.title} Open Graph image`,
      contentUrl: abs(o.image),
      width: o.width,
      height: o.height,
      description: o.pageDescription ?? `Open Graph image for ${o.title}`,
      about: { "@type": "WebSite", name: o.title, url: o.url },
      url: abs(path),
    },
    breadcrumbs([
      { name: SITE_NAME, path: "/" },
      { name: "OG Images", path: "/og-images" },
      { name: o.title, path },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ItemPage
        section="og-images"
        title={`${o.title} OG image`}
        subtitle={hostOf(o.url)}
        lead={`The image ${hostOf(o.url)} shows when its link is shared: a ${o.theme.toLowerCase()} card in a ${o.style.join(" and ").toLowerCase()} style, from the ${o.industry.toLowerCase()} space.`}
        actions={externalButton(o.url, `Visit ${hostOf(o.url)}`)}
        media={
          // eslint-disable-next-line @next/next/no-img-element
          <img src={o.image} width={o.width} height={o.height} alt={`Open Graph image for ${o.title}`} className="block w-full rounded-lg shadow-[0_0_0_1px_var(--line)]" />
        }
        details={[
          { label: "Website", value: <a href={o.url} target="_blank" rel="noopener noreferrer" className="link hover:text-fg">{hostOf(o.url)}</a> },
          ...(o.pageTitle ? [{ label: "Shared title", value: o.pageTitle }] : []),
          ...(o.pageDescription ? [{ label: "Shared description", value: o.pageDescription }] : []),
          { label: "Style", value: tagList(o.style) },
          { label: "Theme", value: o.theme },
          { label: "Industry", value: o.industry },
        ]}
        related={related}
        relatedTitle="More OG image examples"
      />
    </>
  );
}
