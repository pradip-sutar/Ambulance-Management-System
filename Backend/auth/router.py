# auth/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from auth.utils import (
    verify_password,
    create_access_token
)

from auth.schema import LoginSchema

from user.model import User
from admin.model import Admin
from driver.model import Driver

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# =========================================================
# USER LOGIN
# =========================================================
@router.post("/user-login")
def user_login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.phone == data.phone
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone number"
        )

    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({
        "id": user.id,
        "role": "user"
    })

    return {
        "access_token": token,
        "role": "user",
        "name": user.name
    }


# =========================================================
# ADMIN LOGIN
# =========================================================
@router.post("/admin-login")
def admin_login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(
        Admin.phone == data.phone
    ).first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone number"
        )

    if not verify_password(data.password, admin.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({
        "id": admin.id,
        "role": "admin"
    })

    return {
        "access_token": token,
        "role": "admin",
        "username": admin.username
    }


# =========================================================
# DRIVER LOGIN
# =========================================================
@router.post("/driver-login")
def driver_login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.phone == data.phone
    ).first()

    if not driver:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone number"
        )

    if not verify_password(data.password, driver.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({
        "id": driver.id,
        "role": "driver"
    })

    return {
        "access_token": token,
        "role": "driver",
        "name": driver.name
    }