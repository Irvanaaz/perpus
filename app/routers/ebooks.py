# app/routers/ebooks.py

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, security, models
from ..database import get_db
import os

router = APIRouter(
    prefix="/ebooks",
    tags=["Ebooks"]
)

@router.get("/", response_model=List[schemas.Ebook])
def read_ebooks(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None, 
    sort_by: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Endpoint publik untuk melihat semua eBook.
    Bisa difilter dengan query parameter 'search'.
    Bisa diurutkan dengan query 'sort_by' (newest, popular, rating).
    """
    ebooks = crud.get_ebooks(db, skip=skip, limit=limit, search=search, sort_by=sort_by) 
    return ebooks

@router.post("/", response_model=schemas.Ebook, status_code=201)
def create_new_ebook(
    title: str = Form(...),
    author: str = Form(...),
    description: Optional[str] = Form(None),
    publication_year: Optional[int] = Form(None),
    pdf_file: UploadFile = File(...),
    cover_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(security.get_current_admin_user)
):
    """
    Endpoint untuk mengupload eBook baru.
    HANYA BISA DIAKSES OLEH ADMIN.
    """
    ebook_data = schemas.EbookCreate(
        title=title, 
        author=author, 
        description=description, 
        publication_year=publication_year
    )
    return crud.create_ebook(db=db, ebook=ebook_data, pdf_file=pdf_file, cover_image=cover_image)
@router.get("/{ebook_id}", response_model=schemas.Ebook)
def read_ebook_detail(ebook_id: int, db: Session = Depends(get_db)):
    """
    Endpoint publik untuk melihat detail satu eBook berdasarkan ID.
    """
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if db_ebook is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ebook not found")
    return db_ebook

@router.put("/{ebook_id}", response_model=schemas.Ebook)
def update_existing_ebook(
    ebook_id: int,
    ebook_update: schemas.EbookUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(security.get_current_admin_user)
):
    """
    Endpoint untuk mengedit/memperbarui eBook.
    HANYA BISA DIAKSES OLEH ADMIN.
    """
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if db_ebook is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ebook not found")
    return crud.update_ebook(db=db, db_ebook=db_ebook, ebook_update=ebook_update)

@router.delete("/{ebook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_ebook(
    ebook_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(security.get_current_admin_user)
):
    """
    Endpoint untuk menghapus eBook.
    HANYA BISA DIAKSES OLEH ADMIN.
    """
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if db_ebook is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ebook not found")
    
    crud.delete_ebook(db=db, db_ebook=db_ebook)
    return {"detail": "Ebook deleted successfully"}

# Endpoint untuk mengunduh file PDF eBook
@router.get("/{ebook_id}/download")
def download_ebook(
    ebook_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Endpoint untuk mengunduh file PDF eBook.
    HANYA BISA DIAKSES OLEH PENGGUNA YANG SUDAH LOGIN.
    """
    # 1. Cari buku di database
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if not db_ebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ebook not found")

    # 2. Cek apakah path file ada di database dan file-nya benar-benar ada di server
    file_path = db_ebook.file_path
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found on server")
    # Simpan log aktivitas unduh
    crud.create_activity_log(db, user_id=current_user.id, ebook_id=ebook_id, action="download")

    # 3. Dapatkan nama file asli untuk diberikan kepada pengguna
    file_name = os.path.basename(file_path)

    # 4. Kirim file sebagai respons
    return FileResponse(path=file_path, media_type='application/pdf', filename=file_name)

# Endpoint untuk membaca eBook secara online di browser
@router.get("/{ebook_id}/read")
def read_ebook_online(
    ebook_id: int,
    db: Session = Depends(get_db)
    # DEPENDENCY current_user DIHAPUS DARI SINI
):
    """
    Endpoint PUBLIK untuk membaca eBook secara online di browser.
    """
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if not db_ebook:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ebook not found")

    file_path = db_ebook.file_path
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found on server")

    return FileResponse(path=file_path, media_type='application/pdf', content_disposition_type="inline")


# Endpoint untuk menambahkan eBook ke favorit
@router.post("/{ebook_id}/favorite", response_model=schemas.Ebook, status_code=status.HTTP_201_CREATED)
def add_ebook_to_favorites(
    ebook_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Menambahkan sebuah buku ke daftar favorit pengguna yang sedang login.
    """
    db_ebook = crud.get_ebook(db, ebook_id=ebook_id)
    if not db_ebook:
        raise HTTPException(status_code=404, detail="Ebook not found")
        
    crud.add_to_favorites(db, user_id=current_user.id, ebook_id=ebook_id)
    return db_ebook

@router.delete("/{ebook_id}/favorite", status_code=status.HTTP_204_NO_CONTENT)
def remove_ebook_from_favorites(
    ebook_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Menghapus sebuah buku dari daftar favorit pengguna yang sedang login.
    """
    db_favorite = crud.get_favorite(db, user_id=current_user.id, ebook_id=ebook_id)
    if not db_favorite:
        raise HTTPException(status_code=404, detail="Favorite entry not found")
        
    crud.remove_from_favorites(db, db_favorite=db_favorite)

