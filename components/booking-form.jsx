"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createBooking, getMyBookings } from "./api/bookingApi"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { User, Heart, Users, MapPin, Ambulance } from "lucide-react"
import dynamic from "next/dynamic"

/* ---------------- HELPERS ---------------- */
const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), {
  ssr: false,
})

const generateRegNo = () => {
  return "AMB-" + Date.now().toString().slice(-8)
}

const calculateAge = (dob) => {
  if (!dob) return ""
  const birthDate = new Date(dob)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age >= 0 ? age : ""
}

/* ---------------- MAIN COMPONENT ---------------- */

const hospitals = [
  { name: "SCB Medical", address: "Cuttack" },
  { name: "Community Health Centre", address: "Mahanga" },
  { name: "Community Health Centre", address: " Barchana" },
  { name: "Community Health Centre", address: "Jagannathpur" },
]

const ambulanceTypes = [
  { value: "basic", label: "Basic" },
  { value: "als", label: "Advanced Life Support" },
  { value: "icu", label: "ICU" },
  { value: "neonatal", label: "Neonatal" },
]

export function BookingForm({ onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pickupLocation, setPickupLocation] = useState(null)
  const [myBookings, setMyBookings] = useState([])
  const [isMapOpen, setIsMapOpen] = useState(false)

  const [formData, setFormData] = useState({
    // Booking Person
    bookerName: "",
    bookerPhone: "",
    bookerAddress: "",

    // Patient Details
    patientName: "",
    patientDob: "",
    patientAge: "",
    patientGender: "",
    patientContact: "",
    aadharNumber: "",
    patientAddress: "",
    patientVillage: "",
    patientPS: "",
    patientDistrict: "",
    patientPincode: "",
    patientAadhar: "",

    bookingDate: new Date().toISOString().split("T")[0],
    bookingTime: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    medicalCondition: "",

    // Caretaker Details
    caretakerName: "",
    caretakerPhone: "",
    caretakerRelation: "",
    caretakerAddress: "",
    caretakerAadharNumber: "",

    // Service Details
    pickupAddress: "",
    dropAddress: "",
    ambulanceType: "",

    // Meta
    registrationNumber: "",
  })

  useEffect(() => {
    const phone = localStorage.getItem("user_phone")
    if (phone) {
      loadBookings(phone)
    }
  }, [])

  const loadBookings = async (phone) => {
    try {
      const data = await getMyBookings(phone)
      setMyBookings(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      registrationNumber: "AMB-" + Date.now().toString().slice(-8),
    }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let updated = { ...formData, [name]: value }
    if (name === "patientDob") {
      updated.patientAge = calculateAge(value)
    }
    setFormData(updated)
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

    const requiredFields = [
      "bookerName",
      "bookerPhone",
      "patientName",
      "patientDob",
      "patientGender",
      "patientContact",
      "patientVillage",
      "patientPS",
      "patientDistrict",
      "patientPincode",
      "patientAadhar",
      "medicalCondition",
      "pickupAddress",
      "ambulanceType",
    ]

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
      patient_name: formData.patientName,
      patient_age: Number(formData.patientAge),
      patient_gender: formData.patientGender,
      patient_contact: formData.patientContact,
      patient_address: formData.patientAddress,
      patient_village: formData.patientVillage,
      patient_police_station: formData.patientPS,
      patient_district: formData.patientDistrict,
      patient_pincode: formData.patientPincode,
      patient_aadhar: formData.patientAadhar,
      medical_condition: formData.medicalCondition,
      caretaker_name: formData.caretakerName,
      caretaker_phone: formData.caretakerPhone,
      caretaker_relation: formData.caretakerRelation,
      caretaker_address: formData.caretakerAddress,
      caretaker_aadhar: formData.caretakerAadharNumber,
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
      toast.success("Ambulance booked successfully!")
    } catch (error) {
      toast.error(error.message || "Booking failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // MAIN RESPONSIVE WRAPPER
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Ambulance className="h-6 w-6" />
            Book Ambulance
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* BOOKER */}
            <Section icon={<User />} title="Booking Person">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Field label="Name *" name="bookerName" value={formData.bookerName} onChange={handleInputChange} />
                <Field label="Phone *" name="bookerPhone" value={formData.bookerPhone} onChange={handleInputChange} />
                <div className="sm:col-span-2">
                  <Field label="Address" name="bookerAddress" value={formData.bookerAddress} onChange={handleInputChange} />
                </div>
              </div>
            </Section>

            {/* PATIENT */}
            <Section icon={<Heart />} title="Patient Details">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Field label="Patient Name *" name="patientName" value={formData.patientName} onChange={handleInputChange} />
                <Field label="DOB *" type="date" name="patientDob" value={formData.patientDob} onChange={handleInputChange} />
                <Field label="Age" name="patientAge" value={formData.patientAge} disabled />

                <div className="grid-cols-1"> {/* Ensure Select container takes full width */}
                  <SelectField
                    label="Gender *"
                    value={formData.patientGender}
                    onChange={(v) => setFormData((p) => ({ ...p, patientGender: v }))}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </div>

                <Field label="Contact *" name="patientContact" value={formData.patientContact} onChange={handleInputChange} />
                <Field label="Aadhaar Number *" name="patientAadhar" value={formData.patientAadhar} onChange={handleInputChange} />
                <Field label="Village *" name="patientVillage" value={formData.patientVillage} onChange={handleInputChange} />
                <Field label="Police Station *" name="patientPS" value={formData.patientPS} onChange={handleInputChange} />
                <Field label="District *" name="patientDistrict" value={formData.patientDistrict} onChange={handleInputChange} />
                <Field label="Pincode *" name="patientPincode" value={formData.patientPincode} onChange={handleInputChange} />
                <div className="sm:col-span-2">
                  <Field label="Patient Address" name="patientAddress" value={formData.patientAddress} onChange={handleInputChange} />
                </div>
              </div>
              <div className="mt-4">
                <Label>Medical Condition *</Label>
                <Textarea
                  name="medicalCondition"
                  placeholder="Describe the medical condition or emergency..."
                  value={formData.medicalCondition}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
            </Section>

            {/* CARETAKER */}
            <Section icon={<Users />} title="Caretaker Details">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Field label="Name" name="caretakerName" value={formData.caretakerName} onChange={handleInputChange} />
                <Field label="Phone" name="caretakerPhone" value={formData.caretakerPhone} onChange={handleInputChange} />
                <Field label="Relation" name="caretakerRelation" value={formData.caretakerRelation} onChange={handleInputChange} />
                <Field label="Aadhaar No" name="caretakerAadharNumber" value={formData.caretakerAadharNumber} onChange={handleInputChange} />
                <div className="sm:col-span-2">
                  <Field label="Address" name="caretakerAddress" value={formData.caretakerAddress} onChange={handleInputChange} />
                </div>
              </div>
            </Section>

            {/* SERVICE */}
            <Section icon={<MapPin />} title="Service Details">
              <div className="space-y-4">
                {/* PICKUP ADDRESS WITH MAP ICON */}
                <div className="space-y-2">
                  <Label>Pickup Address *</Label>
                  <div className="relative">
                    <Textarea
                      name="pickupAddress"
                      placeholder="Enter address manually or click the icon to use map"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="pr-10 w-full text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-9 w-9 z-10 hover:bg-accent"
                      onClick={() => setIsMapOpen(true)}
                      title="Open Map Picker"
                    >
                      <MapPin className="h-5 w-5 text-primary" />
                    </Button>
                  </div>
                </div>

                {/* DROP HOSPITAL DROPDOWN */}
                <div className="space-y-2">
                  <Label>Drop Hospital</Label>
                  <Select value={formData.dropAddress} onValueChange={handleHospitalSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map((h) => (
                        <SelectItem
                          key={`${h.name}-${h.address}`}
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

                {/* AMBULANCE TYPE */}
                <div className="space-y-2">
                  <Label>Ambulance Type *</Label>
                  <Select value={formData.ambulanceType} onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Ambulance Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ambulanceTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Section>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Booking Date" name="bookingDate" value={formData.bookingDate} disabled />
              <Field label="Booking Time" name="bookingTime" value={formData.bookingTime} disabled />
            </div>

            {/* SUBMIT */}
            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg mt-4">
              {isSubmitting ? "Dispatching..." : "Request Ambulance"}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Reg No: {formData.registrationNumber}
            </p>
          </form>
        </CardContent>
      </Card>

      {/* USER BOOKINGS */}
      <div className="space-y-4">
        {/* <h2 className="text-xl font-semibold px-1">My Bookings</h2> */}
        {myBookings.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No bookings found.</p>
        )}
        {myBookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3">
                <p className="font-bold text-lg">{booking.registration_number}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit sm:ml-auto">
                  {booking.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row">
                  <span className="font-medium text-gray-500 w-full sm:w-32">Patient:</span>
                  <span className="break-words">{booking.patient_name}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="font-medium text-gray-500 w-full sm:w-32">Pickup:</span>
                  <span className="break-words text-gray-700">{booking.pickup_address}</span>
                </div>
              </div>

              {/* DRIVER DETAILS */}
              {booking.driver ? (
                <div className="border rounded-md p-3 bg-green-50 space-y-2 text-sm">
                  <h3 className="font-semibold text-green-700">Driver Assigned</h3>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-600 w-full sm:w-24">Name:</span>
                    <span>{booking.driver.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-600 w-full sm:w-24">Phone:</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">{booking.driver.phone}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-600 w-full sm:w-24">Vehicle:</span>
                    <span>{booking.driver.vehicle_number}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  Waiting for driver acceptance...
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAP DIALOG */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        {/* Responsive Dialog: Full screen height on mobile, auto on desktop */}
        <DialogContent className="sm:max-w-4xl w-full h-[85vh] sm:h-auto flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6 border-b">
            <DialogTitle>Select Pickup Location</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 w-full relative bg-gray-100">
            <MapPicker onSelectLocation={handleMapSelect} />
          </div>
          <div className="p-4 bg-white border-t text-center text-sm text-muted-foreground">
            Click anywhere on the map to confirm the pickup location.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------------- HELPERS UI ---------------- */

function Section({ icon, title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-medium text-lg text-gray-800">
        {icon}
        {title}
      </div>
      <div className="p-4 border rounded-lg bg-white shadow-sm">{children}</div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <Input {...props} className="w-full" />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}