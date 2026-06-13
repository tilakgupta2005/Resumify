from datetime import date
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Annotated, Optional, Literal, List
import re

class Name(BaseModel):
    first_name: Annotated[str, Field(..., min_length=3, max_length=50, title="First Name", description="The First Name of the user", example="John")]
    middle_name: Annotated[Optional[str], Field(None, min_length=3, max_length=50, title="Middle Name", description="The Middle Name of the user", example="Michael")]
    last_name: Annotated[str, Field(..., min_length=3, max_length=100, title="Last Name", description="The Last Name of the user", example="Doe")]

    @field_validator('first_name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z\s]+$", v):
            raise ValueError("First Name can only contain letters and spaces")
        return v.strip()
    
    @field_validator('middle_name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z\s]+$", v):
            raise ValueError("Middle Name can only contain letters and spaces")
        return v.strip()

    @field_validator('last_name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z\s]+$", v):
            raise ValueError("Last Name can only contain letters and spaces")
        return v.strip()

class Location(BaseModel):
    address: Annotated[Optional[str], Field(None, min_length=5, max_length=200, description="Street address including house/building number and street name.", example="123 Main Street")]
    city: Annotated[str, Field(..., min_length=2, max_length=100, description="City or locality name.", example="New York")]
    state: Annotated[str, Field(..., min_length=2, max_length=100, description="State, province, or region.", example="NY")]
    country: Annotated[str, Field(..., min_length=2, max_length=100, description="Country name.", example="USA")]
    postal_code: Annotated[str, Field(..., min_length=3, max_length=12, description="Postal code or ZIP code.", example="10001")]

    @field_validator("city", "state", "country")
    @classmethod
    def validate_location_names(cls, v: str) -> str:
        if not re.match(r"^[A-Za-z\s]+$", v):
            raise ValueError("Only letters and spaces are allowed.")
        return v.strip()

    @field_validator("address")
    @classmethod
    def validate_address(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Address cannot be empty.")
        return v.strip()

    @field_validator("postal_code")
    @classmethod
    def validate_postal_code(cls, v: str) -> str:
        # Supports common international postal code formats
        if not re.match(r"^[A-Za-z0-9\s\-]{3,12}$", v):
            raise ValueError("Invalid postal code format.")
        return v.strip().upper()

class PersonalInfo(BaseModel):
    name: Annotated[Name, Field(..., title="Full Name", description="The Full Name of the user", example={"first_name": "John", "middle_name": "Michael", "last_name": "Doe"})] 
    email: Annotated[EmailStr, Field(..., title="Email", description="The Contact Email address of the user", example="john.doe@example.com")]
    phone: Annotated[str, Field(..., title="Phone Number", description="Phone Number of the user", example="+1234567890")]
    location: Annotated[Location, Field(..., title="Location", description="Location of the User", example={"address": "456 Oak Avenue", "city": "Los Angeles", "state": "CA", "country": "USA", "postal_code": "90210"})]
    linkedin: Annotated[Optional[str], Field(None, title="LinkedIN", description="Linkedin URL of User", example="https://www.linkedin.com/in/username")]
    github: Annotated[Optional[str], Field(None, title="Github", description="Github URL of User",example="https://github.com/username")]
    portfolio: Annotated[Optional[str], Field(None, title="Portfolio", description="Portfolio URL of User", example="https://www.username.com")]

    @field_validator("linkedin")
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if not (v.startswith("https://www.linkedin.com/in/")):
            raise ValueError("URL must start with https://www.linkedin.com/in/")
        return v
    
    @field_validator("github")
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if not (v.startswith("https://github.com/")):
            raise ValueError("URL must start with https://github.com/")
        return v
    
    @field_validator("portfolio")
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("URL must start with http:// or https://")
        return v

    @field_validator('phone')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(r"^\+\d{1,3}\d{7,14}$" ,v):
            raise ValueError("Phone number must start with country code (e.g., +1) and contain only digits")
        return v.strip()

class Projects(BaseModel):
    project_name: Annotated[str, Field(..., max_length=150, title= "Project Name", description="Name of the project", example="E-commerce Website")]
    team_size: Annotated[int, Field(..., gt=0, title="Team Size", description="Number of team members involved in the project", example=4)]
    start_date: Annotated[date, Field(..., title="Start Date", description="Project start date in YYYY-MM-DD format", example="2021-01-01")]
    end_date: Annotated[Optional[date], Field(None, title="End Date", description="Project end date in YYYY-MM-DD format, or null if ongoing", example="2022-12-31")]
    project_url: Annotated[str, Field(..., title="Project URL", description="URL to the project repository or live site", example="https://github.com/username/e-commerce-website")]
    technologies_used: Annotated[List[str], Field(..., max_length=500, title="Technologies Used", description="Comma-separated list of technologies used in the project", example=["Python", "FastAPI"])]
    description: Annotated[str, Field(..., max_length=1000, title="Project Description", description="A brief description of the project", example="Developed a full-stack e-commerce website with user authentication and payment integration.")]
    
    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v, info):
        start_date = info.data.get("start_date")

        # If both exist, end_date must be after start_date
        if v and start_date and v < start_date:
            raise ValueError("end_date cannot be before start_date")

        return v
    
class Experience(BaseModel):
    company: Annotated[str, Field(..., max_length=150, title="Company Name", description="Name of the company", example="Google")]
    designation: Annotated[str, Field(..., max_length=100, title="Designation", description="Job title or role held at the company", example="Software Engineer")]
    ctc: Annotated[float, Field(..., gt=0, title="CTC", description="Cost to Company (CTC) in INR", example=1200000.00)]
    location: Annotated[str, Field(..., title="Location", description="Location of the company", example="Bangalore")]
    start_date: Annotated[date, Field(..., title="Start Date", description="Employment start date in YYYY-MM-DD format", example="2020-01-01")]
    end_date: Annotated[Optional[date], Field(None, title="End Date", description="Employment end date in YYYY-MM-DD format, or null if ongoing", example="2022-12-31")]
    skills: Annotated[List[str], Field(default=[], title="Skills", description="List of skills acquired in this experience", example=["Python", "FastAPI"])]

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v, info):
        start_date = info.data.get("start_date")

        # If both exist, end_date must be after start_date
        if v and start_date and v < start_date:
            raise ValueError("end_date cannot be before start_date")

        return v
    
class Education(BaseModel):
    institution_name: Annotated[str, Field(..., max_length=150, title="Institution Name", description="Name of the educational institution", example="Stanford University")]
    degree: Annotated[str, Field(..., max_length=100, title="Degree", description="Degree or qualification obtained", example="Bachelor of Science")]
    field_of_study: Annotated[str, Field(..., max_length=100, title="Field of Study", description="Field of study or major", example="Computer Science")]
    start_date: Annotated[date, Field(..., title="Start Date", description="Education start date in YYYY-MM-DD format", example="2016-09-01")]
    end_date: Annotated[Optional[date], Field(None, title="End Date", description="Education end date in YYYY-MM-DD format, or null if ongoing", example="2020-06-30")]
    grade: Annotated[Optional[str], Field(None, max_length=20, title="Grade", description="Grade or percentage obtained", example="3.8/4.0")]

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v, info):
        start_date = info.data.get("start_date")

        # If both exist, end_date must be after start_date
        if v and start_date and v < start_date:
            raise ValueError("end_date cannot be before start_date")

        return v
    
class Certification(BaseModel):
    title: Annotated[str, Field(..., max_length=150, title="Certification Name", description="Name of the certification", example="AWS Certified Solutions Architect")]
    issuing_organization: Annotated[Optional[str], Field(None, max_length=150, title="Issuer", description="Name of the certification issuer", example="Amazon Web Services")]
    issue_date: Annotated[Optional[date], Field(None, title="Issue Date", description="Date when the certification was issued in YYYY-MM-DD format", example="2022-01-01")]
    skills: Annotated[List[str], Field(default=[], title="Skills", description="List of skills acquired from this certification", example=["Cloud Architecture", "DevOps"])]
    
class ResumeDetails(BaseModel):
    personal_info: Annotated[
        PersonalInfo, 
        Field(..., title="Personal Information", description="Personal information of the user", example={"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com"})]
    skills: Annotated[
        List[str], 
        Field(default=[], title="Skills", description="List of skills possessed by the user", example=["Python", "Machine Learning"])]
    experience: Annotated[
        Optional[List[Experience]], 
        Field(default=[], title="Experience", description="List of work experiences", example=[{"company": "Google", "designation": "Software Engineer", "ctc": 1200000.00, "location_type": "bangalore", "start_date": "2020-01-01", "end_date": "2022-12-31", "skills": ["Python","FastAPI"]}])]
    education: Annotated[
        List[Education], 
        Field(default=[], title="Education", description="List of educational qualifications", example=[{"institution_name": "Stanford University", "degree": "Bachelor of Science", "field_of_study": "Computer Science", "start_date": "2016-09-01", "end_date": "2020-06-30", "grade": "3.8/4.0"}])]
    projects: Annotated[
        List[Projects], 
        Field(default=[], title="Projects", description="List of projects undertaken", example=[{"project_name": "E-commerce Website", "team_size": 5, "start_date": "2020-01-01", "end_date": "2022-12-31", "project_url": "https://github.com/johndoe/ecommerce", "technologies_used": ["React", "Node.js"], "description": "Developed a full-stack e-commerce website using React and Node.js"}])]
    certifications: Annotated[
        List[Certification], 
        Field(default=[], title="Certifications", description="List of certifications obtained", example=[{"title": "AWS Certified Solutions Architect", "issuing_organization": "Amazon Web Services", "issue_date": "2022-01-01", "skills": ["Cloud Architecture", "DevOps"]}])]
    technical_participation: Annotated[
        Optional[List[str]], 
        Field(None, max_length=500, title="Technical Participation", description="Description of technical participation in events, workshops, or competitions", example="Participated in Google Code Jam and Facebook Hacker Cup")]
    co_curricular: Annotated[
        Optional[List[str]], 
        Field(None, max_length=500, title="Co-Curricular Activities", description="Description of co-curricular activities", example="Member of the university coding club, participated in hackathons and coding competitions")]
    extra_curricular: Annotated[
        Optional[List[str]], 
        Field(None, max_length=500, title="Extra Curricular Activities", description="Description of extra curricular activities", example="Captain of the university basketball team")]
    achievements: Annotated[
        Optional[List[str]], 
        Field(None, max_length=500, title="Achievements", description="Description of achievements", example="Won first place in XYZ coding competition")]

