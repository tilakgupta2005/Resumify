from app.core.config import get_settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from app.core.exceptions import InvalidGoogleApiKeyError, GoogleApiQuotaError
from google.genai.errors import ClientError, ServerError
import re
from langchain_google_genai.chat_models import ChatGoogleGenerativeAIError


class SafeChatGoogleGenerativeAI(ChatGoogleGenerativeAI):
    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        try:
            return super()._generate(messages, stop=stop, run_manager=run_manager, **kwargs)
        except (ClientError, ChatGoogleGenerativeAIError, ServerError) as e:
            msg = str(e)

            if "API_KEY_INVALID" in msg or "API key not valid" in msg:
                raise InvalidGoogleApiKeyError(
                    "Your Google API key was rejected. Please check it and try again."
                ) from e

            if "RESOURCE_EXHAUSTED" in msg or "429" in msg:
                retry_after = None
                match = re.search(r'"retryDelay":\s*"(\d+)s"', msg)
                if match:
                    retry_after = int(match.group(1))
                friendly = (
                    "Your Google API key has hit its daily free-tier limit. Try again after it resets, or use a different key."
                    if "PerDay" in msg else
                    f"Your Google API key is rate-limited. Try again in about {retry_after} seconds." if retry_after else
                    "Your Google API key hit its rate limit. Please try again shortly."
                )
                raise GoogleApiQuotaError(friendly, retry_after_seconds=retry_after) from e

            raise
        except ServerError as e:
            raise GoogleApiQuotaError("Google's API is temporarily unavailable. Please try again shortly.") from e


def get_llm(api_key: str) -> ChatGoogleGenerativeAI:
    if not api_key or not api_key.strip():
        raise InvalidGoogleApiKeyError("Google API key is required")
    return SafeChatGoogleGenerativeAI(model=settings.llm_model_name, temperature=settings.llm_temperature, google_api_key=api_key)
settings = get_settings()


print("Loading Embedding Model...")
embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
print("Embedding model loaded successfully.")