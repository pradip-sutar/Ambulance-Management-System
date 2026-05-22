from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    
    role = Column(String, default="user")   # This was missing in DB

    bookings = relationship("Booking", back_populates="user")
   