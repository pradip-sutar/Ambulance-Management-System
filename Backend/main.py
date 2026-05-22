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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= API ROUTES =================
app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(driver_router, prefix="/api")
app.include_router(booking_router, prefix="/api")

# ================= UPLOADS =================
os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# ================= FRONTEND BUILD =================
FRONTEND_DIST = r"C:\Users\Admin\ambulance\frontend\dist"

# Serve assets folder
app.mount(
    "/assets",
    StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")),
    name="assets"
)

# ================= REACT ROUTES =================
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):

    file_path = os.path.join(FRONTEND_DIST, full_path)

    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)

    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))