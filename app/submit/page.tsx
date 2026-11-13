import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ArrowUpRightGlyph18, CheckGlyph18 } from "@/components/icons";
import { SectionIcon } from "@/components/site/section-icon";
import { SECTION_ORDER, SECTION_SCHEMAS } from "@/lib/section-schemas";

export const metadata: Metadata = {
  title: "Submit a design resource",
  description: "Suggest a UI resource, design video, OG image, app icon or agent skill for the UIArchives collection. Every submission is reviewed by hand.",
  alternates: { canonical: "/submit" },
};

/** What each section asks for first — shown so people know before they click. */
const NEEDS: Record<string, string> = {
  resources: "Name, website and a one-line description",
  designs: "Just the X post link",
  "og-images": "The page URL — we fetch its image",
  "app-icons": "Just the App Store link",
  skills: "Repository link and install command",
};

const STEPS = [
  { title: "Submit", body: "Pick a section and share the link. It takes a minute." },
  { title: "Reviewed by hand", body: "Every entry is opened, checked and described in plain words." },
  { title: "Hear back", body: "You get an email when it's published — or why it wasn't." },
];

export default function Page() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="text-[22px] leading-tight font-medium tracking-[-0.02em]">Submit something</h1>
        <p className="mt-3 max-w-[520px] text-[15px] leading-[1.7] text-fg-2">
          Know a resource, design, OG image, app icon or skill that belongs in the archive? Pick where it fits —
          each section only asks for what it needs.
        </p>

        <ul className="mt-10 border-t">
          {SECTION_ORDER.map((k) => {
            const s = SECTION_SCHEMAS[k];
            return (
              <li key={k} className="border-b">
                <Link
                  href={`/submit/${k}`}
                  className={`tint-${k} group flex items-start gap-4 py-5 transition-colors duration-200 hover:bg-hover sm:px-3`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-hover transition-colors duration-200 group-hover:bg-bg">
                    <SectionIcon slug={k} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-[var(--tint)]">
                      Submit {/^(og|app|[aeiou])/i.test(s.noun) ? "an" : "a"} {s.noun}
                    </span>
                    <span className="mt-0.5 block max-w-[60ch] text-fg-2">{s.intro}</span>
                    <span className="mt-2 flex items-center gap-1.5 text-[13px] text-fg-3">
                      <CheckGlyph18 aria-hidden="true" className="size-3" />
                      {NEEDS[k]}
                    </span>
                  </span>
                  <ArrowUpRightGlyph18
                    aria-hidden="true"
                    className="mt-1.5 size-3.5 shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--tint)]"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <section className="mt-14">
          <h2 className="mb-4 text-fg-3">How it works</h2>
          <ol className="border-t">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4 border-b py-4 sm:px-3">
                <span className="mt-px grid size-6 shrink-0 place-items-center rounded-full bg-fg text-[12px] font-medium text-bg tabular-nums">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block font-medium">{step.title}</span>
                  <span className="mt-0.5 block text-fg-2">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
