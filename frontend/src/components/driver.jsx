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
  CheckCircle,
  XCircle,
  Navigation,
  Flag,
  Camera,
  Inbox,
} from "lucide-react"
import { toast } from "sonner"
import {
  getDriverBookings,
  updateBookingStatus,
  acceptBooking,
  rejectBooking,
  uploadDropProof,
} from "./api/driverapi"

// Helper function to style badges based on status
const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "assigned":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "on_the_way":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "picked":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function DriverDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [driverId, setDriverId] = useState(null)
  const [dropProof, setDropProof] = useState({})

  const completedTrips = bookings.filter((b) => b.status === "completed").length
  const visibleBookings = bookings.filter((b) => b.status !== "completed")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setDriverId(payload.id)
    }
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
      fetchBookings()
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

  const handleAction = async (id, status, extra = {}) => {
    try {
      await updateBookingStatus(id, status, extra)
      toast.success(`Status updated: ${status.replace("_", " ")}`)
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status, ...extra } : b))
      )
    } catch {
      toast.error("Failed to update status")
    }
  }

  const handleReached = async (id) => {
    await handleAction(id, "on_the_way")
  }

  const handleCompleteRide = async (id) => {
    try {
      let extraData = {}
      
      if (dropProof[id]) {
        const uploadRes = await uploadDropProof(id, dropProof[id])
        extraData.drop_proof_url = uploadRes.url
      }

      await handleAction(id, "completed", extraData)
      toast.success("Ride completed!")
      
      setDropProof((prev) => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
    } catch {
      toast.error("Completion failed")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Ambulance className="h-8 w-8 animate-pulse text-primary mr-2" />
        <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100 pb-8">
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Ambulance className="h-6 w-6 text-red-500" />
              Driver Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Manage your assigned trips</p>
          </div>
          <Card className="shadow-none border-none bg-red-50 text-red-800">
            <CardContent className="p-3 text-center">
              <p className="text-xs font-medium">Completed</p>
              <h2 className="text-2xl font-bold">{completedTrips}</h2>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        {visibleBookings.length === 0 && (
          <div className="mt-20 flex flex-col items-center justify-center text-muted-foreground">
            <Inbox className="h-16 w-16 mb-4 stroke-1" />
            <h3 className="text-lg font-semibold">No Bookings Assigned</h3>
            <p className="text-sm">New trips will appear here when assigned.</p>
          </div>
        )}

        {visibleBookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden border shadow-sm">
            {/* Card Header - Reg No & Status */}
            <div className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center">
              <p className="font-semibold text-slate-900 tracking-wide">
                REG: {booking.registration_number}
              </p>
              <Badge variant="outline" className={`capitalize ${getStatusStyle(booking.status)}`}>
                {booking.status.replace("_", " ")}
              </Badge>
            </div>

            <CardContent className="p-4 space-y-4">
              {/* Booker Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-800">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{booking.booker_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <a href={`tel:${booking.booker_phone}`} className="text-blue-600 hover:underline">
                    {booking.booker_phone}
                  </a>
                </div>
              </div>

              {/* Route Timeline */}
              <div className="bg-slate-50 rounded-lg p-3 border">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                    <div className="flex-1 w-px bg-slate-300 my-1" />
                    <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">PICKUP</p>
                      <p className="text-sm text-slate-900">{booking.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">DROP</p>
                      <p className="text-sm text-slate-900">{booking.drop_address || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Condition */}
              {booking.medical_condition && (
                <div className="text-sm text-slate-600 bg-amber-50 p-2 rounded border border-amber-100">
                  <span className="font-semibold text-amber-800">Condition: </span> 
                  {booking.medical_condition}
                </div>
              )}

              {/* Map Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => {
                    if (!booking.pickup_lat || !booking.pickup_lng) return toast.error("Pickup coordinates not available")
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${booking.pickup_lat},${booking.pickup_lng}`, "_blank")
                  }}
                >
                  <Navigation className="h-3.5 w-3.5 mr-1" /> Navigate Pickup
                </Button>
                {booking.drop_location && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      if (!booking.drop_location?.lat || !booking.drop_location?.lng) return toast.error("Hospital coordinates not available")
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${booking.drop_location.lat},${booking.drop_location.lng}`, "_blank")
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" /> Navigate Hospital
                  </Button>
                )}
              </div>

              {/* Action Area */}
              <div className="pt-2 border-t">
                {booking.status === "pending" && booking.driver_id === null && (
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleAccept(booking.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Accept
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleReject(booking.id)}>
                      <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </div>
                )}

                {booking.status === "assigned" && booking.driver_id === driverId && (
                  <div className="space-y-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm font-semibold text-blue-900">Action Required: Reach Pickup</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleReached(booking.id)}
                    >
                      <Flag className="h-4 w-4 mr-2" /> Reached Pickup
                    </Button>
                  </div>
                )}

                {booking.status === "on_the_way" && booking.driver_id === driverId && (
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleAction(booking.id, "picked")}>
                    <User className="h-4 w-4 mr-2" /> Patient Picked Up
                  </Button>
                )}

                {booking.status === "picked" && booking.driver_id === driverId && (
                  <div className="space-y-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <p className="text-sm font-semibold text-orange-900">Action Required: Complete Trip</p>
                    
                    {/* Optional Drop Photo Upload */}
                    <div className="flex items-center gap-2">
                      <input 
                        id={`drop-photo-${booking.id}`} 
                        type="file" 
                        accept="image/*"
                        // ✅ REMOVED capture="environment" so mobile prompts Camera OR Gallery
                        className="hidden" 
                        onChange={(e) => setDropProof((prev) => ({ ...prev, [booking.id]: e.target.files[0] }))} 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => document.getElementById(`drop-photo-${booking.id}`).click()}
                      >
                        <Camera className="h-4 w-4 mr-2" /> 
                        {dropProof[booking.id] ? "Photo Added ✓" : "Upload Hospital Photo (Optional)"}
                      </Button>
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleCompleteRide(booking.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Complete Ride
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}