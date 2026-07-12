from pathlib import Path
import shutil
import subprocess
import uuid

from jinja2 import Environment, FileSystemLoader


# -----------------------------
# Paths
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

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

xelatex_path = (
    r"C:\Users\tilak\AppData\Local\Programs\MiKTeX\miktex\bin\x64\xelatex.exe"
)


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


def create_output_folder(data: dict):

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
        f"{first_name}_{last_name}_resume.pdf"
    )

    return output_folder, pdf_name


# -----------------------------
# Render Latex
# -----------------------------

def render_tex(
    data: dict,
    template_name="jakes_resume.tex"
):

    output_folder, pdf_name = create_output_folder(data)


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

def render_pdf(data: dict):

    tex_path, output_folder, pdf_name = render_tex(data)


    pdf_path = compile_pdf(
        tex_path,
        output_folder,
        pdf_name
    )

    print("{pdf_name} created")
    
    return str(pdf_path)