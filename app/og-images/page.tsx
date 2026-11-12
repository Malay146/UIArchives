import Link from "next/link";
import type { Metadata } from "next";
import { getOgImages } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { OgImages } from "@/components/sections/og-images";

export const metadata: Metadata = {
  title: "OG Images — UIArchives",
  description: "Hand-picked Open Graph images — how great products present themselves when a link is shared.",
};

export default async function Page() {
  const ogImages = await getOgImages();
  const light = ogImages.filter((i) => i.theme === "Light").length;
  return (
    <>
      <Header />
      <main>
        <ArchiveShell active="og-images">
          <SectionIntro
            title="OG Images"
            blurb="The image a link turns into when it's shared. Hand-picked cards that introduce a product well in 1200 × 630 — filter by style, theme or industry."
            facts={[
              { label: "Images", value: ogImages.length },
              { label: "Light / Dark", value: `${light} / ${ogImages.length - light}` },
            ]}
          >
            <Link href="/submit/og-images" className="link text-fg-2 hover:text-fg">
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
