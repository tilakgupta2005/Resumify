from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from schema.users import *
from services.auth_service import *

router = APIRouter(prefix="/auth", tags=["auth"]) 

@router.post("/signup")
async def signup(user: CreateUser):
    try:
        create_user(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return JSONResponse(content={"message": "User created successfully"}, status_code=201)

@router.post("/login")
async def login(user: LoginUser):
    try:
        token = login_user(user)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    return JSONResponse(content={"message": "Login successful", "token": token}, status_code=200)