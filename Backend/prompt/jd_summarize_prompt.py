from langchain_core.prompts import PromptTemplate

jd_summarize_prompt = PromptTemplate(
    template="""Summarize the following Job Description into a single ATS-friendly paragraph.
Rules:
- Include the company name, job title, required skills, preferred skills, responsibilities, eligibility, technologies, tools, programming languages, qualifications, and other important job requirements.
- Preserve all important ATS keywords exactly as they appear whenever possible.
- Do not invent, remove, or alter important information.
- Write a concise, information-dense paragraph optimized for semantic search and keyword matching.
- Do not use bullet points, headings, markdown, symbols, or special formatting.
- Output only the summary.

Job Description:
{jd_text}""",
    input_variables=["jd_text"]
)
