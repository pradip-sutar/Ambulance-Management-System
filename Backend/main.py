from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ ADD THIS
from database import Base, engine
from bookingform.router import router as booking_router
from driver.router import router as driver_router
from admin.router import router as admin_router
from user.router import router as user_router


from driver.model import Driver
from bookingform.model import Booking
from user.model import User
from admin.model import Admin



Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ ADD CORS CONFIG HERE
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],     # ✅ IMPORTANT → allows OPTIONS
    allow_headers=["*"],
)

# ✅ ROUTES
app.include_router(booking_router)
app.include_router(driver_router)
app.include_router(admin_router)
app.include_router(user_router)

@app.get("/")
def root():
    return {"message": "Ambulance API Running"}