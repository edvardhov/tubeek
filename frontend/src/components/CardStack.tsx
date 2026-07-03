"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiArrowLeft,
  HiCheck,
  HiRefresh,
  HiSparkles,
  HiX,
} from "react-icons/hi";
import { FlashCard } from "@/components/FlashCard";
import type { Card, Deck, SessionStats } from "@/lib/types";

const SWIPE_THRESHOLD = 100;
const EXIT_MS = 280;

const CHEERS = [
  "Nice one!",
  "You got it!",
  "Keep going!",
  "On a roll!",
  "Sharp!",
  "Nailed it!",
];

interface CardStackProps {
  deck: Deck;
  onRestart: () => void;
}

function SegmentProgress({
  total,
  knownCount,
  remaining,
}: {
  total: number;
  knownCount: number;
  remaining: number;
}) {
  const activeIndex = total - remaining;

  return (
    <div className="flex w-full shrink-0 gap-1">
      {Array.from({ length: total }).map((_, index) => {
        const mastered = index < knownCount;
        const active = index === activeIndex && remaining > 0;

        return (
          <motion.div
            key={index}
            className={`h-1.5 flex-1 rounded-full ${
              mastered
                ? "bg-accent"
                : active
                  ? "bg-accent/45"
                  : "bg-surface-muted"
            }`}
            animate={active ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
            transition={active ? { duration: 1.4, repeat: Infinity } : undefined}
          />
        );
      })}
    </div>
  );
}

function SessionStatsBar({
  knownCount,
  reviewCount,
  remaining,
  streak,
}: {
  knownCount: number;
  reviewCount: number;
  remaining: number;
  streak: number;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 text-[11px] font-medium">
      <div className="flex items-center gap-3 text-text-muted">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {knownCount} known
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          {reviewCount} review
        </span>
      </div>
      <div className="flex items-center gap-2">
        {streak >= 2 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-0.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent"
          >
            <HiSparkles className="text-[10px]" />
            {streak} streak
          </motion.span>
        )}
        <span className="tabular-nums text-text-subtle">{remaining} left</span>
      </div>
    </div>
  );
}

