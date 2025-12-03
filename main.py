# app/main.py
from fastapi import FastAPI
from .database import engine, Base
from .routers import auth, users, ebooks, admin, reviews
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Perpustakaan eBook API",
    description="API untuk platform perpustakaan eBook gratis.",
    version="0.1.0"
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(ebooks.router)
app.include_router(admin.router)
app.include_router(reviews.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Selamat datang di API Perpustakaan eBook!"}