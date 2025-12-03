# app/models.py
from sqlalchemy import Column, Integer, String, func, TIMESTAMP, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

user_role_enum = Enum('user', 'admin', name='user_role', create_type=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(user_role_enum, default='user')
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")

class Ebook(Base):
    __tablename__ = "ebooks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    author = Column(String(100))
    description = Column(Text)
    publication_year = Column(Integer)
    file_path = Column(String(255), nullable=False)
    cover_image_path = Column(String(255))
    categories = relationship("Category", secondary="ebook_categories", back_populates="ebooks")
    reviews = relationship("Review", back_populates="ebook", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    ebooks = relationship("Ebook", secondary="ebook_categories", back_populates="categories")

class EbookCategory(Base):
    __tablename__ = "ebook_categories"
    ebook_id = Column(Integer, ForeignKey("ebooks.id"), primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id"), primary_key=True)

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ebook_id = Column(Integer, ForeignKey("ebooks.id"), nullable=False)
    user = relationship("User", back_populates="favorites")
    ebook = relationship("Ebook")

class ActivityLog(Base):
    __tablename__ = "activity_log"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ebook_id = Column(Integer, ForeignKey("ebooks.id"), nullable=False)
    action = Column(String(20), nullable=False)
    timestamp = Column(TIMESTAMP(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="activity_logs")
    ebook = relationship("Ebook")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ebook_id = Column(Integer, ForeignKey("ebooks.id"), nullable=False)
    timestamp = Column(TIMESTAMP(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="reviews")   
    ebook = relationship("Ebook", back_populates="reviews")