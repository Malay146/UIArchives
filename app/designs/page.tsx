import Link from "next/link";
import type { Metadata } from "next";
import { getDesigns } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { Designs } from "@/components/sections/designs";

export const metadata: Metadata = {
  title: "Designs — UIArchives",
  description:
    "Interaction and animation clips from designers and engineers, filterable by what they show.",
};

export default async function Page() {
  const designs = await getDesigns();
  const authors = new Set(designs.map((c) => c.author.handle)).size;
  return (
    <>
      <Header />
      <main>
        <ArchiveShell active="designs">
          <SectionIntro
            title="Designs"
            blurb="Design videos worth studying, mostly from X — components, explorations, landing pages and more. Hover to play; open one to see who made it and what it shows."
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
