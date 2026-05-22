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
    // <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
    <header className="sticky top-0 z-50 w-full bg-white border-b">

      {/* TOP BAR */}
      <div className="container mx-auto flex flex-col lg:flex-row lg:h-16 items-center justify-between px-4 py-3 lg:py-0 gap-3">

        {/* LEFT: Logo + Mobile Title */}
        <div className="flex items-center gap-3">
          
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-white shadow-sm">
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
              alt="Basanta Kumar Nath"
              className="h-12 w-auto max-w-[280px] object-contain lg:hidden"
            />

            {/* MOBILE BUTTONS */}
            <div className="flex flex-wrap gap-1 mt-1 lg:hidden">

              <a
                href="tel:9776696669"
                className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white"
              >
                <Phone className="h-1 w-1" />
                9776696669
              </a>

              <a
                href="tel:9348616669"
                className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white"
              >
                <Phone className="h-1 w-1" />
                9348616669
              </a>

              {/* <a
                href="tel:9006706355"
                className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white"
              >
                <Phone className="h-1 w-1" />
                9006706355
              </a> */}

              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white"
                >
                  <LogIn className="h-1 w-1" />
                  Login
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-full bg-black px-2 py-1 text-xs font-semibold text-white"
                >
                  <LogOut className="h-1 w-1" />
                  Logout
                </button>
              )}

            </div>
          </div>
        </div>

        {/* CENTER IMAGE (Desktop Only) */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <img
            src="/ambulance-seba.png"
            alt="Basanta Kumar Nath"
            className="h-12 w-auto max-w-lg object-contain"
          />
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="hidden lg:flex items-center gap-3">

          <a
            href="tel:9776696669"
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            <span>9776696669</span>
          </a>

          <a
            href="tel:9348616669"
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            <span>9348616669</span>
          </a>

          <a
            href="tel:9006706355"
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            <span>9006706355</span>
          </a>

          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <LogIn className="h-4 w-4" />
             
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
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