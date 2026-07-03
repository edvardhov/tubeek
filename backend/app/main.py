from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.generator import check_ollama_health, generate_deck
from app.schemas import (
    DeckRequest,
    DeckResponse,
    ErrorResponse,
    HealthResponse,
    HealthStatus,
    VideoMeta,
)
from app.transcript import fetch_transcript, parse_video_id

app = FastAPI(
    title="Tubeek API",
    description="YouTube transcript to flashcard deck pipeline",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    ollama_status, model_status = check_ollama_health()
    overall = HealthStatus.OK
    if ollama_status != "ok" or model_status != "ok":
        overall = HealthStatus.UNREACHABLE if ollama_status != "ok" else HealthStatus.MISSING

    return HealthResponse(
        status=overall,
        ollama=HealthStatus(ollama_status),
        model=HealthStatus(model_status),
        model_name=settings.ollama_model,
    )


@app.post(
    "/api/decks",
    response_model=DeckResponse,
    responses={
        422: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
)
async def create_deck(request: DeckRequest) -> DeckResponse:
    video_id = parse_video_id(request.url)
    transcript = fetch_transcript(video_id, language=request.language)
    deck = generate_deck(transcript, card_count=request.card_count)

    return DeckResponse(
        video=VideoMeta(video_id=video_id, url=request.url.strip()),
        deck=deck,
    )


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": "tubeek-backend", "docs": "/docs"}
