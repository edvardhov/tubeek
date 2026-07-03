"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import type { Card } from "@/lib/types";

interface FlashCardProps {
  card: Card;
  cardIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onFlip: () => void;
  isExiting?: boolean;
  exitDirection?: "left" | "right" | null;
  style?: React.CSSProperties;
  drag?: boolean;
  onDragEnd?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => void;
  className?: string;
}

export function FlashCard({
  card,
  cardIndex,
  totalCards,
  isFlipped,
  onFlip,
  isExiting = false,
  exitDirection = null,
  style,
  drag = false,
  onDragEnd,
  className = "",
}: FlashCardProps) {
  const dragX = useMotionValue(0);
  const knowOpacity = useTransform(dragX, [0, 60], [0, 1]);
  const reviewOpacity = useTransform(dragX, [0, -60], [0, 1]);
  const knowScale = useTransform(knowOpacity, [0, 1], [0.85, 1]);
  const reviewScale = useTransform(reviewOpacity, [0, 1], [0.85, 1]);
  const rotate = useTransform(dragX, [-150, 0, 150], [-10, 0, 10]);
  const knowGlow = useTransform(dragX, [0, 80], [0, 0.35]);
  const reviewGlow = useTransform(dragX, [0, -80], [0, 0.25]);

  return (
    <motion.div
      className={`absolute inset-0 ${drag && !isExiting ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      style={{ ...style, x: isExiting ? undefined : dragX, rotate: isExiting ? undefined : rotate }}
      animate={
        isExiting && exitDirection
          ? {
              x: exitDirection === "right" ? 420 : -420,
              rotate: exitDirection === "right" ? 18 : -18,
              opacity: 0,
              scale: 0.92,
            }
          : { x: 0, rotate: 0, opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      drag={drag && !isExiting}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={(event, info) => {
        dragX.set(0);
        onDragEnd?.(event, info);
      }}
      whileDrag={{ scale: 1.015 }}
    >
      <motion.div
        style={{ opacity: knowGlow }}
        className="pointer-events-none absolute -inset-1 rounded-3xl bg-accent blur-xl"
      />
      <motion.div
        style={{ opacity: reviewGlow }}
        className="pointer-events-none absolute -inset-1 rounded-3xl bg-text-subtle blur-xl"
      />

      <motion.span
        style={{ opacity: knowOpacity, scale: knowScale }}
        className="pointer-events-none absolute right-5 top-5 z-10 rounded-lg border-2 border-accent bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-fg"
      >
        Got it
      </motion.span>
      <motion.span
        style={{ opacity: reviewOpacity, scale: reviewScale }}
        className="pointer-events-none absolute left-5 top-5 z-10 rounded-lg border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-text-muted"
      >
        Review
      </motion.span>

      <div
        className="relative h-full w-full"
        style={{ perspective: 1400 }}
        onClick={!isExiting ? onFlip : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            onFlip();
          }
        }}
      >
        <motion.div
          className="relative h-full w-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 160, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-5 py-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-text-subtle">
                  ?
                </span>
                Question
              </span>
              <span className="rounded-full bg-bg px-2.5 py-0.5 text-[10px] font-semibold tabular-nums text-text-subtle">
                {cardIndex} / {totalCards}
              </span>
            </div>
            <div className="relative flex flex-1 flex-col p-5 sm:p-6">
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-2 select-none text-7xl font-bold leading-none text-border/40 dark:text-border/25"
              >
                ?
              </span>
              <p className="my-auto px-1 text-center text-lg font-semibold leading-snug text-text sm:text-xl">
                {card.question}
              </p>
              <p className="text-center text-[11px] text-text-subtle">
                Tap to reveal the answer
              </p>
            </div>
          </div>

          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border-2 dark:border"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "var(--card-answer-bg)",
              borderColor: "var(--card-answer-border)",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-3"
              style={{
                background: "var(--card-answer-header)",
                borderColor: "var(--card-answer-border)",
                color: "var(--card-answer-header-fg)",
              }}
            >
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: "color-mix(in srgb, var(--card-answer-header-fg) 18%, transparent)",
                  }}
                >
                  ✓
                </span>
                Answer
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold tabular-nums"
                style={{
                  background: "color-mix(in srgb, var(--card-answer-header-fg) 12%, transparent)",
                }}
              >
                {cardIndex} / {totalCards}
              </span>
            </div>
            <div
              className="relative flex flex-1 flex-col border-l-[3px] p-5 sm:p-6"
              style={{ borderLeftColor: "var(--card-answer-stripe)" }}
            >
              <p className="my-auto px-1 text-center text-base font-normal leading-relaxed text-text sm:text-lg">
                {card.answer}
              </p>
              <p className="text-center text-[11px] text-text-muted dark:text-accent/80">
                Swipe right if you knew it · left to review
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
