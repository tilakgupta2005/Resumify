from langchain_core.output_parsers import StrOutputParser
from services.experience_service import ExperienceService
from utils.n_recent_item import get_recent_items
from utils.embedding_gen import get_embedding
from core.config import *
from services.create_base_cv import get_resume
from schema.generation_schema import ProfessionalSummary
from utils.bm25_search import bm25_search
from prompt.jd_summarize_prompt import jd_summarize_prompt
from prompt.professional_summary_prompt import professional_summary_prompt
from services.skill_service import SkillService
from services.experience_service import ExperienceService
from services.project_service import ProjectService


def final_resume(jd_text: str, user_id: str):

    jd_summary = (jd_summarize_prompt | llm | StrOutputParser()).invoke({"jd_text": jd_text})

    jd_summary_embedding = get_embedding(jd_summary)
    
    base_resume = get_resume(user_id)
   
    base_resume["skills"] = SkillService.optimize(jd_summary, base_resume)

    base_resume["experience"] = ExperienceService.optimize(jd_summary, base_resume)

    base_resume["education"] = get_recent_items(base_resume["education"], n=2)

    if base_resume.get("certifications"):
        certifications = []
        for certificate in base_resume["certifications"]:
            certifications.append(certificate["title"])
        base_resume["certifications"] = bm25_search(certifications, jd_summary, n=5)

    search_config = {
    "technical_participation": 5,
    "co_curricular": 3,
    "extra_curricular": 3,
    "achievements": 5,
}
    for key, n in search_config.items():
        if base_resume.get(key):
            base_resume[key] = bm25_search(
                base_resume[key],
                jd_summary,
                n=n
            )

    base_resume["projects"] = ProjectService.optimize(jd_summary, user_id, jd_summary_embedding)

    base_resume_no_personal_info = base_resume.copy()
    base_resume_no_personal_info.pop("personal_info", None)

    professional_summary_llm = llm.with_structured_output(ProfessionalSummary)

    professional_summary = (professional_summary_prompt | professional_summary_llm).invoke({"jd_summary": jd_summary, "resume": base_resume_no_personal_info})

    base_resume["professional_summary"] = professional_summary.summary

    print(base_resume)
    return base_resume


