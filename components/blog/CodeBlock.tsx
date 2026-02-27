"use client";

import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/utlis/cn";

export function CodeBlock({ children, className, ...props }: any) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  if (!language) {
    return (
      <code
        className={cn(
          "relative rounded-md bg-muted px-[0.4rem] py-[0.2rem] font-mono text-[0.9em] text-foreground font-semibold",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <Highlight theme={themes.vsDark} code={code} language={language as any}>
      {({
        className: prismClassName,
        style,
        tokens,
        getLineProps,
        getTokenProps,
      }) => (
        <div className="relative my-6 rounded-xl overflow-hidden border border-zinc-800 bg-[#1e1e1e]">
          <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900">
            <span className="text-xs text-zinc-400 font-mono capitalize">
              {language}
            </span>
          </div>
          <pre
            className={cn(
              "overflow-x-auto p-4 font-mono text-sm",
              prismClassName,
            )}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  );
}
