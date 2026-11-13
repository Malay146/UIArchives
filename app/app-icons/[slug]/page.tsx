import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appIconsWithSlugs, findBySlug, itemPath } from "@/lib/server/items";
import { ItemPage, tagList, externalButton } from "@/components/seo/item-page";
import { JsonLd, abs, breadcrumbs, SITE_NAME } from "@/lib/seo";
import { shortAppName } from "@/lib/app-name";

type Props = { params: Promise<{ slug: string }> };
const SQUIRCLE = "rounded-[22.37%]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hit = await findBySlug(appIconsWithSlugs(), slug);
  if (!hit) return { title: "Not found", robots: { index: false } };
  const a = hit.item;
  const name = shortAppName(a.name);
  const desc = `The ${name} app icon by ${a.developer}: a ${a.style.join(", ").toLowerCase()} ${a.platform.join(" and ")} icon in ${a.color.join(" and ").toLowerCase()}. Download-quality preview and similar app icons.`;
  return {
    title: `${name} app icon — ${a.platform[0] ?? "iOS"} icon design`,
    description: desc,
    alternates: { canonical: itemPath["app-icons"](slug) },
    openGraph: { url: itemPath["app-icons"](slug), title: `${name} app icon`, description: desc, images: [{ url: a.image, width: 1024, height: 1024 }] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const all = await appIconsWithSlugs();
  const hit = all.find((x) => x.slug === slug);
  if (!hit) notFound();
  const a = hit.item;
  const name = shortAppName(a.name);
  const path = itemPath["app-icons"](slug);
  const related = all
    .filter((x) => x.item !== a)
    .sort((p, q) => Number(q.item.category === a.category) - Number(p.item.category === a.category))
    .slice(0, 8)
    .map((x) => ({ name: shortAppName(x.item.name), path: itemPath["app-icons"](x.slug), meta: `${x.item.developer} · ${x.item.category}` }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: `${name} app icon`,
      contentUrl: abs(a.image),
      width: 1024,
      height: 1024,
      creator: { "@type": "Organization", name: a.developer },
      about: { "@type": "MobileApplication", name: a.name, operatingSystem: a.platform.join(", "), applicationCategory: a.category, url: a.link },
      url: abs(path),
    },
    breadcrumbs([
      { name: SITE_NAME, path: "/" },
      { name: "App Icons", path: "/app-icons" },
      { name, path },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ItemPage
        section="app-icons"
        title={`${name} app icon`}
        subtitle={`${a.developer} · ${a.category}`}
        lead={`${a.name} by ${a.developer}. A ${a.style.join(", ").toLowerCase()} ${a.platform.join(" and ")} icon in ${a.color.join(" and ").toLowerCase()}, kept for its mark.`}
        actions={externalButton(a.link, "View on the App Store")}
        media={
          <div className="grid place-items-center rounded-lg bg-hover py-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image} width={240} height={240} alt={`${name} app icon`} className={`block size-48 sm:size-60 ${SQUIRCLE}`} />
          </div>
        }
        details={[
          { label: "App", value: a.name },
          { label: "Developer", value: a.developer },
          { label: "Category", value: a.category },
          { label: "Style", value: tagList(a.style) },
          { label: "Colour", value: tagList(a.color) },
          { label: "Platform", value: a.platform.join(", ") },
        ]}
        related={related}
        relatedTitle="Similar app icons"
      />
    </>
  );
}
