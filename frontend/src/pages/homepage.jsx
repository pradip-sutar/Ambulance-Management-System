"use client"

import { useState, useEffect } from "react"
import { Toaster } from "sonner"
import { Header } from "../components/header"
import { Hero } from "../components/hero"
import { BookingForm } from "../components/booking-form"
import { RecentBookings } from "../components/recent-bookings"
import { Footer } from "../components/footer"

export default function Home() {
   useEffect(() => {
  if (window.location.hash === "#booking-form") {
    const element = document.getElementById("booking-form")

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  } else {
    window.scrollTo(0, 0)
  }
}, [])

  const [bookings, setBookings] = useState([])
  

  const handleNewBooking = (booking) => {
    setBookings((prev) => [booking, ...prev])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      
      {/* 
        Main Content Area
        - py-8 px-4 sm:px-6 for mobile spacing
        - md:py-12 lg:py-16 for larger screen vertical spacing
        - bg-blue-50 is softer on the eyes for large backgrounds
      */}
      <main className="flex-1 w-full bg-blue-50 py-8 px-4 sm:px-6 md:py-12 lg:py-16 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          
          {/* 
            Responsive Grid Layout
            - 1 column by default (mobile)
            - 3 columns on large screens (lg)
            - gap-6 sm:gap-8 for spacing between columns
          */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Booking Form Section - Takes up 2 columns on desktop */}
            <div className="lg:col-span-3">
              <BookingForm onSubmit={handleNewBooking} />
            </div>

            {/* Recent Bookings Section - Takes up 1 column on desktop */}
            {/* <div className="lg:col-span-1">
              <RecentBookings bookings={bookings} />
            </div> */}

          </div>
          
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