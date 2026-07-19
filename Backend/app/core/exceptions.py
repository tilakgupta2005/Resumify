# app/core/exceptions.py

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


# ---------------------------------------------------------------------------
# Base class — every custom exception in the app extends this.
# Carries its own status_code so routers never need to hardcode one.
# ---------------------------------------------------------------------------
class AppError(Exception):
    status_code = 500

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


# ---------------------------------------------------------------------------
# Resume domain
# ---------------------------------------------------------------------------
class ResumeNotFoundError(AppError):
    status_code = 404


class ResumeSaveError(AppError):
    status_code = 500


# ---------------------------------------------------------------------------
# Auth domain
# ---------------------------------------------------------------------------
class InvalidTokenError(AppError):
    status_code = 401


class TokenExpiredError(AppError):
    status_code = 401


# ---------------------------------------------------------------------------
# LLM / Google API domain
# ---------------------------------------------------------------------------
class InvalidGoogleApiKeyError(AppError):
    status_code = 401


class GoogleApiQuotaError(AppError):
    status_code = 429

    def __init__(self, message: str, retry_after_seconds: int | None = None):
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


# ---------------------------------------------------------------------------
# PDF generation domain
# ---------------------------------------------------------------------------
class PdfCompilationError(AppError):
    status_code = 500


# ---------------------------------------------------------------------------
# Handlers — register all three in main.py
# ---------------------------------------------------------------------------

async def app_error_handler(request: Request, exc: AppError):
    headers = {}
    if isinstance(exc, GoogleApiQuotaError) and exc.retry_after_seconds:
        headers["Retry-After"] = str(exc.retry_after_seconds)

    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
        headers=headers,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = {}
    for err in exc.errors():
        field_path = ".".join(str(p) for p in err["loc"] if p != "body")
        errors[field_path] = err["msg"]

    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation failed. Please check the highlighted fields.",
            "errors": errors,
        },
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    # Keeps plain HTTPException(...) calls (still used in auth.py, security.py)
    # returning the same {"detail": ...} shape as everything else, so the
    # frontend has one consistent error format regardless of which part
    # of the app raised it.
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})