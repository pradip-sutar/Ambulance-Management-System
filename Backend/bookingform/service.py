# bookingform/service.py

from sqlalchemy.orm import Session
from bookingform.model import Booking


def create_booking(db: Session, data):
    booking = Booking(
        user_id=None,                    # Will be filled later when user is authenticated
        driver_id=None,
        registration_number=data.registration_number,
        booker_name=data.booker_name,
        booker_phone=data.booker_phone,

        patient_name=data.patient_name,
        patient_age=data.patient_age,
        patient_gender=data.patient_gender,

        medical_condition=data.medical_condition,
        ambulance_type=data.ambulance_type,

        pickup_address=data.pickup_address,
        drop_address=data.drop_address,

        pickup_lat=data.pickup_location.lat if data.pickup_location else None,
        pickup_lng=data.pickup_location.lng if data.pickup_location else None,

        status="pending"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking