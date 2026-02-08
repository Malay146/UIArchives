import { cn } from "@/utlis/cn";
import React from "react";

const TwitterIcon = ({className}: {className?: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-twitter-icon lucide-twitter hover:stroke-zinc-400 hover:scale-110 transition-all duration-200", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
};

export default TwitterIcon;
