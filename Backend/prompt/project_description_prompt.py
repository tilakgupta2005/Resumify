from langchain_core.prompts import PromptTemplate

project_description_prompt = PromptTemplate(
        template="""You are an expert ATS resume writer.
Rewrite each project description to better match the Job Description Summary.
Rules:
- Use ONLY the provided project information.
- Do NOT invent technologies, metrics, features, or achievements.
- Write exactly 3 bullet points for each project.
- Each bullet must be a single sentence (12–25 words) starting with a strong action verb.
- Naturally emphasize relevant JD keywords only when supported by the project.
- Highlight the project's impact where supported. Never fabricate metrics or outcomes.
- Keep the meaning and technologies unchanged.
- Return descriptions for all projects in the same order.
- Output only the structured response required by the schema.
- Output only the JSON object defined by the schema.

Job Description Summary:
{jd_summary}

Projects:
{projects}""",
        input_variables=["jd_summary", "projects"]
    )
