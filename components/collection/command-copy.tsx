"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckGlyph18, CopyGlyph18 } from "@/components/icons";

/**
 * A shell command with a copy button tucked into its right edge.
 *
 * The icon swap is the whole animation: copy → check with a short scale +
 * blur crossfade (blur bridges the two shapes so it reads as one icon
 * changing), ease-out, ~180ms, no bounce. It reverts on its own.
 */
export function CommandCopy({
  command,
  size = "sm",
  prompt = false,
}: {
  command: string;
  size?: "sm" | "md";
  /** Show a leading "$". */
  prompt?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef<HTMLElement>(null);
  const [overflows, setOverflows] = useState(false);

  // Fade the edge only when the command is actually cut off.
  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [command]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async (e: React.MouseEvent) => {
    // Inside a clickable row: copying must not also open the row.
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  const md = size === "md";
  const icon = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: "blur(2px)" },
    animate: reduce ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: "blur(2px)" },
    transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] as const },
  };

  return (
    <div
      // Inside a hovered list row (which turns grey), flip to the page colour
      // with a hairline so the block never melts into the row.
      className={`group/cmd relative z-10 flex min-w-0 items-center rounded-lg bg-hover font-mono text-fg-2 transition-[background-color,box-shadow] duration-150 group-hover:bg-bg group-hover:shadow-[inset_0_0_0_1px_var(--line-strong)] ${
        md ? "h-12 pr-1.5 pl-4 text-[13px]" : "h-9 pr-1 pl-3 text-[12px]"
      }`}
    >
      {/* Long commands fade out at the edge instead of an ellipsis */}
      <code
        ref={codeRef}
        className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap select-all ${
          overflows ? "[mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)]" : ""
        }`}
        title={command}
      >
        {prompt && <span className="mr-2 text-fg-3 select-none">$</span>}
        {command}
      </code>

      <button
        type="button"
        onClick={copy}
        data-sound={copied ? "none" : "toggle-on"}
        aria-label={copied ? "Copied" : "Copy command"}
        className={`press ml-1 grid shrink-0 place-items-center rounded-md text-fg-3 transition-colors duration-150 hover:bg-bg hover:text-fg group-hover:hover:bg-hover ${
          md ? "size-9" : "size-7"
        } ${copied ? "bg-bg text-fg group-hover:bg-hover" : ""}`}
      >
        <span className="relative grid size-3.5 place-items-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {copied ? (
              <motion.span key="check" className="absolute inset-0 grid place-items-center" {...icon}>
                <CheckGlyph18 aria-hidden="true" className="size-3.5" />
              </motion.span>
            ) : (
              <motion.span key="copy" className="absolute inset-0 grid place-items-center" {...icon}>
                <CopyGlyph18 aria-hidden="true" className="size-3.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
