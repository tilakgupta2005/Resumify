from pathlib import Path
import shutil
import subprocess
import uuid
import os

from jinja2 import Environment, FileSystemLoader
from app.core.config import get_settings


# -----------------------------
# Paths
# -----------------------------
settings = get_settings()

BASE_DIR = Path(__file__).resolve().parents[2]

TEMPLATE_DIR = BASE_DIR / "templates"
OUTPUT_DIR = BASE_DIR / "output"


# -----------------------------
# Jinja Setup
# -----------------------------

env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=False,
    trim_blocks=True,
    lstrip_blocks=True,
)


# -----------------------------
# Latex executable
# -----------------------------

xelatex_path = settings.latex_executable_path


# -----------------------------
# Helpers
# -----------------------------

def get_candidate_name(data: dict):

    first_name = (
        data["personal_info"]["name"]["first_name"]
        .strip()
        .lower()
        .replace(" ", "_")
    )

    last_name = (
        data["personal_info"]["name"]["last_name"]
        .strip()
        .lower()
        .replace(" ", "_")
    )

    return first_name, last_name


def create_output_folder(data: dict, company: str):

    first_name, last_name = get_candidate_name(data)

    unique_id = uuid.uuid4().hex[:8]

    folder_name = (
        f"{first_name}_{last_name}_{unique_id}"
    )

    output_folder = OUTPUT_DIR / folder_name

    output_folder.mkdir(
        parents=True,
        exist_ok=True
    )

    pdf_name = (
        f"{first_name}_{last_name}_resume@{company}.pdf"
    )

    return output_folder, pdf_name


# -----------------------------
# Render Latex
# -----------------------------

