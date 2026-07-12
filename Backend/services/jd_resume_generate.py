from langchain_core.output_parsers import StrOutputParser
from services.experience_service import ExperienceService
from utils.n_recent_item import get_recent_items
from utils.embedding_gen import get_embedding
from core.config import *
from services.create_base_cv import get_resume
from schema.generation_schema import ProfessionalSummary
from utils.bm25_search import bm25_search
from prompt.jd_summarize_prompt import jd_summarize_prompt
from prompt.professional_summary_prompt import professional_summary_prompt
from services.skill_service import SkillService
from services.experience_service import ExperienceService
from services.project_service import ProjectService


def jd_resume_json(jd_text: str, user_id: str):

    print(f"Getting details for user:{user_id}")

    jd_summary = (jd_summarize_prompt | llm | StrOutputParser()).invoke({"jd_text": jd_text})

    jd_summary_embedding = get_embedding(jd_summary)
    
    base_resume = get_resume(user_id)
   
    base_resume["skills"] = SkillService.optimize(jd_summary, base_resume)

    base_resume["experience"] = ExperienceService.optimize(jd_summary, base_resume)

    base_resume["education"] = get_recent_items(base_resume["education"], n=2)

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

    base_resume["projects"] = ProjectService.optimize(jd_summary, user_id, jd_summary_embedding)

    base_resume_no_personal_info = base_resume.copy()
    base_resume_no_personal_info.pop("personal_info", None)

    professional_summary_llm = llm.with_structured_output(ProfessionalSummary)

    professional_summary = (professional_summary_prompt | professional_summary_llm).invoke({"jd_summary": jd_summary, "resume": base_resume_no_personal_info})

    base_resume["professional_summary"] = professional_summary.summary

    print(f"Successful user resume data reterival for user:{user_id}")
    return base_resume
