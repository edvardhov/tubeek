"use client";

import { useCallback, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { AppHeader } from "@/components/AppHeader";
import { DeckView } from "@/components/DeckView";
import { ErrorPanel } from "@/components/ErrorPanel";
import { getModeLabel, HowItWorks, LandingHero } from "@/components/LandingHero";
import { Logo } from "@/components/Logo";
import { PipelineStatus } from "@/components/PipelineStatus";
import { UrlForm } from "@/components/UrlForm";
import { getDeckSource, SAMPLE_VIDEOS } from "@/lib/deck-source/provider";
import type {
  AppError,
  BackendStatus,
  DeckResult,
  PipelineStep,
} from "@/lib/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<PipelineStep>("idle");
  const [result, setResult] = useState<DeckResult | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(
    null,
  );

  const deckSource = getDeckSource();
  const isLoading = step !== "idle" && step !== "error" && step !== "complete";

  useEffect(() => {
    deckSource.healthcheck().then(setBackendStatus);
  }, [deckSource]);

  const runGenerate = useCallback(
    async (targetUrl: string) => {
      if (!targetUrl.trim()) return;

      setError(null);
      setResult(null);
      setStep("fetching_transcript");

      try {
        const deck = await deckSource.generateDeck(targetUrl.trim(), setStep);
        setResult(deck);
      } catch (err) {
        setStep("error");
        if (err && typeof err === "object" && "code" in err && "message" in err) {
          setError(err as AppError);
        } else {
          setError({
            code: "UNKNOWN",
            message: "Something went wrong. Please try again.",
          });
        }
      }
    },
    [deckSource],
  );

  const handleGenerate = useCallback(() => {
    void runGenerate(url);
  }, [url, runGenerate]);

  const handleSampleSelect = useCallback(
    (sampleUrl: string) => {
      void runGenerate(sampleUrl);
    },
    [runGenerate],
  );

  const handleBack = useCallback(() => {
    setResult(null);
    setStep("idle");
    setError(null);
  }, []);

  if (result) {
    return (
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-bg">
        <DeckView result={result} onBack={handleBack} />
      </main>
    );
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-bg">
      <AppHeader left={<Logo markClassName="h-8 w-8" />} />
      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-4 py-2">
        <LandingHero modeLabel={getModeLabel()} />

        <UrlForm
          value={url}
          onChange={setUrl}
          onSubmit={handleGenerate}
          onSampleSelect={handleSampleSelect}
          loading={isLoading}
          sampleUrls={SAMPLE_VIDEOS.map((s) => ({
            url: s.url,
            label: s.label,
          }))}
        />

        <PipelineStatus step={step} />

        {error && <ErrorPanel error={error} backendStatus={backendStatus} />}

        {backendStatus && backendStatus.status !== "ok" && (
          <div className="w-full max-w-xl rounded-xl border border-border bg-surface p-4 text-xs text-text-muted">
            {backendStatus.ollama !== "ok" && (
              <p>Ollama offline — start it locally to generate live decks.</p>
            )}
            {backendStatus.ollama === "ok" && backendStatus.model !== "ok" && (
              <p>
                Model missing — run{" "}
                <code className="rounded bg-surface-muted px-1 py-0.5">
                  ollama pull {backendStatus.modelName}
                </code>
              </p>
            )}
          </div>
        )}

        {!isLoading && step === "idle" && !error && (
          <div className="how-it-works-section hidden w-full shrink-0 lg:block">
            <HowItWorks />
          </div>
        )}
      </div>

      <footer className="shrink-0 pb-3 pt-1 text-center text-xs text-text-subtle">
        <a
          href="https://github.com/edvardhov/tubeek"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition hover:text-text-muted"
        >
          <FaGithub />
          Open Source
        </a>
      </footer>
    </main>
  );
}
