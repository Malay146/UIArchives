import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { designsWithSlugs, findBySlug, itemPath } from "@/lib/server/items";
import { ItemPage, tagList, externalButton } from "@/components/seo/item-page";
import { JsonLd, abs, breadcrumbs, SITE_NAME } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
const clip = (s: string, n = 155) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…` : s);
const date = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hit = await findBySlug(designsWithSlugs(), slug);
  if (!hit) return { title: "Not found", robots: { index: false } };
  const d = hit.item;
  const desc = clip(d.note ?? `${d.title} by ${d.author.name}: a ${d.kind.join(" and ").toLowerCase()} design video.`);
  return {
    title: `${d.title} by ${d.author.name}`,
    description: desc,
    alternates: { canonical: itemPath.designs(slug) },
    openGraph: { type: "video.other", url: itemPath.designs(slug), title: `${d.title} by ${d.author.name}`, description: desc, images: d.poster ? [{ url: d.poster }] : undefined },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const all = await designsWithSlugs();
  const hit = all.find((x) => x.slug === slug);
  if (!hit) notFound();
  const d = hit.item;
  const path = itemPath.designs(slug);
  const related = all
    .filter((x) => x.item !== d && x.item.kind.some((k) => d.kind.includes(k)))
    .slice(0, 8)
    .map((x) => ({ name: x.item.title, path: itemPath.designs(x.slug), meta: `by ${x.item.author.name}` }));
  const profile = `https://x.com/${d.author.handle}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: `${d.title} by ${d.author.name}`,
      description: d.note ?? d.caption ?? d.title,
      thumbnailUrl: d.poster ? abs(d.poster) : undefined,
      uploadDate: d.posted ?? d.added,
      contentUrl: d.video ? abs(d.video) : undefined,
      ...(d.duration ? { duration: `PT${d.duration}S` } : {}),
      creator: { "@type": "Person", name: d.author.name, url: profile },
      embedUrl: undefined,
      url: abs(path),
    },
    breadcrumbs([
      { name: SITE_NAME, path: "/" },
      { name: "Designs", path: "/designs" },
      { name: d.title, path },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ItemPage
        section="designs"
        title={d.title}
        subtitle={<>by <a href={profile} target="_blank" rel="noopener noreferrer" className="link hover:text-fg">{d.author.name}</a> <span className="text-fg-3">@{d.author.handle}</span></>}
        lead={d.note}
        actions={externalButton(d.post, "View post on X")}
        media={
          <video
            src={d.video}
            poster={d.poster}
            controls
            muted
            loop
            playsInline
            preload="metadata"
            style={{ aspectRatio: d.width && d.height ? `${d.width} / ${d.height}` : "16 / 9" }}
            className="block w-full rounded-lg bg-black shadow-[0_0_0_1px_var(--line)]"
          />
        }
        details={[
          { label: "Designer", value: <a href={profile} target="_blank" rel="noopener noreferrer" className="link hover:text-fg">{d.author.name}</a> },
          { label: "Category", value: tagList(d.kind) },
          { label: "Platform", value: tagList(d.platform) },
          ...(d.stack?.length ? [{ label: "Built with", value: tagList(d.stack) }] : []),
          ...(d.posted ? [{ label: "Posted", value: date(d.posted) }] : []),
          ...(d.duration ? [{ label: "Length", value: `${Math.floor(d.duration / 60)}:${String(d.duration % 60).padStart(2, "0")}` }] : []),
        ]}
        related={related}
        relatedTitle="Similar designs"
      >
        {d.caption && (
          <section className="mt-10">
            <h2 className="mb-3 text-fg-3">From the post</h2>
            <blockquote className="border-l-2 pl-4 text-[15px] leading-[1.75] whitespace-pre-line text-fg-2">{d.caption}</blockquote>
          </section>
        )}
      </ItemPage>
    </>
  );
}
