import { GithubGlyph32 } from "@/components/icons";

/** "Star" button linking to the repo. Solid: dark on light, light on dark. */
export function GithubStar() {
  return (
    <a
      href="https://github.com/Malay146/UIArchives"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star UIArchives on GitHub"
      className="press flex h-7 items-center gap-1.5 rounded-md bg-fg px-2 font-medium text-bg transition-opacity hover:opacity-85"
    >
      <GithubGlyph32 aria-hidden="true" className="size-3.5" />
      <span className="hidden sm:inline">Star</span>
    </a>
  );
}
