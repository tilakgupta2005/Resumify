from langchain_huggingface import HuggingFaceEmbeddings
import dotenv

HUGGINGFACEHUB_API_TOKEN = dotenv.get_key('.env', 'HUGGINGFACEHUB_API_TOKEN')

embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

def get_embedding(text: str) -> list[float]:
    return embeddings.embed_query(text)


print(get_embedding("want a chat bot developer with experience in python and langchain"))
