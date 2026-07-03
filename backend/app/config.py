from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"
    cors_origins: str = "http://localhost:3000"
    max_transcript_chars: int = 24000
    default_card_count: int = 10
    webshare_proxy_username: str | None = None
    webshare_proxy_password: str | None = None

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
