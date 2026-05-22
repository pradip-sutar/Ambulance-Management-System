import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Eye, EyeOff, Users, Ambulance, MapPin, 
  ClipboardList, UserCheck, Truck, Plus, FileText 
} from "lucide-react"
import {
  Card, CardContent, CardHeader, CardTitle
} from "./ui/card"
import { Button } from "./ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "./ui/select"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { toast } from "sonner"

import {
  getBookings,
  getDrivers,
  assignDriver,
} from "./api/adminApi"

import { createDriver } from "./api/driverapi"

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [driverForm, setDriverForm] = useState({
    name: "",
    phone: "",
    vehicle_number: "",
    password: "",
  })

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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

  const handleUpdatePassword = async (driverId, newPassword) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/admin/driver-password/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      })

      if (!res.ok) throw new Error()
      toast.success("Password updated!")
    } catch {
      toast.error("Failed to update password")
    }
  }

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

  const handleCreateDriver = async () => {
    if (!driverForm.name || !driverForm.phone || !driverForm.vehicle_number || !driverForm.password) {
      toast.error("All fields required")
      return
    }

    try {
      await createDriver(driverForm)
      toast.success("Driver created!")
      setDriverForm({ name: "", phone: "", vehicle_number: "", password: "" })
      fetchData()
    } catch {
      toast.error("Failed to create driver")
    }
  }

  // Helper for status colors
  const getStatusColor = (status) => {
    if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";
    if (status === "assigned" || status === "online") return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
    return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50";
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Ambulance className="h-6 w-6 animate-pulse text-blue-600" />
          <p className="text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* 🔷 HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-10">Manage bookings, drivers, and assignments</p>
          </div>
          <Button onClick={() => navigate("/admin-report")} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <FileText className="h-4 w-4 mr-2" /> View Reports
          </Button>
        </div>

        {/* 🔷 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Bookings</p>
                <h2 className="text-2xl font-bold text-slate-800">{bookings.length}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Drivers</p>
                <h2 className="text-2xl font-bold text-slate-800">{drivers.length}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Available Drivers</p>
                <h2 className="text-2xl font-bold text-slate-800">
                  {drivers.filter(d => d.status === "online").length}
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🔷 CREATE DRIVER */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" /> Register New Driver
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Full Name"
                value={driverForm.name}
                onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                className="bg-slate-50 border-slate-200 focus:bg-white"
              />
              <Input
                placeholder="Phone Number"
                value={driverForm.phone}
                onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                className="bg-slate-50 border-slate-200 focus:bg-white"
              />
              <Input
                placeholder="Vehicle Number (e.g., OD 05 AB 1234)"
                value={driverForm.vehicle_number}
                onChange={(e) => setDriverForm({ ...driverForm, vehicle_number: e.target.value })}
                className="bg-slate-50 border-slate-200 focus:bg-white"
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={driverForm.password}
                  onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleCreateDriver} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Driver
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 🔷 DRIVER LIST TABLE */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-600" /> Active Drivers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Driver Name</th>
                    <th className="px-6 py-3 font-medium">Vehicle Number</th>
                    <th className="px-6 py-3 font-medium">Phone</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-500">No drivers found.</td>
                    </tr>
                  ) : (
                    drivers.map((driver) => (
                      <tr key={driver.id} className="bg-white border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                          {driver.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                          {driver.vehicle_number}
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                          {driver.phone}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getStatusColor(driver.status)}>
                                            {driver.status}
                                        </Badge>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => {
                              const newPassword = prompt("Enter new password")
                              if (!newPassword) return
                              handleUpdatePassword(driver.id, newPassword)
                            }}
                          >
                            Edit Password
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 🔷 BOOKINGS */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pt-4">
            <ClipboardList className="h-5 w-5 text-blue-600" /> Recent Bookings
          </h2>
          
          {bookings.length === 0 ? (
             <Card className="border-slate-100 shadow-sm">
               <CardContent className="p-8 text-center text-slate-500">
                 No bookings available.
               </CardContent>
             </Card>
          ) : (
            bookings.map((b) => (
              <Card key={b.id} className={`border-l-4 ${b.status === 'pending' ? 'border-l-amber-500' : 'border-l-blue-500'} bg-white shadow-sm hover:shadow-md transition-shadow`}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      <Ambulance className="h-5 w-5 text-slate-400" />
                      {b.registration_number}
                    </p>
                    <Badge variant="outline" className={getStatusColor(b.status)}>
                      {b.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p className="text-slate-700">
                      <span className="font-medium text-slate-500">Patient: </span> 
                      {b.patient_name}
                    </p>
                    <div className="flex gap-2 text-slate-700">
                      <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                      <div className="space-y-1">
                        <p><span className="font-medium text-slate-500">Pickup:</span> {b.pickup_address}</p>
                        <p><span className="font-medium text-slate-500">Drop:</span> {b.drop_address || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Assign Section */}
                  {b.status === "pending" && (
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <Select
                        onValueChange={(value) =>
                          setSelectedDriver((prev) => ({ ...prev, [b.id]: value }))
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[240px] bg-slate-50 border-slate-200">
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
                      <Button 
                        onClick={() => handleAssign(b.id)} 
                        className="bg-emerald-600 hover:bg-emerald-700 shadow-sm w-full sm:w-auto"
                      >
                        <UserCheck className="h-4 w-4 mr-2" /> Assign Driver
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  )
}