import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type Button2Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button2 = ({ children, className = "", ...props }: Button2Props) => {
  return (
    <button
      {...props}
      className={`noise font-[Inter] px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-[#BDBDBD] cursor-pointer rounded-xl sm:rounded-2xl   
      shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.5),inset_2px_2px_2px_rgba(255,255,255,0.5)] sm:shadow-[inset_-4px_-4px_4px_rgba(0,0,0,0.5),inset_4px_4px_4px_rgba(255,255,255,0.5)]
      hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.5),inset_-2px_-2px_2px_rgba(255,255,255,0.5)] sm:hover:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.5)]
      transition-shadow duration-300 font-light text-zinc-800 text-xs sm:text-sm md:text-base ${className}`}
    >
      {children}
    </button>
  );
};
export default Button2;
