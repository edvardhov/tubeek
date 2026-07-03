export interface Card {
  question: string;
  answer: string;
}

export interface Deck {
  title: string;
  cards: Card[];
}

export interface VideoMeta {
  video_id: string;
  url: string;
}

export interface DeckResult {
  video: VideoMeta;
  deck: Deck;
}

export type PipelineStep =
  | "idle"
  | "fetching_transcript"
  | "generating_cards"
  | "complete"
  | "error";

export type HealthStatus = "ok" | "unreachable" | "missing";

export interface BackendStatus {
  status: HealthStatus;
  ollama: HealthStatus;
  model: HealthStatus;
  modelName: string;
}

export type ErrorCode =
  | "INVALID_URL"
  | "NO_TRANSCRIPT"
  | "TRANSCRIPTS_DISABLED"
  | "OLLAMA_UNREACHABLE"
  | "MODEL_MISSING"
  | "GENERATION_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export interface AppError {
  code: ErrorCode;
  message: string;
  detail?: string;
}

export interface SwipeDirection {
  direction: "left" | "right";
}

export interface SessionStats {
  total: number;
  known: number;
  review: number;
}
