"use client"

import { useState } from "react"
import { Toaster } from "sonner"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BookingForm } from "@/components/booking-form"
import { RecentBookings } from "@/components/recent-bookings"
import { Footer } from "@/components/footer"

export default function Home() {
  const [bookings, setBookings] = useState([])

  const handleNewBooking = (booking) => {
    setBookings((prev) => [booking, ...prev])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      
      {/* 
        Changed max-w-5xl to max-w-7xl to stretch across laptop screens.
        Added responsive padding (lg:px-8 lg:py-20) for more breathing room on desktop.
      */}
      <main className="container mx-auto flex-1 px-4 py-10 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <BookingForm onSubmit={handleNewBooking} />
        </div>
      </main>

      <Footer />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          classNames: {
            toast: "shadow-elegant",
          },
        }}
      />
    </div>
  )
}