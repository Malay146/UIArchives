import Link from "next/link";
import { SECTIONS, type SectionSlug } from "@/lib/sections";
import { getSectionCounts } from "@/lib/server/published";

/**
 * The archive's frame: every section listed on the left, always in the same
 * place, with how much is in each. The current section's content — intro,
 * search, filters, results — fills the rest.
 */
export async function ArchiveShell({ active, children }: { active: SectionSlug; children: React.ReactNode }) {
  const counts = await getSectionCounts();
  return (
    <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="hidden border-r lg:block">
        <nav aria-label="Archive" className="sticky top-[var(--header-h)] py-6 pr-4 pl-4 sm:pl-6">
          <p className="mb-2 px-2 text-fg-3">Archive</p>
          <ul>
            {SECTIONS.map((s) => {
              const on = s.slug === active;
              const n = counts[s.slug];
              return (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    aria-current={on ? "page" : undefined}
                    className={`press flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors duration-150 ${
                      on ? "bg-hover text-fg" : "text-fg-2 hover:text-fg"
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-fg-3 tabular-nums">{n || "Soon"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t pt-4">
            <Link href="/blog" className="flex rounded-md px-2 py-1.5 text-fg-2 transition-colors hover:text-fg">
              Journal
            </Link>
            <Link href="/submit" className="flex rounded-md px-2 py-1.5 text-fg-2 transition-colors hover:text-fg">
              Submit something
            </Link>
          </div>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
