from unittest.mock import MagicMock, patch

from app.generator import check_ollama_health


def test_check_ollama_health_matches_model_base_name() -> None:
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "models": [{"name": "llama3.1:8b"}, {"name": "nomic-embed-text:latest"}]
    }
    mock_response.raise_for_status = MagicMock()

    with patch("app.generator.settings") as mock_settings:
        mock_settings.ollama_host = "http://localhost:11434"
        mock_settings.ollama_model = "llama3.1:8b"
        with patch("app.generator.httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = mock_response
            ollama_status, model_status = check_ollama_health()

    assert ollama_status == "ok"
    assert model_status == "ok"


def test_check_ollama_health_missing_model() -> None:
    mock_response = MagicMock()
    mock_response.json.return_value = {"models": [{"name": "other-model:latest"}]}
    mock_response.raise_for_status = MagicMock()

    with patch("app.generator.settings") as mock_settings:
        mock_settings.ollama_host = "http://localhost:11434"
        mock_settings.ollama_model = "llama3.1:8b"
        with patch("app.generator.httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = mock_response
            ollama_status, model_status = check_ollama_health()

    assert ollama_status == "ok"
    assert model_status == "missing"
