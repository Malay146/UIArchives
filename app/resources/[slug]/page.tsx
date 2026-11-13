import type { Metadata } from "next";
import { notFound } from "next/navigation";
import siteMeta from "@/data/site-meta.json";
import snapshots from "@/data/snapshots.json";
import { resourcesWithSlugs, findBySlug, itemPath } from "@/lib/server/items";
import { ItemPage, tagList, externalButton } from "@/components/seo/item-page";
import { Logo } from "@/components/directory/logo";
import { JsonLd, abs, breadcrumbs, SITE_NAME } from "@/lib/seo";
import {
  categoriesOf,
  isSocial,
  linkLabel,
  logoKey,
  primaryCategory,
  primaryHref,
  tagsOf,
  type UiCardData,
} from "@/types/resource";

type Meta = { title: string; description: string; headline: string; checked: string };
type Snap = { src: string; width: number; height: number };
const META = siteMeta as Record<string, Meta>;
const SNAPS = snapshots as Record<string, Snap>;

type Props = { params: Promise<{ slug: string }> };

const clip = (s: string, n = 155) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…` : s);

function seoTitle(r: UiCardData) {
  if (isSocial(r)) return `${r.title} (${linkLabel(r)}) — who to follow in design`;
  return r.title.length > 22 ? `${r.title}: features & alternatives` : `${r.title}: ${primaryCategory(r)}, features & alternatives`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hit = await findBySlug(resourcesWithSlugs(), slug);
  if (!hit) return { title: "Not found — UIArchives", robots: { index: false } };
  const r = hit.item;
  const path = itemPath.resources(slug);
  const snap = SNAPS[logoKey(r)];
  return {
    title: seoTitle(r),
    description: clip(r.description),
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${r.title} on ${SITE_NAME}`,
      description: clip(r.description, 200),
      ...(snap ? { images: [{ url: snap.src, width: snap.width, height: snap.height, alt: `${r.title} website` }] } : {}),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const all = await resourcesWithSlugs();
  const hit = all.find((x) => x.slug === slug);
  if (!hit) notFound();
  const r = hit.item;
  const key = logoKey(r);
  const meta =
    META[key] ??
    (r.headline || r.metaDescription
      ? { title: r.headline ?? "", description: r.metaDescription ?? "", headline: r.headline ?? "", checked: "" }
      : undefined);
  // Built-in entries have a landing-page snapshot; approved ones use the site's preview image.
  const snap = SNAPS[key] ?? (r.image ? { src: r.image, width: 1200, height: 630 } : undefined);
  const social = isSocial(r);
  const primary = primaryCategory(r);
  const cats = categoriesOf(r);
  const tags = tagsOf(r).filter((t) => !(cats as string[]).includes(t));
  const href = primaryHref(r);
  const path = itemPath.resources(slug);

  const related = all
    .filter((x) => x.item !== r && primaryCategory(x.item) === primary)
    .slice(0, 8)
    .map((x) => ({ name: x.item.title, path: itemPath.resources(x.slug), meta: linkLabel(x.item) }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: r.title,
      description: r.description,
      url: abs(path),
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: abs("/") },
      about: social
        ? { "@type": "Person", name: r.title, sameAs: [href] }
        : { "@type": "WebSite", name: r.title, url: href, ...(meta?.description ? { description: meta.description } : {}) },
      ...(snap ? { primaryImageOfPage: abs(snap.src) } : {}),
    },
    breadcrumbs([
      { name: SITE_NAME, path: "/" },
      { name: "Resources", path: "/" },
      { name: r.title, path },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ItemPage
        section="resources"
        title={r.title}
        subtitle={`${primary} · ${linkLabel(r)}`}
        visual={<Logo resource={r} className="size-10" />}
        lead={r.description}
        actions={externalButton(href, social ? `Follow on X` : `Visit ${linkLabel(r)}`)}
        media={
          snap ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={snap.src}
              width={snap.width}
              height={snap.height}
              alt={`${r.title} website, landing page`}
              className="block aspect-[16/10] w-full rounded-lg object-cover object-top shadow-[0_0_0_1px_var(--line)]"
            />
          ) : null
        }
        details={[
          { label: "Category", value: primary },
          ...(cats.length > 1 ? [{ label: "Also in", value: tagList(cats.filter((c) => c !== primary)) }] : []),
          ...(tags.length ? [{ label: "Tags", value: tagList(tags) }] : []),
          { label: social ? "X profile" : "Website", value: <a href={href} target="_blank" rel="noopener noreferrer" className="link hover:text-fg">{linkLabel(r)}</a> },
        ]}
        related={related}
        relatedTitle={social ? "More people to follow" : `${r.title} alternatives and similar ${primary.toLowerCase()}`}
      >
        {meta && (meta.headline || meta.description) && (
          <section className="mt-10">
            <h2 className="mb-3 text-fg-3">In their words</h2>
            <blockquote className="border-l-2 pl-4 text-[15px] leading-[1.75] text-fg-2">
              {meta.headline && <p className="font-medium text-fg">{meta.headline}</p>}
              {meta.description && <p className={meta.headline ? "mt-1" : ""}>{meta.description}</p>}
            </blockquote>
          </section>
        )}
      </ItemPage>
    </>
  );
}
