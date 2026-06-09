from fastapi import FastAPI
from fastapi.security import HTTPBearer
from router import auth, base_resume

app = FastAPI()

security = HTTPBearer()

app.include_router(auth.router)
app.include_router(base_resume.router)


@app.get("/")
def root():
    return{"message": "Resumify API"}

@app.get("/health")
def health_check():
    return{"status": "OK"}