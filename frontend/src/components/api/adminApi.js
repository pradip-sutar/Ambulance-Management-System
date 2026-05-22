import axios from "axios"

// ✅ Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// ✅ Auto attach token to every request
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


// =========================
// 🚑 BOOKINGS
// =========================

// Get all bookings (admin)
export const getBookings = async () => {
  try {
    const res = await API.get("/admin/bookings")
    return res.data
  } catch (error) {
    console.error("Get Bookings Error:", error.response?.data || error.message)
    throw error.response?.data || { message: "Failed to fetch bookings" }
  }
}


// =========================
// 🚑 DRIVERS
// =========================

// Get all drivers (admin)
export const getDrivers = async () => {
  try {
    const res = await API.get("/admin/drivers")
    return res.data
  } catch (error) {
    console.error("Get Drivers Error:", error.response?.data || error.message)
    throw error.response?.data || { message: "Failed to fetch drivers" }
  }
}


// =========================
// 🚑 ASSIGN DRIVER
// =========================

export const assignDriver = async (driver_id, booking_id) => {
  try {
    const res = await API.put(
      `/admin/assign`,
      null,
      {
        params: {
          driver_id,
          booking_id,
        },
      }
    )

    return res.data
  } catch (error) {
    console.error(
      "Assign Driver Error:",
      error.response?.data || error.message
    )
    throw error.response?.data || { message: "Failed to assign driver" }
  }
}