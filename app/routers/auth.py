# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..import crud, schemas, security
from ..database import get_db

router = APIRouter(
    prefix="/auth", 
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint untuk mendaftarkan pengguna baru.
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar."
        )
    
    return crud.create_user(db=db, user=user)

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Endpoint untuk login pengguna dan mendapatkan token akses.
    """
    # 1. Cari user berdasarkan email (di OAuth2, fieldnya bernama 'username')
    user = crud.get_user_by_email(db, email=form_data.username)

    # 2. Jika user tidak ada ATAU password salah, kirim error
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Jika berhasil, buat token JWT
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    
    # 4. Kembalikan token ke pengguna
    return {"access_token": access_token, "token_type": "bearer"}