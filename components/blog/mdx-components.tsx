import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/utlis/cn";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./CodeBlock";

export function getMdxComponents(): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      // Enforce the rule: Only ONE H1 per page (The post title).
      // If authors use # in markdown, it downgrades to H2 automatically.
      <h2
        className={cn(
          "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }) => (
      <h5
        className={cn(
          "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }) => (
      <h6
        className={cn(
          "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }) => (
      <Link
        href={props.href as string}
        className={cn(
          "font-medium transition-colors text-foreground no-underline",
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn(
          "leading-8 not-first:mt-6 text-muted-foreground/90 text-lg",
          className,
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li
        className={cn("text-muted-foreground/90 text-lg", className)}
        {...props}
      />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "mt-6 border-l-4 border-primary pl-6 italic text-foreground bg-muted/40 py-4 pr-4 rounded-r-lg",
          className,
        )}
        {...props}
      />
    ),
    img: ({
      className,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <div className="my-10 overflow-hidden rounded-xl border bg-muted w-full relative min-h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            className,
          )}
          alt={alt}
          {...props}
        />
      </div>
    ),
    hr: ({ ...props }) => <hr className="my-10 border-muted" {...props} />,
    table: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-y-auto rounded-lg border">
        <table
          className={cn("w-full overflow-hidden rounded-lg", className)}
          {...props}
        />
      </div>
    ),
    tr: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={cn("m-0 border-t bg-card p-0 even:bg-muted/50", className)}
        {...props}
      />
    ),
    th: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={cn(
          "border border-muted bg-muted py-3 px-4 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={cn(
          "border border-muted py-3 px-4 text-left [[align=center]]:text-center [[align=right]]:text-right text-muted-foreground",
          className,
        )}
        {...props}
      />
    ),
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children, ...props }) => (
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    ),
    Image: (props: ImageProps) => (
      <Image className="rounded-xl border my-8" {...props} />
    ),
  };
}
