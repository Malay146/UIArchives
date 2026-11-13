import Link from "next/link";
import type { Metadata } from "next";
import { designsWithSlugs, itemPath } from "@/lib/server/items";
import { JsonLd, collectionPage } from "@/lib/seo";
import { getDesigns } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { Designs } from "@/components/sections/designs";

export const metadata: Metadata = {
  title: "UI Design Inspiration Videos — components & interactions",
  description:
    "Hand-picked UI design videos from designers on X: components, micro-interactions, landing pages, mobile apps, dashboards and 3D. Filter by category and see who made each one.",
  alternates: { canonical: "/designs" },
  openGraph: { url: "/designs", title: "Design inspiration videos — UIArchives" },
};

export default async function Page() {
  const designs = await getDesigns();
  const authors = new Set(designs.map((c) => c.author.handle)).size;
  return (
    <>
      <JsonLd
        data={collectionPage({
          name: "Design inspiration videos",
          description: "UI design videos from designers on X: components, interactions, landing pages and more.",
          path: "/designs",
          items: (await designsWithSlugs()).map((r) => ({ name: r.item.title, path: itemPath.designs(r.slug) })),
        })}
      />
      <Header />
      <main>
        <ArchiveShell active="designs">
          <SectionIntro
            title="Designs"
            blurb="Design videos worth studying, mostly from X — components, interactions, landing pages, mobile apps and more. Hover to play; open one to see who made it."
            facts={[
              { label: "Designs", value: designs.length },
              { label: "Makers", value: authors },
            ]}
          >
            <Link href="/submit/designs"
              className="press inline-flex h-8 items-center rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
            >
              Submit a design
            </Link>
          </SectionIntro>
          <Designs items={designs} />
        </ArchiveShell>
      </main>
      <Footer />
    </>
  );
}
