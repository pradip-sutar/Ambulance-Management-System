# driver/model.py

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import DateTime

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)

    vehicle_number = Column(String, nullable=False)

    password = Column(String, nullable=False)

    status = Column(String, default="offline")

    bookings = relationship("Booking", back_populates="driver")
    pickup_proof = Column(String, nullable=True)
    pickup_time = Column(DateTime, nullable=True)

    drop_proof = Column(String, nullable=True)
    drop_time = Column(DateTime, nullable=True)