def render_tex(
    data: dict,
    company: str,
    template_name="jakes_resume.tex"
):

    output_folder, pdf_name = create_output_folder(data, company)


    template = env.get_template(template_name)


    rendered = template.render(**data)


    tex_path = output_folder / "resume.tex"


    with open(
        tex_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(rendered)


    return tex_path, output_folder, pdf_name



# -----------------------------
# Compile PDF
# -----------------------------

def compile_pdf(
    tex_path: Path,
    output_folder: Path,
    pdf_name: str
):

    result = subprocess.run(
        [
            xelatex_path,
            "-interaction=nonstopmode",
            "-output-directory",
            str(output_folder),
            str(tex_path),
        ],
        capture_output=True,
        text=True
    )


    generated_pdf = output_folder / "resume.pdf"


    if not generated_pdf.exists():
        print(result.stdout)
        print(result.stderr)
        raise Exception("PDF generation failed")


    final_pdf = output_folder / pdf_name

    shutil.move(
        generated_pdf,
        final_pdf
    )

    return final_pdf


# -----------------------------
# Main Function
# -----------------------------

def render_pdf(data: dict, company: str):
    
    tex_path, output_folder, pdf_name = render_tex(data, company)


    pdf_path = compile_pdf(
        tex_path,
        output_folder,
        pdf_name
    )

    print(f"{pdf_name} created")
    return str(pdf_path), str(pdf_name) ,str(output_folder)


def cleanup_file(dir_path: str):
    if os.path.isdir(dir_path):
        shutil.rmtree(dir_path)
        print(f"Directory Deleted: {dir_path}")




if __name__ == "__main__":
    render_pdf({'skills': ['AWS', 'Cloud', 'Data Engineering', 'Cloud Architecture', 'DevOps', 'BigQuery', 'OOP', 'Kubernetes', 'Deep Learning', 'Containers', 'Angular', 'Socket.io', 'TensorFlow', 'Firebase', 'Container Orchestration', 'Flutter', 'Git', 'MySQL', 'SQL', 'Spring Boot', 'Java', 'Terraform', 'FastAPI', 'MongoDB', 'Node.js', 'React', 'Azure', 'Machine Learning', 'Docker', 'Python', 'PyTorch'], 'projects': [{'end_date': None, 'team_size': 3, 'start_date': '2022-03-01', 'description': ['Constructed an automated customer service chatbot utilizing Python and advanced NLP (Natural Language Processing) technical methods.', 'Designed high performance API endpoints with FastAPI to process complex user queries in real time.', 'Leveraged TensorFlow machine learning libraries to enhance the accuracy of automated responses for customer support.'], 'project_url': 'https://github.com/johndoe/ai-chatbot', 'project_name': 'AI Chatbot', 'technologies_used': ['Python', 'TensorFlow', 'FastAPI']}, {'end_date': '2021-12-31', 'team_size': 5, 'start_date': '2021-01-01', 'description': ['Developed a full stack e-commerce application utilizing React and Node.js for a seamless user experience.', 'Integrated secure authentication modules and robust payment processing gateways to protect sensitive user transaction data.', 'Managed complex product data using MongoDB to power a functional admin dashboard for inventory oversight.'], 'project_url': 'https://github.com/johndoe/ecommerce', 'project_name': 'E-commerce Website', 'technologies_used': ['React', 'Node.js', 'MongoDB']}], 'education': [{'grade': '4.0/4.0', 'degree': 'Master of Science', 'end_date': '2022-06-30', 'start_date': '2020-09-01', 'field_of_study': 'Artificial Intelligence', 'institution_name': 'MIT'}, {'grade': '3.8/4.0', 'degree': 'Bachelor of Science', 'end_date': '2020-06-30', 'start_date': '2016-09-01', 'field_of_study': 'Computer Science', 'institution_name': 'Stanford University'}], 'experience': [{'ctc': 1800000.0, 'skills': ['PyTorch', 'Python', 'Docker'], 'company': 'Meta', 'end_date': None, 'location': 'Remote', 'start_date': '2024-01-01', 'description': ['Architected Machine Learning (ML) models using PyTorch to enhance production system inference performance capabilities.', 'Containerized ML services with Docker to facilitate efficient deployment within cloud-native environments and platforms.', 'Optimized Machine Learning (ML) model workflows to improve overall performance metrics for scalable production systems.'], 'designation': 'ML Engineer'}, {'ctc': 1500000.0, 'skills': ['Python', 'Machine Learning', 'Azure'], 'company': 'Microsoft', 'end_date': None, 'location': 'Hyderabad', 'start_date': '2023-01-01', 'description': ['Developed Machine Learning (ML) models using Python to drive predictive analytics and data-driven product outcomes.', 'Engineered robust data pipelines with Python to support complex Machine Learning (ML) solution deployment requirements.', 'Collaborated with cross-functional teams to integrate AI solutions on Azure within a fast-paced environment.'], 'designation': 'Data Scientist'}, {'ctc': 1400000.0, 'skills': ['React', 'Node.js', 'MongoDB'], 'company': 'Adobe', 'end_date': '2022-12-31', 'location': 'Noida', 'start_date': '2022-01-01', 'description': ['Constructed full-stack web applications utilizing the MEAN Stack framework components including React and Node.js.', 'Integrated REST APIs to ensure seamless communication and data exchange across high-performance web applications.', 'Designed MongoDB schemas to support scalable data storage and optimize user interface performance and experience.'], 'designation': 'Full Stack Developer'}, {'ctc': 1200000.0, 'skills': ['Python', 'FastAPI', 'AWS'], 'company': 'Google', 'end_date': '2022-12-31', 'location': 'Bangalore', 'start_date': '2020-01-01', 'description': ['Built scalable backend microservices using Python and FastAPI to support cloud-native application development requirements.', 'Deployed cloud-native applications on AWS services to ensure high availability and robust infrastructure performance.', 'Improved API performance through systematic optimization and automated testing procedures within the development lifecycle.'], 'designation': 'Software Engineer'}, {'ctc': 1000000.0, 'skills': ['AWS', 'Terraform', 'Docker'], 'company': 'IBM', 'end_date': '2019-12-31', 'location': 'Chennai', 'start_date': '2019-02-01', 'description': ['Provisioned scalable cloud infrastructure on AWS using Terraform to support enterprise-level application deployment needs.', 'Automated deployment pipelines to streamline CI/CD processes and enhance overall infrastructure reliability and efficiency.', 'Managed containerized applications with Docker to ensure consistency across cloud-native environments and software platforms.'], 'designation': 'Cloud Engineer'}], 'achievements': ['Published a research paper in AI journal', 'Received Employee of the Quarter award', 'Achieved 5-star rating on HackerRank', 'Solved 1000+ coding problems on LeetCode', 'Top 5 finalist in national hackathon'], 'co_curricular': ['Member of the university coding club', 'Managed technical fest events', 'Served as student ambassador'], 'personal_info': {'name': {'last_name': 'Johnson', 'first_name': 'Sarah', 'middle_name': 'Elizabeth'}, 'email': 'sarah.johnson@example.com', 'phone': '+14155551234', 'github': 'https://github.com/sarahjohnson', 'linkedin': 'https://www.linkedin.com/in/sarahjohnson', 'location': {'city': 'Los Angeles', 'state': 'CA', 'address': '456 Oak Avenue', 'country': 'USA', 'postal_code': '90210'}, 'portfolio': 'https://www.sarahjohnson.dev'}, 'certifications': ['Google Professional Data Engineer', 'AWS Certified Solutions Architect', 'Oracle Java SE Certification', 'Microsoft Azure Fundamentals', 'Certified Kubernetes Administrator'], 'extra_curricular': ['Volunteered in local community services', 'Captain of the university basketball team', 'Member of music club'], 'technical_participation': ['Participated in Hacktoberfest', 'Participated in Google Code Jam', 'Attended AWS re:Invent', 'Participated in ACM ICPC Regional Contest', 'Competed in Kaggle Machine Learning Challenges'], 'professional_summary': 'Software engineer with 5 years of experience in cloud-native development, Java, and Python. Demonstrated expertise in AWS, Docker, and Kubernetes for scalable infrastructure. Proven track record in CI/CD automation, MEAN stack applications, and object-oriented design. Solved 1000 plus coding problems on LeetCode with strong analytical skills. Certified Kubernetes Administrator and AWS Certified Solutions Architect committed to robust software development and infrastructure optimization.'}, "Resumify")