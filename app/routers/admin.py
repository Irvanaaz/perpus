# app/routers/admin.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, security, models
from ..database import get_db

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(security.get_current_admin_user)]
)

@router.get("/stats/most-downloaded", response_model=List[schemas.EbookStat])
def get_stats_most_downloaded(db: Session = Depends(get_db)):
    """
    Endpoint untuk mendapatkan statistik buku yang paling banyak diunduh.
    HANYA BISA DIAKSES OLEH ADMIN.
    """
    return crud.get_most_downloaded_ebooks(db, limit=5)

@router.get("/stats/summary", response_model=schemas.DashboardSummary)
def get_stats_summary(db: Session = Depends(get_db)):
    """
    Endpoint untuk mendapatkan ringkasan statistik dashboard admin.
    HANYA BISA DIAKSES OLEH ADMIN.
    """
    total_users = crud.get_total_users_count(db)
    top_users = crud.get_most_active_users(db, limit=5)
    top_ebooks = crud.get_most_downloaded_ebooks(db, limit=5)
    
    return {
        "total_users": total_users,
        "top_active_users": top_users,
        "most_downloaded_ebooks": top_ebooks,
    }

# Endpoint untuk panel monitoring (admin)
@router.get("/monitoring/latest", response_model=schemas.MonitoringPanel)
def get_monitoring_panel(db: Session = Depends(get_db)):
    """
    Endpoint untuk mendapatkan data monitoring terbaru (user & ebook).
    HANYA BISA DIAKSES OLEH ADMIN.
    """
    latest_users = crud.get_latest_users(db, limit=5)
    latest_ebooks = crud.get_latest_ebooks(db, limit=5)
    
    return {
        "latest_users": latest_users,
        "latest_ebooks": latest_ebooks
    }
