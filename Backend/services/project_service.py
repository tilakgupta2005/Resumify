from core.database import supabase
from core.config import llm
from schema.generation_schema import projectdescription
from prompt.project_description_prompt import project_description_prompt

class ProjectService:

    @staticmethod
    def optimize(jd_summary, base_resume, user_id, jd_summary_embedding):
       result = supabase.rpc(
        "get_top_projects",
        {
            "p_user_id": user_id,
            "p_embedding": jd_summary_embedding
            }
            ).execute()
       
       if result.data:
        project_llm = llm.with_structured_output(projectdescription)

        project_description = (project_description_prompt | project_llm).invoke({"jd_summary": jd_summary, "projects": result.data})

        for original, rewritten in zip(result.data, project_description.projects):
            original["description"] = rewritten.project_description

        base_resume["projects"] = result.data