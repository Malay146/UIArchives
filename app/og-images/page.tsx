import Link from "next/link";
import type { Metadata } from "next";
import { ogImagesWithSlugs, itemPath } from "@/lib/server/items";
import { JsonLd, collectionPage } from "@/lib/seo";
import { getOgImages } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { OgImages } from "@/components/sections/og-images";

export const metadata: Metadata = {
  title: "OG Image Examples — Open Graph image inspiration",
  description:
    "A gallery of the best Open Graph image examples: how great products present their links when shared. Filter by style for OG image inspiration.",
  alternates: { canonical: "/og-images" },
  openGraph: { url: "/og-images", title: "OG image examples — UIArchives" },
};

export default async function Page() {
  const ogImages = await getOgImages();
  const light = ogImages.filter((i) => i.theme === "Light").length;
  return (
    <>
      <JsonLd
        data={collectionPage({
          name: "OG image examples",
          description: "A gallery of Open Graph image examples from great products.",
          path: "/og-images",
          items: (await ogImagesWithSlugs()).map((r) => ({ name: `${r.item.title} OG image`, path: itemPath["og-images"](r.slug) })),
        })}
      />
      <Header />
      <main>
        <ArchiveShell active="og-images">
          <SectionIntro
            title="OG Images"
            blurb="The image a link turns into when it's shared. Hand-picked cards that introduce a product well in 1200 × 630, filtered by style."
            facts={[
              { label: "Images", value: ogImages.length },
              { label: "Light / Dark", value: `${light} / ${ogImages.length - light}` },
            ]}
          >
            <Link href="/submit/og-images"
              className="press inline-flex h-8 items-center rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
            >
              Submit an OG image
            </Link>
          </SectionIntro>
          <OgImages items={ogImages} />
        </ArchiveShell>
      </main>
      <Footer />
    </>
  );
}
