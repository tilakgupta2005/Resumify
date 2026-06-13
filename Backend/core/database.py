from supabase import create_client, Client
import dotenv 

dotenv.load_dotenv()

supabase: Client = create_client(
    dotenv.get_key('.env', 'SUPABASE_URL'),
    dotenv.get_key('.env', 'SUPABASE_KEY')
)