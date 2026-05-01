from sqlalchemy.orm import Session
from user.model import User
from auth.utils import hash_password, verify_password, create_access_token


# ✅ Create User
def create_user(db: Session, data):
    user = User(
        name=data.name,
        phone=data.phone,
        password=hash_password(data.password),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# ✅ Login User
def login_user(db: Session, phone: str, password: str):
    user = db.query(User).filter(User.phone == phone).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    token = create_access_token({
        "id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "user": user
    }


# ✅ Get All Users (Admin)
def get_all_users(db: Session):
    return db.query(User).all()