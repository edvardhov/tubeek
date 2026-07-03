"use client";

import { HiMoon, HiSun } from "react-icons/hi";
import { useTheme } from "@/lib/theme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();

  const ariaLabel = mounted
    ? theme === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle color theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-sm transition hover:border-accent hover:text-accent ${className}`}
      aria-label={ariaLabel}
      suppressHydrationWarning
    >
      {!mounted ? (
        <HiMoon className="text-lg" aria-hidden="true" />
      ) : theme === "dark" ? (
        <HiSun className="text-lg" aria-hidden="true" />
      ) : (
        <HiMoon className="text-lg" aria-hidden="true" />
      )}
    </button>
  );
}
