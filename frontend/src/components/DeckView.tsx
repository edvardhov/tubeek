"use client";

import { AppHeader } from "@/components/AppHeader";
import { CardStack } from "@/components/CardStack";
import type { DeckResult } from "@/lib/types";
import { HiArrowLeft, HiExternalLink } from "react-icons/hi";

interface DeckViewProps {
  result: DeckResult;
  onBack: () => void;
}

export function DeckView({ result, onBack }: DeckViewProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_srgb,var(--accent)_6%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,color-mix(in_srgb,var(--accent)_6%,transparent),transparent)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,color-mix(in_srgb,var(--accent)_3%,transparent),transparent)]"
      />

      <AppHeader
        left={
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-muted transition hover:border-accent hover:text-text"
            >
              <HiArrowLeft className="text-sm" />
              Exit
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{result.deck.title}</p>
              <a
                href={result.video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-0.5 truncate text-[11px] text-text-subtle transition hover:text-accent"
              >
                <span className="truncate">Watch source · Q&A from transcript</span>
                <HiExternalLink className="shrink-0 text-[10px]" />
              </a>
            </div>
          </div>
        }
      />

      <div className="relative mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col overflow-hidden px-4 pb-3">
        <CardStack deck={result.deck} onRestart={onBack} />
      </div>
    </div>
  );
}
