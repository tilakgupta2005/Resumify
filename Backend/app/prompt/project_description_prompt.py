from langchain_core.prompts import PromptTemplate

project_description_prompt = PromptTemplate(
    template="""You are an expert ATS resume writer.
Rewrite each project description to better match the Job Description Summary.

Step 1 - Before writing, scan the provided project text for anything measurable that already
exists there: performance numbers, accuracy/scores, dataset or user size, latency, percentage
improvements, number of features/modules, or scale words. If any exist, surface them in the
bullets. If none exist for a given project, describe the qualitative scope or outcome instead -
do not invent a number.

Rules:
- Use ONLY the provided project information.
- Do NOT invent technologies, metrics, features, or achievements.
- Write exactly 3 bullet points for each project.
- Each bullet must be a single sentence (10-18 words) starting with a strong, varied action verb.
  Do not repeat the same verb across bullets for the same project.
- Never start a bullet with "Responsible for", "Worked on", "Helped with", or a first-person
  pronoun.
- Naturally emphasize relevant JD keywords only when supported by the project. Include both the
  acronym and expanded form on first mention where supported (e.g. "NLP" / "Natural Language
  Processing"), to match ATS keyword search on either form.
- Highlight the project's impact where supported. Never fabricate metrics or outcomes.
- Keep the meaning and technologies unchanged.
- Plain text only - no special characters, symbols, emojis, or markdown formatting.
- Return descriptions for all projects in the same order.
- Output only the JSON object defined by the schema.

Job Description Summary:
{jd_summary}

Projects:
{projects}""",
    input_variables=["jd_summary", "projects"]
)