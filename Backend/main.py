from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os
import subprocess
import webbrowser

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

# ================= FRONTEND PROCESS =================
frontend_process = None

# ================= CORS =================
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= STATIC FILES =================
os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# ================= ROUTES =================
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(driver_router)
app.include_router(booking_router)

# ================= ROOT =================
@app.get("/")
def root():
    return {"message": "Ambulance API Running"}

# ================= START FRONTEND ON BACKEND START =================
@app.on_event("startup")
def start_frontend():
    global frontend_process

    frontend_path = r"C:\Users\Admin\Ambulance-management-system"

    # Start Next.js frontend (production mode)
    frontend_process = subprocess.Popen(
        ["npm", "run", "start"],
        cwd=frontend_path,
        shell=True
    )

    # Open browser automatically
    webbrowser.open("http://localhost:3000")


# ================= STOP FRONTEND ON BACKEND STOP =================
@app.on_event("shutdown")
def stop_frontend():
    global frontend_process
    if frontend_process:
        frontend_process.terminate()