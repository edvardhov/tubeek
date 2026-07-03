"use client";

import type { AppError, BackendStatus } from "@/lib/types";
import { HiExclamationTriangle } from "react-icons/hi2";

interface ErrorPanelProps {
  error: AppError;
  backendStatus?: BackendStatus | null;
}

export function ErrorPanel({ error, backendStatus }: ErrorPanelProps) {
  const setupHints: Record<string, string[]> = {
    OLLAMA_UNREACHABLE: [
      "Install Ollama: https://ollama.com/download",
      "Start Ollama and ensure it is running on port 11434",
      "Run: make dev-backend",
    ],
    MODEL_MISSING: [
      `Pull the model: ollama pull ${backendStatus?.modelName ?? "llama3.1:8b"}`,
      "Verify with: ollama list",
    ],
    NO_TRANSCRIPT: [
      "Try a video with captions enabled",
      "Check that the video is public and not age-restricted",
    ],
    TRANSCRIPTS_DISABLED: [
      "This video has transcripts disabled by the creator",
      "Try a different video with auto-generated or manual captions",
    ],
    NETWORK_ERROR: [
      "Ensure the backend is running: make dev-backend",
      "Check NEXT_PUBLIC_API_URL points to http://localhost:8000",
    ],
  };

  const hints = setupHints[error.code] ?? [];

  return (
    <div className="w-full max-w-xl rounded-xl border border-danger/30 bg-danger-muted p-4">
      <div className="flex items-start gap-3">
        <HiExclamationTriangle className="mt-0.5 shrink-0 text-danger" />
        <div className="space-y-2">
          <p className="text-sm font-semibold text-danger">{error.message}</p>
          {error.detail && (
            <p className="text-xs text-text-muted">{error.detail}</p>
          )}
          {hints.length > 0 && (
            <ul className="list-inside list-disc space-y-1 text-xs text-text-muted">
              {hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
