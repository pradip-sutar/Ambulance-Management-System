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
      
      <main className="container mx-auto flex-1 px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <BookingForm onSubmit={handleNewBooking} />
          {/* <RecentBookings bookings={bookings} /> */}
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