# driver/service.py

from sqlalchemy.orm import Session
from driver.model import Driver
from bookingform.model import Booking
from auth.utils import hash_password   # ← Correct import


def create_driver(db: Session, data):
    driver = Driver(
        name=data.name,
        phone=data.phone,
        vehicle_number=data.vehicle_number,
        username=data.username,
        password=hash_password(data.password),
        status="offline"
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
    booking.status = "accepted"

    db.commit()
    db.refresh(booking)
    return booking


def reject_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return None

    booking.status = "rejected"
    db.commit()
    db.refresh(booking)
    return booking


def update_booking_status(db: Session, booking_id: int, status: str):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return None

    booking.status = status
    db.commit()
    db.refresh(booking)
    return booking


def get_driver_bookings(db: Session, driver_id: int):
    return db.query(Booking).filter(
        (Booking.driver_id == None) | (Booking.driver_id == driver_id)
    ).all()