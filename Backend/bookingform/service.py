from sqlalchemy.orm import Session
from bookingform.model import Booking


def create_booking(db, data):

    # Get latest booking
    last_booking = (
        db.query(Booking)
        .order_by(Booking.id.desc())
        .first()
    )

    if last_booking and last_booking.registration_number:

        try:
            last_number = int(
                last_booking.registration_number.split("-")[1]
            )
            next_number = last_number + 1
        except Exception:
            next_number = 50
    else:
        next_number = 50
    # Generate registration number
    registration_number = f"AMB-{str(next_number).zfill(3)}"

    booking = Booking(
        registration_number=registration_number,
        booker_name=data.booker_name,
        booker_phone=data.booker_phone,
        booker_address=getattr(data, "booker_address", None),
        booking_date=data.booking_date,
        booking_time=data.booking_time,
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