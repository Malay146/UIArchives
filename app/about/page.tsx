import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionIcon } from "@/components/site/section-icon";
import { SECTIONS } from "@/lib/sections";
import { getSectionCounts } from "@/lib/server/published";
import { JsonLd, SITE_URL, abs, breadcrumbs } from "@/lib/seo";
import { GithubGlyph32, XTwitterGlyph32 } from "@/components/icons";
import { AUTHOR } from "@/lib/author";

export const metadata: Metadata = {
  title: "About — who curates UIArchives and how entries are chosen",
  description:
    "UIArchives is a hand-picked archive of design resources curated by Malay Patel, a designer and frontend developer. How entries are chosen, reviewed and kept up to date.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", type: "profile", title: "About UIArchives" },
};

const UPDATED = "2026-11-13";


export default async function Page() {
  const counts = await getSectionCounts();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About UIArchives",
      url: abs("/about"),
      dateModified: UPDATED,
      mainEntity: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "UIArchives",
        url: SITE_URL,
        founder: {
          "@type": "Person",
          "@id": `${SITE_URL}/about#malay-patel`,
          name: AUTHOR.name,
          jobTitle: AUTHOR.role,
          url: abs("/about"),
          sameAs: [AUTHOR.x, AUTHOR.github],
        },
      },
    },
    breadcrumbs([
      { name: "UIArchives", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="mx-auto max-w-[760px] px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="text-[22px] leading-tight font-medium tracking-[-0.02em]">About UIArchives</h1>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.75] text-fg-2">
          UIArchives is a hand-picked archive for people who make interfaces: the component libraries, design tools,
          typefaces, icons and references worth knowing, plus design videos, Open Graph image examples, app icons and
          agent skills. Every entry is chosen and reviewed by a person. Nothing is added automatically.
        </p>

        <section className="mt-12">
          <h2 className="mb-3 text-fg-3">What's in the archive</h2>
          <ul className="border-t">
            {SECTIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  className={`tint-${s.slug} group flex items-center gap-3 border-b py-3 transition-colors hover:bg-hover sm:px-3`}
                >
                  <SectionIcon slug={s.slug} className="size-5" />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium text-[var(--tint)]">{s.label}</span>
                    <span className="ml-2 text-fg-2">{s.blurb}</span>
                  </span>
                  <span className="shrink-0 text-fg-3 tabular-nums">{counts[s.slug] || "Soon"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-3 text-fg-3">How entries are chosen</h2>
          <div className="space-y-4 text-[15px] leading-[1.75] text-fg-2">
            <p>
              <span className="font-medium text-fg">Useful to someone shipping interfaces.</span> Every entry has to
              save a designer or frontend developer real time or teach them something — a library worth building on, a
              typeface worth licensing, a video worth studying.
            </p>
            <p>
              <span className="font-medium text-fg">Looked at, not scraped.</span> Each resource is opened and used
              before it's added. Descriptions are written in plain words: what it is, who it's for. Screenshots and
              details come from the product's own site.
            </p>
            <p>
              <span className="font-medium text-fg">Reviewed before it appears.</span> New candidates arrive from
              reader submissions and from public sources (the App Store, GitHub and Hacker News). All of them wait in a
              private review queue; only the ones that clear the bar are published, and submitters hear back either way.
            </p>
            <p>
              <span className="font-medium text-fg">Kept current.</span> Entries that go stale, change direction or
              disappear are updated or removed. Designs credit their makers and link to the original post.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-3 text-fg-3">Who's behind it</h2>
          <div className="rounded-xl p-5 shadow-[0_0_0_1px_var(--line-strong)]">
            <p className="font-medium">{AUTHOR.name}</p>
            <p className="text-fg-2">{AUTHOR.role}</p>
            <p className="mt-3 text-[15px] leading-[1.75] text-fg-2">
              Malay curates the archive and writes the Journal — guides on design resources like OG images, app icons
              and agent skills for design. UIArchives started as a personal list of the tools Malay kept reaching for, and
              is built and maintained by hand.
            </p>
            <div className="mt-3 -ml-2 flex gap-1">
              {[
                { href: AUTHOR.x, label: "Malay Patel on X (@pmalay694)", Icon: XTwitterGlyph32 },
                { href: AUTHOR.github, label: "Malay Patel on GitHub", Icon: GithubGlyph32 },
              ].map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={label}
                  title={label}
                  className="press grid size-9 place-items-center rounded-md text-fg-2 transition-colors hover:bg-hover hover:text-fg"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-3 text-fg-3">Suggestions and corrections</h2>
          <p className="text-[15px] leading-[1.75] text-fg-2">
            Know something that belongs here, or spotted a mistake? <Link href="/submit" className="link text-fg">Submit it</Link>,
            message <a href={AUTHOR.x} target="_blank" rel="noopener noreferrer" className="link text-fg">@pmalay694</a> on X, or open
            an issue on <a href="https://github.com/Malay146/UIArchives" target="_blank" rel="noopener noreferrer" className="link text-fg">GitHub</a> —
            the site's code is open source.
          </p>
        </section>

        <p className="mt-12 text-[13px] text-fg-3">
          Last updated{" "}
          <time dateTime={UPDATED}>
            {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(UPDATED))}
          </time>
        </p>
      </main>
      <Footer />
    </>
  );
}
