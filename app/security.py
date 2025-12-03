import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import ValidationError

from . import schemas, crud, models
from .database import get_db

load_dotenv()

# Konfigurasi untuk hashing password menggunakan bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Memverifikasi password polos dengan password yang sudah di-hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Menghasilkan hash dari password."""
    return pwd_context.hash(password)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

def create_access_token(data: dict):
    to_encode = data.copy()
    # Menambahkan waktu kedaluwarsa token
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Membuat token JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dependency "Penjaga Keamanan".
    Memeriksa token JWT, dan mengembalikan data user jika valid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 1. Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        # 2. Validasi isi token dengan skema
        token_data = schemas.TokenData(email=email)
    except (JWTError, ValidationError):
        # Jika token tidak valid atau isinya salah
        raise credentials_exception
    
    # 3. Ambil data user dari database
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    
    # 4. Jika semua valid, kembalikan data user
    return user

def get_current_admin_user(current_user: models.User = Depends(get_current_user)):
    """
    Dependency yang memeriksa apakah pengguna saat ini adalah admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted, requires admin role."
        )
    return current_user