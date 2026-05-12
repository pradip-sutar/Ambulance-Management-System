# driver/schema.py

from pydantic import BaseModel


class DriverCreate(BaseModel):
    name: str
    phone: str
    vehicle_number: str
    password: str

class DriverResponse(DriverCreate):
    id: int
    status: str

    class Config:
        from_attributes = True