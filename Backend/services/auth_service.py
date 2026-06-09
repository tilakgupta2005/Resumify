from fastapi import HTTPException, Request
from core.config import SUPABASE_URL
from jose import jwt
import httpx

JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
AUDIENCE = "authenticated"


async def authenticate_user(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth header")

    token = auth_header.split(" ")[1]

    async with httpx.AsyncClient() as client:
        resp = await client.get(JWKS_URL)
        jwks = resp.json()

    try:
        # 1. Get token header
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]

        # 2. Find matching key
        key = None
        for k in jwks["keys"]:
            if k["kid"] == kid:
                key = k
                break

        if key is None:
            raise HTTPException(status_code=401, detail="Public key not found")

        # 3. Decode correctly
        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            audience=AUDIENCE
        )

        return {
            "user_id": payload["sub"],
            "email": payload.get("email")
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")

    except jwt.JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")