from app.services.experience_service import ExperienceService
from app.utils.n_recent_item import get_recent_items
from app.utils.embedding_gen import get_embedding
from app.services.resume_services import get_resume
from app.core.exceptions import ResumeNotFoundError
from app.schema.generation_schema import ProfessionalSummary, JdSummary
from app.utils.bm25_search import bm25_search
from app.prompt.jd_summarize_prompt import jd_summarize_prompt
from app.prompt.professional_summary_prompt import professional_summary_prompt
from app.services.skill_service import SkillService
from app.services.project_service import ProjectService
from datetime import datetime
import re


def jd_resume_json(jd_text: str, user_id: str, llm):

    print(f"Getting details for user:{user_id}")
    base_resume = get_resume(user_id)
    if not base_resume or not base_resume.get("personal_info"):
        raise ResumeNotFoundError("No base resume found for this user. Create one first.")

    jd_summary_llm = llm.with_structured_output(JdSummary)

    jd_summary_result = (jd_summarize_prompt | jd_summary_llm).invoke({"jd_text": jd_text})
    jd_summary = jd_summary_result.summary

    jd_summary_embedding = get_embedding(jd_summary)
   
    base_resume["skills"] = SkillService.optimize(jd_summary, base_resume)

    base_resume["experience"] = ExperienceService.optimize(jd_summary, base_resume, llm)

    if base_resume.get("education"):
        base_resume["education"] = get_recent_items(base_resume["education"], n=2)
        for edu in base_resume["education"]:
            if edu.get("start_date"):
                try:
                    edu["start_date"] = datetime.strptime(edu["start_date"], "%Y-%m-%d").strftime("%b %Y")
                except Exception:
                    pass
            if edu.get("end_date"):
                try:
                    edu["end_date"] = datetime.strptime(edu["end_date"], "%Y-%m-%d").strftime("%b %Y")
                except Exception:
                    pass
    else:
        base_resume["education"] = []

    if base_resume.get("certifications"):
        certifications = []
        for certificate in base_resume["certifications"]:
            certifications.append(certificate["title"])
        base_resume["certifications"] = bm25_search(certifications, jd_summary, n=5)

    search_config = {
        "technical_participation": 5,
        "co_curricular": 3,
        "extra_curricular": 3,
        "achievements": 5,
    }
    for key, n in search_config.items():
        if base_resume.get(key):
            base_resume[key] = bm25_search(
                base_resume[key],
                jd_summary,
                n=n
            )
    
    personal_info = base_resume.get("personal_info")
    if personal_info and isinstance(personal_info, dict):
        if personal_info.get("linkedin"):
            personal_info["front_linkedin"] = clean_url(personal_info["linkedin"])

        if personal_info.get("github"):
            personal_info["front_github"] = clean_url(personal_info["github"])
        
        if personal_info.get("portfolio"):
            personal_info["front_portfolio"] = clean_url(personal_info["portfolio"])

    base_resume["projects"] = ProjectService.optimize(jd_summary, user_id, jd_summary_embedding, llm)

    base_resume_no_personal_info = base_resume.copy()
    base_resume_no_personal_info.pop("personal_info", None)

    professional_summary_llm = llm.with_structured_output(ProfessionalSummary)

    professional_summary = (professional_summary_prompt | professional_summary_llm).invoke({"jd_summary": jd_summary, "resume": base_resume_no_personal_info})

    base_resume["professional_summary"] = professional_summary.summary

    print(f"Successful user resume data reterival for user:{user_id}")
    return base_resume, jd_summary_result.company


def clean_url(url: str) -> str:
    if not url:
        return ""

    return re.sub(r"^(https?://)?(www\.)?", "", str(url))