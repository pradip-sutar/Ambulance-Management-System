# bookingform/model.py

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base


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

    # Relationships
    user = relationship("User", back_populates="bookings")
    driver = relationship("Driver", back_populates="bookings")