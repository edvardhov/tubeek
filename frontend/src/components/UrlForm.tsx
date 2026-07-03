"use client";

import { FaYoutube } from "react-icons/fa";

interface SampleVideo {
  url: string;
  label: string;
}

interface UrlFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSampleSelect?: (url: string) => void;
  loading?: boolean;
  sampleUrls?: SampleVideo[];
}

export function UrlForm({
  value,
  onChange,
  onSubmit,
  onSampleSelect,
  loading = false,
  sampleUrls = [],
}: UrlFormProps) {
  return (
    <div className="w-full max-w-xl space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <p className="mb-1 text-sm font-medium text-text">Paste a video to quiz from</p>
        <p className="mb-3 text-xs leading-relaxed text-text-muted">
          Tubeek pulls the transcript and builds questions about the content — each answer
          comes from what the video said.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-3"
        >
          <div className="relative">
            <FaYoutube className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-red-600 dark:text-red-400" />
            <input
              type="url"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-xl border border-border bg-bg py-3 pl-10 pr-4 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="w-full rounded-xl border border-accent bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Writing questions from transcript…" : "Generate Q&A from video"}
          </button>
        </form>
      </div>

      {sampleUrls.length > 0 && (
        <div className="space-y-3">
          <p className="text-center text-xs font-medium text-text-muted">
            Or jump in with a sample
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {sampleUrls.map((sample) => (
              <button
                key={sample.url}
                type="button"
                onClick={() => {
                  onChange(sample.url);
                  onSampleSelect?.(sample.url);
                }}
                disabled={loading}
                className="rounded-xl border border-border bg-surface px-3 py-3 text-left text-xs transition hover:border-accent hover:bg-surface-muted disabled:opacity-50"
              >
                <span className="block font-semibold text-text">{sample.label}</span>
                <span className="mt-1 block text-text-subtle">8 questions · 1-click</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
