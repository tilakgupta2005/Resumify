from prompt.experience_description_prompt import experience_description_prompt
from utils.n_recent_item import get_recent_items
from schema.generation_schema import experiencedescription
from core.config import llm

class ExperienceService:

    @staticmethod
    def optimize(jd_summary, base_resume):
        exp = get_recent_items(base_resume["experience"], n=5)

        if exp:
            experience_llm = llm.with_structured_output(experiencedescription)
            experience_description = (experience_description_prompt | experience_llm).invoke({"jd_summary": jd_summary, "experiences": exp})

        for original, rewritten in zip(exp, experience_description.experiences):
            original["description"] = rewritten.company_description

        return exp