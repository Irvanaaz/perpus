# app/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr  
    password: str = Field(..., min_length=8, max_length=72)

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    class Config: from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Category(BaseModel):
    id: int
    name: str
    class Config: from_attributes = True

class Ebook(BaseModel):
    id: int
    title: str
    author: Optional[str] = None
    description: Optional[str] = None
    publication_year: Optional[int] = None
    cover_image_path: Optional[str] = None
    categories: List[Category] = []
    class Config: from_attributes = True

class EbookCreate(BaseModel):
    title: str
    author: Optional[str] = None
    description: Optional[str] = None
    publication_year: Optional[int] = None

class EbookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    publication_year: Optional[int] = None
    
class ActivityLog(BaseModel):
    id: int
    action: str
    timestamp: datetime
    ebook: Ebook 
    class Config: from_attributes = True

class EbookStat(BaseModel):
    ebook: Ebook
    download_count: int
    class Config: from_attributes = True

class UserStat(BaseModel):
    user: UserResponse 
    activity_count: int

class DashboardSummary(BaseModel):
    total_users: int
    top_active_users: List[UserStat]
    most_downloaded_ebooks: List[EbookStat]

class Review(BaseModel):
    id: int
    rating: int = Field(..., ge=1, le=5) 
    comment: Optional[str] = None
    user: UserResponse 
    timestamp: datetime
    class Config: from_attributes = True

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5) 
    comment: Optional[str] = None

class MonitoringPanel(BaseModel):
    latest_users: List[UserResponse]
    latest_ebooks: List[Ebook]