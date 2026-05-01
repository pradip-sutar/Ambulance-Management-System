from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from bookingform.schema import BookingCreate
from bookingform.service import create_booking
from bookingform.model import Booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/")
def add_booking(data: BookingCreate, db: Session = Depends(get_db)):
    return create_booking(db, data)


@router.get("/")
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()


