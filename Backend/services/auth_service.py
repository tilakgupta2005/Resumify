from core.config import JWT_SECRET_KEY, JWT_ALGORITHM
from fastapi import HTTPException, Request
from schema.users import *
from core.database import get_connection
import bcrypt
from datetime import datetime, timedelta
import jwt


def check_user_exists(email: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE Email = %s"
    cursor.execute(query, (email,))
    existing_user = cursor.fetchone()
    cursor.close()
    conn.close()
    return existing_user is not None

def create_user(user_data: CreateUser):
    if check_user_exists(user_data.Email):
        raise HTTPException(status_code=400, detail="User with this email already exists")
    conn = get_connection()
    cursor = conn.cursor()
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    query = "INSERT INTO users (Name, Email, password) VALUES (%s, %s, %s)"
    cursor.execute(query, (user_data.Name, user_data.Email, hashed_password))
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Creating user: {user_data.Name}, Email: {user_data.Email}")

  
def login_user(user_data: LoginUser):
    if not check_user_exists(user_data.Email):
        raise HTTPException(status_code=404, detail="User with this email does not exist")
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE Email = %s"
    cursor.execute(query, (user_data.Email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    # Compare input password with stored hash
    if not bcrypt.checkpw(user_data.password.encode('utf-8'), user[3].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    expires_at = datetime.utcnow() + timedelta(days=7)
    token = jwt.encode({"user_email": user[2], "exp": expires_at}, JWT_SECRET_KEY, JWT_ALGORITHM)
        
    print(f"Logging in user with Email: {user_data.Email}")
    
    return token


def authenticate_user(Request: Request):
    try:
        auth_header = Request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="Authorization header missing")
        token = auth_header.split(" ")[-1]
        if token.count(".") != 2:
            raise HTTPException(status_code=401, detail="Invalid token format")
        data = jwt.decode(token, JWT_SECRET_KEY, JWT_ALGORITHM)
        user_email = data.get("user_email")
        if not check_user_exists(user_email):
            raise HTTPException(status_code=404, detail="User does not exist")
        return user_email
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")