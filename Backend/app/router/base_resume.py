from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.core.security import get_current_user
from app.schema.resume_schema import ResumeDetails
from app.services.resume_services import get_resume, create_base_cv, update_base_cv


router = APIRouter(prefix="/base_resume", tags=["base_resume"])


@router.get("/base_resume", response_model=ResumeDetails)
def get_base_resume(user: dict = Depends(get_current_user)):
    get_resume_data = get_resume(user.get("user_id"))
    return JSONResponse(content={"message": "Base resume retrieved successfully", "data": get_resume_data}, status_code=200)

@router.post("/create_base_resume")
def create_base_resume(resume_details: ResumeDetails, user: dict = Depends(get_current_user)):
    create_base_cv(user, resume_details)
    return JSONResponse(content={"message": "Base resume created successfully"}, status_code=201)

@router.put("/update_base_resume")
def update_base_resume(resume_details: ResumeDetails, user: dict = Depends(get_current_user)):
    update_base_cv(user, resume_details)
    return JSONResponse(content={"message": "Base resume updated successfully"}, status_code=200)