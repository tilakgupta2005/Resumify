from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from schema.resume_schema import *
from services.auth_service import *
from services.create_base_cv import *
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/base_resume", tags=["base_resume"])

security = HTTPBearer()

@router.get("/base_resume", response_model=ResumeDetails)
def get_base_resume(user: str = Depends(authenticate_user), credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        get_resume_data = get_resume(user.get("user_id"))
        return JSONResponse(
        content={"message": "Base resume retrieved successfully", "data": get_resume_data}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving base resume: {str(e)}")

@router.post("/create_base_resume")
def create_base_resume(resume_details: ResumeDetails, user: str = Depends(authenticate_user), credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        create_base_cv(user, resume_details)
        return JSONResponse(content={"message": "Base resume created successfully"}, status_code=201)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating base resume: {str(e)}")    

@router.put("/update_base_resume")
def update_base_resume(resume_details: ResumeDetails, user: str = Depends(authenticate_user), credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        create_base_cv(user, resume_details)
        return JSONResponse(content={"message": "Base resume updated successfully"}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating base resume: {str(e)}")
