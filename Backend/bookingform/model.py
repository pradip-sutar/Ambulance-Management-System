from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)

    # Booking Info
    registration_number = Column(String, nullable=False)
    booker_name = Column(String, nullable=False)
    booker_phone = Column(String, nullable=False)

    # Patient Info
    patient_name = Column(String, nullable=False)
    patient_age = Column(Integer, nullable=False)
    patient_gender = Column(String, nullable=True)
    caretaker_phone = Column(String, nullable=True)
    caretaker_relation = Column(String, nullable=True)
    caretaker_address = Column(String, nullable=True)
    caretaker_aadhar = Column(String, nullable=True)

    patient_village = Column(String)
    patient_police_station = Column(String)
    patient_district = Column(String)
    patient_pincode = Column(String)
    patient_aadhar = Column(String)
    caretaker_name = Column(String, nullable=True)
    
    booking_date = Column(String)
    booking_time = Column(String)
    medical_condition = Column(String, nullable=True)
    ambulance_type = Column(String, nullable=True)

    # Addresses
    pickup_address = Column(String, nullable=False)
    drop_address = Column(String, nullable=True)

    # Location Coordinates
    pickup_lat = Column(Float, nullable=True)
    pickup_lng = Column(Float, nullable=True)

    # Status
    status = Column(String, default="pending")

    # ✅ PROOF AND KM COLUMNS (BOOKING WISE)
    pickup_proof_url = Column(String, nullable=True)
    pickup_km = Column(Float, nullable=True)
    pickup_time = Column(DateTime, nullable=True)

    drop_proof_url = Column(String, nullable=True)
    drop_km = Column(Float, nullable=True)
    drop_time = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="bookings")
    driver = relationship("Driver", back_populates="bookings")

    created_at = Column(DateTime(timezone=True), server_default=func.now())