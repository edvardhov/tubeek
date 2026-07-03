import { assetPath, type DeckSource } from "@/lib/deck-source/index";
import type { AppError, BackendStatus, DeckResult, PipelineStep } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface SampleVideo {
  url: string;
  label: string;
  fixture: string;
}

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
    label: "Neural Networks",
    fixture: "neural-networks.json",
  },
  {
    url: "https://www.youtube.com/watch?v=zwibgNGe4aY",
    label: "DNA Explained",
    fixture: "dna-explained.json",
  },
  {
    url: "https://www.youtube.com/watch?v=e-P5IFTqB98",
    label: "Black Holes",
    fixture: "black-holes.json",
  },
];

const FALLBACK_FIXTURE = "sample-deck.json";

async function loadFixture(filename: string): Promise<DeckResult> {
  const path = assetPath(`/demo/${filename}`);
  const response = await fetch(path);
  if (!response.ok) {
    const error: AppError = {
      code: "UNKNOWN",
      message: "Demo deck could not be loaded.",
      detail: `Expected fixture at ${path}. Rebuild with NEXT_PUBLIC_APP_MODE=demo (see README).`,
    };
    throw error;
  }
  return response.json() as Promise<DeckResult>;
}

function resolveFixture(url: string): string {
  const match = SAMPLE_VIDEOS.find((sample) => sample.url === url);
  return match?.fixture ?? FALLBACK_FIXTURE;
}

export const demoSource: DeckSource = {
  async healthcheck(): Promise<BackendStatus> {
    return {
      status: "ok",
      ollama: "ok",
      model: "ok",
      modelName: "demo",
    };
  },

  async generateDeck(
    url: string,
    onProgress?: (step: PipelineStep) => void,
  ): Promise<DeckResult> {
    onProgress?.("fetching_transcript");
    await delay(1200);

    onProgress?.("generating_cards");
    await delay(1800);

    const fixture = resolveFixture(url);
    const result = await loadFixture(fixture);

    if (!SAMPLE_VIDEOS.some((sample) => sample.url === url)) {
      result.video = {
        video_id: "demo0000000",
        url,
      };
    }

    onProgress?.("complete");
    return result;
  },
};
