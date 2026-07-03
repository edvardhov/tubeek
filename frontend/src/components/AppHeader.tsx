"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

interface AppHeaderProps {
  left?: React.ReactNode;
  className?: string;
}

export function AppHeader({ left, className = "" }: AppHeaderProps) {
  return (
    <header
      className={`mx-auto flex w-full max-w-4xl shrink-0 items-center justify-between gap-4 px-4 py-3 ${className}`}
    >
      <div className="flex min-h-10 min-w-0 flex-1 items-center">{left}</div>
      <ThemeToggle />
    </header>
  );
}
