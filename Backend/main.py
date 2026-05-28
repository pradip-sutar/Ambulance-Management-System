from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import os

# ================= DATABASE =================
from database import Base, engine

# ================= ROUTERS =================
from bookingform.router import router as booking_router
from driver.router import router as driver_router
from admin.router import router as admin_router
from user.router import router as user_router
from auth.router import router as auth_router
from gallery.router import router as gallery_router

# ================= MODELS =================
from bookingform.model import Booking
from driver.model import Driver
from user.model import User
from admin.model import Admin

# ================= CREATE TABLES =================
Base.metadata.create_all(bind=engine)

# ================= APP =================
app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://moambulanceseba.com",
        "http://moambulanceseba.com",
        "http://localhost:8001",
        "http://localhost:4179",
        "http://127.0.0.1:4179",

        "http://localhost:8001",
        "http://127.0.0.1:8001",

    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= PATHS =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FRONTEND_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "../frontend/dist")
)

ASSETS_DIR = os.path.join(FRONTEND_DIR, "assets")

UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

# ================= STATIC FILES =================

# React assets
app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

# Uploaded images
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
app.mount("/api/uploads", StaticFiles(directory=UPLOADS_DIR), name="api-uploads")  # ✅ ADD THIS

# ================= API ROUTES =================
app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(driver_router, prefix="/api")
app.include_router(booking_router, prefix="/api")
app.include_router(gallery_router, prefix="/api")  # ✅ Added /api prefix

# ================= SERVE REACT =================
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    file_path = os.path.join(FRONTEND_DIR, full_path)

    if full_path != "" and os.path.exists(file_path):
        return FileResponse(file_path)

    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))