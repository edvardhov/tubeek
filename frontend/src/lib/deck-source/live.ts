import {
  API_URL,
  parseApiError,
  type DeckSource,
} from "@/lib/deck-source/index";
import type { BackendStatus, DeckResult, PipelineStep } from "@/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const liveSource: DeckSource = {
  async healthcheck(): Promise<BackendStatus> {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      if (!response.ok) {
        return {
          status: "unreachable",
          ollama: "unreachable",
          model: "missing",
          modelName: "llama3.1:8b",
        };
      }
      const data = await response.json();
      return {
        status: data.status,
        ollama: data.ollama,
        model: data.model,
        modelName: data.model_name,
      };
    } catch {
      return {
        status: "unreachable",
        ollama: "unreachable",
        model: "missing",
        modelName: "llama3.1:8b",
      };
    }
  },

  async generateDeck(
    url: string,
    onProgress?: (step: PipelineStep) => void,
  ): Promise<DeckResult> {
    onProgress?.("fetching_transcript");
    await delay(300);

    onProgress?.("generating_cards");

    const response = await fetch(`${API_URL}/api/decks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, card_count: 10, language: "en" }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw parseApiError(response.status, body);
    }

    const data = await response.json();
    onProgress?.("complete");
    return data as DeckResult;
  },
};
