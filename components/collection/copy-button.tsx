"use client";

import { useEffect, useState } from "react";
import { CheckGlyph18, CopyGlyph18 } from "@/components/icons";

export function CopyButton({ value, label = "Copy", className = "" }: { value: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
        } catch {}
      }}
      className={`press inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-fg shadow-[0_0_0_1px_var(--line-strong)] transition-colors hover:bg-hover ${className}`}
    >
      {done ? <CheckGlyph18 aria-hidden="true" className="size-3" /> : <CopyGlyph18 aria-hidden="true" className="size-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="press inline-flex h-8 items-center gap-1.5 rounded-md bg-fg px-3 font-medium text-bg transition-opacity hover:opacity-85"
    >
      {children}
    </a>
  );
}
