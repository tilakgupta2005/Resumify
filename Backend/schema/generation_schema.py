from typing import List
from pydantic import BaseModel, Field

class projectdescription(BaseModel):
    project1: List[str] = Field(..., min_length=3, max_length=3, description="List of 3 points describing project 1")
    project2: List[str] = Field(..., min_length=3, max_length=3, description="List of 3 points describing project 2")
    project3: List[str] = Field(..., min_length=3, max_length=3, description="List of 3 points describing project 3")