# admin/model.py

from sqlalchemy import Column, Integer, String
from database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)      # ← Added
    password = Column(String, nullable=False)