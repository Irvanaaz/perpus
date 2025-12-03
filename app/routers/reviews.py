# app/routers/reviews.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, security, models
from ..database import get_db

router = APIRouter(
    prefix="/ebooks/{ebook_id}/reviews",
    tags=["Reviews"]
)

@router.post("/", response_model=schemas.Review, status_code=status.HTTP_201_CREATED)
def create_review_for_ebook(
    ebook_id: int,
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Membuat ulasan baru untuk sebuah eBook.
    HANYA BISA DIAKSES OLEH PENGGUNA YANG SUDAH LOGIN.
    """
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if not db_ebook:
        raise HTTPException(status_code=404, detail="Ebook not found")

    db_review = crud.create_ebook_review(db, user_id=current_user.id, ebook_id=ebook_id, review=review)
    if db_review is None:
        raise HTTPException(status_code=400, detail="User has already reviewed this ebook")
        
    return db_review

@router.get("/", response_model=List[schemas.Review])
def read_reviews_for_ebook(ebook_id: int, db: Session = Depends(get_db)):
    """
    Endpoint publik untuk melihat semua ulasan dari sebuah eBook.
    """
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if not db_ebook:
        raise HTTPException(status_code=404, detail="Ebook not found")
        
    return crud.get_ebook_reviews(db, ebook_id=ebook_id)