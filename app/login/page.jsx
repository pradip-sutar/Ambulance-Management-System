"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Clock, Truck, Users, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ✅ IMPORT API
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

      try {
        data = await userLogin(form.phone, form.password)
      } catch {
        try {
          data = await adminLogin(form.phone, form.password)
        } catch {
          data = await driverLogin(form.phone, form.password)
        }
      }

      if (data?.access_token) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user_phone", form.phone)

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
    <div className="flex min-h-screen relative overflow-hidden">

      {/* ========================================= */}
      {/* FULL-WIDTH BACKGROUND IMAGE               */}
      {/* ========================================= */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/hero-ambulance2.png')",
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      {/* Deep blue gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-slate-900/90 z-[2]" />

      {/* ========================================= */}
      {/* LEFT SIDE: HERO SECTION (Hidden on Mobile) */}
      {/* ========================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="relative z-20 flex flex-col justify-center p-12 xl:p-20">
          <div className="max-w-lg">
            {/* Verified Badge */}
            <Badge
              variant="secondary"
              className="mb-6 border border-white/20 bg-white/10 px-4 py-2 text-white/90 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              24/7 Verified Service
            </Badge>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
              Book an <br />
              ambulance in{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                seconds.
              </span>
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-md text-base leading-relaxed text-white/80">
              Fast, reliable emergency medical transport when every second counts.
              Our network of verified ambulances is ready to respond 24/7.
            </p>

            {/* Stats Container */}
            <div className="grid grid-cols-3 gap-4">
              <StatIndicator
                icon={<Clock className="h-5 w-5" />}
                value="< 12 min"
                label="Avg arrival"
              />
              <StatIndicator
                icon={<Truck className="h-5 w-5" />}
                value="24/7"
                label="Emergency service"
              />
              <StatIndicator
                icon={<Users className="h-5 w-5" />}
                value="100%"
                label="Trained crew"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT SIDE: GLASS LOGIN FORM              */}
      {/* ========================================= */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2 relative z-10">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
                A
              </div>
              <span className="text-xl font-bold text-white">Ambulance</span>
            </div>
            {/* ✅ CLOSE BUTTON - Mobile */}
            <button
              onClick={() => router.push("/")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-110"
              title="Back to Booking"
            >
              <X size={18} />
            </button>
          </div>

          {/* GLASS CARD */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative">

            {/* ✅ CLOSE BUTTON - Desktop (top-right of card) */}
            <button
              onClick={() => router.push("/")}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/60 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-110"
              title="Back to Booking"
            >
              <X size={16} />
            </button>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Admin/Driver Login
            </h2>
            <p className="mt-2 text-white/60">
              Sign in to your account to continue
            </p>

            {error && (
              <div className="mt-4 bg-red-500/15 text-red-300 p-3 rounded-lg text-sm border border-red-500/20 backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-white/15 bg-white/[0.06] text-white placeholder-white/35 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent backdrop-blur-sm transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-white/15 bg-white/[0.06] text-white placeholder-white/35 p-3 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600/90 text-white p-3 rounded-lg font-semibold hover:bg-blue-500 disabled:bg-blue-600/50 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 backdrop-blur-sm"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

          </div>
          {/* END GLASS CARD */}

        </div>
      </div>
    </div>
  )
}

/* ---------------- HELPER UI COMPONENT ---------------- */
function StatIndicator({ icon, value, label }) {
  return (
    <div className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md transition-all hover:bg-white/15 hover:scale-[1.02]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/30 text-blue-100 group-hover:bg-blue-500/50 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          {value}
        </h3>
        <p className="text-sm font-medium text-white/70">
          {label}
        </p>
      </div>
    </div>
  )
}