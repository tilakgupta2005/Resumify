import dotenv


dotenv.load_dotenv()

SUPABASE_URL = dotenv.get_key('.env', 'SUPABASE_URL')
JWT_SECRET_KEY = dotenv.get_key('.env', 'JWT_SECRET_KEY')
JWT_ALGORITHM = dotenv.get_key('.env', 'JWT_ALGORITHM')