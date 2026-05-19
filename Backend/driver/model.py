from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    vehicle_number = Column(String, nullable=False)
    password = Column(String, nullable=False)
    status = Column(String, default="offline")

    bookings = relationship("Booking", back_populates="driver")
    
    # ❌ REMOVED proof columns from here (now in Booking)