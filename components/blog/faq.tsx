"use client";

import { useId, useState } from "react";
import { ChevronDownGlyph18 } from "@/components/icons";

/**
 * FAQ accordion for Journal posts. Each answer opens and closes with a height
 * animation (grid rows 0fr ↔ 1fr), and the content stays in the HTML for
 * search engines and readers without JavaScript.
 *
 *   <Faq>
 *     <FaqItem q="What size?">Answer in **MDX**.</FaqItem>
 *   </Faq>
 */
export function Faq({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 border-t">{children}</div>;
}

export function FaqItem({ q, children, open: initial = false }: { q: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial);
  const id = useId();
  return (
    <div className="border-b">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          data-sound={open ? "close" : "open"}
          className="group flex w-full items-center justify-between gap-6 py-4 text-left text-[15px] font-medium text-fg transition-colors"
        >
          <span>{q}</span>
          <span
            aria-hidden="true"
            className={`grid size-6 shrink-0 place-items-center rounded-full text-fg-3 transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-hover group-hover:text-fg ${
              open ? "rotate-180" : ""
            }`}
          >
            <ChevronDownGlyph18 className="size-3" />
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5 text-[15px] leading-[1.75] text-fg-2 [&>p]:m-0 [&>p+p]:mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
