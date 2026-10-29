
from functools import lru_cache
# pyrefly: ignore[missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Supabase / database -------------------------------------------------
    supabase_url: str
    supabase_key: str

    # --- Auth ------------------------------------------------------------
    jwt_secret_key: str
    jwt_algorithm: str = "ES256"
    jwks_cache_ttl_seconds: int = 300

    # --- LLM / embeddings provider ---------------------------------------
    # Which provider implementation to use. Adding a new provider only
    # means adding a branch in app/infra/ai_provider.py, not touching
    # any service.
    llm_provider: str = "google_genai"
    llm_model_name: str = "gemini-3.1-flash-lite"
    llm_temperature: float = 0.7

    embedding_provider: str = "huggingface"
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"

    # --- PDF rendering -----------------------------------------------------
    # No more hardcoded Windows path. Empty string == "auto-detect with
    # shutil.which('xelatex')" (see app/services/pdf_service.py).
    latex_executable_path: str = ""

    frontend_base_url: str = ""

    # --- App metadata -----------------------------------------------------
    app_name: str = "Resumify API"
    cors_allow_origins: str = ""
    @property
    def cors_origins_list(self) -> list[str]:
        origins = [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]
        default_origins = [
            "https://tryresumify.vercel.app",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ]
        for default in default_origins:
            if default not in origins:
                origins.append(default)
        return origins


@lru_cache
def get_settings() -> Settings:
    """Settings are parsed once and cached; every module should call this
    instead of instantiating Settings() itself."""
    return Settings()


