import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/utlis/cn";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./CodeBlock";
import { Faq, FaqItem } from "./faq";
import { Explore } from "./explore";

type P<T = HTMLElement> = React.HTMLAttributes<T>;

const heading = "scroll-mt-20 font-medium tracking-[-0.01em] text-fg [&_a]:text-inherit [&_a]:no-underline";

export function getMdxComponents(): MDXComponents {
  return {
    // Only one h1 per page (the post title) — authored h1s become h2.
    h1: ({ className, ...props }: P) => (
      <h2 className={cn(heading, "mt-14 text-[17px]", className)} {...props} />
    ),
    h2: ({ className, ...props }: P) => (
      <h2 className={cn(heading, "mt-14 text-[17px]", className)} {...props} />
    ),
    h3: ({ className, ...props }: P) => (
      <h3 className={cn(heading, "mt-10 text-[15px]", className)} {...props} />
    ),
    h4: ({ className, ...props }: P) => (
      <h4 className={cn(heading, "mt-8 text-[15px] text-fg-2", className)} {...props} />
    ),
    h5: ({ className, ...props }: P) => (
      <h5 className={cn(heading, "mt-8 text-fg-2", className)} {...props} />
    ),
    h6: ({ className, ...props }: P) => (
      <h6 className={cn(heading, "mt-8 text-fg-2", className)} {...props} />
    ),
    a: ({ className, href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const external = href.startsWith("http");
      return (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={cn(
            "text-fg underline decoration-line-strong decoration-1 underline-offset-[3px] transition-colors hover:decoration-fg",
            className,
          )}
          {...props}
        />
      );
    },
    p: ({ className, ...props }: P<HTMLParagraphElement>) => (
      <p
        className={cn("mt-5 text-[15px] leading-[1.75] text-fg-2 first:mt-0", className)}
        {...props}
      />
    ),
    strong: ({ className, ...props }: P) => (
      <strong className={cn("font-medium text-fg", className)} {...props} />
    ),
    ul: ({ className, ...props }: P<HTMLUListElement>) => (
      <ul
        className={cn("mt-5 ml-5 list-disc marker:text-fg-3 [&>li]:mt-2", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }: P<HTMLOListElement>) => (
      <ol
        className={cn("mt-5 ml-5 list-decimal marker:text-fg-3 [&>li]:mt-2", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }: P<HTMLLIElement>) => (
      <li
        className={cn("pl-1 text-[15px] leading-[1.75] text-fg-2", className)}
        {...props}
      />
    ),
    blockquote: ({ className, ...props }: P) => (
      <blockquote
        className={cn("mt-6 border-l pl-5 text-fg [&_p]:text-fg", className)}
        {...props}
      />
    ),
    img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={cn("my-10 w-full rounded-lg border grayscale", className)}
        alt={alt}
        loading="lazy"
        {...props}
      />
    ),
    hr: (props: P<HTMLHRElement>) => <hr className="my-12" {...props} />,
    table: ({ className, ...props }: P<HTMLTableElement>) => (
      <div className="my-8 w-full overflow-x-auto border-y">
        <table className={cn("w-full text-left", className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }: P<HTMLTableRowElement>) => (
      <tr className={cn("border-b last:border-b-0", className)} {...props} />
    ),
    th: ({ className, ...props }: P<HTMLTableCellElement>) => (
      <th
        className={cn("px-3 py-2.5 font-medium text-fg-3 first:pl-0", className)}
        {...props}
      />
    ),
    td: ({ className, ...props }: P<HTMLTableCellElement>) => (
      <td
        className={cn("px-3 py-2.5 align-top text-fg-2 first:pl-0", className)}
        {...props}
      />
    ),
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children, ...props }) => (
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    ),
    Faq,
    FaqItem,
    Explore,
    Image: (props: ImageProps) => (
      <Image className="my-10 rounded-lg border grayscale" {...props} />
    ),
  };
}