function StudyControls({
  isFirstCard,
  isFlipped,
  onReview,
  onFlip,
  onKnow,
}: {
  isFirstCard: boolean;
  isFlipped: boolean;
  onReview: () => void;
  onFlip: () => void;
  onKnow: () => void;
}) {
  return (
    <div className="w-full shrink-0 space-y-2">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReview}
          disabled={isFirstCard}
          aria-label="Review again"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-muted transition hover:border-text-subtle hover:text-text disabled:cursor-not-allowed disabled:opacity-35"
        >
          <HiX className="text-xl" />
        </button>

        <button
          type="button"
          onClick={onFlip}
          className={`flex h-14 min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border px-5 transition ${
            isFlipped
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border bg-surface text-text-muted hover:text-text"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isFlipped ? "Answer" : "Question"}
          </span>
          <span className="text-text-subtle/60">·</span>
          <span className="text-sm font-semibold text-text">Flip</span>
        </button>

        <button
          type="button"
          onClick={onKnow}
          aria-label="Got it"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent bg-accent text-accent-fg transition hover:bg-accent-hover active:scale-95"
        >
          <HiCheck className="text-2xl" />
        </button>
      </div>
      <p className="text-center text-[10px] text-text-subtle">
        Drag the card · ← review · → got it · Space flips
      </p>
    </div>
  );
}

function MasteryRing({ mastery }: { mastery: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (mastery / 100) * circumference;

  return (
    <div className="relative mx-auto h-32 w-32">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-surface-muted"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-accent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-3xl font-bold tabular-nums text-text"
        >
          {mastery}%
        </motion.span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-subtle">
          mastered
        </span>
      </div>
    </div>
  );
}

function CompletionScreen({
  stats,
  onStudyAgain,
  onNewVideo,
}: {
  stats: SessionStats;
  onStudyAgain: () => void;
  onNewVideo: () => void;
}) {
  const mastery = Math.round((stats.known / stats.total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex w-full flex-col items-center gap-5 rounded-2xl border border-border bg-surface/90 p-6 text-center shadow-sm backdrop-blur-sm"
    >
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Session complete
        </p>
        <h2 className="text-xl font-bold text-text">
          {mastery >= 80 ? "Crushed it." : mastery >= 50 ? "Solid run." : "Good start."}
        </h2>
      </div>

      <MasteryRing mastery={mastery} />

      <div className="grid w-full grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-border bg-bg px-3 py-3">
          <p className="text-2xl font-bold tabular-nums text-accent">{stats.known}</p>
          <p className="text-xs text-text-muted">Known first pass</p>
        </div>
        <div className="rounded-xl border border-border bg-bg px-3 py-3">
          <p className="text-2xl font-bold tabular-nums text-text">{stats.review}</p>
          <p className="text-xs text-text-muted">Need review</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStudyAgain}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
      >
        <HiRefresh />
        Run it back
      </button>
      <button
        type="button"
        onClick={onNewVideo}
        className="inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text"
      >
        <HiArrowLeft className="text-sm" />
        New video
      </button>
    </motion.div>
  );
}

export function CardStack({ deck, onRestart }: CardStackProps) {
  const total = deck.cards.length;

  const [queue, setQueue] = useState<Card[]>(deck.cards);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [streak, setStreak] = useState(0);
  const [cheer, setCheer] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const current = queue[0];
  const isFirstCard = currentPosition === 1;

  const stats: SessionStats = useMemo(
    () => ({ total, known: knownCount, review: reviewCount }),
    [total, knownCount, reviewCount],
  );

  const resetSession = useCallback(() => {
    setQueue(deck.cards);
    setKnownCount(0);
    setReviewCount(0);
    setCurrentPosition(1);
    setStreak(0);
    setCheer(null);
    setIsFlipped(false);
    setIsExiting(false);
    setExitDirection(null);
  }, [deck.cards]);

  const showCheer = useCallback((direction: "left" | "right") => {
    if (direction === "right") {
      const message = CHEERS[Math.floor(Math.random() * CHEERS.length)];
      setCheer(message);
      window.setTimeout(() => setCheer(null), 900);
    }
  }, []);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!current || isExiting) return;
      if (direction === "left" && isFirstCard) return;

      setExitDirection(direction);
      setIsExiting(true);
      setIsFlipped(false);
      showCheer(direction);

      window.setTimeout(() => {
        setQueue((prev) => {
          const [, ...rest] = prev;
          if (direction === "left") {
            return [...rest, current];
          }
          return rest;
        });

        if (direction === "right") {
          setKnownCount((count) => count + 1);
          setStreak((value) => value + 1);
        } else {
          setReviewCount((count) => count + 1);
          setStreak(0);
        }

        setCurrentPosition((position) => Math.min(position + 1, total));
        setIsExiting(false);
        setExitDirection(null);
      }, EXIT_MS);
    },
    [current, isExiting, isFirstCard, showCheer],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        setIsFlipped((prev) => !prev);
      }
      if (event.key === "ArrowRight") handleSwipe("right");
      if (event.key === "ArrowLeft" && !isFirstCard) handleSwipe("left");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSwipe, isFirstCard]);

  if (!current && !isExiting) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden">
        <CompletionScreen
          stats={stats}
          onStudyAgain={resetSession}
          onNewVideo={onRestart}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-hidden"
    >
      <div className="shrink-0 space-y-2">
        <SegmentProgress total={total} knownCount={knownCount} remaining={queue.length} />
        <SessionStatsBar
          knownCount={knownCount}
          reviewCount={reviewCount}
          remaining={queue.length}
          streak={streak}
        />
      </div>

      <div className="relative min-h-0 w-full flex-1">
        {queue.slice(0, 3).map((card, index) => {
          const isTop = index === 0;
          const cardKey = `${card.question}-${knownCount}-${reviewCount}-${queue.length}`;

          if (!isTop) {
            return (
              <motion.div
                key={`peek-${index}-${cardKey}`}
                className="absolute inset-x-3 rounded-2xl border border-border bg-surface-muted"
                style={{
                  top: index * 6,
                  bottom: 0,
                  zIndex: 10 - index,
                }}
                animate={{
                  scale: 1 - index * 0.035,
                  opacity: 0.55 - index * 0.12,
                }}
              />
            );
          }

          return (
            <FlashCard
              key={cardKey}
              card={card}
              cardIndex={Math.min(currentPosition, total)}
              totalCards={total}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped((prev) => !prev)}
              isExiting={isExiting}
              exitDirection={exitDirection}
              drag={!isExiting}
              onDragEnd={(_, info) => {
                if (info.offset.x > SWIPE_THRESHOLD) handleSwipe("right");
                else if (info.offset.x < -SWIPE_THRESHOLD && !isFirstCard) {
                  handleSwipe("left");
                }
              }}
              className="z-20"
            />
          );
        })}

        <AnimatePresence>
          {cheer && (
            <motion.p
              key={cheer}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent backdrop-blur-sm"
            >
              {cheer}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <StudyControls
        isFirstCard={isFirstCard}
        isFlipped={isFlipped}
        onReview={() => handleSwipe("left")}
        onFlip={() => setIsFlipped((prev) => !prev)}
        onKnow={() => handleSwipe("right")}
      />
    </motion.div>
  );
}
