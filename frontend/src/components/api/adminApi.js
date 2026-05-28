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

export const updateBooking = async (id, data) => {
  try {
    const res = await API.put(`/bookings/${id}`, data); // ✅ Using the Axios instance
    return res.data;
  } catch (error) {
    console.error("Update Booking Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update booking" };
  }
};

// =========================
// 📸 UPLOAD DROP PROOF
// =========================

export const uploadDropProofAdmin = async (bookingId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Use the existing driver endpoint for uploading drop proof
    const res = await API.post(`/drivers/bookings/${bookingId}/drop-proof`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Upload Drop Proof Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to upload drop proof" };
  }
};