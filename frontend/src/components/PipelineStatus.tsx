"use client";

import { motion } from "framer-motion";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";
import type { PipelineStep } from "@/lib/types";

const STEPS: { key: PipelineStep; label: string }[] = [
  { key: "fetching_transcript", label: "Fetching transcript" },
  { key: "generating_cards", label: "Writing Q&A from transcript" },
  { key: "complete", label: "Ready" },
];

interface PipelineStatusProps {
  step: PipelineStep;
}

function stepIndex(step: PipelineStep): number {
  if (step === "idle" || step === "error") return -1;
  return STEPS.findIndex((item) => item.key === step);
}

export function PipelineStatus({ step }: PipelineStatusProps) {
  if (step === "idle") return null;

  const current = stepIndex(step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl rounded-xl border border-border bg-surface p-4 shadow-sm"
    >
      <div className="space-y-3">
        {STEPS.map((item, index) => {
          const done = current > index;
          const active = current === index;
          const failed = step === "error" && index === Math.max(current, 0);

          return (
            <div key={item.key} className="flex items-center gap-3">
              {done ? (
                <HiCheckCircle className="text-accent" />
              ) : failed ? (
                <HiExclamationCircle className="text-danger" />
              ) : (
                <span
                  className={`inline-block h-4 w-4 rounded-full border-2 ${
                    active
                      ? "border-accent border-t-transparent animate-spin"
                      : "border-border"
                  }`}
                />
              )}
              <span
                className={`text-sm ${
                  done
                    ? "text-accent"
                    : active
                      ? "text-accent"
                      : failed
                        ? "text-danger"
                        : "text-text-subtle"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
