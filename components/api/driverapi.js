import axios from "axios"

// ===============================
// ✅ AXIOS INSTANCE (BASE SETUP)
// ===============================
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// ===============================
// ✅ AUTO ATTACH TOKEN
// ===============================
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)


// ===============================
// 🚑 DRIVER BOOKINGS
// ===============================

// Get driver bookings (available + assigned)
export const getDriverBookings = async () => {
  try {
    const res = await API.get("/drivers/me/bookings")
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch bookings" }
  }
}


// ===============================
// 🚨 BOOKING ACTIONS
// ===============================

// Accept booking
export const acceptBooking = async (bookingId) => {
  try {
    const res = await API.put(
      "/drivers/accept",
      null,
      {
        params: { booking_id: bookingId },
      }
    )
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Accept failed" }
  }
}

// Reject booking
export const rejectBooking = async (bookingId) => {
  try {
    const res = await API.put(
      "/drivers/reject",
      null,
      {
        params: { booking_id: bookingId },
      }
    )
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Reject failed" }
  }
}

// ✅ FIXED: Send status and extra data (km, urls) as JSON body instead of Query Params
export const updateBookingStatus = async (bookingId, status, extra = {}) => {
  try {
    const res = await API.put(
      `/drivers/booking/${bookingId}`,
      { 
        status, 
        ...extra // Spreads pickup_km, pickup_proof_url, drop_km, drop_proof_url
      }
    )
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Update failed" }
  }
}


// ===============================
// 👨‍✈️ DRIVER MANAGEMENT
// ===============================

// Create driver
export const createDriver = async (data) => {
  try {
    const res = await API.post("/drivers/", data)
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to create driver" }
  }
}

// Get all drivers
export const getDrivers = async () => {
  try {
    const res = await API.get("/drivers")
    return res.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch drivers" }
  }
}

export const updateDriverPassword = async (driverId, password) => {
  const token = localStorage.getItem("token")

  const res = await fetch(
    `http://localhost:8000/admin/driver-password/${driverId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
      }),
    }
  )

  if (!res.ok) {
    throw new Error("Failed")
  }

  return await res.json()
}

// ===============================
// 📤 FILE UPLOADS
// ===============================

// Upload pickup proof
export const uploadPickupProof = async (bookingId, file) => {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const res = await API.post(
      `/drivers/bookings/${bookingId}/pickup-proof`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return res.data // Backend returns { "url": "uploads/..." }
  } catch (error) {
    throw error.response?.data || { message: "Upload failed" }
  }
}

// Upload drop proof
export const uploadDropProof = async (bookingId, file) => {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const res = await API.post(
      `/drivers/bookings/${bookingId}/drop-proof`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return res.data // Backend returns { "url": "uploads/..." }
  } catch (error) {
    throw error.response?.data || { message: "Upload failed" }
  }
}