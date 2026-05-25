from sqlalchemy.orm import Session
from bookingform.model import Booking


def create_booking(db, data):

    booking = Booking(
        # Booking Info
        registration_number=data.registration_number,
        booker_name=data.booker_name,
        booker_phone=data.booker_phone,
        booker_address=getattr(data, "booker_address", None),

        booking_date=data.booking_date,
        booking_time=data.booking_time,

        # Service Info
        ambulance_type=data.ambulance_type,

        pickup_address=data.pickup_address,
        drop_address=data.drop_address,

        # Coordinates
        pickup_lat=(
            data.pickup_location.lat
            if data.pickup_location
            else None
        ),
        pickup_lng=(
            data.pickup_location.lng
            if data.pickup_location
            else None
        ),

        status="pending"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking