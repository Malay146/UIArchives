"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronDownGlyph18,
  ChevronUpGlyph18,
  XmarkGlyph18,
} from "@/components/icons";

const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

type Props<T> = {
  item: T | null;
  /** The list the sheet was opened from, for previous / next. */
  list: T[];
  onSelect: (item: T) => void;
  onClose: () => void;
  /** Element id of the heading inside children, for the dialog's name. */
  labelledBy?: string;
  children: (item: T) => React.ReactNode;
  /**
   * Media-first mode: the media fills a dark stage in the middle of the
   * screen and the details sit in a sidebar on the right (stacked on phones).
   */
  stage?: (item: T) => React.ReactNode;
};

/**
 * The shared detail sheet: slides in from the right, wide, with previous /
 * next through the list it came from. ↑/↓ (or k/j) walk, esc closes, focus
 * stays inside, and the page behind is locked.
 */
export function Sheet<T>({ item, list, onSelect, onClose, labelledBy = "sheet-title", children, stage }: Props<T>) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const open = item !== null;

  const index = item !== null ? list.indexOf(item) : -1;
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest("input, textarea");
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (!typing && (e.key === "ArrowDown" || e.key === "j" || (stage && e.key === "ArrowRight")) && next) {
        e.preventDefault();
        onSelect(next);
      } else if (!typing && (e.key === "ArrowUp" || e.key === "k" || (stage && e.key === "ArrowLeft")) && prev) {
        e.preventDefault();
        onSelect(prev);
      } else if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), video[controls], [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, onClose, onSelect, stage]);

  useEffect(() => {
    if (!open) return;
    const restore = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = prevOverflow;
      restore?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    panelRef.current?.querySelector("[data-scroll]")?.scrollTo({ top: 0 });
  }, [item]);

  const header = (
    <div className="flex h-12 shrink-0 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-1">
        <IconButton label="Previous" disabled={!prev} onClick={() => prev && onSelect(prev)}>
          <ChevronUpGlyph18 className={`size-3.5 ${stage ? "-rotate-90" : ""}`} />
        </IconButton>
        <IconButton label="Next" disabled={!next} onClick={() => next && onSelect(next)}>
          <ChevronDownGlyph18 className={`size-3.5 ${stage ? "-rotate-90" : ""}`} />
        </IconButton>
        <span className="ml-2 text-fg-3 tabular-nums">
          {index + 1} of {list.length}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        data-sound="close"
        className="press flex h-7 items-center gap-2 rounded-md pr-1 pl-2 text-fg-2 transition-colors hover:text-fg"
        aria-label="Close details"
      >
        <span className="hidden sm:inline">Close</span>
        <kbd className="hidden h-[18px] place-items-center rounded-[4px] border border-line-strong px-1 font-sans text-[11px] leading-none sm:grid">
          esc
        </kbd>
        <XmarkGlyph18 className="size-3.5 sm:hidden" />
      </button>
    </div>
  );

  if (stage) {
    return (
      <AnimatePresence>
        {item !== null && (
          <motion.div
            key="stage"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className="fixed inset-0 z-[90] flex flex-col outline-none lg:flex-row"
            // No opacity on this wrapper: a translucent parent stops the
            // backdrop blur below from working until the fade ends. It only
            // stays mounted while its children animate out.
            exit={{ opacity: 1, transition: { duration: 0.26 } }}
          >
            {/* Backdrop: dims and blurs the page in, together. */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(14px)" }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px)",
                transition: { duration: 0.22, ease: EASE_DRAWER },
              }}
              transition={{ duration: reduce ? 0.15 : 0.42, ease: EASE_DRAWER }}
            />

            {/* The stage: dark, the media centred in it. Clicking the dark area closes. */}
            <div
              className="relative flex h-[52dvh] shrink-0 items-center justify-center p-4 sm:p-8 lg:h-auto lg:min-w-0 lg:flex-1 lg:px-20 lg:py-14"
              // Anything on the stage that isn't the media itself or a control closes it.
              onClick={(e) => !(e.target as HTMLElement).closest("video, img, button, a, [data-stage-media]") && onClose()}
              data-sound="close"
            >
              <motion.div
                key={index}
                className="flex size-full items-center justify-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px) scale(0.94)" }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px) scale(1)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px) scale(0.97)", transition: { duration: 0.18, ease: EASE_DRAWER } }}
                transition={{ duration: 0.46, ease: EASE_DRAWER, delay: reduce ? 0 : 0.06 }}
              >
                {stage(item)}
              </motion.div>
              <StageArrow side="left" label="Previous" disabled={!prev} onClick={() => prev && onSelect(prev)} />
              <StageArrow side="right" label="Next" disabled={!next} onClick={() => next && onSelect(next)} />
            </div>

            {/* Details sidebar. */}
            <motion.aside
              className="relative flex min-h-0 w-full flex-1 flex-col bg-bg shadow-[0_-1px_0_var(--line-strong)] lg:w-[400px] lg:flex-none lg:shadow-[-1px_0_0_var(--line-strong)]"
              initial={reduce ? { opacity: 0 } : { transform: "translateX(100%)" }}
              animate={reduce ? { opacity: 1 } : { transform: "translateX(0%)" }}
              exit={reduce ? { opacity: 0 } : { transform: "translateX(100%)", transition: { duration: 0.22, ease: EASE_DRAWER } }}
              transition={{ duration: 0.44, ease: EASE_DRAWER }}
            >
              {header}
              <div data-scroll className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {children(item)}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {item !== null && (
        <div className="fixed inset-0 z-[90]" key="sheet">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/20 dark:bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.3, ease: EASE_DRAWER }}
            onClick={onClose}
            data-sound="close"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className="absolute top-0 right-0 bottom-0 flex w-full flex-col bg-bg shadow-[-1px_0_0_var(--line-strong),-24px_0_64px_-24px_rgb(0_0_0/0.25)] outline-none focus-visible:outline-none sm:w-[min(760px,calc(100vw-64px))]"
            initial={reduce ? { opacity: 0 } : { transform: "translateX(100%)" }}
            animate={reduce ? { opacity: 1 } : { transform: "translateX(0%)" }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { transform: "translateX(100%)", transition: { duration: 0.22, ease: EASE_DRAWER } }
            }
            transition={{ duration: 0.36, ease: EASE_DRAWER }}
          >
            {header}
            <div data-scroll className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {children(item)}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Round previous / next buttons on either side of the stage (pointer devices only). */
function StageArrow({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`press absolute top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition-[background-color,opacity,color] duration-150 hover:bg-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-0 lg:grid ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <ChevronUpGlyph18 className={`size-3.5 ${side === "left" ? "-rotate-90" : "rotate-90"}`} />
    </button>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="press grid size-7 place-items-center rounded-md text-fg-2 transition-colors hover:bg-hover hover:text-fg disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* Shared pieces for sheet content ------------------------------------ */

export function SheetSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="mb-3 text-fg-3">{title}</h3>
      {children}
    </section>
  );
}

export function SheetRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b py-2.5">
      <dt className="shrink-0 text-fg-3">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}

export function SheetTags({ tags }: { tags: string[] }) {
  return (
    <span className="flex flex-wrap justify-end gap-1.5">
      {tags.map((t) => (
        <span key={t} className="rounded-[4px] bg-hover px-1.5 py-px text-[12px] text-fg-2">
          {t}
        </span>
      ))}
    </span>
  );
}
