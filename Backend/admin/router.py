from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from driver.service import create_driver   # We'll improve this
from driver.schema import DriverCreate
from admin.model import Admin
from admin.schema import AdminCreate

from database import get_db
from admin.service import (
    get_dashboard_stats,
    get_all_bookings,
    get_all_drivers,
    assign_driver,
    update_driver_status,
)

from auth.utils import require_role   # ✅ FIX 1
from bookingform.model import Booking     # ✅ FIX 2 (adjust path if needed)

router = APIRouter(prefix="/admin", tags=["Admin"])


# 📊 Dashboard (admin only)
@router.get("/dashboard")
def dashboard(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return get_dashboard_stats(db)


# 📋 All bookings
@router.get("/bookings")
def bookings(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return get_all_bookings(db)


# 🚑 All drivers
@router.get("/drivers")
def drivers(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return get_all_drivers(db)


# 🔄 Assign driver manually
@router.put("/assign")
def assign(
    driver_id: int,
    booking_id: int,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    result = assign_driver(db, driver_id, booking_id)

    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"message": "Driver assigned", "data": result}


# 🟢 Update driver status
@router.put("/driver-status")
def update_status(
    driver_id: int,
    status: str,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    result = update_driver_status(db, driver_id, status)

    if not result:
        raise HTTPException(status_code=404, detail="Driver not found")

    return {"message": "Driver status updated", "data": result}@router.post("/create-driver")
def create_driver_by_admin(
    data: DriverCreate,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    # Optional: Check if username already exists
    existing = db.query(Driver).filter(Driver.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")

    driver = create_driver(db, data)
    return {
        "message": "Driver created successfully by admin",
        "driver": {
            "id": driver.id,
            "name": driver.name,
            "username": driver.username,
            "phone": driver.phone,
            "vehicle_number": driver.vehicle_number
        }
    }



@router.post("/create-admin")
def create_admin(
    data: AdminCreate,
    current_user=Depends(require_role("admin")),   # Only existing admin can create new admin
    db: Session = Depends(get_db)
):
    # Check if phone already exists
    existing_phone = db.query(Admin).filter(Admin.phone == data.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    # Check if username already exists
    existing_username = db.query(Admin).filter(Admin.username == data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create new admin
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