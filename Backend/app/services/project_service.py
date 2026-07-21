from app.core.database import get_supabase_client
from app.schema.generation_schema import projectdescription
from app.prompt.project_description_prompt import project_description_prompt
from app.utils.n_recent_item import get_recent_items
from datetime import datetime


class ProjectService:

    @staticmethod
    def optimize(jd_summary, user_id, jd_summary_embedding, llm):
       result = get_supabase_client().rpc(
        "get_top_projects",
        {
            "p_user_id": user_id,
            "p_embedding": jd_summary_embedding,
            "p_limit": 3
            }
            ).execute()
       
       if result.data:
        project_llm = llm.with_structured_output(projectdescription)

        project_description = (project_description_prompt | project_llm).invoke({"jd_summary": jd_summary, "projects": result.data})

        for original, rewritten in zip(result.data, project_description.projects):
            original["start_date"] = datetime.strptime(original["start_date"], "%Y-%m-%d").strftime("%b %Y")
            if original["end_date"]:
                original["end_date"] = datetime.strptime(original["end_date"], "%Y-%m-%d").strftime("%b %Y")
            original["description"] = rewritten.project_description

        return get_recent_items(result.data, 3)
       
       return[]