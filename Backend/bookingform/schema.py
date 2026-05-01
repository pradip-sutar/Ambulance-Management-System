from pydantic import BaseModel
from typing import Optional


class Location(BaseModel):
    lat: float
    lng: float


class BookingCreate(BaseModel):
    registration_number: str

    booker_name: str
    booker_phone: str

    patient_name: str
    patient_age: int
    patient_gender: str

    medical_condition: str

    pickup_address: str
    drop_address: Optional[str]

    ambulance_type: str

    pickup_location: Optional[Location] = None