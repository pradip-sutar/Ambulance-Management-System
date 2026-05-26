import { useEffect, useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { createBooking, getMyBookings } from "./api/bookingApi"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"
import { toast } from "sonner"
import { User, MapPin, Ambulance } from "lucide-react"

/* ---------------- HELPERS ---------------- */
const MapPicker = lazy(() => import("./ui/MapPicker"))

/* ---------------- MAIN COMPONENT ---------------- */

const hospitals = [
  { name: "SCB Medical", address: "Cuttack" },
  { name: "Community Health Centre", address: "Mahanga" },
  { name: "Community Health Centre", address: "Barchana" },
  { name: "Community Health Centre", address: "Jagannathpur" },
  { name: "Community Health Centre", address: "Salepur" },
  
]

const ambulanceTypes = [
  { value: "basic", label: "Basic" },
]

export function BookingForm({ onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pickupLocation, setPickupLocation] = useState(null)
  const [myBookings, setMyBookings] = useState([])
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const [formData, setFormData] = useState({
    bookerName: "",
    bookerPhone: "",
    bookerAddress: "",
    bookingDate: "",
    bookingTime: "",
    pickupAddress: "",
    dropAddress: "",
    ambulanceType: "",
    registrationNumber: "",
  })

  useEffect(() => {
  setMounted(true)

  setFormData((prev) => ({
    ...prev,
    bookingDate: new Date().toISOString().split("T")[0],
    bookingTime: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }))
}, [])

  useEffect(() => {
    const phone = localStorage.getItem("user_phone")
    if (phone) loadBookings(phone)
  }, [])


  useEffect(() => {
  const nextNumber = 50 + myBookings.length

  setFormData((prev) => ({
    ...prev,
    registrationNumber: `AMB-${String(nextNumber).padStart(3, "0")}`,
  }))
}, [myBookings])


  const loadBookings = async (phone) => {
    try {
      const data = await getMyBookings(phone)
      setMyBookings(data)
    } catch (err) {
      console.error("Failed to load bookings:", err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, ambulanceType: value }))
  }

  const handleHospitalSelect = (value) => {
    setFormData((prev) => ({ ...prev, dropAddress: value }))
  }

  const handleMapSelect = (data) => {
    setPickupLocation({ lat: data.lat, lng: data.lng })
    const addressString = data.address || `${data.lat}, ${data.lng}`
    setFormData((prev) => ({ ...prev, pickupAddress: addressString }))
    setIsMapOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const requiredFields = ["bookerName", "bookerPhone", "pickupAddress", "ambulanceType"]
    const missing = requiredFields.filter((f) => !formData[f])

    if (missing.length > 0) {
      toast.error("Please fill all required fields")
      setIsSubmitting(false)
      return
    }

    const payload = {
      registration_number: formData.registrationNumber,
      booker_name: formData.bookerName,
      booker_phone: formData.bookerPhone,
      booker_address: formData.bookerAddress,
      pickup_address: formData.pickupAddress,
      drop_address: formData.dropAddress,
      ambulance_type: formData.ambulanceType,
      booking_date: formData.bookingDate,
      booking_time: formData.bookingTime,
      pickup_location: pickupLocation
        ? { lat: pickupLocation.lat, lng: pickupLocation.lng }
        : null,
    }

    try {
      const data = await createBooking(payload)
      
      // ✅ DIRECT CALL immediately upon successful booking
      window.location.href = "tel:+919776696669"
      
      setSuccessOpen(true)
      if (onSubmit) onSubmit(data)
      
     const phone = localStorage.getItem("user_phone")

if (phone) {
  const updatedBookings = await getMyBookings(phone)

  setMyBookings(updatedBookings)

  const nextNumber = 50 + updatedBookings.length

  setFormData({
    bookerName: "",
    bookerPhone: "",
    bookerAddress: "",
    pickupAddress: "",
    dropAddress: "",
    ambulanceType: "",
    bookingDate: new Date().toISOString().split("T")[0],
    bookingTime: new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    registrationNumber: `AMB-${String(nextNumber).padStart(3, "0")}`,
  })
}
    } catch (error) {
      toast.error(error.message || "Booking failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-5">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Ambulance className="h-6 w-6" />
            Book Ambulance
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* BOOKING PERSON */}
            <Section icon={<User />} title="Booking Person">
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Name *" name="bookerName" value={formData.bookerName} onChange={handleInputChange} />
                <Field label="Phone *" name="bookerPhone" value={formData.bookerPhone} onChange={handleInputChange} />
                <div className="sm:col-span-2 lg:col-span-3">
                  <Field label="Address" name="bookerAddress" value={formData.bookerAddress} onChange={handleInputChange} />
                </div>
              </div>
            </Section>

            {/* SERVICE DETAILS */}
            <Section icon={<MapPin />} title="Service Details">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Pickup Address *</Label>
                  <div className="relative">
                    <Textarea
                      name="pickupAddress"
                      placeholder="Enter address manually or click the icon to use map"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      rows={2}
                      className="pr-10 w-full text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 z-10 hover:bg-accent"
                      onClick={() => setIsMapOpen(true)}
                      title="Open Map Picker"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Drop Hospital</Label>
                    <Select value={formData.dropAddress} onValueChange={handleHospitalSelect}>
                      <SelectTrigger className="w-full bg-white border">
                        <SelectValue placeholder="Select Hospital" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {hospitals.map((h, i) => (
                          <SelectItem
                            key={`${h.name}-${h.address}-${i}`}
                            value={`${h.name}, ${h.address}`}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{h.name}</span>
                              <span className="text-xs text-muted-foreground">{h.address}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Ambulance Type *</Label>
                    <Select value={formData.ambulanceType} onValueChange={handleSelectChange}>
                      <SelectTrigger className="w-full bg-white border">
                        <SelectValue placeholder="Select Ambulance Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {ambulanceTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Section>

            {mounted && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Booking Date" name="bookingDate" value={formData.bookingDate} disabled />
                <Field label="Booking Time" name="bookingTime" value={formData.bookingTime} disabled />
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Dispatching..." : "Request Ambulance"}
            </Button>

            {mounted && (
              <p className="text-xs text-gray-500 text-center mt-1">
                Booking ID: {formData.registrationNumber}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* USER BOOKINGS */}
      <div className="space-y-3">
        {myBookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b pb-2">
                <p className="font-bold text-lg">{booking.registration_number}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit sm:ml-auto">
                  {booking.status}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex flex-col sm:flex-row">
                  <span className="font-medium text-gray-500 w-full sm:w-32">Pickup:</span>
                  <span className="break-words text-gray-700">{booking.pickup_address}</span>
                </div>
              </div>

              {booking.driver ? (
                <div className="border rounded-md p-2 bg-green-50 space-y-1 text-sm">
                  <h3 className="font-semibold text-green-700">Driver Assigned</h3>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-600 w-full sm:w-24">Name:</span>
                    <span>{booking.driver.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-600 w-full sm:w-24">Phone:</span>
                    <span className="text-blue-600">{booking.driver.phone}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-600 w-full sm:w-24">Vehicle:</span>
                    <span>{booking.driver.vehicle_number}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 p-2 rounded-md text-sm flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  Waiting for driver acceptance...
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ✅ SUCCESS DIALOG — No Call Button, Shows Booker Name */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-[350px] text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-green-700">
              <Ambulance className="h-4 w-4" />
              Booking Confirmed!
            </DialogTitle>
            {formData.bookerName && (
                <div className="text-sm text-slate-700 justify-center flex items-center gap-2 mt-0">
                  Thank you <span className="font-semibold">{formData.bookerName}</span>
                </div>
              )}
            <DialogDescription className="space-y-1 pt-0 justify-center flex items-center flex-col">
              <p>Your ambulance has been booked successfully.</p>
              
              {/* ✅ BOOKING PERSON NAME */}
              

              <div className="font-bold text-sm text-blue-600">
                Booking ID: {formData.registrationNumber}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* MAP DIALOG */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-3 border-b">
            <DialogTitle>Select Pickup Location</DialogTitle>
            <DialogDescription>
              Click anywhere on the map to confirm the pickup location.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-[400px]">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full bg-gray-100 text-muted-foreground">
                Loading map...
              </div>
            }>
              <MapPicker onSelectLocation={handleMapSelect} />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------------- HELPER UI COMPONENTS ---------------- */

function Section({ icon, title, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-medium text-base text-gray-800">
        {icon}
        {title}
      </div>
      <div className="p-3 border rounded-lg bg-white shadow-sm">{children}</div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <Input {...props} className="w-full h-9 text-sm" />
    </div>
  )
}