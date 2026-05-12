# admin/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt

from database import get_db

from auth.utils import (
    require_role,
    hash_password
)

from admin.model import Admin
from admin.schema import AdminCreate

from driver.model import Driver
from driver.schema import DriverCreate
from driver.service import create_driver

from admin.service import (
    get_dashboard_stats,
    get_all_bookings,
    get_all_drivers,
    assign_driver,
    update_driver_status,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# =========================================================
# DASHBOARD
# =========================================================
@router.get("/dashboard")
def dashboard(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return get_dashboard_stats(db)


# =========================================================
# ALL BOOKINGS
# =========================================================
@router.get("/bookings")
def bookings(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return get_all_bookings(db)


# =========================================================
# ALL DRIVERS
# =========================================================
@router.get("/drivers")
def drivers(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return get_all_drivers(db)


# =========================================================
# ASSIGN DRIVER
# =========================================================
@router.put("/assign")
def assign(
    driver_id: int,
    booking_id: int,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    result = assign_driver(db, driver_id, booking_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return {
        "message": "Driver assigned",
        "data": result
    }


# =========================================================
# UPDATE DRIVER STATUS
# =========================================================
@router.put("/driver-status")
def update_status(
    driver_id: int,
    status: str,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    result = update_driver_status(db, driver_id, status)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    return {
        "message": "Driver status updated",
        "data": result
    }


# =========================================================
# CREATE DRIVER
# =========================================================
@router.post("/create-driver")
def create_driver_by_admin(
    data: DriverCreate,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    existing = db.query(Driver).filter(
        Driver.phone == data.phone
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Phone already exists"
        )

    driver = create_driver(db, data)

    return {
        "message": "Driver created successfully",
        "driver": {
            "id": driver.id,
            "name": driver.name,
            "phone": driver.phone,
            "vehicle_number": driver.vehicle_number
        }
    }

# =========================================================
# UPDATE DRIVER PASSWORD
# =========================================================

from pydantic import BaseModel

class PasswordUpdate(BaseModel):
    password: str


@router.put("/driver-password/{driver_id}")
def update_driver_password(
    driver_id: int,
    data: PasswordUpdate,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.id == driver_id
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    hashed_password = bcrypt.hashpw(
        data.password.encode(),
        bcrypt.gensalt()
    ).decode()

    driver.password = hashed_password

    db.commit()

    return {
        "message": "Password updated successfully"
    }
# =========================================================
# CREATE ADMIN
# =========================================================
@router.post("/create-admin")
def create_admin(
    data: AdminCreate,
    current_user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    existing_phone = db.query(Admin).filter(
        Admin.phone == data.phone
    ).first()

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered"
        )

    existing_username = db.query(Admin).filter(
        Admin.username == data.username
    ).first()

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    new_admin = Admin(
        username=data.username,
        phone=data.phone,
        password=hash_password(data.password)
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {
        "message": "Admin created successfully",
        "admin": {
            "id": new_admin.id,
            "username": new_admin.username,
            "phone": new_admin.phone
        }
    }