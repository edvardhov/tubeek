import type {
  AppError,
  BackendStatus,
  DeckResult,
  PipelineStep,
} from "@/lib/types";

export interface DeckSource {
  generateDeck(
    url: string,
    onProgress?: (step: PipelineStep) => void,
  ): Promise<DeckResult>;
  healthcheck(): Promise<BackendStatus>;
}

export function parseApiError(status: number, body: unknown): AppError {
  if (
    body &&
    typeof body === "object" &&
    "detail" in body &&
    body.detail &&
    typeof body.detail === "object" &&
    "code" in body.detail
  ) {
    const detail = body.detail as {
      code: AppError["code"];
      message: string;
      detail?: string;
    };
    return {
      code: detail.code,
      message: detail.message,
      detail: detail.detail,
    };
  }

  return {
    code: status >= 500 ? "UNKNOWN" : "NETWORK_ERROR",
    message: "Request failed. Check your connection and try again.",
  };
}

export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE ?? "live";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
