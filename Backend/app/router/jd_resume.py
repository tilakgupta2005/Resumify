from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from app.core.ai_provider import InvalidGoogleApiKeyError, GoogleApiQuotaError
from app.core.security import get_current_user, get_user_llm
from app.services.jd_resume_generate import jd_resume_json
from app.services.pdf_service import render_pdf, cleanup_file

router = APIRouter(prefix="/jd_resume", tags=["jd_resume"])

@router.post("/generate-resume")
async def generate_resume(jd_text: str, background_tasks: BackgroundTasks, llm=Depends(get_user_llm), user: dict = Depends(get_current_user)):
    try:
        jd_resume_data, company = jd_resume_json(jd_text, user.get("user_id"), llm)
        pdf_path, pdf_name, output_folder = render_pdf(jd_resume_data, company)
        background_tasks.add_task(cleanup_file, output_folder)
        return FileResponse(path=pdf_path, media_type="application/pdf", filename=pdf_name)
    finally:
        client = getattr(llm, "client", None) or getattr(llm, "api_client", None)
        if client is not None and hasattr(client, "close"):
            client.close()
        del llm   

@router.post("/validate_key")
async def validate_key(llm = Depends(get_user_llm)):
    llm.invoke("ping", max_output_tokens=5)
    return {"valid": True}