"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";
import { GithubStar } from "./github-star";
import { CommandTrigger } from "@/components/command/command-menu";
import { SECTIONS } from "@/lib/sections";

/**
 * Site-wide tools only — the archive's sections live in the sidebar. Below
 * the desktop breakpoint, where there's no sidebar, the sections become a
 * scrolling strip under the bar so nothing hides behind a menu.
 */
export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const sectionLinks = SECTIONS.map((s) => (
    <Link
      key={s.href}
      href={s.href}
      aria-current={isActive(s.href) ? "page" : undefined}
      className={`relative shrink-0 whitespace-nowrap transition-colors ${
        isActive(s.href) ? "text-fg" : "text-fg-2 hover:text-fg"
      }`}
    >
      {s.label}
      {isActive(s.href) && (
        <span aria-hidden="true" className="absolute inset-x-0 -bottom-[11px] h-px bg-fg" />
      )}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-40 border-b bg-bg/85 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-[1600px] items-center gap-8 px-4 sm:px-6">
        <Logo />
        <div className="ml-auto flex items-center gap-3.5 sm:gap-5">
          <Link
            href="/blog"
            aria-current={pathname.startsWith("/blog") ? "page" : undefined}
            className={`transition-colors ${pathname.startsWith("/blog") ? "text-fg" : "text-fg-2 hover:text-fg"}`}
          >
            Journal
          </Link>
          <CommandTrigger />
          <GithubStar />
          <span className="hidden h-3.5 w-px bg-line-strong sm:block" aria-hidden="true" />
          <div className="flex items-center gap-3.5 sm:gap-4">
            <SoundToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
      <nav
        aria-label="Sections"
        className="scrollbar-none flex h-10 items-center gap-5 overflow-x-auto border-t px-4 sm:px-6 lg:hidden"
      >
        {sectionLinks}
      </nav>
    </header>
  );
}
