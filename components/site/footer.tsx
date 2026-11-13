import Link from "next/link";
import { Mark } from "./logo";
import { GithubGlyph32, XTwitterGlyph32 } from "@/components/icons";

export function Footer() {
  return (
    <footer className="mt-32 border-t">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-6 px-4 py-10 text-fg-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-1.5">
          <Mark className="size-4 text-fg" />
          <span>
            UIArchives — an open index, maintained by hand.
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/about" className="link hover:text-fg">
            About
          </Link>
          <Link href="/submit" className="link hover:text-fg">
            Submit
          </Link>
          <a
            href="https://github.com/Malay146/UIArchives"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="UIArchives on GitHub"
            title="GitHub"
            className="transition-colors hover:text-fg"
          >
            <GithubGlyph32 aria-hidden="true" className="size-4" />
          </a>
          <a
            href="https://x.com/pmalay694"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="UIArchives on X"
            title="X"
            className="transition-colors hover:text-fg"
          >
            <XTwitterGlyph32 aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
