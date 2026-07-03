import pytest

from app.exceptions import TubeekError
from app.schemas import Card, Deck, ErrorCode
from app.transcript import parse_video_id


@pytest.mark.parametrize(
    "url,expected",
    [
        ("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("https://youtu.be/dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("https://www.youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("https://www.youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("dQw4w9WgXcQ", "dQw4w9WgXcQ"),
    ],
)
def test_parse_video_id_valid(url: str, expected: str) -> None:
    assert parse_video_id(url) == expected


def test_parse_video_id_invalid() -> None:
    with pytest.raises(TubeekError) as exc_info:
        parse_video_id("not-a-url")
    assert exc_info.value.code == ErrorCode.INVALID_URL


def test_deck_schema_validation() -> None:
    deck = Deck(
        title="Sample Deck",
        cards=[
            Card(question="What is Tubeek?", answer="A local-first flashcard generator."),
            Card(question="What stack?", answer="Next.js and FastAPI."),
            Card(question="What LLM?", answer="Ollama with Llama 3."),
        ],
    )
    assert len(deck.cards) == 3
    assert deck.title == "Sample Deck"
