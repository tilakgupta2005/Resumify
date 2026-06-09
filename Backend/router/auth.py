from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from schema.users_schema import *
from core.database import supabase

router = APIRouter(prefix="/auth", tags=["auth"]) 

@router.post("/signup")
async def signup(user: CreateUser):
    try:
        auth = supabase.auth.sign_up({
            "email": user.Email,
            "password": user.password,
            "options": {
                "data": {
                    "name": user.Name
                }
            }
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return JSONResponse(content={"message": auth.user.id}, status_code=201)

@router.post("/login")
async def login(user: LoginUser):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.Email,
            "password": user.password
        })
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    return JSONResponse(content={
        "message": "Login successful", 
        "refresh_token": response.session.refresh_token,
        "user_id": response.user.id,
        "email": response.user.email,
        "access_token": response.session.access_token
    }, status_code=200)

