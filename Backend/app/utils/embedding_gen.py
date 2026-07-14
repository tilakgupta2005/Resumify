from app.core.ai_provider import embeddings

def get_embedding(text: str) -> list[float]:
    return embeddings.embed_query(text)
