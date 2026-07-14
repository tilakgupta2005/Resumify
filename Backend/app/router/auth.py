from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.schema.users_schema import CreateUser, LoginUser, ForgotPasswordRequest, ResetPasswordRequest
from app.core.database import get_supabase_client
from app.core.config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"]) 

settings = get_settings()

@router.post("/signup")
async def signup(user: CreateUser):
    try:
        auth = get_supabase_client().auth.sign_up({
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
        response = get_supabase_client().auth.sign_in_with_password({
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

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    try:
        get_supabase_client().auth.reset_password_email(
            data.email,
            {
                "redirect_to": f"{settings.frontend_base_url}/reset-password"
            }
        )

        return {
            "message": "Password reset email sent. Check your inbox."
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    print("reseting password")
    try:
        supabase = get_supabase_client()

        # Authenticate using the recovery tokens
        supabase.auth.set_session(
            data.access_token,
            data.refresh_token
        )

        # Update the password
        supabase.auth.update_user({
            "password": data.password
        })

        return {
            "message": "Password updated successfully"
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))