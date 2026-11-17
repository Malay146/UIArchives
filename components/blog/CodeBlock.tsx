"use client";

import { Highlight, type PrismTheme } from "prism-react-renderer";
import { cn } from "@/utlis/cn";
import { CommandCopy } from "@/components/collection/command-copy";
import { CopyButton } from "@/components/collection/copy-button";

// Syntax theme driven by --code-* variables (globals.css), so it follows light and dark.
const theme: PrismTheme = {
  plain: { color: "var(--fg)", backgroundColor: "var(--code-bg)" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--code-comment)", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "var(--code-punct)" } },
    { types: ["keyword", "atrule", "important", "rule"], style: { color: "var(--code-keyword)" } },
    { types: ["string", "char", "attr-value", "regex", "inserted", "url"], style: { color: "var(--code-string)" } },
    { types: ["function", "class-name", "selector", "maybe-class-name"], style: { color: "var(--code-function)" } },
    { types: ["number", "boolean", "constant", "symbol", "unit"], style: { color: "var(--code-number)" } },
    { types: ["tag", "builtin"], style: { color: "var(--code-tag)" } },
    { types: ["property", "attr-name", "variable"], style: { color: "var(--code-attr)" } },
    { types: ["deleted"], style: { color: "var(--code-keyword)", textDecorationLine: "line-through" } },
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

  // A one-line shell command reads best as a command, with its copy button.
  if (/^(bash|sh|shell|zsh|console)$/.test(language) && !code.includes("\n")) {
    return (
      <div className="my-6">
        <CommandCopy command={code.replace(/^\$\s*/, "")} size="md" prompt />
      </div>
    );
  }

  return (
    <Highlight theme={theme} code={code} language={language}>
      {({ className: prismClassName, style, tokens, getLineProps, getTokenProps }) => (
        <figure className="my-8 overflow-hidden rounded-lg border">
          <figcaption className="flex items-center justify-between border-b py-1.5 pr-1.5 pl-4 text-[12px] text-fg-3">
            {language}
            <CopyButton value={code} label="Copy" className="h-6 px-2 text-[12px] shadow-none" />
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
