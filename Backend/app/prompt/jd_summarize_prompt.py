from langchain_core.prompts import PromptTemplate

jd_summarize_prompt = PromptTemplate(
    template="""You are an expert ATS analyst.
Extract structured information from the Job Description below.

Return two things:
1. company - the hiring company's name exactly as it appears. If no company name is
   mentioned, use an empty string.
2. summary - a single dense, ATS-friendly paragraph capturing the job, targeting 150-220
   words (roughly 900-1400 characters). Prioritize the most important and most frequently
   emphasized requirements first if the JD is long enough that everything can't fit.

Rules for the summary:
- Include the job title, required skills, preferred/nice-to-have skills, core
  responsibilities, eligibility criteria, technologies, tools, programming languages,
  frameworks, certifications, and qualifications (education, years of experience) mentioned
  in the JD - prioritized by importance if space is limited.
- Preserve every important keyword and skill EXACTLY as written in the JD (spelling,
  casing, acronym form) - do not paraphrase technology or skill names. This paragraph is
  used for both keyword search and semantic embedding search, so exact terms matter as much
  as overall meaning.
- When the JD uses an acronym or its expanded form, include whichever form(s) the JD itself
  uses. Do not add a form the JD doesn't contain.
- Do not invent information. If trimming for length, drop the least job-critical details
  first (e.g. generic company boilerplate) before dropping skills, technologies, or
  responsibilities.
- Write in full, coherent sentences - not a keyword list, not bullet points, not
  semicolon-separated fragments.
- No bullet points, headings, markdown, symbols, or special formatting.
- Stay within 150-220 words. Do not pad to reach the target; stop once the JD's substance
  is covered.
- Output only the JSON object defined by the schema.

Job Description:
{jd_text}""",
    input_variables=["jd_text"],
)
