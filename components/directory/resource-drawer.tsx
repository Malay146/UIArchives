"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetRow, SheetSection } from "@/components/ui/sheet";
import siteMeta from "@/data/site-meta.json";
import snapshots from "@/data/snapshots.json";
import {
  type UiCardData,
  categoriesOf,
  isSocial,
  linkLabel,
  logoKey,
  primaryCategory,
  primaryHref,
  tagsOf,
} from "@/types/resource";
import { Logo } from "./logo";
import {
  ArrowUpRightGlyph18,
  CheckGlyph18,
  CopyGlyph18,
} from "@/components/icons";

type SiteMeta = {
  title: string;
  description: string;
  headline: string;
  checked: string;
};
const META = siteMeta as Record<string, SiteMeta>;
/** "Nov 13, 2026", or "" when there's no valid date (e.g. media fetched on submit). */
const shortDate = (iso: string) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime())
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d)
    : "";
};

type Snapshot = { src: string; width: number; height: number; checked: string };
const SNAPS = snapshots as Record<string, Snapshot>;

type Props = {
  resource: UiCardData | null;
  /** The list the drawer was opened from, for previous / next. */
  list: UiCardData[];
  numberOf: (r: UiCardData) => number;
  onSelect: (r: UiCardData) => void;
  onClose: () => void;
};

/**
 * A wide sheet from the right with everything about one resource: what it
 * says about itself, where it lives, how it's filed, and what sits near it.
 */
