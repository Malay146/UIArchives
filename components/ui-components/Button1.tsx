import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type Button1Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button1 = ({ children, className = "", ...props }: Button1Props) => {
  return (
    <button
      {...props}
      className={twMerge(
        clsx(
          "noise font-[Inter] px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-[#171717] cursor-pointer rounded-xl sm:rounded-2xl transition-shadow duration-300 font-light text-zinc-400 text-xs sm:text-sm md:text-base",
          "shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)]",
          "hover:shadow-[inset_-2px_-2px_2px_rgba(255,255,255,0.08),inset_2px_2px_2px_rgba(0,0,0,0.5)] sm:hover:shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.08),inset_4px_4px_4px_rgba(0,0,0,0.5)]",
          className
        )
      )}
    >
      {children}
    </button>
  );
};
export default Button1;