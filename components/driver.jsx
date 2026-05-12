"use client"

import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import {
  MapPin,
  User,
  Phone,
  Ambulance,
} from "lucide-react"

import { toast } from "sonner"

import {
  getDriverBookings,
  updateBookingStatus,
  acceptBooking,
  rejectBooking,
  uploadPickupProof,
  uploadDropProof,
} from "./api/driverapi"

export default function DriverDashboard() {

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const [driverId, setDriverId] = useState(null)
  const [pickupProof, setPickupProof] = useState({})
const [dropProof, setDropProof] = useState({})
  const [pickupKm, setPickupKm] = useState({})
const [dropKm, setDropKm] = useState({})
const completedTrips = bookings.filter(
  (b) => b.status === "completed"
).length

  // ===================================================
  // GET DRIVER ID FROM TOKEN
  // ===================================================
  useEffect(() => {

    const token = localStorage.getItem("token")

    if (token) {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      )

      setDriverId(payload.id)
    }

    fetchBookings()

  }, [])

  // ===================================================
  // FETCH BOOKINGS
  // ===================================================
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

  // ===================================================
  // ACCEPT BOOKING
  // ===================================================
  const handleAccept = async (id) => {

    try {

      await acceptBooking(id)

      toast.success("Booking accepted")

      fetchBookings()

    } catch (err) {

      toast.error("Already taken by another driver")
    }
  }

 const handleReached = async (id) => {
  if (!pickupProof[id]) {
    toast.error("Upload proof photo")
    return
  }

  if (!pickupKm[id]) {
    toast.error("Enter pickup KM reading")
    return
  }

  try {
    await uploadPickupProof(id, pickupProof[id])

    await handleAction(id, "on_the_way", {
      pickup_km: pickupKm[id],
    })

    toast.success("Pickup proof uploaded")

  } catch {
    toast.error("Upload failed")
  }
}



