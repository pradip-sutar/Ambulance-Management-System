from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db

from user.schema import UserCreate, UserLogin
from user.service import create_user, login_user, get_all_users

router = APIRouter(prefix="/users", tags=["Users"])


# ✅ Register
@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, data)


# ✅ Login
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    result = login_user(db, data.phone, data.password)

    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return result


# ✅ Get all users (Admin use)
@router.get("/")
def all_users(db: Session = Depends(get_db)):
    return get_all_users(db)