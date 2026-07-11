from langchain_core.prompts import PromptTemplate

experience_description_prompt = PromptTemplate(
    template="""You are an expert ATS resume writer.
Rewrite each work experience description to better match the Job Description Summary.
Rules:
- Use ONLY the provided experience information.
- Do NOT invent technologies, metrics, responsibilities, achievements, or business impact.
- Write exactly 3 bullet points for each experience.
- Each bullet must be a single sentence (12–25 words) starting with a strong action verb.
- Naturally emphasize relevant JD keywords only when supported by the experience.
- Highlight the contribution or impact where supported. Never fabricate metrics or outcomes.
- Keep the role, technologies, and responsibilities factually accurate.
- Return descriptions for all experiences in the same order.
- Output only the JSON object defined by the schema.

Job Description Summary:
{jd_summary}

Experiences:
{experiences}""",
    input_variables=["jd_summary", "experiences"]
)
