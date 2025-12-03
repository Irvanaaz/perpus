# app/routers/users.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, security, models, crud
from typing import List
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: schemas.UserResponse = Depends(security.get_current_user)):
    """
    Endpoint untuk mendapatkan detail profil dari pengguna yang sedang login.
    Endpoint ini terproteksi oleh autentikasi JWT.
    """
    return current_user

# Endpoint untuk mendapatkan daftar buku favorit pengguna yang sedang login
@router.get("/me/favorites", response_model=List[schemas.Ebook])
def read_user_favorites(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Endpoint untuk mendapatkan daftar buku favorit dari pengguna yang sedang login.
    """
    return crud.get_user_favorites(db, user_id=current_user.id)

# Endpoint untuk mendapatkan riwayat aktivitas pengguna yang sedang login
@router.get("/me/history", response_model=List[schemas.ActivityLog])
def read_user_activity_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Endpoint untuk mendapatkan riwayat aktivitas (download, dll.) 
    dari pengguna yang sedang login.
    """
    return crud.get_user_activity_logs(db, user_id=current_user.id)
