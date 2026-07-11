from langchain_core.prompts import PromptTemplate

professional_summary_prompt = PromptTemplate(
    template="""
You are an expert ATS resume writer.
Write a compelling professional summary tailored to the Job Description Summary.
Rules:
- Use ONLY the provided resume information.
- Do NOT invent experience, responsibilities, skills, certifications, projects, technologies, metrics, or achievements.
- Strictly adhere to the character limit of 150-500 characters (including spaces).
- Begin by summarizing the candidate's technical profile and primary expertise.
- Naturally incorporate the most relevant ATS keywords from the Job Description.
- Highlight the candidate's strongest technical skills, relevant experience, projects, certifications, and achievements.
- Do NOT begin with adjectives such as "Highly skilled", "Highly accomplished", "Results-oriented", "Dynamic", or "Seasoned".
- Begin directly with the candidate's role or technical expertise (e.g., "Software engineer with...", "Computer science graduate with...", "Machine learning engineer with...").
- Emphasize technical contributions and business impact only when supported by the resume.
- If measurable achievements are explicitly provided, include them naturally. Never fabricate numbers or outcomes.
- Maintain a professional, concise, and recruiter-friendly tone.
- Output only the JSON object defined by the schema.

Job Description Summary:
{jd_summary}

Resume Details:
{resume}
""",
    input_variables=["jd_summary", "resume"]
)
