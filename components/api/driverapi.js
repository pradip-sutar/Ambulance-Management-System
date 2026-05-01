const BASE_URL = "http://127.0.0.1:8000"

// ✅ GET bookings (available + assigned)
export const getDriverBookings = async (driverId = 1) => {
  const res = await fetch(`${BASE_URL}/drivers/${driverId}/bookings`)

  if (!res.ok) throw new Error("Failed to fetch bookings")

  return res.json()
}

// ✅ ACCEPT booking (NEW)
export const acceptBooking = async (bookingId, driverId = 1) => {
  const res = await fetch(
    `${BASE_URL}/drivers/accept?driver_id=${driverId}&booking_id=${bookingId}`,
    {
      method: "PUT",
    }
  )

  if (!res.ok) throw new Error("Already taken")

  return res.json()
}

// ❌ (optional reject)
export const rejectBooking = async (bookingId) => {
  const res = await fetch(
    `${BASE_URL}/drivers/reject?booking_id=${bookingId}`,
    {
      method: "PUT",
    }
  )

  if (!res.ok) throw new Error("Reject failed")

  return res.json()
}

// ✅ UPDATE status (ride flow)
export const updateBookingStatus = async (bookingId, status) => {
  const res = await fetch(
    `${BASE_URL}/drivers/booking/${bookingId}?status=${status}`,
    {
      method: "PUT",
    }
  )

  if (!res.ok) throw new Error("Failed to update status")

  return res.json()
}



// ✅ Create Driver
export const createDriver = async (data) => {
  const res = await fetch(`${BASE_URL}/drivers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create driver")
  }

  return res.json()
}

// ✅ Get all drivers
export const getDrivers = async () => {
  const res = await fetch(`${BASE_URL}/drivers`)

  if (!res.ok) {
    throw new Error("Failed to fetch drivers")
  }

  return res.json()
}