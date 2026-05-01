"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Ambulance, MapPin } from "lucide-react"
import { toast } from "sonner"

import {
  getBookings,
  getDrivers,
  assignDriver,
} from "@/components/api/adminApi"

import { createDriver } from "@/components/api/driverapi"

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState({})
  const [loading, setLoading] = useState(true)

  const [driverForm, setDriverForm] = useState({
    name: "",
    phone: "",
    vehicle_number: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [b, d] = await Promise.all([
        getBookings(),
        getDrivers(),
      ])

      setBookings(b)
      setDrivers(d)
    } catch {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Assign driver
  const handleAssign = async (bookingId) => {
    const driverId = Number(selectedDriver[bookingId])

    if (!driverId) {
      toast.error("Select driver first")
      return
    }

    try {
      await assignDriver(driverId, bookingId)
      toast.success("Driver assigned!")
      fetchData()
    } catch {
      toast.error("Assignment failed")
    }
  }

  // ✅ Create driver
  const handleCreateDriver = async () => {
    if (!driverForm.name || !driverForm.phone || !driverForm.vehicle_number) {
      toast.error("All fields required")
      return
    }

    try {
      await createDriver(driverForm)

      toast.success("Driver created!")

      setDriverForm({
        name: "",
        phone: "",
        vehicle_number: "",
      })

      fetchData()
    } catch {
      toast.error("Failed to create driver")
    }
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-6 space-y-6">

      {/* 🔷 HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users className="h-6 w-6" />
        Admin Dashboard
      </h1>

      {/* 🔷 STATS */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p>Total Bookings</p>
            <h2 className="text-xl font-bold">{bookings.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p>Total Drivers</p>
            <h2 className="text-xl font-bold">{drivers.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p>Available Drivers</p>
            <h2 className="text-xl font-bold">
              {drivers.filter(d => d.status === "online").length}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* 🔷 CREATE DRIVER */}
      <Card>
        <CardHeader>
          <CardTitle>Create Driver</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-4 gap-3">

          <Input
            placeholder="Name"
            value={driverForm.name}
            onChange={(e) =>
              setDriverForm({ ...driverForm, name: e.target.value })
            }
          />

          <Input
            placeholder="Phone"
            value={driverForm.phone}
            onChange={(e) =>
              setDriverForm({ ...driverForm, phone: e.target.value })
            }
          />

          <Input
            placeholder="Vehicle Number"
            value={driverForm.vehicle_number}
            onChange={(e) =>
              setDriverForm({
                ...driverForm,
                vehicle_number: e.target.value,
              })
            }
          />

          <Button onClick={handleCreateDriver}>
            Add Driver
          </Button>

        </CardContent>
      </Card>

      {/* 🔷 BOOKINGS */}
      <div className="space-y-4">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-4 space-y-3">

              <div className="flex justify-between">
                <p className="font-semibold">{b.registration_number}</p>
                <Badge>{b.status}</Badge>
              </div>

              <p><b>Patient:</b> {b.patient_name}</p>

              <div className="flex gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  <p><b>Pickup:</b> {b.pickup_address}</p>
                  <p><b>Drop:</b> {b.drop_address || "N/A"}</p>
                </div>
              </div>

              {/* ✅ Assign */}
             {(b.status === "pending") && (
  <div className="flex gap-2">

    <Select
      onValueChange={(value) =>
        setSelectedDriver((prev) => ({
          ...prev,
          [b.id]: value,
        }))
      }
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Driver" />
      </SelectTrigger>

      <SelectContent>
        {drivers.map((d) => (
          <SelectItem key={d.id} value={String(d.id)}>
            {d.name} ({d.vehicle_number})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Button onClick={() => handleAssign(b.id)}>
      Assign Driver
    </Button>

  </div>
)}

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}