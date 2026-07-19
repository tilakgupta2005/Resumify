from fastapi import FastAPI
from fastapi.security import HTTPBearer
from app.router import auth, base_resume, jd_resume
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.exceptions import AppError, app_error_handler, validation_exception_handler, http_exception_handler

settings = get_settings()

app = FastAPI()

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list, # In production, replace "*" with your frontend URL like ["http://localhost:5173"]
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