# auth/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth.utils import verify_password, create_access_token

from user.model import User
from admin.model import Admin
from driver.model import Driver

router = APIRouter(prefix="/auth", tags=["Auth"])


# ==================== USER LOGIN (Phone + Password) ====================
@router.post("/user-login")
def user_login(phone: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == phone).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid phone or password")

    token = create_access_token({
        "id": user.id,
        "role": "user",
        "phone": user.phone
    })

    return {
        "token": token,
        "role": "user",
        "name": user.name
    }


# ==================== ADMIN LOGIN (Phone + Password) ====================
@router.post("/admin-login")
def admin_login(phone: str, password: str, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.phone == phone).first()   # Changed to phone

    if not admin or not verify_password(password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid phone or password")

    token = create_access_token({
        "id": admin.id,
        "role": "admin",
        "phone": admin.phone
    })

    return {
        "token": token,
        "role": "admin",
        "username": admin.username if hasattr(admin, 'username') else None
    }


# ==================== DRIVER LOGIN (Phone + Password) ====================
@router.post("/driver-login")
def driver_login(phone: str, password: str, db: Session = Depends(get_db)):
    driver = db.query(Driver).filter(Driver.phone == phone).first()   # Changed to phone

    if not driver or not verify_password(password, driver.password):
        raise HTTPException(status_code=401, detail="Invalid phone or password")

    token = create_access_token({
        "id": driver.id,
        "role": "driver",
        "phone": driver.phone
    })

    return {
        "token": token,
        "role": "driver",
        "name": driver.name
    }