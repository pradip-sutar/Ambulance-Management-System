"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createBooking } from "./api/bookingApi"
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

// Import your MapPicker component
// import MapPicker from "./ui/MapPicker"

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
  
  // State to control Map Dialog
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

  // Generate Registration Number on load
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      registrationNumber: "AMB-" + Date.now().toString().slice(-8),
    }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    let updated = { ...formData, [name]: value }

    // Auto age from DOB
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

  // Called when user selects a location on map
  const handleMapSelect = (data) => {
    setPickupLocation({ lat: data.lat, lng: data.lng })
    // If map returned an address string, use it. Otherwise use coordinates.
    const addressString = data.address || `${data.lat}, ${data.lng}`
    setFormData((prev) => ({ ...prev, pickupAddress: addressString }))
    setIsMapOpen(false) // Close dialog
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

  try {
    const payload = {
      registration_number: formData.registrationNumber,
      booker_name: formData.bookerName,
      booker_phone: formData.bookerPhone,
      patient_name: formData.patientName,
      patient_age: Number(formData.patientAge),
      patient_gender: formData.patientGender,
      medical_condition: formData.medicalCondition,
      pickup_address: formData.pickupAddress,
      drop_address: formData.dropAddress,
      ambulance_type: formData.ambulanceType,
      pickup_location: pickupLocation
        ? {
            lat: pickupLocation.lat,
            lng: pickupLocation.lng,
          }
        : null,
    }

    const data = await createBooking(payload)

    toast.success("Ambulance booked successfully!", {
      description: `Reg No: ${formData.registrationNumber}`,
    })

    onSubmit?.(data)

    // RESET FORM
    setPickupLocation(null)
    setFormData({
      bookerName: "",
      bookerPhone: "",
      bookerAddress: "",
      patientName: "",
      patientDob: "",
      patientAge: "",
      patientGender: "",
      patientContact: "",
      aadharNumber: "",
      patientAddress: "",
      medicalCondition: "",
      caretakerName: "",
      caretakerPhone: "",
      caretakerRelation: "",
      caretakerAddress: "",
      caretakerAadharNumber: "",
      pickupAddress: "",
      dropAddress: "",
      ambulanceType: "",
      registrationNumber: generateRegNo(),
    })
  } catch (error) {
    toast.error(error.message || "Booking failed")
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ambulance className="h-5 w-5" />
          Book Ambulance
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BOOKER */}
          <Section icon={<User />} title="Booking Person">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name *" name="bookerName" value={formData.bookerName} onChange={handleInputChange} />
              <Field label="Phone *" name="bookerPhone" value={formData.bookerPhone} onChange={handleInputChange} />
              <div className="sm:col-span-2">
                 <Field label="Address" name="bookerAddress" value={formData.bookerAddress} onChange={handleInputChange} />
              </div>
            </div>
          </Section>

          {/* PATIENT */}
          <Section icon={<Heart />} title="Patient Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Patient Name *" name="patientName" value={formData.patientName} onChange={handleInputChange} />
              <Field label="DOB *" type="date" name="patientDob" value={formData.patientDob} onChange={handleInputChange} />
              <Field label="Age" name="patientAge" value={formData.patientAge} disabled />
              
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
              <Field label="Contact *" name="patientContact" value={formData.patientContact} onChange={handleInputChange} />
              <Field label="Aadhaar" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} />
              <Field
                label="Patient Address"
                name="patientAddress"
                value={formData.patientAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-4">
              <Label>Medical Condition *</Label>
              <Textarea
                name="medicalCondition"
                placeholder="Describe the medical condition or emergency..."
                value={formData.medicalCondition}
                onChange={handleInputChange}
              />
            </div>
          </Section>

          {/* CARETAKER */}
          <Section icon={<Users />} title="Caretaker Details">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Field label="Name" name="caretakerName" value={formData.caretakerName} onChange={handleInputChange} />
              <Field label="Phone" name="caretakerPhone" value={formData.caretakerPhone} onChange={handleInputChange} />
              <Field label="Relation" name="caretakerRelation" value={formData.caretakerRelation} onChange={handleInputChange} />
              <Field label="Aadhaar No" name="caretakerAadharNumber" value={formData.caretakerAadharNumber} onChange={handleInputChange} />
              <div className="sm:col-span-2 md:col-span-3">
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
                    className="pr-10" // Add padding right so text doesn't hide behind icon
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 z-10 hover:bg-accent"
                    onClick={() => setIsMapOpen(true)}
                    title="Open Map Picker"
                  >
                    <MapPin className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              </div>

              {/* MAP DIALOG */}
              <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Select Pickup Location</DialogTitle>
                  </DialogHeader>
                  <div className="w-full h-[400px] rounded-md overflow-hidden border">
                    <MapPicker 
                      onSelectLocation={handleMapSelect} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click anywhere on the map to confirm the pickup location.
                  </p>
                </DialogContent>
              </Dialog>

              {/* DROP HOSPITAL DROPDOWN */}
              <div className="space-y-2">
                <Label>Drop Hospital</Label>
                <Select 
                  value={formData.dropAddress} 
                  onValueChange={handleHospitalSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((h) => (
                      <SelectItem 
                        // FIX: Use a combination of name and address as the key to ensure uniqueness
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
              <Select value={formData.ambulanceType} onValueChange={handleSelectChange}>
                <SelectTrigger>
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
          </Section>

          {/* SUBMIT */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Dispatching..." : "Request Ambulance"}
          </Button>

          <p className="text-xs text-gray-500">
            Reg No: {formData.registrationNumber}
          </p>

        </form>
      </CardContent>
    </Card>
  )
}

/* ---------------- HELPERS UI ---------------- */

function Section({ icon, title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        {title}
      </div>
      <div className="p-4 border rounded">{children}</div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
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