import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ArchiveShell } from "@/components/site/archive-shell";
import { SectionIcon } from "@/components/site/section-icon";
import { SECTIONS, type SectionSlug } from "@/lib/sections";
import { ArrowUpRightGlyph18 } from "@/components/icons";

export type DetailRow = { label: string; value: React.ReactNode };
export type RelatedItem = { name: string; path: string; meta?: string };

/**
 * One archive item on its own page — the indexable twin of the side panel.
 * Same frame as the section (sidebar, header), with breadcrumbs, a heading,
 * a plain-language summary, the media, the facts, and related items.
 */
export function ItemPage({
  section,
  title,
  subtitle,
  lead,
  visual,
  actions,
  media,
  details,
  children,
  related,
  relatedTitle,
}: {
  section: SectionSlug;
  title: string;
  subtitle?: React.ReactNode;
  /** One or two sentences: what this is and who it's for. */
  lead?: React.ReactNode;
  /** Small mark beside the title (logo, avatar, icon). */
  visual?: React.ReactNode;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  details: DetailRow[];
  children?: React.ReactNode;
  related?: RelatedItem[];
  relatedTitle?: string;
}) {
  const s = SECTIONS.find((x) => x.slug === section)!;
  return (
    <>
      <Header />
      <main>
        <ArchiveShell active={section}>
          <article className="max-w-[880px] px-4 pt-8 pb-20 sm:px-6 sm:pt-10">
            <nav aria-label="Breadcrumb" className="text-[13px] text-fg-3">
              <ol className="flex flex-wrap items-center gap-x-1.5">
                <li>
                  <Link href="/" className="transition-colors hover:text-fg">
                    UIArchives
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={s.href} className="transition-colors hover:text-fg">
                    {s.label}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="truncate text-fg-2">
                  {title}
                </li>
              </ol>
            </nav>

            <header className="mt-8 flex items-start gap-4">
              {visual && <div className="flex shrink-0">{visual}</div>}
              <div className="min-w-0">
                <h1 className="text-[22px] leading-tight font-medium tracking-[-0.02em] text-balance">{title}</h1>
                {subtitle && <p className="mt-1 text-fg-2">{subtitle}</p>}
              </div>
            </header>

            {lead && <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.75] text-fg-2 text-pretty">{lead}</p>}

            {actions && <div className="mt-6 flex flex-wrap gap-2">{actions}</div>}

            {media && <div className="mt-8">{media}</div>}

            {children}

            <section className="mt-10">
              <h2 className="mb-3 text-fg-3">Details</h2>
              <dl className="border-t">
                {details.map((d) => (
                  <div key={d.label} className="flex items-start justify-between gap-6 border-b py-2.5">
                    <dt className="shrink-0 text-fg-3">{d.label}</dt>
                    <dd className="min-w-0 text-right">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {related && related.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-3 text-fg-3">{relatedTitle ?? `More in ${s.label}`}</h2>
                <ul className="grid gap-px overflow-hidden rounded-lg bg-[var(--line)] shadow-[0_0_0_1px_var(--line)] sm:grid-cols-2">
                  {related.map((r) => (
                    <li key={r.path} className="bg-bg">
                      <Link href={r.path} className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-hover">
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{r.name}</span>
                          {r.meta && <span className="block truncate text-[13px] text-fg-3">{r.meta}</span>}
                        </span>
                        <ArrowUpRightGlyph18
                          aria-hidden="true"
                          className="size-3 shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                        />
                      </Link>
                    </li>
                  ))}
                  {related.length % 2 === 1 && <li aria-hidden="true" className="hidden bg-bg sm:block" />}
                </ul>
              </section>
            )}

            <Link
              href={s.href}
              className={`tint-${s.slug} group mt-12 flex items-center gap-3 rounded-xl p-4 shadow-[0_0_0_1px_var(--line-strong)] transition-colors hover:bg-hover`}
            >
              <SectionIcon slug={s.slug} className="size-6" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-[var(--tint)]">Browse all {s.label}</span>
                <span className="block truncate text-fg-2">{s.blurb}</span>
              </span>
            </Link>
          </article>
        </ArchiveShell>
      </main>
      <Footer />
    </>
  );
}

export const tagList = (tags: string[]) => (
  <span className="flex flex-wrap justify-end gap-1.5">
    {tags.map((t) => (
      <span key={t} className="rounded-[4px] bg-hover px-1.5 py-px text-[12px] text-fg-2">
        {t}
      </span>
    ))}
  </span>
);

export const externalButton = (href: string, label: React.ReactNode, primary = true) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={
      primary
        ? "press inline-flex h-8 items-center gap-1.5 rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
        : "press inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-fg shadow-[0_0_0_1px_var(--line-strong)] transition-colors hover:bg-hover"
    }
  >
    {label} <ArrowUpRightGlyph18 aria-hidden="true" className="size-3" />
  </a>
);
