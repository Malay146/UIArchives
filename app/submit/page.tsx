import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ArrowUpRightGlyph18 } from "@/components/icons";
import { SECTION_ORDER, SECTION_SCHEMAS } from "@/lib/section-schemas";

export const metadata: Metadata = { title: "Submit — UIArchives", description: "Suggest a resource, design, OG image, app icon or skill." };

export default function Page() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-medium">Submit something</h1>
        <p className="mt-3 max-w-[460px] text-fg-2">
          Each section asks for different things. Pick where it belongs — every submission is reviewed by hand, and you'll hear back by email.
        </p>
        <ul className="mt-10 border-t">
          {SECTION_ORDER.map((k) => {
            const s = SECTION_SCHEMAS[k];
            return (
              <li key={k}>
                <Link href={`/submit/${k}`} className="group flex items-start justify-between gap-6 border-b py-4 transition-colors hover:bg-hover sm:px-3">
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium">{s.label}</span>
                    <span className="max-w-[520px] text-fg-2">{s.intro}</span>
                  </span>
                  <ArrowUpRightGlyph18 aria-hidden="true" className="mt-1.5 size-3 shrink-0 text-fg-3 transition-colors group-hover:text-fg" />
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </>
  );
}
