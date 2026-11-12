import Link from "next/link";
import type { Metadata } from "next";
import { getMotion } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { Motion } from "@/components/sections/motion";

export const metadata: Metadata = {
  title: "Motion — UIArchives",
  description:
    "Interaction and animation clips from designers and engineers, filterable by what they show.",
};

export default async function Page() {
  const motionClips = await getMotion();
  const authors = new Set(motionClips.map((c) => c.author.handle)).size;
  return (
    <>
      <Header />
      <main>
        <ArchiveShell active="motion">
          <SectionIntro
            title="Motion"
            blurb="Short interaction studies, mostly from X. Hover to play; open one to see who made it, what it shows and how it was built."
            facts={[
              { label: "Clips", value: motionClips.length },
              { label: "Makers", value: authors },
            ]}
          >
            <Link href="/submit/motion" className="link text-fg-2 hover:text-fg">
              Submit a clip
            </Link>
          </SectionIntro>
          <Motion items={motionClips} />
        </ArchiveShell>
      </main>
      <Footer />
    </>
  );
}
