import { cn } from "@/utlis/cn";
import React from "react";

const WebIcon = ({className}: {className?: string}) => {
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
      className={cn("lucide lucide-globe-icon lucide-globe hover:stroke-zinc-400 hover:scale-110 transition-all duration-200")}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
};

export default WebIcon;
