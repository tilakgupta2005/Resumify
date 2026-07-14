from langchain_core.prompts import PromptTemplate

experience_description_prompt = PromptTemplate(
    template="""You are an expert ATS resume writer.
Rewrite each work experience description to better match the Job Description Summary.

Step 1 - Before writing, scan the provided experience text for anything measurable that
already exists there: percentages, counts, durations, team size, dollar/revenue figures,
latency/performance numbers, user/customer counts, frequency (e.g. "daily", "weekly"), or
scale words (e.g. "across 5 teams", "10+ services"). If any of these exist, you MUST surface
them in the rewritten bullets. If none exist for a given experience, describe the qualitative
outcome or scope instead - do not invent a number to fill the gap.

Rules:
- Use ONLY the provided experience information.
- Do NOT invent technologies, metrics, responsibilities, achievements, or business impact.
- Write exactly 3 bullet points for each experience.
- Each bullet must be a single sentence (10-18 words) starting with a strong, varied action verb
  (e.g. Architected, Automated, Optimized, Reduced, Streamlined, Scaled, Migrated, Led). Do not
  repeat the same verb across bullets for the same experience.
- Never start a bullet with "Responsible for", "Worked on", "Helped with", "Duties included",
  or any first-person pronoun ("I", "my").
- Naturally emphasize relevant JD keywords only when supported by the experience. When the JD
  uses an acronym or its expanded form (e.g. "ML" vs "Machine Learning"), include both on first
  mention if the source experience supports it, so ATS keyword matching catches either form.
- Highlight the contribution or impact where supported. Never fabricate metrics or outcomes.
- Keep the role, technologies, and responsibilities factually accurate.
- Plain text only - no special characters, symbols, emojis, or markdown formatting.
- Return descriptions for all experiences in the same order.
- Output only the JSON object defined by the schema.

Job Description Summary:
{jd_summary}

Experiences:
{experiences}""",
    input_variables=["jd_summary", "experiences"]
)
