"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`px-4 py-2 rounded-lg bg-zinc-600 text-zinc-900 outline-none placeholder:text-zinc-800 w-full text-sm sm:text-base ${className}`}
    />
  );
}
