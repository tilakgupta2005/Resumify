from fastapi import FastAPI
from fastapi.security import HTTPBearer
from app.router import auth, base_resume, jd_resume
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend URL like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



security = HTTPBearer()

app.include_router(auth.router)
app.include_router(base_resume.router)
app.include_router(jd_resume.router)


@app.get("/")
def root():
    return{"message": "Resumify API"}

@app.get("/health")
def health_check():
    return{"status": "OK"}