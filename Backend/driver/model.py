# driver/model.py

from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    phone = Column(String)
    vehicle_number = Column(String)

    username = Column(String, unique=True)   # ✅ NEW
    password = Column(String)                # ✅ NEW (hashed)

    status = Column(String, default="offline")

    bookings = relationship("Booking", back_populates="driver")