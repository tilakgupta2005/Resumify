from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.services.auth_service import authenticate_user

bearer_scheme = HTTPBearer()


async def get_current_user(
    user: dict = Depends(authenticate_user),
    _credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    return user