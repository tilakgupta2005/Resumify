from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from app.core.security import get_current_user
from app.services.jd_resume_generate import jd_resume_json
from app.services.pdf_service import render_pdf, cleanup_file

router = APIRouter(prefix="/jd_resume", tags=["jd_resume"])


@router.post("/generate-resume")
async def generate_resume(jd_text: str, background_tasks: BackgroundTasks, user: dict = Depends(get_current_user)):
    try:
        jd_resume_data, company = jd_resume_json(jd_text, user.get("user_id"))

        # Generates the PDF and returns its file path
        pdf_path, pdf_name, output_folder = render_pdf(jd_resume_data, company)

        background_tasks.add_task(cleanup_file, output_folder)

        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename=pdf_name,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating resume: {str(e)}"
        )