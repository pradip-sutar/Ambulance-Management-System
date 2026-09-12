from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session, joinedload
import os, shutil, uuid

from database import get_db
from auth.utils import require_role

from bookingform.schema import (
    BookingCreate,
    BookingResponse,
    PatientDetailUpdate,
    BookingUpdate,
    AdminBookingCreate,
)
from bookingform.service import create_booking
from bookingform.model import Booking

from driver.model import Driver
from driver.schema import DriverCreate
from driver.service import create_driver

router = APIRouter(prefix="/bookings", tags=["Bookings"])

UPLOAD_DIR = "uploads/drop_proofs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================================================
# 1. CREATE BOOKING (user form)
# =========================================================
@router.post("/")
def add_booking(data: BookingCreate, db: Session = Depends(get_db)):
    return create_booking(db, data)


# =========================================================
# 2. ALL BOOKINGS
# =========================================================
@router.get("/", response_model=list[BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).options(joinedload(Booking.driver)).all()


# =========================================================
# 3. ADMIN FULL CREATE   ⚠️ MUST be before /{booking_id}
# =========================================================
@router.post("/admin-create", response_model=BookingResponse)
def admin_create_booking(
    data: AdminBookingCreate,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    driver_id = None
    if data.driver_phone:
        driver = db.query(Driver).filter(Driver.phone == data.driver_phone).first()
        if not driver and data.driver_name:
            driver = create_driver(
                db,
                DriverCreate(
                    name=data.driver_name,
                    phone=data.driver_phone,
                    vehicle_number=data.driver_vehicle_number or "",
                    password="changeme123",
                ),
            )
        if driver:
            driver_id = driver.id

    reg_no = data.registration_number
    if not reg_no:
        last = db.query(Booking).order_by(Booking.id.desc()).first()
        try:
            next_num = int(last.registration_number.split("-")[1]) + 1 if last else 50
        except Exception:
            next_num = 50
        reg_no = f"AMB-{str(next_num).zfill(3)}"
    else:
        exists = db.query(Booking).filter(
            Booking.registration_number == reg_no
        ).first()
        if exists:
            raise HTTPException(
                status_code=400,
                detail=f"Registration number {reg_no} already exists",
            )

    booking = Booking(
        registration_number=reg_no,
        booker_name=data.booker_name or "Admin Entry",
        booker_phone=data.booker_phone or "N/A",
        booking_date=data.booking_date,
        booking_time=data.booking_time,
        ambulance_type=data.ambulance_type,
        patient_name=data.patient_name,
        patient_contact=data.patient_contact,
        patient_age=data.patient_age,
        patient_gender=data.patient_gender,
        patient_aadhar=data.patient_aadhar,
        patient_village=data.patient_village,
        patient_police_station=data.patient_police_station,
        patient_district=data.patient_district,
        patient_pincode=data.patient_pincode,
        medical_condition=data.medical_condition,
        pickup_address=data.pickup_address or "",
        drop_address=data.drop_address,
        caretaker_name=data.caretaker_name,
        caretaker_phone=data.caretaker_phone,
        caretaker_relation=data.caretaker_relation,
        driver_id=driver_id,
        status=data.status or "completed",
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return (
        db.query(Booking)
        .options(joinedload(Booking.driver))
        .filter(Booking.id == booking.id)
        .first()
    )


# =========================================================
# 4. UPLOAD DROP PROOF   ⚠️ MUST be before /{booking_id}
# =========================================================
@router.post("/{booking_id}/drop-proof")
def upload_drop_proof(
    booking_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    booking.drop_proof_url = f"/{filepath}"
    db.commit()
    db.refresh(booking)
    return {"message": "Drop proof uploaded", "url": booking.drop_proof_url}


# =========================================================
# 5. UPDATE PATIENT DETAILS   ⚠️ MUST be before /{booking_id}
# =========================================================
@router.put("/patient-details/{booking_id}")
def update_patient_details(
    booking_id: int,
    data: PatientDetailUpdate,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(booking, field, value)

    db.commit()
    db.refresh(booking)
    return {"message": "Patient details updated successfully", "data": booking}


# =========================================================
# 6. UPDATE FULL BOOKING   ⚠️ MUST be before /{booking_id}
# =========================================================
@router.put("/{booking_id}")
def update_booking(
    booking_id: int,
    data: BookingUpdate,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(booking, field, value)

    db.commit()
    db.refresh(booking)
    return {"message": "Booking updated successfully", "data": booking}


# =========================================================
# 7. MY BOOKINGS (phone)   ⚠️ MUST be before /{booking_id}
# =========================================================
@router.get("/my-bookings/{phone}", response_model=list[BookingResponse])
def get_my_bookings(phone: str, db: Session = Depends(get_db)):
    return (
        db.query(Booking)
        .options(joinedload(Booking.driver))
        .filter(Booking.booker_phone == phone)
        .all()
    )


# =========================================================
# 8. SINGLE BOOKING   ⚠️ MUST be LAST
# =========================================================
@router.get("/{booking_id}", response_model=BookingResponse)
def get_single_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.driver))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking