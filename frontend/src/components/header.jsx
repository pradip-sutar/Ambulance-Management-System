import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  Phone,
  LogIn,
  LogOut,
} from "lucide-react"

export function Header() {
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      setIsLoggedIn(true)

      try {
        const payload = JSON.parse(
          atob(token.split(".")[1])
        )

        setRole(payload.role)
      } catch (err) {
        console.log(err)
      }
    }
  }, [])

  const handleLogin = () => {
    navigate("/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">

      {/* TOP BAR */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-0 sm:px-4 py-2 lg:py-0 gap-3">

        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Logo 1 (Always Visible) */}
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 lg:h-36 lg:w-36 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Mobile Content */}
          <div className="flex flex-col">

            <img
              src="/ambulance-seba.png"
              alt="Ambulance Seba"
              className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px] object-contain lg:hidden"
            />

            {/* MOBILE BUTTONS */}
            <div className="flex flex-wrap gap-2 mt-2 lg:hidden">

              <a
                href="tel:9776696669"
                className="flex items-center gap-1 rounded-full bg-red-600 px-1 py-1.5 text-[11px] sm:text-xs font-semibold text-white"
              >
                <Phone className="h-3 w-3" />
                9776696669
              </a>

              <a
                href="tel:9348616669"
                className="flex items-center gap-1 rounded-full bg-red-600 px-1 py-1.5 text-[11px] sm:text-xs font-semibold text-white"
              >
                <Phone className="h-3 w-3" />
                9348616669
              </a>

              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white"
                >
                  <LogIn className="h-3 w-3" />
                  
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white"
                >
                  <LogOut className="h-3 w-3" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div className="hidden lg:flex flex-1 px-0">
          <img
            src="/ambulance-seba.png"
            alt="Ambulance Seba"
            className="h-30 xl:h-32 w-auto max-w-4xl "
          />
        </div>

        {/* Logo 2 (Hidden on Mobile, Visible on Desktop) ✅ */}
        <div className="hidden lg:flex h-36 w-36 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-full w-full object-cover"
          />
        </div>

      </div>

      <div className="container mt-[10px] mb-[5px] mx-auto flex flex-col lg:flex-row items-center justify-end px-0 sm:px-4 py-2 lg:py-0 gap-3">
        <div className="hidden lg:flex items-center gap-4">

          <a
            href="tel:9776696669"
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm xl:text-base font-semibold text-white hover:scale-105 transition"
          >
            <Phone className="h-4 w-4" />
            9776696669
          </a>

          <a
            href="tel:9348616669"
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm xl:text-base font-semibold text-white hover:scale-105 transition"
          >
            <Phone className="h-4 w-4" />
            9348616669
          </a>

          <a
            href="tel:9006706355"
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm xl:text-base font-semibold text-white hover:scale-105 transition"
          >
            <Phone className="h-4 w-4" />
            9006706355
          </a>

          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm xl:text-base font-semibold text-white hover:bg-blue-700"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm xl:text-base font-semibold text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              Logout ({role})
            </button>
          )}

        </div> 
      </div>
    </header>
  )
}