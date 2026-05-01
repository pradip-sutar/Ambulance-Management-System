# admin/service.py

from bookingform.model import Booking
from driver.model import Driver


# 📊 Dashboard Stats
def get_dashboard_stats(db):
    total_bookings = db.query(Booking).count()
    pending = db.query(Booking).filter(Booking.status == "pending").count()
    active = db.query(Booking).filter(Booking.status == "on_the_way").count()
    completed = db.query(Booking).filter(Booking.status == "completed").count()

    total_drivers = db.query(Driver).count()
    online_drivers = db.query(Driver).filter(Driver.status == "online").count()

    return {
        "total_bookings": total_bookings,
        "pending": pending,
        "active": active,
        "completed": completed,
        "total_drivers": total_drivers,
        "online_drivers": online_drivers,
    }


# 📋 Get all bookings
def get_all_bookings(db):
    return db.query(Booking).all()


# 🚑 Get all drivers
def get_all_drivers(db):
    return db.query(Driver).all()


# 🔄 Assign driver manually (admin override)
def assign_driver(db, driver_id, booking_id):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        return None

    booking.driver_id = driver_id
    booking.status = "assigned"

    db.commit()
    db.refresh(booking)

    return booking


# 🟢 Update driver online/offline
def update_driver_status(db, driver_id, status):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()

    if not driver:
        return None

    driver.status = status

    db.commit()
    db.refresh(driver)

    return driver