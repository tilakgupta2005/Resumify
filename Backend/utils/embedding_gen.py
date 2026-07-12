from core.config import embeddings

def get_embedding(text: str) -> list[float]:
    return embeddings.embed_query(text)