export function ResourceDrawer({
  resource,
  list,
  numberOf,
  onSelect,
  onClose,
}: Props) {
  return (
    <Sheet
      item={resource}
      list={list}
      onSelect={onSelect}
      onClose={onClose}
      labelledBy="drawer-title"
    >
      {(r) => (
        <Details
          resource={r}
          number={numberOf(r)}
          list={list}
          onSelect={onSelect}
        />
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */

function Details({
  resource: r,
  number,
  list,
  onSelect,
}: {
  resource: UiCardData;
  number: number;
  list: UiCardData[];
  onSelect: (r: UiCardData) => void;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [r]);

  const social = isSocial(r);
  const href = primaryHref(r);
  const label = linkLabel(r);
  const meta =
    META[logoKey(r)] ??
    (r.headline || r.metaDescription
      ? { title: "", description: r.metaDescription ?? "", headline: r.headline ?? "", checked: "" }
      : undefined);
  const snap = SNAPS[logoKey(r)];
  // Landing snapshot first; otherwise the preview image stored with the entry.
  const preview = snap
    ? {
        src: snap.src,
        width: snap.width,
        height: snap.height,
        fit: "object-cover object-top",
        ratio: "aspect-[16/10]",
      }
    : r.image
      ? {
          src: r.image,
          width: 1440,
          height: 900,
          fit: "object-cover object-top",
          ratio: "aspect-[16/10]",
        }
      : null;
  const cats = categoriesOf(r);
  const tags = tagsOf(r).filter((t) => !(cats as string[]).includes(t));
  const primary = primaryCategory(r);
  const related = list
    .filter((x) => x !== r && primaryCategory(x) === primary)
    .slice(0, 6);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <article className="px-4 pt-8 pb-16 sm:px-8">
      {/* Identity */}
      <header className="flex items-start gap-4">
        <Logo resource={r} className="size-12" />
        <div className="min-w-0 flex-1">
          <h2
            id="drawer-title"
            className="text-[17px] leading-tight font-medium tracking-[-0.01em]"
          >
            {r.title}
          </h2>
          <p className="mt-1 text-fg-2">
            {social ? `${label} on X` : label}
            <span className="text-fg-3">
              {" "}
              · No. {String(number).padStart(3, "0")}
            </span>
          </p>
        </div>
      </header>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex h-8 items-center gap-1.5 rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
        >
          {social ? "View on X" : "Visit website"}
          <ArrowUpRightGlyph18 aria-hidden="true" className="size-3" />
        </a>
        <button
          type="button"
          onClick={copy}
          className="press inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-fg shadow-[0_0_0_1px_var(--line-strong)] transition-colors hover:bg-hover"
        >
          {copied ? (
            <CheckGlyph18 aria-hidden="true" className="size-3" />
          ) : (
            <CopyGlyph18 aria-hidden="true" className="size-3" />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      {/* Landing page — what you'll actually see when you click through */}
      {!social && preview && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="group/snap mt-8 block overflow-hidden rounded-lg bg-bg shadow-[0_0_0_1px_var(--line-strong),0_8px_24px_-12px_rgb(0_0_0/0.18)]"
        >
          {snap && (
            <div className="flex h-8 items-center gap-3 border-b px-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
              </span>
              <span className="flex-1 truncate text-center text-[12px] text-fg-3">
                {href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
              <ArrowUpRightGlyph18 className="size-2.5 text-fg-3 transition-colors group-hover/snap:text-fg" />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={preview.src}
            src={preview.src}
            alt=""
            width={preview.width}
            height={preview.height}
            decoding="async"
            className={`block w-full bg-hover ${preview.ratio} ${preview.fit}`}
          />
        </a>
      )}
      {snap && shortDate(snap.checked) && (
        <p className="mt-2 text-[12px] text-fg-3">Landing page, captured {shortDate(snap.checked)}</p>
      )}

      {/* Overview */}
      <SheetSection title="Overview">
        <p className="max-w-[62ch] text-[15px] leading-[1.7] text-fg-2">
          {r.description}
        </p>
      </SheetSection>

      {/* In their own words */}
      {meta && (meta.description || meta.headline) && (
        <SheetSection title="From the website">
          <figure className="border-l pl-4">
            {meta.headline && meta.headline !== r.title && (
              <p className="font-medium">{meta.headline}</p>
            )}
            {meta.description && (
              <blockquote
                className={`max-w-[62ch] text-fg-2 ${meta.headline && meta.headline !== r.title ? "mt-1" : ""}`}
              >
                {meta.description}
              </blockquote>
            )}
            {meta.title && (
              <figcaption className="mt-2 text-[12px] text-fg-3">
                {meta.title}
                {shortDate(meta.checked) && <> — checked {shortDate(meta.checked)}</>}
              </figcaption>
            )}
          </figure>
        </SheetSection>
      )}

      {/* Facts */}
      <SheetSection title="Details">
        <dl className="border-t">
          <SheetRow label={cats.length > 1 ? "Categories" : "Category"}>
            {cats.join(", ") || primary}
          </SheetRow>
          {tags.length > 0 && (
            <SheetRow label="Tags">
              <span className="flex flex-wrap justify-end gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-[4px] bg-hover px-1.5 py-px text-[12px] text-fg-2"
                  >
                    {t}
                  </span>
                ))}
              </span>
            </SheetRow>
          )}
          <SheetRow label={social ? "X" : "Website"}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="link text-fg"
            >
              {label}
            </a>
          </SheetRow>
          <SheetRow label="Address">
            <span className="break-all text-fg-2">
              {href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </span>
          </SheetRow>
        </dl>
      </SheetSection>

      {/* Nearby */}
      {related.length > 0 && (
        <SheetSection title={`More in ${primary}`}>
          <ul className="grid gap-px overflow-hidden rounded-lg bg-line shadow-[0_0_0_1px_var(--line)] sm:grid-cols-2">
            {related.map((x) => (
              <li key={x.title} className="bg-bg">
                <button
                  type="button"
                  onClick={() => onSelect(x)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-hover"
                >
                  <Logo resource={x} className="size-6" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {x.title}
                    </span>
                    <span className="block truncate text-[12px] text-fg-3">
                      {linkLabel(x)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </SheetSection>
      )}
    </article>
  );
}
