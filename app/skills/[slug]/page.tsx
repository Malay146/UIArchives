import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { skillsWithSlugs, findBySlug, itemPath } from "@/lib/server/items";
import { ItemPage, tagList, externalButton } from "@/components/seo/item-page";
import { CommandCopy } from "@/components/collection/command-copy";
import { JsonLd, abs, breadcrumbs, SITE_NAME } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
const clip = (s: string, n = 155) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…` : s);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hit = await findBySlug(skillsWithSlugs(), slug);
  if (!hit) return { title: "Not found", robots: { index: false } };
  const s = hit.item;
  return {
    title: s.name.length > 30 ? `${s.name} — agent skills` : `${s.name} — agent skills for Claude Code`,
    description: clip(`${s.description} Install command, included skills and what each one does.`),
    alternates: { canonical: itemPath.skills(slug) },
    openGraph: { url: itemPath.skills(slug), title: `${s.name} — agent skills`, description: clip(s.description, 200) },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const all = await skillsWithSlugs();
  const hit = all.find((x) => x.slug === slug);
  if (!hit) notFound();
  const s = hit.item;
  const path = itemPath.skills(slug);
  const related = all
    .filter((x) => x.item !== s)
    .slice(0, 8)
    .map((x) => ({ name: x.item.name, path: itemPath.skills(x.slug), meta: `${x.item.skills.length} skills · ${x.item.author.name}` }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: s.name,
      description: s.description,
      codeRepository: s.repo,
      author: { "@type": "Person", name: s.author.name },
      ...(s.license ? { license: s.license } : {}),
      keywords: s.topics.join(", "),
      url: abs(path),
    },
    breadcrumbs([
      { name: SITE_NAME, path: "/" },
      { name: "Skills", path: "/skills" },
      { name: s.name, path },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ItemPage
        section="skills"
        title={s.name}
        subtitle={`by ${s.author.name}`}
        lead={s.description}
        actions={externalButton(s.repo, "View on GitHub")}
        media={
          <div>
            <h2 className="mb-3 text-fg-3">Install</h2>
            <CommandCopy command={s.install} size="md" prompt />
          </div>
        }
        details={[
          { label: "Author", value: s.author.name },
          { label: "Topics", value: tagList(s.topics) },
          ...(s.agents.length ? [{ label: "Works with", value: tagList(s.agents) }] : []),
          ...(s.license ? [{ label: "Licence", value: s.license }] : []),
          { label: "Repository", value: <a href={s.repo} target="_blank" rel="noopener noreferrer" className="link hover:text-fg">{s.repo.replace(/^https:\/\/(www\.)?/, "")}</a> },
        ]}
        related={related}
        relatedTitle="More agent skills"
      >
        {s.skills.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-fg-3">Included skills ({s.skills.length})</h2>
            <ul className="border-t">
              {s.skills.map((k) => (
                <li key={k.name} className="border-b py-3">
                  <p className="font-mono text-[13px] text-fg">{k.name}</p>
                  {k.summary && <p className="mt-0.5 text-fg-2">{k.summary}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </ItemPage>
    </>
  );
}
