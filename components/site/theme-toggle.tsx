"use client";

import { useEffect, useState } from "react";
import { ContrastGlyph18 } from "@/components/icons";
import { type Theme, getTheme, onThemeChange, toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    setThemeState(getTheme());
    return onThemeChange(setThemeState);
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-sound={theme === "dark" ? "toggle-off" : "toggle-on"}
      className="press -m-2 grid size-8 place-items-center text-fg-2 transition-colors hover:text-fg"
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
    >
      <ContrastGlyph18 aria-hidden="true" className="size-[15px]" />
    </button>
  );
}
