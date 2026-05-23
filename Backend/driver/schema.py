from pydantic import BaseModel
from typing import Optional

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

# ✅ NEW SCHEMA: Fixes the 422 error by defining the JSON body
class StatusUpdate(BaseModel):
    status: str
    pickup_km: Optional[float] = None
    pickup_proof_url: Optional[str] = None
    drop_km: Optional[float] = None
    drop_proof_url: Optional[str] = None