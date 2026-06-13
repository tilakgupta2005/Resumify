from core.config import JWT_SECRET_KEY, JWT_ALGORITHM
from fastapi import HTTPException, Request
from schema.users_schema import *
from schema.resume_schema import *
from core.database import supabase

def get_resume(user_id: str):
    try:
        response = supabase.rpc("get_resume", {"p_user_id": user_id}).execute()
        # if response.status_code == 200:
        return response.data
        # else:
            # raise HTTPException(status_code=500, detail="Error retrieving resume")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving resume: {str(e)}")
    
    
def create_base_cv(user: str, resume_data: ResumeDetails):
    # try:
    #     try:
    #         personal_info = {
    #             "user_id": user.get("user_id"),
    #             "first_name": resume_data.personal_info.name.first_name,
    #             "middle_name": resume_data.personal_info.name.middle_name,
    #             "last_name": resume_data.personal_info.name.last_name,
    #             "email": resume_data.personal_info.email,
    #             "phone": resume_data.personal_info.phone,
    #             "linkedin": resume_data.personal_info.linkedin,
    #             "github": resume_data.personal_info.github,
    #             "portfolio": resume_data.personal_info.portfolio
    #             }
    #         supabase.table("personal_info").insert(personal_info).execute()

    #     except Exception as e:
    #         raise HTTPException(status_code=500, detail=f"Error inserting personal info: {str(e)}")

    #     location_info = {
    #         "user_id": user.get("user_id"),
    #         "city": resume_data.personal_info.location.city,
    #         "state": resume_data.personal_info.location.state,
    #         "country": resume_data.personal_info.location.country,
    #         "address": resume_data.personal_info.location.address
    #     }
        
    #     for experience in resume_data.experience:
    #         experience_data = {
    #             "user_id": user.get("user_id"),
    #             "company_name": experience.company,
    #             "designation": experience.designation,
    #             "ctc": experience.ctc,
    #             "location": experience.location,
    #             "start_date": experience.start_date.isoformat(),
    #             "end_date": experience.end_date.isoformat() if experience.end_date else None,
    #             "skills": experience.skills,
    #         }
    #         supabase.table("experience").insert(experience_data).execute()
        
    #     for education in resume_data.education:
    #         education_data = {
    #             "user_id": user.get("user_id"),
    #             "institution_name": education.institution_name,
    #             "degree": education.degree,
    #             "field_of_study": education.field_of_study,
    #             "start_date": education.start_date.isoformat(),
    #             "end_date": education.end_date.isoformat() if education.end_date else None,
    #             "grade": education.grade,
    #         }
    #         supabase.table("education").insert(education_data).execute()

    #     for project in resume_data.projects:
    #         project_data = {
    #             "user_id": user.get("user_id"),
    #             "project_name": project.project_name,
    #             "team_size": project.team_size,
    #             "start_date": project.start_date.isoformat(),
    #             "end_date": project.end_date.isoformat() if project.end_date else None,
    #             "project_url": project.project_url,
    #             "technologies_used": project.technologies_used,
    #             "description": project.description
    #         }
    #         supabase.table("projects").insert(project_data).execute()

    #     for certification in resume_data.certifications:
    #         certification_data = {
    #             "user_id": user.get("user_id"),
    #             "title": certification.title,
    #             "issuing_organization": certification.issuing_organization,
    #             "issue_date": certification.issue_date.isoformat(),
    #             "skills": certification.skills
    #         }
    #         supabase.table("certifications").insert(certification_data).execute()

    #     for technical_participation in resume_data.technical_participation:
    #         technical_participation_data = {
    #             "user_id": user.get("user_id"),
    #             "technical_participation": technical_participation
    #         }
    #         supabase.table("technical_participation").insert(technical_participation_data).execute()

    #     for co_curricular in resume_data.co_curricular:
    #         co_curricular_data = {
    #             "user_id": user.get("user_id"),
    #             "co_curricular": co_curricular
    #         }
    #         supabase.table("co_curricular").insert(co_curricular_data).execute()

    #     for extra_curricular in resume_data.extra_curricular:
    #         extra_curricular_data = {
    #             "user_id": user.get("user_id"),
    #             "extra_curricular": extra_curricular
    #         }
    #         supabase.table("extra_curricular").insert(extra_curricular_data).execute()

    #     for achievement in resume_data.achievements:
    #         achievement_data = {
    #             "user_id": user.get("user_id"),
    #             "achievements": achievement
    #         }
    #         supabase.table("achievements").insert(achievement_data).execute()

    #     supabase.table("locations").insert(location_info).execute()
    #     supabase.table("skills").insert(resume_data.skills).execute()

    try:
        response = supabase.rpc(
    "save_resume",
    {
        "p_user_id": user["user_id"],
        "p_resume": resume_data.model_dump(mode="json")
    }
).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inserting personal info: {str(e)}")