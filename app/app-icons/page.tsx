import Link from "next/link";
import type { Metadata } from "next";
import { getAppIcons } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { AppIcons } from "@/components/sections/app-icons";

export const metadata: Metadata = {
  title: "App Icons — UIArchives",
  description:
    "iOS and macOS app icons, filterable by style, colour and category.",
};

export default async function Page() {
  const appIcons = await getAppIcons();
  return (
    <>
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
            <Link href="/submit/app-icons" className="link text-fg-2 hover:text-fg">
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
