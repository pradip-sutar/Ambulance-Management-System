"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import XLSX from "xlsx-js-style"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
  getBookings,
} from "@/components/api/adminApi"

import { toast } from "sonner"

export default function ReportPage() {
  const router = useRouter()

  const [bookings, setBookings] = useState([])

  const [loading, setLoading] = useState(true)

  const [reportType, setReportType] =
    useState("ambulance")

  const [selectedImage, setSelectedImage] = useState(null)

  const [filters, setFilters] = useState({
    patient: "",
    mobile: "",
    driver: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {

    try {

      const data = await getBookings()

      setBookings(data)

    } catch {

      toast.error("Failed to load reports")

    } finally {

      setLoading(false)
    }
  }

  const filteredBookings = useMemo(() => {

    return bookings.filter((b) => {

      const patientMatch =
        b.patient_name
          ?.toLowerCase()
          .includes(
            filters.patient.toLowerCase()
          )

      const mobileMatch =
        (
          b.patient_contact ||
          b.booker_phone ||
          ""
        ).includes(filters.mobile)

      const driverMatch =
        (b.driver?.name || "")
          .toLowerCase()
          .includes(
            filters.driver.toLowerCase()
          )
      let dateMatch = true

      if (
        filters.startDate &&
        filters.endDate
      ) {

        const bookingDate =
          new Date(b.created_at)

        const start =
          new Date(filters.startDate)

        const end =
          new Date(filters.endDate)

        end.setHours(
          23,
          59,
          59,
          999
        )

        dateMatch =
          bookingDate >= start &&
          bookingDate <= end
      }

      return (
        patientMatch &&
        mobileMatch &&
        driverMatch &&
        dateMatch
      )
    })

  }, [bookings, filters])

  if (loading) {
    return (
      <p className="p-6">
        Loading...
      </p>
    )
  }


  const exportToExcel = () => {
    if (!filteredBookings.length) return

    let data = []

    if (reportType === "ambulance") {
      data = filteredBookings.map((b) => ({
        "Booking ID": b.id,
        "Register No": b.registration_number,
        "Patient Name": b.patient_name,
        "Patient Mobile": b.patient_contact || b.booker_phone,
        "Driver Name": b.driver?.name || "N/A",
        "Driver Mobile": b.driver?.phone || "N/A",
        "Vehicle Number": b.driver?.vehicle_number || "N/A",
        "Ambulance Type": b.ambulance_type,
        Status: b.status,
        "Date & Time": b.created_at
          ? new Date(b.created_at).toLocaleString()
          : "N/A",
      }))
    }

    if (reportType === "patient") {
      data = filteredBookings.map((b) => ({
        "Booking Date": b.booking_date || "N/A",
        "Booking Time": b.booking_time || "N/A",
        "Register No": b.registration_number,
        "Patient Name": b.patient_name,
        Address: b.pickup_address,
        Village: b.patient_village || "N/A",
        "Police Station": b.patient_police_station || "N/A",
        District: b.patient_district || "N/A",
        Pincode: b.patient_pincode || "N/A",
        Age: b.patient_age,
        Gender: b.patient_gender,
        "Contact No": b.patient_contact || b.booker_phone,
        "Aadhaar No": b.patient_aadhar || "N/A",
        "Medical Condition": b.medical_condition,
      }))
    }

    if (reportType === "caretaker") {
      data = filteredBookings.map((b) => ({
        "Booking ID": b.id,
        "Register No": b.registration_number,
        "Patient Name": b.patient_name,
        "Care Taker Name": b.caretaker_name || "N/A",
        "Care Taker Mobile": b.caretaker_phone || "N/A",
        "Relationship": b.caretaker_relation || "N/A",

        "Status": b.status,
      }))
    }

    if (reportType === "booking") {
      data = filteredBookings.map((b) => ({
        "Booking ID": b.id,
        "Register No": b.registration_number,
        "Booker Name": b.booker_name || "N/A",
        "Booker Mobile": b.booker_phone || "N/A",
        "Patient Name": b.patient_name,

        "Ambulance Type": b.ambulance_type,
        "Status": b.status,
        "Date & Time": b.created_at
          ? new Date(b.created_at).toLocaleString()
          : "N/A",
      }))
    }

    const worksheet = XLSX.utils.json_to_sheet(data)

    // Bold + center headers
    const range = XLSX.utils.decode_range(worksheet["!ref"])

    for (let C = range.s.c; C <= range.e.c; ++C) {

      const cellAddress = XLSX.utils.encode_cell({
        r: 0,
        c: C,
      })

      if (!worksheet[cellAddress]) continue

      worksheet[cellAddress].s = {
        font: {
          bold: true,
          sz: 12,
        },

        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      }
    }
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    )

    XLSX.writeFile(
      workbook,
      `${reportType}-report.xlsx`
    )
  }



  return (

    <div className="p-6 space-y-6">

      <Card>

        <CardHeader>

          <CardTitle>
            Ambulance Booking Reports
          </CardTitle>

          <div className="flex justify-between items-center">

            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
            >
              ← Back to Admin Page
            </Button>

            <Button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Download Excel
            </Button>

          </div>

        </CardHeader>

        <CardContent className="space-y-4">
          {/* BACK BUTTON */}

          {/* REPORT TYPE BUTTONS */}
          <div className="flex gap-2 flex-wrap">

            <Button
              variant={
                reportType === "ambulance"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setReportType(
                  "ambulance"
                )
              }
            >
              Ambulance Report
            </Button>

            <Button
              variant={
                reportType === "patient"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setReportType(
                  "patient"
                )
              }
            >
              Patient Report
            </Button>


            <Button
              variant={
                reportType === "caretaker"
                  ? "default"
                  : "outline"
              }
              onClick={() => setReportType("caretaker")}
            >
              Care Taker Report
            </Button>

            <Button
              variant={
                reportType === "booking"
                  ? "default"
                  : "outline"
              }
              onClick={() => setReportType("booking")}
            >
              Booking Person Report
            </Button>

          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <Input
              placeholder="Patient Name"
              value={filters.patient}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  patient:
                    e.target.value,
                })
              }
            />

            <Input
              placeholder="Mobile Number"
              value={filters.mobile}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  mobile:
                    e.target.value,
                })
              }
            />

            <Input
              placeholder="Driver Name"
              value={filters.driver}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  driver:
                    e.target.value,
                })
              }
            />

            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  startDate:
                    e.target.value,
                })
              }
            />

            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  endDate:
                    e.target.value,
                })
              }
            />

          </div>

          {/* TABLE */}
          <div className="border rounded-lg overflow-auto">

            <Table>

              {/* ======================
                  AMBULANCE REPORT
              ======================= */}

              {reportType ===
                "ambulance" && (
                  <>

                    <TableHeader>

                      <TableRow>

                        <TableHead>
                          Booking ID
                        </TableHead>

                        <TableHead>
                          Register No
                        </TableHead>

                        <TableHead>
                          Patient Name
                        </TableHead>

                        <TableHead>
                          Patient Mobile
                        </TableHead>

                        <TableHead>
                          Driver Name
                        </TableHead>

                        <TableHead>
                          Driver Mobile
                        </TableHead>

                        <TableHead>
                          Vehicle Number
                        </TableHead>

                        <TableHead>
                          Ambulance Type
                        </TableHead>
                        <TableHead>Pickup Photo</TableHead>

                        <TableHead>Drop Photo</TableHead>

                        <TableHead>
                          Status
                        </TableHead>

                        <TableHead>
                          Date & Time
                        </TableHead>

                      </TableRow>

                    </TableHeader>

                    <TableBody>

                      {filteredBookings.length >
                        0 ? (

                        filteredBookings.map(
                          (b) => (

                            <TableRow
                              key={b.id}
                            >

                              <TableCell>
                                {b.id}
                              </TableCell>

                              <TableCell>
                                {
                                  b.registration_number
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  b.patient_name
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  b.patient_contact ||
                                  b.booker_phone
                                }
                              </TableCell>

                              <TableCell>
                                {b.driver
                                  ?.name ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {b.driver
                                  ?.phone ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {b.driver
                                  ?.vehicle_number ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {
                                  b.ambulance_type
                                }
                              </TableCell>
                              <TableCell>

  {b.pickup_photo ? (

    <img
      src={b.pickup_photo}
      alt="Pickup"
      className="h-14 w-14 rounded object-cover cursor-pointer border"
      onClick={() =>
        setSelectedImage(b.pickup_photo)
      }
    />

  ) : (

    "N/A"

  )}

</TableCell>

<TableCell>

  {b.drop_photo ? (

    <img
      src={b.drop_photo}
      alt="Drop"
      className="h-14 w-14 rounded object-cover cursor-pointer border"
      onClick={() =>
        setSelectedImage(b.drop_photo)
      }
    />

  ) : (

    "N/A"

  )}

</TableCell>

                              <TableCell>
                                {b.status}
                              </TableCell>

                              <TableCell>
                                {b.created_at
                                  ? new Date(
                                    b.created_at
                                  ).toLocaleString()
                                  : "N/A"}
                              </TableCell>

                            </TableRow>

                          )
                        )

                      ) : (

                        <TableRow>

                          <TableCell
                            colSpan={10}
                            className="text-center py-6"
                          >
                            No reports found
                          </TableCell>

                        </TableRow>

                      )}

                    </TableBody>

                  </>
                )}

              {/* ======================
                  PATIENT REPORT
              ======================= */}

              {reportType ===
                "patient" && (
                  <>

                    <TableHeader>

                      <TableRow>

                        <TableHead>
                          Booking Date
                        </TableHead>

                        <TableHead>
                          Booking Time
                        </TableHead>

                        <TableHead>
                          Register No
                        </TableHead>

                        <TableHead>
                          Patient Name
                        </TableHead>

                        <TableHead>
                          Address
                        </TableHead>

                        <TableHead>
                          Village
                        </TableHead>

                        <TableHead>
                          Police Station
                        </TableHead>

                        <TableHead>
                          District
                        </TableHead>

                        <TableHead>
                          Pincode
                        </TableHead>

                        <TableHead>
                          Age
                        </TableHead>

                        <TableHead>
                          Gender
                        </TableHead>

                        <TableHead>
                          Contact No
                        </TableHead>

                        <TableHead>
                          Aadhaar No
                        </TableHead>

                        <TableHead>
                          Medical Condition
                        </TableHead>

                      </TableRow>

                    </TableHeader>

                    <TableBody>

                      {filteredBookings.length >
                        0 ? (

                        filteredBookings.map(
                          (b) => (

                            <TableRow
                              key={b.id}
                            >

                              <TableCell>
                                {b.booking_date ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {b.booking_time ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {
                                  b.registration_number
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  b.patient_name
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  b.pickup_address
                                }
                              </TableCell>

                              <TableCell>
                                {b.patient_village ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {b.patient_police_station ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {b.patient_district ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {b.patient_pincode ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {
                                  b.patient_age
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  b.patient_gender
                                }
                              </TableCell>

                              <TableCell>
                                {
                                  b.patient_contact ||
                                  b.booker_phone
                                }
                              </TableCell>

                              <TableCell>
                                {b.patient_aadhar ||
                                  "N/A"}
                              </TableCell>

                              <TableCell>
                                {
                                  b.medical_condition
                                }
                              </TableCell>

                            </TableRow>

                          )
                        )

                      ) : (

                        <TableRow>

                          <TableCell
                            colSpan={14}
                            className="text-center py-6"
                          >
                            No patient
                            reports found
                          </TableCell>

                        </TableRow>

                      )}

                    </TableBody>

                  </>
                )}


              {/* ======================
    CARE TAKER REPORT
====================== */}

              {reportType === "caretaker" && (
                <>

                  <TableHeader>
                    <TableRow>

                      <TableHead>Booking ID</TableHead>
                      <TableHead>Register No</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Care Taker Name</TableHead>
                      <TableHead>Care Taker Mobile</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Status</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {filteredBookings.length > 0 ? (

                      filteredBookings.map((b) => (

                        <TableRow key={b.id}>

                          <TableCell>{b.id}</TableCell>

                          <TableCell>
                            {b.registration_number}
                          </TableCell>

                          <TableCell>
                            {b.patient_name}
                          </TableCell>

                          <TableCell>
                            {b.caretaker_name || "N/A"}
                          </TableCell>

                          <TableCell>
                            {b.caretaker_phone || "N/A"}
                          </TableCell>

                          <TableCell>
                            {b.caretaker_relation || "N/A"}
                          </TableCell>

                          <TableCell>
                            {b.status}
                          </TableCell>

                        </TableRow>

                      ))

                    ) : (

                      <TableRow>

                        <TableCell
                          colSpan={9}
                          className="text-center py-6"
                        > No caretaker reports found
                        </TableCell>

                      </TableRow>

                    )}

                  </TableBody>

                </>
              )}


              {/* ======================
    BOOKING PERSON REPORT
====================== */}

              {reportType === "booking" && (
                <>

                  <TableHeader>

                    <TableRow>

                      <TableHead>Booking ID</TableHead>
                      <TableHead>Register No</TableHead>
                      <TableHead>Booker Name</TableHead>
                      <TableHead>Booker Mobile</TableHead>
                      <TableHead>Patient Name</TableHead>

                      <TableHead>Ambulance Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date & Time</TableHead>

                    </TableRow>
                  </TableHeader>

                  <TableBody>

                    {filteredBookings.length > 0 ? (

                      filteredBookings.map((b) => (

                        <TableRow key={b.id}>

                          <TableCell>{b.id}</TableCell>

                          <TableCell>
                            {b.registration_number}
                          </TableCell>

                          <TableCell>
                            {b.booker_name || "N/A"}
                          </TableCell>

                          <TableCell>
                            {b.booker_phone || "N/A"}
                          </TableCell>

                          <TableCell>
                            {b.patient_name}
                          </TableCell>

                          <TableCell>
                            {b.ambulance_type}
                          </TableCell>

                          <TableCell>
                            {b.status}
                          </TableCell>

                          <TableCell>
                            {b.created_at
                              ? new Date(
                                b.created_at
                              ).toLocaleString()
                              : "N/A"}
                          </TableCell>

                        </TableRow>

                      ))

                    ) : (

                      <TableRow>

                        <TableCell
                          colSpan={10}
                          className="text-center py-6"
                        >
                          No booking person reports found
                        </TableCell>

                      </TableRow>

                    )}

                  </TableBody>

                </>
              )}

            </Table>

          </div>

          {/* TOTAL */}
          <div className="flex justify-end">

            <Button variant="outline">

              Total Reports:
              {" "}
              {filteredBookings.length}

            </Button>

          </div>

        </CardContent>

      </Card>
<Dialog
  open={!!selectedImage}
  onOpenChange={() => setSelectedImage(null)}
>
  <DialogContent className="max-w-3xl">

    <DialogHeader>
      <DialogTitle>
        Proof Photo
      </DialogTitle>
    </DialogHeader>

    {selectedImage && (

      <img
        src={selectedImage}
        alt="Preview"
        className="w-full max-h-[80vh] object-contain rounded"
      />

    )}

  </DialogContent>
</Dialog>
    </div>
  )
}