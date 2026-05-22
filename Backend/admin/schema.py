# admin/schema.py

from pydantic import BaseModel


class AssignDriver(BaseModel):
    driver_id: int
    booking_id: int


class UpdateDriverStatus(BaseModel):
    driver_id: int
    status: str


class AdminCreate(BaseModel):
    username: str
    phone: str
    password: str