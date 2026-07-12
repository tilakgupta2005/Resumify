from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from services.auth_service import *
from services.create_base_cv import *
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.jd_resume_generate import jd_resume_json
from services.pdf_render import render_pdf

router = APIRouter(prefix="/jd_resume", tags=["jd_resume"])

security = HTTPBearer()

@router.post("/generate", response_model=ResumeDetails)
def get_base_resume(jd_text: str, user: str = Depends(authenticate_user), credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        jd_resume_data = jd_resume_json(jd_text, user.get("user_id"))
        path = render_pdf(jd_resume_data)
        return JSONResponse(
        content={"message": "jd based resume generated successfully", "data": path}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving base resume: {str(e)}")