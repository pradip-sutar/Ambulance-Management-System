from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os


from database import Base, engine
from fastapi.staticfiles import StaticFiles

# ================= IMPORT ROUTERS =================
from bookingform.router import router as booking_router
from driver.router import router as driver_router
from admin.router import router as admin_router
from user.router import router as user_router
from auth.router import router as auth_router

# ================= IMPORT MODELS =================
from bookingform.model import Booking
from driver.model import Driver
from user.model import User
from admin.model import Admin

# ================= CREATE TABLES =================
Base.metadata.create_all(bind=engine)

# ================= APP =================
app = FastAPI()

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
    return {
        "message": "Ambulance API Running"
    }