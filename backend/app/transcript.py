import re

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)
from youtube_transcript_api.proxies import WebshareProxyConfig

from app.config import settings
from app.exceptions import TubeekError
from app.schemas import ErrorCode

VIDEO_ID_PATTERNS = [
    re.compile(r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/shorts/)([a-zA-Z0-9_-]{11})"),
    re.compile(r"^([a-zA-Z0-9_-]{11})$"),
]


def parse_video_id(url: str) -> str:
    candidate = url.strip()
    for pattern in VIDEO_ID_PATTERNS:
        match = pattern.search(candidate)
        if match:
            return match.group(1)
    raise TubeekError(
        status_code=422,
        code=ErrorCode.INVALID_URL,
        message="Could not parse a valid YouTube video ID from the URL.",
        detail=url,
    )


def _build_api() -> YouTubeTranscriptApi:
    if settings.webshare_proxy_username and settings.webshare_proxy_password:
        return YouTubeTranscriptApi(
            proxy_config=WebshareProxyConfig(
                proxy_username=settings.webshare_proxy_username,
                proxy_password=settings.webshare_proxy_password,
            )
        )
    return YouTubeTranscriptApi()


def _join_transcript(fetched) -> str:
    return " ".join(snippet.text.strip() for snippet in fetched if snippet.text)


def _truncate(text: str, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(" ", 1)[0] + "..."


def fetch_transcript(video_id: str, language: str = "en") -> str:
    api = _build_api()

    try:
        transcript_list = api.list(video_id)
    except VideoUnavailable as exc:
        raise TubeekError(
            status_code=422,
            code=ErrorCode.INVALID_URL,
            message="Video is unavailable or does not exist.",
            detail=str(exc),
        ) from exc
    except TranscriptsDisabled as exc:
        raise TubeekError(
            status_code=422,
            code=ErrorCode.TRANSCRIPTS_DISABLED,
            message="Transcripts are disabled for this video.",
            detail=str(exc),
        ) from exc
    except NoTranscriptFound as exc:
        raise TubeekError(
            status_code=422,
            code=ErrorCode.NO_TRANSCRIPT,
            message="No transcript found for this video.",
            detail=str(exc),
        ) from exc

    try:
        transcript = transcript_list.find_transcript([language])
        entries = transcript.fetch()
        text = _join_transcript(entries)
    except NoTranscriptFound:
        try:
            transcript = transcript_list.find_generated_transcript([language])
            entries = transcript.fetch()
            text = _join_transcript(entries)
        except NoTranscriptFound:
            try:
                available = list(transcript_list)
                if not available:
                    raise TubeekError(
                        status_code=422,
                        code=ErrorCode.NO_TRANSCRIPT,
                        message="No transcript found for this video.",
                    )
                transcript = available[0]
                if language != transcript.language_code:
                    transcript = transcript.translate(language)
                entries = transcript.fetch()
                text = _join_transcript(entries)
            except NoTranscriptFound as exc:
                raise TubeekError(
                    status_code=422,
                    code=ErrorCode.NO_TRANSCRIPT,
                    message="No transcript found for this video.",
                    detail=str(exc),
                ) from exc

    text = text.strip()
    if not text:
        raise TubeekError(
            status_code=422,
            code=ErrorCode.NO_TRANSCRIPT,
            message="Transcript was empty.",
        )

    return _truncate(text, settings.max_transcript_chars)
