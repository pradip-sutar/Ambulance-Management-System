"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

// ✅ IMPORT API
// Make sure this path matches your actual project structure
import { userLogin, adminLogin, driverLogin } from "../../components/api/auth"

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    phone: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let data

      // try user login
      try {
        data = await userLogin(form.phone, form.password)
      } catch {
        // try admin login
        try {
          data = await adminLogin(form.phone, form.password)
        } catch {
          // try driver login
          data = await driverLogin(form.phone, form.password)
        }
      }

      if (data?.access_token) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user_phone", form.phone)

        // Decode JWT payload to get role
        const payload = JSON.parse(
          atob(data.access_token.split(".")[1])
        )

        alert(`Login Successful as ${payload.role}`)

        if (payload.role === "admin") {
          router.push("/admin")
        } else if (payload.role === "driver") {
          router.push("/driver")
        } else {
          router.push("/")
        }
      } else {
        setError("Invalid phone or password")
      }
    } catch (err) {
      console.error(err)
      setError(err?.detail || "Server connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <form
        onSubmit={handleSubmit}
        className="
          bg-white 
          p-6 sm:p-8 
          rounded-xl 
          shadow-lg 
          w-full 
          max-w-md 
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="w-full mt-4 border border-blue-600 text-blue-600 p-3 rounded hover:bg-blue-50 transition-colors"
        >
          Create New Account
        </button>

      </form>
    </div>
  )
}