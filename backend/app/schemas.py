from enum import StrEnum

from pydantic import BaseModel, Field


class Card(BaseModel):
    question: str = Field(min_length=1)
    answer: str = Field(min_length=1)


class Deck(BaseModel):
    title: str = Field(min_length=1)
    cards: list[Card] = Field(min_length=3, max_length=20)


class DeckRequest(BaseModel):
    url: str = Field(min_length=1)
    card_count: int = Field(default=10, ge=3, le=20)
    language: str = Field(default="en", min_length=2, max_length=10)


class VideoMeta(BaseModel):
    video_id: str
    url: str


class DeckResponse(BaseModel):
    video: VideoMeta
    deck: Deck


class ErrorCode(StrEnum):
    INVALID_URL = "INVALID_URL"
    NO_TRANSCRIPT = "NO_TRANSCRIPT"
    TRANSCRIPTS_DISABLED = "TRANSCRIPTS_DISABLED"
    OLLAMA_UNREACHABLE = "OLLAMA_UNREACHABLE"
    MODEL_MISSING = "MODEL_MISSING"
    GENERATION_FAILED = "GENERATION_FAILED"


class ErrorResponse(BaseModel):
    code: ErrorCode
    message: str
    detail: str | None = None


class HealthStatus(StrEnum):
    OK = "ok"
    UNREACHABLE = "unreachable"
    MISSING = "missing"


class HealthResponse(BaseModel):
    status: HealthStatus
    ollama: HealthStatus
    model: HealthStatus
    model_name: str
    version: str = "0.1.0"
