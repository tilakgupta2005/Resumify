from pydantic import BaseModel, Field
from typing import List
from langchain_core.output_parsers import PydanticOutputParser

class Project(BaseModel):
    project_name: str
    project_description: List[str] = Field(
        min_length=3,
        max_length=3
    )

class projectdescription(BaseModel):
    projects: List[Project]

class Experience(BaseModel):
    company_name: str
    company_description: List[str] = Field(
        min_length=3,
        max_length=3
    )

class experiencedescription(BaseModel):
    experiences: List[Experience] = Field(max_length=5)

class ProfessionalSummary(BaseModel):
    summary: str = Field(
        ...,
        min_length=100,
        max_length=600,
        description="ATS-friendly professional summary of 3-5 sentences."
    )

