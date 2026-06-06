from fastapi import FastAPI
from fastapi.security import HTTPBearer
from router import auth

app = FastAPI()

security = HTTPBearer()

app.include_router(auth.router)


@app.get("/")
def root():
    return{"message": "Resumify API"}

@app.get("/health")
def health_check():
    return{"status": "OK"}