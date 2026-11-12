import { memo } from "react";
import {
  type UiCardData,
  isSocial,
  linkLabel,
  primaryCategory,
  primaryHref,
} from "@/types/resource";
import { Logo } from "./logo";
import { ArrowUpRightGlyph18 } from "@/components/icons";

export const ROW_GRID =
  "md:grid md:grid-cols-[3rem_minmax(0,13rem)_minmax(0,1fr)_9rem_10rem] md:items-center md:gap-6";

type Props = {
  resource: UiCardData;
  number: number;
  selected?: boolean;
  onOpen?: (resource: UiCardData) => void;
};

/**
 * One line of the index. The whole row opens the detail drawer; the link at
 * the end goes straight to the website (or X profile) in a new tab.
 */
function ResourceRowBase({ resource, number, selected, onOpen }: Props) {
  const { title, description } = resource;
  const href = primaryHref(resource);
  const label = linkLabel(resource);
  const social = isSocial(resource);
  const category = primaryCategory(resource);

  return (
    <li
      className={`group relative border-b px-4 py-3.5 transition-colors duration-150 sm:px-6 md:py-3 ${ROW_GRID} ${
        selected ? "bg-hover" : "hover:bg-hover"
      }`}
    >
      <span className="hidden text-fg-3 tabular-nums md:block">
        {String(number).padStart(3, "0")}
      </span>

      <div className="flex min-w-0 items-center gap-2.5">
        <Logo resource={resource} />
        <button
          type="button"
          onClick={() => onOpen?.(resource)}
          aria-haspopup="dialog"
          className="truncate text-left font-medium outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:-outline-offset-1 focus-visible:after:outline-fg"
        >
          {title}
          <span className="sr-only">, show details</span>
        </button>
        <span className="ml-auto shrink-0 text-fg-3 md:hidden">{category}</span>
      </div>

      <p className="mt-1.5 line-clamp-2 text-fg-2 md:mt-0 md:line-clamp-1">
        {description}
      </p>

      <span className="hidden truncate text-fg-2 md:block">{category}</span>

      <div className="mt-2 flex min-w-0 md:mt-0 md:justify-end">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 -m-1 flex min-w-0 items-center gap-2 rounded p-1 text-fg-3 transition-colors hover:text-fg"
          aria-label={social ? `${title} on X, ${label} (new tab)` : `Visit ${label} (new tab)`}
        >
          <span className="truncate">{label}</span>
          <ArrowUpRightGlyph18 aria-hidden="true" className="hidden size-3 shrink-0 md:block" />
        </a>
      </div>
    </li>
  );
}

export const ResourceRow = memo(ResourceRowBase);
