from fastapi import HTTPException
from app.schema.users_schema import *
from app.schema.resume_schema import *
from app.core.database import get_supabase_client

def get_resume(user_id: str) -> dict:
    try:
        response = get_supabase_client().rpc("get_resume", {"p_user_id": user_id}).execute()
        # if response.status_code == 200:
        return response.data
        # else:
            # raise HTTPException(status_code=500, detail="Error retrieving resume")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving resume: {str(e)}")
    
    
def _save_resume(user: dict, resume_data: ResumeDetails, action: str) -> None:
    try:
        get_supabase_client().rpc(
            "save_resume",
            {
                "p_user_id": user["user_id"],
                "p_resume": resume_data.model_dump(mode="json"),
            },
        ).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error {action} base resume: {str(e)}")


def create_base_cv(user: dict, resume_data: ResumeDetails) -> None:
    _save_resume(user, resume_data, action="creating")


def update_base_cv(user: dict, resume_data: ResumeDetails) -> None:
    _save_resume(user, resume_data, action="updating")