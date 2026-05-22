# bookingform/service.py

from sqlalchemy.orm import Session
from bookingform.model import Booking





def create_booking(db, data):

    booking = Booking(

        # Booking Info
        registration_number=data.registration_number,
        booker_name=data.booker_name,
        booker_phone=data.booker_phone,

        # Patient Info
        patient_name=data.patient_name,
        patient_age=data.patient_age,
        patient_gender=data.patient_gender,

        patient_village=data.patient_village,
        patient_police_station=data.patient_police_station,
        patient_district=data.patient_district,
        patient_pincode=data.patient_pincode,
        patient_aadhar=data.patient_aadhar,

        booking_date=data.booking_date,
        booking_time=data.booking_time,

        medical_condition=data.medical_condition,

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