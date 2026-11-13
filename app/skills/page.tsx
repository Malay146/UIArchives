import Link from "next/link";
import type { Metadata } from "next";
import { getSkills } from "@/lib/server/published";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIntro } from "@/components/collection/section-intro";
import { ArchiveShell } from "@/components/site/archive-shell";
import { Skills } from "@/components/sections/skills";

export const metadata: Metadata = {
  title: "Skills — UIArchives",
  description:
    "Agent skills that teach coding agents design and frontend craft.",
};

export default async function Page() {
  const skills = await getSkills();
  const total = skills.reduce((n, s) => n + s.skills.length, 0);
  return (
    <>
      <Header />
      <main>
        <ArchiveShell active="skills">
          <SectionIntro
            title="Skills"
            blurb="Packaged know-how for coding agents — install one and your agent designs, animates and writes interfaces with someone else's hard-won judgement."
            facts={[
              { label: "Skill sets", value: skills.length },
              { label: "Skills", value: total },
            ]}
          >
            <Link href="/submit/skills"
              className="press inline-flex h-8 items-center rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
            >
              Submit a skill
            </Link>
          </SectionIntro>
          <Skills items={skills} />
        </ArchiveShell>
      </main>
      <Footer />
    </>
  );
}
