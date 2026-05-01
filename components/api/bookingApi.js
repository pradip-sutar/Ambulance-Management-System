import axios from "axios"

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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