jd_text = """Consulting/Technical/Software Engineer Trainee

CISCO

a month ago
On Campus

Employment Type
Internship + Full-Time


Position Type
Internship + Full Time


Location
Bengaluru


Cost to Company
CTC: INR 20,00,000


Stipend
Stipend: INR 1,00,000


Good to have Skill(s)
▪ Strong analytical and problem-solving skills with ability to troubleshoot technical problems.

▪ Passionate about networking information technology or computer science.

▪ Ability to multi-task self-start and work in a fast-paced team environment and the ability to work independently.


Description
Job Description – Consulting/Technical/Software Engineer Trainee

In Cisco, we have an outstanding opportunity where we actually get to use the technology we build!
We are Innovators -We drive innovation to propel business transformation while maintaining operational quality.
We are Accelerators -We accelerate digital solutions to generate cost savings and efficiency gains for enterprise growth and success.
We are Transformers -As customer zero, we transform the customer experience by being our own customer first with agility, quality, and security, we continuously deliver business outcomes for our clients.
What You’ll Do -Team Description We are a force multiplier for Cisco and our Partners to simplify digital transformation for our customers through unmatched technical expertise, relevant insights, and relentless automation at global scale for major Cisco strategic architecture plays to our service provider and enterprise customers worldwide. A key focus for the team is to analyze every aspect of software solution in detail. This community is an eminent place for information related to skill, projects, activities, customer impact stories and technology we are engaged in. We are committed to build the successful implementation of software solutions, maximize the value of the investment, and address the critical business needs for better engagement of our team with customers and deliver our services in an exquisite manner. You will have the opportunity to work closely with seasoned software engineers and architects developing software and tools in support of technology platform, infrastructure, SaaS applications, databases and others win a cloud-native environment.
Participate in a variety of professional development opportunities, network with senior executive leadership team, give back to your local community, and socialize with a community of global technologists. We provide a great learning experience and also have developed a program to help our University Hires transition to true professionals.
Solid fundamentals of Data Structures, Algorithms, Object oriented design and programming
Strong knowledge on Unix/Linux systems and Unix scripting
A good understanding of Cloud based application development (using Docker, Kubernetes, AWS services) and think about security and scalability
Solid understanding of computer science fundamentals and software engineering with an aptitude for learning new technologies
Strong knowledge of programming and scripting languages like JAVA, Python, Scala, GoLong etc
Strong testing inclination to ensure programs are comprehensive and well tested for all use cases
Exposure to debugging application programs along with development and debugging tools
Familiar with more than one development environment, well-versed with at least one
Interest in User experience and User interface design and development (MEAN Stack)
Possess creative problem solving skills and excellent troubleshooting/debugging skills
Familiar with CI/CD tools namely GIT, GitHub, Jenkins,


Who You Are -

The requirement is for 2027 passout only.
Fluent in English (verbal and written).
Passionate about networking, information technology or computer science.
Strong analytical and problem-solving skills with ability to troubleshoot technical problems.
Ability to multi-task, self-start, and work in a fast-paced team environment and the ability to work independently.


Why Cisco - 

WeAreCisco, where each person is unique, but we bring our talents to work as a team and make a difference powering an inclusive future for all.
We embrace digital, and help our customers implement change in their digital businesses. Some may think we’re “old” (39 years strong) and only about hardware, but we’re also a software company. And a security company. We even invented an intuitive network that adapts, predicts, learns and protects. No other company can do what we do – you can’t put us in a box!
But “Digital Transformation” is an empty buzz phrase without a culture that allows for innovation, creativity, and yes, even failure (if you learn from it.)
Day to day, we focus on the give and take. We give our best, give our egos a break, and give of ourselves (because giving back is built into our DNA.) We take accountability, bold steps, and take difference to heart. Because without diversity of thought and a dedication to equality for all, there is no moving forward.
So, you have colorful hair? Don’t care. Tattoos? Show off your ink. Like polka dots? That’s cool. Pop culture enthusiast? Many of us are. Passion for technology and world changing? Be you, with us!
Cisco's greatest strength is its people. To ensure that we hire the best talent in the right way, we follow a strict hiring process, and recently, Cisco has been made aware of fraudulent recruiters claiming to be from the company. Please be advised that any communication from Cisco recruiters about careers will:
· be in direct response to an application you have submitted through the company jobs site
· begin with screening or an interview
· originate from a Cisco email address, and
· be conducted across email, phone, or WebEx
Cisco will never make a job offer without conducting an interview process or ask candidates for payments in any way. All formal applications status can be viewed through https://jobs.cisco.com, with all offers coming from Cisco Recruiting mailer with directions to access via a secure portal. If you have been requested to apply for a role or have received an offer from sites or channels other than above mentioned, please do not provide any personal identifying information, including your Social Security or other personal identifying number,
Internship Duration
6 Months   

Registration Endeda month ago

2 Attachments

image004.png
image004.png

image003.png
image003.png

Eligible Courses
B.Tech. - Information Technology
B.Tech. - Artificial Intelligence & Data Science
B.Tech. - Artificial Intelligence & Machine Learning
B.Tech. - Electronics & Communication Engineering
B.Tech. - Computer Science & Engineering
B.Tech. - Electrical Engineering
B.Tech. - Cyber Security
B.Tech. - Electronics & Communication Engineering
B.Tech. - Internet of Things
B.Tech. - Computer Science & Engineering
B.Tech. - Electrical and Electronics Engineering
B.Tech. - Electronics & Communication Engineering
B.Tech. - Computer Science & Engineering
B.Tech. - Internet of Things
Eligibility Criteria
♦ The students must be from a Cisco Networking Academy in India.
♦ Student must have completed all the required pre-requisites.
♦ No current backlogs at registration time."""

final_resume(jd_text, "325a762c-712f-4d37-a65a-e8b1ac0c747c")