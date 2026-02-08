import { cn } from "@/utlis/cn";
import React from "react";

const CrossArrow = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-arrow-up-right-icon", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
};

export default CrossArrow;
