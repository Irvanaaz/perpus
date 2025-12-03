from sqlalchemy.orm import Session
from sqlalchemy import func, or_ 
from . import models, schemas, security
from fastapi import UploadFile
from typing import List, Optional
import shutil, os


def get_user_by_email(db: Session, email: str):
    """Mencari user berdasarkan email."""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Membuat user baru di database."""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Fungsi CRUD untuk eBook
def get_ebooks(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
):
    """
    Mengambil daftar semua eBook, dengan opsi pencarian dan pengurutan.
    """
    query = db.query(models.Ebook)

    # Logika Pencarian (sudah ada)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Ebook.title.ilike(search_term),
                models.Ebook.author.ilike(search_term),
            )
        )

    # === LOGIKA PENGURUTAN BARU ===
    if sort_by == "popular":
        # Mengurutkan berdasarkan jumlah unduhan
        query = (
            query.outerjoin(models.ActivityLog)
            .filter(models.ActivityLog.action == "download")
            .group_by(models.Ebook.id)
            .order_by(func.count(models.ActivityLog.id).desc())
        )
    elif sort_by == "rating":
        # Mengurutkan berdasarkan rata-rata rating
        query = (
            query.outerjoin(models.Review)
            .group_by(models.Ebook.id)
            .order_by(func.avg(models.Review.rating).desc().nullslast())
        )
    elif sort_by == "newest":
        # Mengurutkan berdasarkan tahun terbit terbaru
        query = query.order_by(models.Ebook.publication_year.desc())
    else:
        # Pengurutan default jika tidak ada parameter sort_by
        query = query.order_by(models.Ebook.id.asc())

    return query.offset(skip).limit(limit).all()

def create_ebook(db: Session, ebook: schemas.EbookCreate, pdf_file: UploadFile, cover_image: UploadFile):
    """Membuat eBook baru, termasuk menyimpan file."""
    # Simpan file PDF
    pdf_path = os.path.join(UPLOAD_DIRECTORY, pdf_file.filename)
    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)
        
    # Simpan file cover image
    cover_path = os.path.join(UPLOAD_DIRECTORY, cover_image.filename)
    with open(cover_path, "wb") as buffer:
        shutil.copyfileobj(cover_image.file, buffer)
        
    # Buat entri di database
    db_ebook = models.Ebook(
        title=ebook.title,
        author=ebook.author,
        description=ebook.description,
        publication_year=ebook.publication_year,
        file_path=pdf_path,
        cover_image_path=cover_path
    )
    db.add(db_ebook)
    db.commit()
    db.refresh(db_ebook)
    return db_ebook
def get_ebook(db: Session, ebook_id: int):
    """Mengambil satu eBook berdasarkan ID-nya."""
    return db.query(models.Ebook).filter(models.Ebook.id == ebook_id).first()

def update_ebook(db: Session, db_ebook: models.Ebook, ebook_update: schemas.EbookUpdate):
    """Memperbarui data eBook di database."""
    # Ambil data dari skema Pydantic
    update_data = ebook_update.model_dump(exclude_unset=True)
    
    # Perbarui field dari objek model SQLAlchemy
    for key, value in update_data.items():
        setattr(db_ebook, key, value)
        
    db.add(db_ebook)
    db.commit()
    db.refresh(db_ebook)
    return db_ebook

def delete_ebook(db: Session, db_ebook: models.Ebook):
    """Menghapus eBook dari database dan file fisiknya."""
    if db_ebook.file_path and os.path.exists(db_ebook.file_path):
        os.remove(db_ebook.file_path)
    if db_ebook.cover_image_path and os.path.exists(db_ebook.cover_image_path):
        os.remove(db_ebook.cover_image_path)
        
    # Hapus data dari database
    db.delete(db_ebook)
    db.commit()
    return {"message": "Ebook deleted successfully"}

# Fungsi CRUD untuk fitur favorit
def get_favorite(db: Session, user_id: int, ebook_id: int):
    """Mencari entri favorit spesifik."""
    return db.query(models.Favorite).filter(models.Favorite.user_id == user_id, models.Favorite.ebook_id == ebook_id).first()

def add_to_favorites(db: Session, user_id: int, ebook_id: int):
    """Menambahkan buku ke daftar favorit pengguna."""
    db_favorite = get_favorite(db, user_id=user_id, ebook_id=ebook_id)
    if db_favorite:
        return db_favorite 
    
    db_favorite = models.Favorite(user_id=user_id, ebook_id=ebook_id)
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite

def remove_from_favorites(db: Session, db_favorite: models.Favorite):
    """Menghapus buku dari daftar favorit."""
    db.delete(db_favorite)
    db.commit()

def get_user_favorites(db: Session, user_id: int):
    """Mengambil semua buku favorit dari seorang pengguna."""
    return db.query(models.Ebook).join(models.Favorite).filter(models.Favorite.user_id == user_id).all()

# Fungsi CRUD untuk fitur activity log
def create_activity_log(db: Session, user_id: int, ebook_id: int, action: str):
    """Membuat entri log aktivitas baru."""
    db_log = models.ActivityLog(user_id=user_id, ebook_id=ebook_id, action=action)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_user_activity_logs(db: Session, user_id: int):
    """Mengambil semua log aktivitas dari seorang pengguna."""
    return db.query(models.ActivityLog).filter(models.ActivityLog.user_id == user_id).order_by(models.ActivityLog.timestamp.desc()).all()

# Fungsi untuk mendapatkan statistik eBook (admin)
def get_most_downloaded_ebooks(db: Session, limit: int = 5):
    """
    Mengambil daftar buku yang paling banyak diunduh.
    """
    results = (
        db.query(
            models.Ebook,
            func.count(models.ActivityLog.id).label("download_count")
        )
        .join(models.ActivityLog, models.Ebook.id == models.ActivityLog.ebook_id)
        .filter(models.ActivityLog.action == "download")
        .group_by(models.Ebook.id)
        .order_by(func.count(models.ActivityLog.id).desc())
        .limit(limit)
        .all()
    )
    return [{"ebook": ebook, "download_count": count} for ebook, count in results]


# Fungsi untuk mendapatkan ringkasan dashboard admin
def get_total_users_count(db: Session) -> int:
    """Menghitung total pengguna yang terdaftar."""
    return db.query(models.User).count()

def get_most_active_users(db: Session, limit: int = 5):
    """
    Mengambil daftar pengguna paling aktif berdasarkan jumlah aktivitas (download).
    """
    results = (
        db.query(
            models.User,
            func.count(models.ActivityLog.id).label("activity_count")
        )
        .join(models.ActivityLog, models.User.id == models.ActivityLog.user_id)
        .group_by(models.User.id)
        .order_by(func.count(models.ActivityLog.id).desc())
        .limit(limit)
        .all()
    )
    return [{"user": user, "activity_count": count} for user, count in results]

# Fungsi CRUD untuk fitur review eBook
def create_ebook_review(db: Session, user_id: int, ebook_id: int, review: schemas.ReviewCreate):
    """Membuat ulasan baru untuk sebuah eBook."""
    # Cek apakah user sudah pernah mereview buku ini
    existing_review = db.query(models.Review).filter(
        models.Review.user_id == user_id, 
        models.Review.ebook_id == ebook_id
    ).first()
    
    if existing_review:
        return None 

    db_review = models.Review(
        **review.model_dump(),
        user_id=user_id,
        ebook_id=ebook_id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_ebook_reviews(db: Session, ebook_id: int, skip: int = 0, limit: int = 100):
    """Mengambil semua ulasan untuk sebuah eBook."""
    return db.query(models.Review).filter(models.Review.ebook_id == ebook_id).offset(skip).limit(limit).all()

# Fungsi untuk panel monitoring (admin)
def get_latest_users(db: Session, limit: int = 5):
    """Mengambil pengguna yang paling baru mendaftar."""
    return db.query(models.User).order_by(models.User.id.desc()).limit(limit).all()

def get_latest_ebooks(db: Session, limit: int = 5):
    """Mengambil eBook yang paling baru diupload."""
    return db.query(models.Ebook).order_by(models.Ebook.id.desc()).limit(limit).all()