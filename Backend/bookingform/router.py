from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database import get_db

from bookingform.schema import (
    BookingCreate,
    BookingResponse
)

from bookingform.service import create_booking
from bookingform.model import Booking

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

# ================= CREATE BOOKING =================

@router.post("/")
def add_booking(
    data: BookingCreate,
    db: Session = Depends(get_db)
):
    return create_booking(db, data)


# ================= ALL BOOKINGS =================

@router.get("/", response_model=list[BookingResponse])
def get_bookings(
    db: Session = Depends(get_db)
):

    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.driver))
        .all()
    )

    return bookings


# ================= USER BOOKINGS =================

@router.get(
    "/my-bookings/{phone}",
    response_model=list[BookingResponse]
)
def get_my_bookings(
    phone: str,
    db: Session = Depends(get_db)
):

    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.driver))
        .filter(Booking.booker_phone == phone)
        .all()
    )

    return bookings


# ================= SINGLE BOOKING =================

@router.get(
    "/{booking_id}",
    response_model=BookingResponse
)
def get_single_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.driver))
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return booking