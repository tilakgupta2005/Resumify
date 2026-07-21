from langchain_core.prompts import PromptTemplate

professional_summary_prompt = PromptTemplate(
    template="""You are an expert ATS resume writer.
Write a compelling professional summary tailored to the Job Description Summary.
Step 1 - Before writing, scan the resume for: total years of experience (if derivable from
dates), any standout quantified achievement, and the 3-5 most JD-relevant technical skills
actually present in the resume. Use whichever of these exist; do not invent any that don't.

Rules:
- Use ONLY the provided resume information.
- Do NOT invent experience, responsibilities, skills, certifications, projects, technologies,
  metrics, or achievements.
- Strictly adhere to the character limit of 150-400 characters (including spaces).
- Begin directly with the candidate's role or technical expertise (e.g., "Software engineer
  with...", "Computer science graduate with...", "Machine learning engineer with..."). Include a
  years-of-experience figure here only if it can be derived from the resume's own dates.
- Do NOT begin with adjectives such as "Highly skilled", "Highly accomplished",
  "Results-oriented", "Dynamic", or "Seasoned".
- Naturally incorporate the most relevant ATS keywords from the Job Description, including both
  acronym and expanded forms where the resume supports it (e.g. "AWS" / "Amazon Web Services").
- Highlight the candidate's strongest technical skills, relevant experience, projects,
  certifications, and achievements.
- If a measurable achievement is explicitly present in the resume, include it naturally. Never
  fabricate numbers or outcomes.
- Plain text only - no special characters, symbols, emojis, or markdown formatting. No
  first-person pronouns.
- Maintain a professional, concise, and recruiter-friendly tone.
- Output only the JSON object defined by the schema.

Job Description Summary:
{jd_summary}

Resume Details:
{resume}
""",
    input_variables=["jd_summary", "resume"]
)