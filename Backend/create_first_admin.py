# create_first_admin.py

from database import SessionLocal
from admin.model import Admin
from auth.utils import hash_password

def create_first_admin():
    db = SessionLocal()

    phone = "9776696669"
    password_plain = "nagen@5"

    try:
        existing = db.query(Admin).filter(Admin.phone == phone).first()
        if existing:
            print("✅ Admin already exists with phone:", phone)
            db.close()
            return

        new_admin = Admin(
            username="superadmin",
            phone=phone,
            password=hash_password(password_plain)
        )

        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)

        print("🎉 First Admin Created Successfully!")
        print("=" * 50)
        print(f"Phone Number : {new_admin.phone}")
        print(f"Username     : superadmin")
        print(f"Password     : {password_plain}")
        print("=" * 50)

    except Exception as e:
        print("❌ Error:", str(e))
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_first_admin()