import { forwardRef } from "react";
import { cn } from "@/utlis/cn";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-fg text-bg hover:opacity-85",
  secondary: "border border-line-strong text-fg hover:bg-hover",
  ghost: "text-fg-2 hover:text-fg",
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "primary", className, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "press inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 font-medium whitespace-nowrap transition-[opacity,background-color,color] duration-150 disabled:pointer-events-none disabled:opacity-40",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
});
