"use client";

import { motion } from "framer-motion";
import { APP_MODE } from "@/lib/deck-source/index";

const steps = [
  {
    step: "1",
    title: "Paste a link",
    body: "Drop any YouTube URL with captions enabled.",
  },
  {
    step: "2",
    title: "Transcript → cards",
    body: "Ollama reads the transcript and builds Q&A pairs.",
  },
  {
    step: "3",
    title: "Swipe & learn",
    body: "Flip cards, swipe right when you know it, left to review.",
  },
];

export function HowItWorks() {
  return (
    <div className="w-full space-y-3">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-text-subtle">
        How it works
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
            className="rounded-xl border border-border bg-surface p-4 text-center sm:text-left"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-muted text-xs font-semibold text-accent">
              {item.step}
            </span>
            <h3 className="mt-3 text-sm font-semibold text-text">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ delay: 0.2, duration: 0.45 }}
      className="relative mx-auto hidden h-36 w-56 sm:block"
      aria-hidden="true"
    >
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-border bg-surface-muted" />
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border border-border bg-surface" />
      <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
          Question
        </span>
        <p className="text-center text-xs leading-snug text-text">
          What is a neural network?
        </p>
        <span className="text-center text-[10px] text-text-subtle">Tap to flip</span>
      </div>
    </motion.div>
  );
}

interface LandingHeroProps {
  modeLabel: string;
}

export function LandingHero({ modeLabel }: LandingHeroProps) {
  return (
    <div className="grid w-full max-w-3xl items-center gap-8 sm:grid-cols-[1fr_auto] sm:text-left">
      <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted"
        >
          {modeLabel}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="text-4xl font-bold tracking-tight text-text sm:text-5xl"
        >
          YouTube → flashcards
          <span className="block text-accent">in one paste.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="max-w-md text-sm leading-relaxed text-text-muted sm:text-base"
        >
          Tubeek turns lecture videos into swipeable study decks — generated on your
          machine with Ollama. No YouTube API key, no cloud.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:justify-start"
        >
          {["Local LLM", "Auto captions", "Flip & swipe"].map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-text-muted"
            >
              {tag}
            </li>
          ))}
        </motion.ul>
      </div>

      <CardPreview />
    </div>
  );
}

export function getModeLabel() {
  return APP_MODE === "demo" ? "Demo — sample decks" : "Local-first";
}
