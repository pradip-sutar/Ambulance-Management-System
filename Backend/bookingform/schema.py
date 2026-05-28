from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Location(BaseModel):
    lat: float
    lng: float


# =========================================================
# CREATE BOOKING — sent from Booking Form (user side)
# Only booking person + service details
# =========================================================
class BookingCreate(BaseModel):
    registration_number: str
    booker_name: str
    booker_phone: str
    booker_address: Optional[str] = None          # ✅ NEW

    booking_date: Optional[str] = None
    booking_time: Optional[str] = None

    pickup_address: str
    drop_address: Optional[str] = None
    ambulance_type: Optional[str] = None

    pickup_location: Optional[Location] = None


# =========================================================
# PATIENT DETAIL UPDATE — sent from Admin Dashboard
# All fields optional so admin can fill incrementally
# =========================================================
class PatientDetailUpdate(BaseModel):
    # Patient fields
    patient_name: Optional[str] = None
    patient_dob: Optional[str] = None             # ✅ NEW
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    patient_contact: Optional[str] = None         # ✅ NEW
    patient_aadhar: Optional[str] = None
    patient_village: Optional[str] = None
    patient_police_station: Optional[str] = None
    patient_district: Optional[str] = None
    patient_pincode: Optional[str] = None
    patient_address: Optional[str] = None         # ✅ NEW
    medical_condition: Optional[str] = None

    # Caretaker fields
    caretaker_name: Optional[str] = None
    caretaker_phone: Optional[str] = None
    caretaker_relation: Optional[str] = None
    caretaker_aadhar: Optional[str] = None
    caretaker_address: Optional[str] = None


# =========================================================
# DRIVER RESPONSE (nested inside BookingResponse)
# =========================================================
class DriverResponse(BaseModel):
    id: int
    name: str
    phone: str
    vehicle_number: str

    class Config:
        from_attributes = True

class BookingUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    patient_contact: Optional[str] = None
    patient_aadhar: Optional[str] = None
    patient_village: Optional[str] = None
    patient_police_station: Optional[str] = None
    patient_district: Optional[str] = None
    patient_pincode: Optional[str] = None
    pickup_address: Optional[str] = None
    drop_address: Optional[str] = None
    medical_condition: Optional[str] = None
    ambulance_type: Optional[str] = None
    status: Optional[str] = None
# =========================================================
# BOOKING RESPONSE — returned to frontend
# All patient/caretaker fields are Optional because
# they are filled later by admin
# =========================================================
class BookingResponse(BaseModel):
    id: int
    registration_number: str

    # Booking person
    booker_name: str
    booker_phone: str
    booker_address: Optional[str] = None          # ✅ NEW

    # Patient — all Optional (filled by admin)
    patient_name: Optional[str] = None
    patient_dob: Optional[str] = None             # ✅ NEW
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    patient_contact: Optional[str] = None         # ✅ NEW
    patient_aadhar: Optional[str] = None
    patient_village: Optional[str] = None
    patient_police_station: Optional[str] = None
    patient_district: Optional[str] = None
    patient_pincode: Optional[str] = None
    patient_address: Optional[str] = None         # ✅ NEW
    medical_condition: Optional[str] = None

    # Caretaker — all Optional (filled by admin)
    caretaker_name: Optional[str] = None
    caretaker_phone: Optional[str] = None
    caretaker_relation: Optional[str] = None
    caretaker_aadhar: Optional[str] = None
    caretaker_address: Optional[str] = None

    # Service
    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    ambulance_type: Optional[str] = None
    pickup_address: str
    drop_address: Optional[str] = None

    # Status & Driver
    status: str
    driver_id: Optional[int] = None
    driver: Optional[DriverResponse] = None

    # Proof & KM
    pickup_proof_url: Optional[str] = None
    pickup_km: Optional[float] = None
    pickup_time: Optional[datetime] = None

    drop_proof_url: Optional[str] = None
    drop_km: Optional[float] = None
    drop_time: Optional[datetime] = None

    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True



