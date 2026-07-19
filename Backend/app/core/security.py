from fastapi import Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.services.auth_service import authenticate_user
from app.core.ai_provider import get_llm

bearer_scheme = HTTPBearer()


async def get_current_user(
    user: dict = Depends(authenticate_user),
    _credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    return user


async def get_user_llm(
    x_google_api_key: str = Header(..., alias="X-Google-Api-Key"),
):
    if not x_google_api_key.strip():
        raise HTTPException(
            status_code=400,
            detail="Missing Google API key. Add it in settings and retry.",
        )
    return get_llm(x_google_api_key)