import dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings


dotenv.load_dotenv()

SUPABASE_URL = dotenv.get_key('.env', 'SUPABASE_URL')
JWT_SECRET_KEY = dotenv.get_key('.env', 'JWT_SECRET_KEY')
JWT_ALGORITHM = dotenv.get_key('.env', 'JWT_ALGORITHM')


llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite", temperature=0.7)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")