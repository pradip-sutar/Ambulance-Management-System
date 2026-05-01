const BASE_URL = "http://127.0.0.1:8000"

// ✅ GET ALL BOOKINGS
export const getBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings/`)

  if (!res.ok) {
    throw new Error("Failed to fetch bookings")
  }

  return res.json()
}

// ✅ GET ALL DRIVERS
export const getDrivers = async () => {
  const res = await fetch(`${BASE_URL}/drivers/`)

  if (!res.ok) {
    throw new Error("Failed to fetch drivers")
  }

  return res.json()
}

// ✅ ASSIGN DRIVER TO BOOKING
export const assignDriver = async (driverId, bookingId) => {
  const res = await fetch(
    `${BASE_URL}/drivers/assign?driver_id=${driverId}&booking_id=${bookingId}`,
    {
      method: "PUT",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to assign driver")
  }

  return res.json()
}