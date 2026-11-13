import Link from "next/link";
import type { Metadata } from "next";
import { resourcesWithSlugs, itemPath } from "@/lib/server/items";
import { JsonLd, collectionPage } from "@/lib/seo";
import { getResources } from "@/lib/server/published";
import { CATEGORIES } from "@/types/resource";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Directory } from "@/components/directory/directory";

export const metadata: Metadata = {
  title: { absolute: "UIArchives — Curated UI resources, design tools & inspiration" },
  description:
    "A hand-picked archive of UI component libraries, design tools, fonts, icons and inspiration — plus design videos, OG image examples, app icons and agent skills. For designers and frontend developers.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default async function Home() {
  const cardData = await getResources();
  return (
    <>
      <JsonLd
        data={collectionPage({
          name: "Resources",
          description: "Hand-picked UI component libraries, design tools, fonts, icons and inspiration for designers and frontend developers.",
          path: "/",
          items: (await resourcesWithSlugs()).map((r) => ({ name: r.item.title, path: itemPath.resources(r.slug) })),
        })}
      />
      <Header />
      <main>
        <ArchiveShell active="resources">
          <SectionIntro
            title="An archive for people who make interfaces."
            blurb="Resources, design videos, OG images, app icons and agent skills — the things designers and engineers reach for, kept in one quiet place. Every entry is chosen by hand."
            facts={[
              { label: "Resources", value: cardData.length },
              { label: "Categories", value: CATEGORIES.length },
            ]}
          >
            <Link
              href="/submit/resources"
              className="press inline-flex h-8 items-center rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
            >
              Suggest a resource
            </Link>
          </SectionIntro>
          <div id="index" className="scroll-mt-[var(--header-h)]">
            <Directory resources={cardData} />
          </div>
        </ArchiveShell>
      </main>
      <Footer />
    </>
  );
}
