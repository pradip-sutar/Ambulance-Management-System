import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Create Booking
export const createBooking = async (payload) => {
  try {
    const response = await API.post("/bookings/", payload)
    return response.data
  } catch (error) {
    console.error("Booking API Error:", error.response?.data || error.message)
    throw error.response?.data || { message: "Booking failed" }
  }
}

// Get Bookings
export const getBookings = async () => {
  try {
    const response = await API.get("/bookings/")
    return response.data
  } catch (error) {
    console.error("Fetch Error:", error.response?.data || error.message)
    throw error.response?.data || { message: "Failed to fetch bookings" }
  }
}

// Get Single Booking (FIXED - no hardcoded URL)
export const getBooking = async (id) => {
  try {
    const response = await API.get(`/bookings/${id}`)
    return response.data
  } catch (error) {
    console.error("Get Booking Error:", error.response?.data || error.message)
    throw error.response?.data || { message: "Failed to fetch booking" }
  }
}

// Get My Bookings
export const getMyBookings = async (phone) => {
  try {
    const response = await API.get(`/bookings/my-bookings/${phone}`)
    return response.data
  } catch (error) {
    console.error("My Booking Error:", error.response?.data || error.message)
    throw error.response?.data || { message: "Failed to fetch bookings" }
  }
}