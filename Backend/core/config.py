import dotenv


dotenv.load_dotenv()

JWT_SECRET_KEY = dotenv.get_key('.env', 'JWT_SECRET_KEY')
JWT_ALGORITHM = dotenv.get_key('.env', 'JWT_ALGORITHM')