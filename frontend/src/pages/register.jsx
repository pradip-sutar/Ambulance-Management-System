import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../components/api/user"

import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await registerUser(form)

      if (res?.error) {
        setError(res.message || "Registration failed")
      } else {
        alert("Registered successfully! Please login now.")
        navigate("/login")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

      <div 
        className="
          bg-white 
          p-6 sm:p-8 
          rounded-xl 
          shadow-lg 
          w-full 
          max-w-md
        "
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Create New Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name Input */}
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="
              border border-gray-300 
              p-3 w-full rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500 
              transition-shadow
            "
          />

          {/* Phone Input */}
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="
              border border-gray-300 
              p-3 w-full rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500 
              transition-shadow
            "
          />

          {/* Password Input with Eye Toggle */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="
                border border-gray-300 
                p-3 w-full rounded-lg 
                pr-12 
                focus:outline-none focus:ring-2 focus:ring-green-500 
                transition-shadow
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              bg-green-600 hover:bg-green-700 
              text-white font-medium 
              p-3 w-full rounded-lg 
              transition 
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm
            "
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login Link Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              border border-blue-600 text-blue-600 hover:bg-blue-50 
              font-medium 
              p-3 w-full rounded-lg 
              transition
              shadow-sm
            "
          >
            Already have an account? Login
          </button>

        </form>
      </div>
    </div>
  )
}