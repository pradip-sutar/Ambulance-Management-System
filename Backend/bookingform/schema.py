from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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
    caretaker_name: Optional[str] = None
    caretaker_phone: Optional[str] = None
    caretaker_relation: Optional[str] = None
    caretaker_address: Optional[str] = None
    caretaker_aadhar: Optional[str] = None
    patient_village: str
    patient_police_station: str
    patient_district: str
    patient_pincode: str
    patient_aadhar: str
    booking_date: str
    booking_time: str
    medical_condition: str
    pickup_address: str
    drop_address: Optional[str] = None
    ambulance_type: str
    pickup_location: Optional[Location] = None

class DriverResponse(BaseModel):
    id: int
    name: str
    phone: str
    vehicle_number: str
    class Config:
        from_attributes = True

class BookingResponse(BaseModel):
    id: int
    registration_number: str
    booker_name: str
    booker_phone: str
    patient_name: str
    patient_age: int
    patient_gender: str
    patient_village: Optional[str] = None
    patient_police_station: Optional[str] = None
    patient_district: Optional[str] = None
    patient_pincode: Optional[str] = None
    patient_aadhar: Optional[str] = None
    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    medical_condition: str
    caretaker_name: Optional[str] = None
    caretaker_phone: Optional[str] = None
    caretaker_relation: Optional[str] = None
    caretaker_address: Optional[str] = None
    caretaker_aadhar: Optional[str] = None
    pickup_address: str
    drop_address: Optional[str] = None
    ambulance_type: str
    status: str
    driver_id: Optional[int] = None
    driver: Optional[DriverResponse] = None
    created_at: Optional[str] = None

    # ✅ ADD THESE FIELDS SO FRONTEND GETS THE URLS
    pickup_proof_url: Optional[str] = None
    pickup_km: Optional[float] = None
    pickup_time: Optional[datetime] = None
    
    drop_proof_url: Optional[str] = None
    drop_km: Optional[float] = None
    drop_time: Optional[datetime] = None

    class Config:
        from_attributes = True