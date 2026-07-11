from utils.bm25_search import bm25_search

class SkillService:
    
    @staticmethod
    def optimize(jd_summary, base_resume):
        skills = []
        for experience in base_resume["experience"]:
            skills.extend(experience["skills"])
        
        for project in base_resume["projects"]:
            skills.extend(project["technologies_used"])
            
        for certification in base_resume["certifications"]:
            skills.extend(certification["skills"])
            
        skills.extend(base_resume["skills"])
        skills = list(dict.fromkeys(skills))
        
        return bm25_search(skills, jd_summary, n=len(skills))