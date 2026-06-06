from pydantic import BaseModel, EmailStr, Field, computed_field, field_validator
from typing import Annotated
import re

class CreateUser(BaseModel):
    Name: Annotated[str, Field(..., min_length=3, max_length=100, title="Name", description="The name of the user")]
    Email: Annotated[EmailStr, Field(..., title="Email", description="The email address of the user")]
    password: Annotated[str, Field(..., min_length=8, max_length=128, title="Password", description="The password of the user")]
    @field_validator('Name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z\s'-]+$", v):
            raise ValueError("Name can only contain letters, spaces, hyphens, and apostrophes")
        return v.strip()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength"""
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r'\d', v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")
        return v

class LoginUser(BaseModel):
    Email: Annotated[EmailStr, Field(..., title="Email", description="The email address of the user")]
    password: Annotated[str, Field(..., min_length=8, max_length=128, title="Password", description="The password of the user")]

# class User(Base):
#     Name: str
#     Email: EmailStr
#     password: str                                           