import Link from "next/link";
import type { Metadata } from "next";
import { appIconsWithSlugs, itemPath } from "@/lib/server/items";
import { JsonLd, collectionPage } from "@/lib/seo";
import { getAppIcons } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { AppIcons } from "@/components/sections/app-icons";

export const metadata: Metadata = {
  title: "App Icon Inspiration — iOS & macOS app icons",
  description:
    "A curated gallery of iOS and macOS app icons with distinctive marks: glass, gradient, flat and 3D styles. Filter by style, colour and category for app icon design inspiration.",
  alternates: { canonical: "/app-icons" },
  openGraph: { url: "/app-icons", title: "App icon inspiration — UIArchives" },
};

export default async function Page() {
  const appIcons = await getAppIcons();
  return (
    <>
      <JsonLd
        data={collectionPage({
          name: "App icon inspiration",
          description: "A curated gallery of iOS and macOS app icons.",
          path: "/app-icons",
          items: (await appIconsWithSlugs()).map((r) => ({ name: r.item.name, path: itemPath["app-icons"](r.slug) })),
        })}
      />
      <Header />
      <main>
        <ArchiveShell active="app-icons">
          <SectionIntro
            title="App Icons"
            blurb="Logomarks from iOS and macOS, shown on Apple's own corner curve. Filter by style, colour or category to find a direction."
            facts={[
              { label: "Icons", value: appIcons.length },
              { label: "Platforms", value: "iOS · macOS" },
            ]}
          >
            <Link href="/submit/app-icons"
              className="press inline-flex h-8 items-center rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
            >
              Submit an app icon
            </Link>
          </SectionIntro>
          <AppIcons items={appIcons} />
        </ArchiveShell>
      </main>
      <Footer />
    </>
  );
}
