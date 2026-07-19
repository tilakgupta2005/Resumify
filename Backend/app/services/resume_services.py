from fastapi import HTTPException
from app.schema.users_schema import *
from app.schema.resume_schema import *
from app.core.database import get_supabase_client
from app.core.exceptions import ResumeNotFoundError, ResumeSaveError

def get_resume(user_id: str) -> dict:
    try:
        response = get_supabase_client().rpc("get_resume", {"p_user_id": user_id}).execute()

    except Exception as e:
        raise ResumeSaveError(f"Error retrieving resume: {str(e)}")

    if not response.data:
        raise ResumeNotFoundError("No base resume found for this user. Create one first.")
    return response.data
    
    
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
        raise ResumeSaveError(f"Error {action} base resume: {str(e)}")


def create_base_cv(user: dict, resume_data: ResumeDetails) -> None:
    _save_resume(user, resume_data, action="creating")


def update_base_cv(user: dict, resume_data: ResumeDetails) -> None:
    _save_resume(user, resume_data, action="updating")