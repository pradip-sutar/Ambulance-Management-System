const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// =========================
// USER LOGIN
// =========================
export const userLogin = async (phone, password) => {
  const res = await fetch(`${BASE_URL}/auth/user-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw data || { message: "User login failed" }
  }

  return data
}


// =========================
// ADMIN LOGIN
// =========================
export const adminLogin = async (phone, password) => {
  const res = await fetch(`${BASE_URL}/auth/admin-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw data || { message: "Admin login failed" }
  }

  return data
}


// =========================
// DRIVER LOGIN
// =========================
export const driverLogin = async (phone, password) => {
  const res = await fetch(`${BASE_URL}/auth/driver-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw data || { message: "Driver login failed" }
  }

  return data
}