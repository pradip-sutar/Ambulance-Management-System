from sqlalchemy.orm import Session
from driver.model import Driver
from bookingform.model import Booking
from sqlalchemy.orm import joinedload
from auth.utils import hash_password
from typing import Dict, Optional
from datetime import datetime # ✅ ADD THIS MISSING IMPORT

def create_driver(db: Session, data):
    existing = db.query(Driver).filter(Driver.phone == data.phone).first()
    if existing:
        return None
    driver = Driver(
        name=data.name, phone=data.phone,
        vehicle_number=data.vehicle_number,
        password=hash_password(data.password), status="offline"
    )
    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver

def get_all_drivers(db: Session):
    return db.query(Driver).all()

def assign_booking(db: Session, driver_id: int, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return None
    if booking.status != "pending":
        return {"error": "Booking already assigned"}
    booking.driver_id = driver_id
    booking.status = "assigned"
    db.commit()
    db.refresh(booking)
    return booking

def accept_booking(db: Session, driver_id: int, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return None
    if booking.driver_id and booking.driver_id != driver_id:
        return "taken"
    booking.driver_id = driver_id
    booking.status = "assigned"
    db.commit()
    updated_booking = db.query(Booking).options(joinedload(Booking.driver)).filter(Booking.id == booking_id).first()
    return updated_booking

def reject_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return None
    booking.status = "rejected"
    db.commit()
    db.refresh(booking)
    return booking

# ✅ UPDATED TO HANDLE EXTRA DATA & SAVE TO BOOKING
def update_booking_status(db: Session, booking_id: int, status: str, extra: Optional[Dict] = None):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return None

    booking.status = status
    
    if extra:
        if "pickup_km" in extra and extra["pickup_km"] is not None:
            booking.pickup_km = float(extra["pickup_km"])
        if "pickup_proof_url" in extra and extra["pickup_proof_url"] is not None:
            booking.pickup_proof_url = extra["pickup_proof_url"]
            booking.pickup_time = datetime.utcnow()
            
        if "drop_km" in extra and extra["drop_km"] is not None:
            booking.drop_km = float(extra["drop_km"])
        if "drop_proof_url" in extra and extra["drop_proof_url"] is not None:
            booking.drop_proof_url = extra["drop_proof_url"]
            booking.drop_time = datetime.utcnow()

    db.commit()
    db.refresh(booking)
    return booking

def get_driver_bookings(db: Session, driver_id: int):
    return db.query(Booking).filter(
        (Booking.driver_id == None) | (Booking.driver_id == driver_id)
    ).all()