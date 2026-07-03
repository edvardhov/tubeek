import json

import httpx
import ollama

from app.config import settings
from app.exceptions import TubeekError
from app.schemas import Deck, ErrorCode


def _build_prompt(transcript: str, card_count: int) -> str:
    return f"""You are an expert educator. Read the YouTube video transcript below \
and create exactly {card_count} educational flashcards.

Rules:
- Each flashcard must test a distinct concept from the transcript.
- Questions should be concise and specific.
- Answers should be accurate, self-contained, and 1-3 sentences.
- Do not invent facts not supported by the transcript.
- Return JSON matching the provided schema with a descriptive deck title.

Transcript:
{transcript}
"""


def _ollama_client() -> ollama.Client:
    return ollama.Client(host=settings.ollama_host)


def check_ollama_health() -> tuple[str, str]:
    """Returns (ollama_status, model_status)."""
    try:
        with httpx.Client(timeout=5.0) as client:
            response = client.get(f"{settings.ollama_host.rstrip('/')}/api/tags")
            response.raise_for_status()
            tags = response.json().get("models", [])
            full_names = {tag.get("name", "") for tag in tags if tag.get("name")}
            model_names = full_names | {name.split(":")[0] for name in full_names}
            target = settings.ollama_model
            target_base = target.split(":")[0]
            if target in model_names or target_base in model_names:
                return "ok", "ok"
            return "ok", "missing"
    except (httpx.HTTPError, json.JSONDecodeError):
        return "unreachable", "missing"


def generate_deck(transcript: str, card_count: int) -> Deck:
    ollama_status, model_status = check_ollama_health()
    if ollama_status == "unreachable":
        raise TubeekError(
            status_code=503,
            code=ErrorCode.OLLAMA_UNREACHABLE,
            message="Ollama is not reachable. Start Ollama locally and retry.",
            detail=settings.ollama_host,
        )
    if model_status == "missing":
        raise TubeekError(
            status_code=503,
            code=ErrorCode.MODEL_MISSING,
            message=f"Model '{settings.ollama_model}' is not installed.",
            detail=f"Run: ollama pull {settings.ollama_model}",
        )

    client = _ollama_client()
    prompt = _build_prompt(transcript, card_count)
    schema = Deck.model_json_schema()

    last_error: Exception | None = None
    for _ in range(2):
        try:
            response = client.generate(
                model=settings.ollama_model,
                prompt=prompt,
                format=schema,
                options={"temperature": 0.2},
            )
            content = response.get("response", "")
            deck = Deck.model_validate_json(content)
            if len(deck.cards) > card_count:
                deck.cards = deck.cards[:card_count]
            return deck
        except Exception as exc:
            last_error = exc

    raise TubeekError(
        status_code=502,
        code=ErrorCode.GENERATION_FAILED,
        message="Failed to generate flashcards from the transcript.",
        detail=str(last_error) if last_error else None,
    )
