# driver/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from datetime import datetime
from driver.model import Driver
import shutil
import os
from bookingform.model import Booking

from database import get_db
from auth.utils import require_role
from driver.schema import DriverCreate
from driver.service import (
    create_driver,
    get_all_drivers,
    accept_booking,
    reject_booking,
    assign_booking,
    update_booking_status,
    get_driver_bookings,
)

router = APIRouter(prefix="/drivers", tags=["Drivers"])


# ==================== ADMIN ENDPOINTS ====================
@router.post("/")
def add_driver(
    data: DriverCreate,
    user=Depends(require_role("admin")),   # Only Admin can create driver
    db: Session = Depends(get_db)
):
    return create_driver(db, data)


@router.get("/")
def get_drivers(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return get_all_drivers(db)


@router.put("/assign")
def assign_driver_to_booking(
    driver_id: int,
    booking_id: int,
    db: Session = Depends(get_db)
):
    result = assign_booking(db, driver_id, booking_id)
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Driver assigned successfully", "data": result}


# ==================== DRIVER ENDPOINTS ====================
@router.put("/accept")
def accept_booking_endpoint(
    booking_id: int,
    user=Depends(require_role("driver")),
    db: Session = Depends(get_db)
):
    result = accept_booking(
        db,
        user["id"],   # driver id from token
        booking_id
    )

    if result == "taken":
        raise HTTPException(
            status_code=400,
            detail="Booking already taken"
        )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return {
        "message": "Booking accepted",
        "data": result
    }
@router.put("/reject")
def reject_booking_endpoint(
    booking_id: int,
    user=Depends(require_role("driver")),
    db: Session = Depends(get_db)
):
    result = reject_booking(db, booking_id)   # Note: reject_booking doesn't need driver_id

    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"message": "Booking rejected", "data": result}


@router.get("/me/bookings")
def my_bookings(
    user=Depends(require_role("driver")),
    db: Session = Depends(get_db)
):
    return get_driver_bookings(db, user["id"])


@router.get("/{driver_id}/bookings")
def get_driver_bookings_endpoint(driver_id: int, db: Session = Depends(get_db)):
    return get_driver_bookings(db, driver_id)


@router.put("/booking/{booking_id}")
def update_booking_status_endpoint(
    booking_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    result = update_booking_status(db, booking_id, status)
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Status updated", "data": result}


@router.post(
    "/bookings/{booking_id}/pickup-proof"
)
async def upload_pickup_proof(
    booking_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    os.makedirs("uploads", exist_ok=True)

    filename = (
        f"{datetime.utcnow().timestamp()}_{file.filename}"
    )

    filepath = f"uploads/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    driver = db.query(Driver).filter(
        Driver.id == booking.driver_id
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.pickup_proof = filepath
    driver.pickup_time = datetime.utcnow()

    db.commit()

    return {
        "message": "Pickup proof uploaded"
    }

@router.post(
    "/bookings/{booking_id}/drop-proof"
)
async def upload_drop_proof(
    booking_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    os.makedirs("uploads", exist_ok=True)

    filename = (
        f"{datetime.utcnow().timestamp()}_{file.filename}"
    )

    filepath = f"uploads/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    driver = db.query(Driver).filter(
        Driver.id == booking.driver_id
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.drop_proof = filepath
    driver.drop_time = datetime.utcnow()

    db.commit()

    return {
        "message": "Drop proof uploaded"
    }