"use client";

import { Highlight, type PrismTheme } from "prism-react-renderer";
import { cn } from "@/utlis/cn";

// Monochrome syntax theme: structure comes from grey value, not hue.
const mono: PrismTheme = {
  plain: { color: "var(--fg)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--fg-3)", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "var(--fg-3)" } },
    { types: ["string", "char", "attr-value", "regex", "inserted"], style: { color: "var(--fg-2)" } },
    { types: ["keyword", "tag", "selector", "important", "atrule"], style: { color: "var(--fg)", fontWeight: "500" } },
    { types: ["number", "boolean", "constant", "symbol", "property", "attr-name", "function", "class-name"], style: { color: "var(--fg)" } },
    { types: ["deleted"], style: { color: "var(--fg-3)", textDecorationLine: "line-through" } },
  ],
};

export function CodeBlock({ children, className, ...props }: any) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  if (!language) {
    return (
      <code
        className={cn(
          "rounded border bg-hover px-1 py-px font-mono text-[0.88em] text-fg",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <Highlight theme={mono} code={code} language={language}>
      {({ className: prismClassName, style, tokens, getLineProps, getTokenProps }) => (
        <figure className="my-8 overflow-hidden rounded-lg border">
          <figcaption className="border-b px-4 py-2 text-[12px] text-fg-3">
            {language}
          </figcaption>
          <pre
            className={cn("overflow-x-auto py-4 font-mono text-[13px] leading-[1.7]", prismClassName)}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="px-4">
                <span className="mr-4 inline-block w-6 text-right text-fg-3 select-none">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </figure>
      )}
    </Highlight>
  );
}
