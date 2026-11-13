import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SubmitForm } from "@/components/submit/submit-form";
import { ArrowLeftGlyph18 } from "@/components/icons";
import { SECTION_SCHEMAS, isSectionKey } from "@/lib/section-schemas";

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  if (!isSectionKey(section)) return { title: "Submit", robots: { index: false } };
  return { title: `Submit a ${SECTION_SCHEMAS[section].noun}`, alternates: { canonical: `/submit/${section}` } };
}

export default async function Page({ params }: Props) {
  const { section } = await params;
  if (section === "motion") redirect("/submit/designs"); // old name
  if (!isSectionKey(section)) notFound();
  const schema = SECTION_SCHEMAS[section];
  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-[1080px] gap-14 px-4 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-20">
        <div className="max-w-[400px]">
          <Link href="/submit" className="press -ml-1 inline-flex items-center gap-1.5 p-1 text-fg-2 transition-colors hover:text-fg">
            <ArrowLeftGlyph18 aria-hidden="true" className="size-3" /> All sections
          </Link>
          <h1 className="mt-10 font-medium">Submit a {schema.noun}</h1>
          <p className="mt-3 text-fg-2">{schema.intro}</p>
          <ol className="mt-10 flex flex-col gap-2 border-t pt-6">
            {["Send it in — takes a minute.", "A person reviews every submission.", "You get an email when it's approved or not."].map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="text-fg-3 tabular-nums">0{i + 1}</span>
                <span className="text-fg-2">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <SubmitForm section={section} />
      </main>
      <Footer />
    </>
  );
}
