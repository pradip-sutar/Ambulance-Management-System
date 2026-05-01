"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Phone, Ambulance } from "lucide-react"
import { toast } from "sonner"

import {
  getDriverBookings,
  updateBookingStatus,
  acceptBooking,
  rejectBooking,
} from "@/components/api/driverapi"

export default function DriverDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const data = await getDriverBookings()
      setBookings(data)
    } catch (err) {
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id) => {
  try {
    await acceptBooking(id)

    toast.success("Booking accepted")

    fetchBookings() // refresh
  } catch (err) {
    toast.error("Already taken by another driver")
  }
}

const handleReject = async (id) => {
  try {
    await rejectBooking(id)

    toast.success("Booking rejected")

    fetchBookings()
  } catch {
    toast.error("Reject failed")
  }
}

  const handleAction = async (id, status) => {
    try {
      await updateBookingStatus(id, status)

      toast.success(`Status updated: ${status}`)

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status } : b
        )
      )
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Ambulance className="h-5 w-5" />
            Driver Dashboard
          </CardTitle>
        </CardHeader>
      </Card>

      {bookings.length === 0 && (
        <p className="text-center text-muted-foreground">
          No bookings assigned
        </p>
      )}

      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="p-4 space-y-3">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <p className="font-medium">
                Reg No: {booking.registration_number}
              </p>

              <Badge>{booking.status}</Badge>
            </div>

            {/* PATIENT */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {booking.patient_name} ({booking.patient_age})
            </div>

            {/* CONTACT */}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {booking.booker_phone}
            </div>

            {/* LOCATION */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1" />
              <div>
                <p><strong>Pickup:</strong> {booking.pickup_address}</p>
                <p><strong>Drop:</strong> {booking.drop_address || "N/A"}</p>
              </div>
            </div>

            {/* CONDITION */}
            <p className="text-sm text-muted-foreground">
              {booking.medical_condition}
            </p>

            {/* ACTION BUTTONS */}
           <div className="flex gap-2 flex-wrap">

  {/* 🟢 MULTI-DRIVER ACCEPT */}
  {booking.status === "pending" && booking.driver_id === null && (
    <>
      <Button onClick={() => handleAccept(booking.id)}>
        Accept
      </Button>

      <Button
        variant="destructive"
        onClick={() => handleReject(booking.id)}
      >
        Reject
      </Button>
    </>
  )}

  {/* 🚑 DRIVER FLOW */}
  {booking.status === "assigned" && booking.driver_id === 1 && (
    <Button onClick={() => handleAction(booking.id, "on_the_way")}>
      Start Ride
    </Button>
  )}

  {booking.status === "on_the_way" && (
    <Button onClick={() => handleAction(booking.id, "picked")}>
      Patient Picked
    </Button>
  )}

  {booking.status === "picked" && (
    <Button onClick={() => handleAction(booking.id, "completed")}>
      Complete
    </Button>
  )}

</div>

          </CardContent>
        </Card>
      ))}
    </div>
  )
}