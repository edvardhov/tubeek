"use client";

import { HiArrowUpRight } from "react-icons/hi2";
import { APP_MODE } from "@/lib/deck-source/index";

export function DemoBanner() {
  if (APP_MODE !== "demo") return null;

  return (
    <div className="shrink-0 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 px-4 py-2.5 text-xs">
        <span className="rounded-md border border-border bg-surface-muted px-2 py-0.5 font-medium uppercase tracking-wider text-text-muted">
          Demo
        </span>
        <span className="text-text-muted">Sample decks · no backend required</span>
        <span className="hidden text-text-subtle sm:inline">·</span>
        <a
          href="https://github.com/edvardhov/tubeek#quickstart"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-accent transition hover:text-accent-hover"
        >
          Run locally
          <HiArrowUpRight className="text-sm" />
        </a>
      </div>
    </div>
  );
}