const handleCompleteRide = async (id) => {
  if (!dropProof[id]) {
    toast.error("Upload hospital photo")
    return
  }

  if (!dropKm[id]) {
    toast.error("Enter drop KM reading")
    return
  }

  try {
    await uploadDropProof(id, dropProof[id])

    await handleAction(id, "completed", {
      drop_km: dropKm[id],
    })

    toast.success("Ride completed")

  } catch {
    toast.error("Completion failed")
  }
}
  // ===================================================
  // REJECT BOOKING
  // ===================================================
  const handleReject = async (id) => {

    try {

      await rejectBooking(id)

      toast.success("Booking rejected")

      fetchBookings()

    } catch {

      toast.error("Reject failed")
    }
  }

  // ===================================================
  // UPDATE STATUS
  // ===================================================
  const handleAction = async (id, status, extra = {}) => {
  try {
    await updateBookingStatus(id, status, extra)

    toast.success(`Status updated: ${status}`)

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status } : b
      )
    )

  } catch {
    toast.error("Failed to update status")
  }
}

  if (loading) {
    return <p className="p-4">Loading...</p>
  }

  return (

    <div className="p-4 space-y-4">
 
      {/* HEADER */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Ambulance className="h-5 w-5" />
            Driver Dashboard
          </CardTitle>
        </CardHeader>
      </Card>  */}

      {/* HEADER */}
<Card>
  <CardHeader>
    <div className="flex justify-between items-center">

      <CardTitle className="flex gap-2 items-center">
        <Ambulance className="h-5 w-5" />
        Driver Dashboard
      </CardTitle>

      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          Total Completed Trips
        </p>

        <h2 className="text-2xl font-bold">
          {completedTrips}
        </h2>
      </div>

    </div>
  </CardHeader>
</Card>

      {/* EMPTY */}
      {bookings.length === 0 && (
        <p className="text-center text-muted-foreground">
          No bookings assigned
        </p>
      )}

      {/* BOOKINGS */}
      {bookings.map((booking) => (

        <Card key={booking.id}>

          <CardContent className="p-4 space-y-3">

            {/* HEADER */}
            <div className="flex justify-between items-center">

              <p className="font-medium">
                Reg No: {booking.registration_number}
              </p>

              <Badge>
                {booking.status}
              </Badge>

            </div>

            {/* PATIENT */}
            <div className="flex items-center gap-2">

              <User className="h-4 w-4" />

              {booking.patient_name}
              ({booking.patient_age})

            </div>

            {/* PHONE */}
            <div className="flex items-center gap-2">

              <Phone className="h-4 w-4" />

              {booking.booker_phone}

            </div>

            <div className="flex gap-2 flex-wrap">

              {/* PICKUP MAP */}
              <Button
  variant="outline"
  onClick={() => {

    if (
      !booking.pickup_lat ||
      !booking.pickup_lng
    ) {

      toast.error(
        "Pickup coordinates not available"
      )

      return
    }

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${booking.pickup_lat},${booking.pickup_lng}`,
      "_blank"
    )
  }}
>
  Pickup Location
</Button>

              {/* DROP MAP */}
              {booking.drop_location && (
                <Button
                  variant="outline"
                 onClick={() => {

  if (
    !booking.drop_location ||
    !booking.drop_location.lat ||
    !booking.drop_location.lng
  ) {

    toast.error(
      "Hospital coordinates not available"
    )

    return
  }

  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${booking.drop_location.lat},${booking.drop_location.lng}`,
    "_blank"
  )
}}
                >
                  Hospital Location
                </Button>
              )}

            </div>

            {/* LOCATION */}
            <div className="flex items-start gap-2">

              <MapPin className="h-4 w-4 mt-1" />

              <div>

                <p>
                  <strong>Pickup:</strong>
                  {" "}
                  {booking.pickup_address}
                </p>

                <p>
                  <strong>Drop:</strong>
                  {" "}
                  {booking.drop_address || "N/A"}
                </p>

              </div>
            </div>

            {/* CONDITION */}
            <p className="text-sm text-muted-foreground">
              {booking.medical_condition}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 flex-wrap">

              {/* ACCEPT / REJECT */}
              {booking.status === "pending" &&
                booking.driver_id === null && (
                  <>
                    <Button
                      onClick={() =>
                        handleAccept(booking.id)
                      }
                    >
                      Accept
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleReject(booking.id)
                      }
                    >
                      Reject
                    </Button>
                  </>
                )
              }

              {/* START RIDE */}
              {booking.status === "assigned" &&
                booking.driver_id === driverId && (

<div className="space-y-2">

  <Input
    type="number"
    placeholder="Pickup KM Reading"
    value={pickupKm[booking.id] || ""}
    onChange={(e) =>
      setPickupKm((prev) => ({
        ...prev,
        [booking.id]: e.target.value,
      }))
    }
  />

  {/* HIDDEN FILE INPUT */}
  <input
    id={`pickup-photo-${booking.id}`}
    type="file"
    accept="image/*"
    capture="environment"
    className="hidden"
    onChange={(e) =>
      setPickupProof((prev) => ({
        ...prev,
        [booking.id]: e.target.files[0],
      }))
    }
  />

  {/* BUTTON */}
  <Button
    type="button"
    variant="outline"
    onClick={() =>
      document
        .getElementById(
          `pickup-photo-${booking.id}`
        )
        .click()
    }
  >
    {pickupProof[booking.id]
      ? "Pickup Photo Added ✓"
      : "Add Pickup Photo"}
  </Button>

  <Button
    onClick={() => handleReached(booking.id)}
  >
    Reached Pickup
  </Button>

</div>
                )
              }

              {/* PICKED */}
              {booking.status === "on_the_way" &&
                booking.driver_id === driverId && (
                  <Button
                    onClick={() =>
                      handleAction(
                        booking.id,
                        "picked"
                      )
                    }
                  >
                    Patient Picked
                  </Button>
                )
              }

              {/* COMPLETE */}
              {booking.status === "picked" &&
                booking.driver_id === driverId && (
                  <div className="space-y-2">

  <Input
    type="number"
    placeholder="Drop KM Reading"
    value={dropKm[booking.id] || ""}
    onChange={(e) =>
      setDropKm((prev) => ({
        ...prev,
        [booking.id]: e.target.value,
      }))
    }
  />

  {/* HIDDEN FILE INPUT */}
  <input
    id={`drop-photo-${booking.id}`}
    type="file"
    accept="image/*"
    capture="environment"
    className="hidden"
    onChange={(e) =>
      setDropProof((prev) => ({
        ...prev,
        [booking.id]: e.target.files[0],
      }))
    }
  />

  {/* BUTTON */}
  <Button
    type="button"
    variant="outline"
    onClick={() =>
      document
        .getElementById(
          `drop-photo-${booking.id}`
        )
        .click()
    }
  >
    {dropProof[booking.id]
      ? "Hospital Photo Added ✓"
      : "Add Hospital Photo"}
  </Button>

  <Button
    onClick={() =>
      handleCompleteRide(booking.id)
    }
  >
    Complete Ride
  </Button>

</div>
                )
              }

            </div>

          </CardContent>

        </Card>

      ))}

    </div>
  )
}