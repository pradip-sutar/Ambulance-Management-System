"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import XLSX from "xlsx-js-style"

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

import { getBookings } from "@/components/api/adminApi"

import { toast } from "sonner"

export default function ReportPage() {
  const router = useRouter()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatingCertId, setGeneratingCertId] = useState(null)
  const [reportType, setReportType] = useState("ambulance")
  const [selectedImage, setSelectedImage] = useState(null)
  const ambulanceLogo = "/ambulance_logo.png"
  const ambulancePhoto = "/ambulance.jpeg"

  const footerPhoto = "/footer.jpeg"
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

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
      const patientMatch = b.patient_name
        ?.toLowerCase()
        .includes(filters.patient.toLowerCase())

      const mobileMatch = (
        b.patient_contact ||
        b.booker_phone ||
        ""
      ).includes(filters.mobile)

      const driverMatch = (b.driver?.name || "")
        .toLowerCase()
        .includes(filters.driver.toLowerCase())

      let dateMatch = true

      if (filters.startDate && filters.endDate) {
        const bookingDate = new Date(b.created_at)
        const start = new Date(filters.startDate)
        const end = new Date(filters.endDate)
        end.setHours(23, 59, 59, 999)
        dateMatch = bookingDate >= start && bookingDate <= end
      }

      return patientMatch && mobileMatch && driverMatch && dateMatch
    })
  }, [bookings, filters])

  if (loading) {
    return <p className="p-6">Loading...</p>
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
        Relationship: b.caretaker_relation || "N/A",
        Status: b.status,
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
        Status: b.status,
        "Date & Time": b.created_at
          ? new Date(b.created_at).toLocaleString()
          : "N/A",
      }))
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const range = XLSX.utils.decode_range(worksheet["!ref"])

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
      if (!worksheet[cellAddress]) continue
      worksheet[cellAddress].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" },
      }
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports")
    XLSX.writeFile(workbook, `${reportType}-report.xlsx`)
  }

  const generateCertificate = async (b) => {
    setGeneratingCertId(b.id)

    let iframe = null

    try {
      iframe = document.createElement("iframe")
      iframe.style.position = "absolute"
      iframe.style.left = "-9999px"
      iframe.style.top = "0"
      iframe.style.width = "850px"
      iframe.style.height = "1200px"
      iframe.style.border = "none"
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document

      // Construct full URLs for proof photos
      const pickupPhotoUrl = b.pickup_proof_url ? `${API_BASE_URL}/${b.pickup_proof_url}` : null;
      const dropPhotoUrl = b.drop_proof_url ? `${API_BASE_URL}/${b.drop_proof_url}` : null;

      iframeDoc.open()
      iframeDoc.write(`
        <html>
          <head>
            <style>
              body {
                margin:70px;
                padding-right:50px;
                font-family: Arial, sans-serif;
                background: #ffffff;
                color: #000000;
                width: 1000px;
              }
            </style>
          </head>
          <body>
            <div style="
              border:4px solid #008000;
              border-radius:20px;
              padding:20px;
              background-color:#ffffff;
            ">
              <!-- Memorial Dedication -->
              <div style="
                text-align:center;
                margin-bottom:15px;
                padding:10px;
                background:linear-gradient(135deg, #f0fff0, #ffffff);
                border-radius:10px;
                border:1px solid #008000;
              ">
                <p style="margin:0; font-size:14px; font-weight:bold; color:#555555;">
                  Dedicated in Loving Memory of
                </p>
                <p style="margin:4px 0 0 0; font-size:18px; font-weight:bold; color:#008000;">
                  Late Basanta Kumar Nath
                </p>
              </div>

              <!-- Header Section -->
              <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <img src="${ambulanceLogo}" style="width:180px; height:180px; border-radius:50%; object-fit:cover;" crossorigin="anonymous" />
                <div style="text-align:center;flex:1;color:#000000;">
                  <h2 style="color:#008000;font-size:30px;margin:0;">FREE</h2>
                  <h2 style="color:#FF0000;font-size:30px;margin:0;">AMBULANCE</h2>
                  <h2 style="color:#008000;margin-top:10px;">SERVICE CERTIFICATE</h2>
                  <h3 style="margin:0px;padding:0px;">Dharmadaspur,Mahanga,Cuttack,Pin:754204</h3>
                  <h3 style="margin:0px;padding:0px;">📞 9776696669,9348616669,9006706355</h3>
                </div>
                <img src="${ambulancePhoto}" style="width:220px; height:220px; border-radius:20px; object-fit:cover;padding-right:10px;" crossorigin="anonymous" />
              </div>
             

              <!-- Details Section -->

              
             <div style="margin-top:10px; border:2px solid #008000; border-radius:15px; padding:20px; color:#000000;">

  <!-- TOP SECTION -->
  <div style="display:flex; justify-content:space-between; gap:20px; align-items:flex-start;">

    <!-- LEFT DETAILS -->
    <div style="flex:2;">
      <p><strong>Date:</strong> ${b.created_at ? new Date(b.created_at).toLocaleDateString() : "N/A"}</p>
      <p><strong>Service ID:</strong> ${b.id}</p>
      <p><strong>Patient Name:</strong> ${b.patient_name}</p>
      <p><strong>Contact Number:</strong> ${b.patient_contact || b.booker_phone}</p>
      <p><strong>Pickup Location:</strong> ${b.pickup_address || "N/A"}</p>
      <p><strong>Drop Location:</strong> ${b.drop_address || "N/A"}</p>
      <p><strong>Driver Name:</strong> ${b.driver?.name || "N/A"}</p>
      <p><strong>Vehicle Number:</strong> ${b.driver?.vehicle_number || "N/A"}</p>
      <p><strong>Ambulance Type:</strong> ${b.ambulance_type || "N/A"}</p>
    </div>

    <!-- RIGHT PHOTOS -->
    ${(pickupPhotoUrl || dropPhotoUrl) ? `
    <div style="flex:1; display:flex; flex-direction:column; gap:12px; align-items:center;">

      <!-- Pickup -->
      <div style="text-align:center;">
        <p style="margin:0 0 5px 0; font-size:13px; font-weight:bold;">Pickup</p>
        ${pickupPhotoUrl
          ? `<img 
              src="${pickupPhotoUrl}" 
              crossorigin="anonymous"
              style="
                width:200px;
                height:170px;
                object-fit:cover;
                border-radius:8px;
                border:1px solid #ccc;
              "
            />`
          : `<div style="
                width:200px;
                height:170px;
                background:#f0f0f0;
                display:flex;
                align-items:center;
                justify-content:center;
                border-radius:8px;
                color:#888;
                font-size:12px;
              ">
                No Photo
             </div>`
        }
      </div>

      <!-- Drop -->
      <div style="text-align:center;">
        <p style="margin:0 0 5px 0; font-size:13px; font-weight:bold;">Drop</p>
        ${dropPhotoUrl
          ? `<img 
              src="${dropPhotoUrl}" 
              crossorigin="anonymous"
              style="
                width:200px;
                height:170px;
                object-fit:cover;
                border-radius:8px;
                border:1px solid #ccc;
              "
            />`
          : `<div style="
                width:200px;
                height:170px;
                background:#f0f0f0;
                display:flex;
                align-items:center;
                justify-content:center;
                border-radius:8px;
                color:#888;
                font-size:12px;
              ">
                No Photo
             </div>`
        }
      </div>

    </div>
    ` : ''}
  </div>

  <!-- FREE SERVICE -->
  <div style="
    margin-top:20px;
    padding:10px;
    border:2px dashed #008000;
    font-size:24px;
    font-weight:bold;
    color:#FF0000;
    text-align:center;
    border-radius:10px;
  ">
    ₹0 (FREE SERVICE)
  </div>

  <p style="
    margin-top:15px;
    text-align:center;
    font-size:16px;
    color:#333333;
  ">
    This ambulance service is provided completely free of cost as a charitable service to the community.
  </p>

</div>
             

              <!-- Signature Section -->
             <div style="margin-top:40px; display:flex; justify-content:flex-end; padding:0 40px;">
               <!-- <div style="text-align:center; width:45%;">
                  <div style="border-bottom:2px solid #000; width:100%; height:50px; margin-bottom:8px;"></div>
                  <p style="margin:0; font-weight:bold; font-size:16px;">Driver's Signature</p>
                  <p style="margin:4px 0 0 0; color:#555; font-size:13px;">${b.driver?.name || "N/A"}</p>
                </div> -->
               <div style="text-align:center; width:45%;">
  
  <!-- Signature Image -->
  <img 
    src="/signature.png"
    crossorigin="anonymous"
    style="
      width:160px;
      height:70px;
      object-fit:contain;
      margin-bottom:-10px;
    "
  />

  <!-- Signature Line -->
  <div style="
    border-bottom:2px solid #000; 
    width:100%; 
    margin-bottom:8px;
  "></div>

  <p style="
    margin:0; 
    font-weight:bold; 
    font-size:16px;
  ">
    Founder Signature
  </p>

  <p style="
    margin:4px 0 0 0; 
    color:#555; 
    font-size:13px;
  ">
    Nagendra Nath
  </p>
</div>
              </div>

              <!-- Footer Photo / Banner Section -->
              <div style="margin-top:30px; border-radius:15px; overflow:hidden; border:2px solid #008000; position:relative;">
                <img src="${footerPhoto}" style="width:100%; height:120px; object-fit:cover; display:block;" crossorigin="anonymous" />
                <div style="position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent, rgba(0,128,0,0.9)); padding:6px; text-align:center; color:#ffffff;">
                  <p style="margin:0; font-size:16px; font-weight:bold; letter-spacing:1px;">
                    FOR EMERGENCY &amp; FREE AMBULANCE SERVICE
                  </p>
                  <p style="margin:3px 0 0 0;font-weight:bold; font-size:15px; opacity:0.9;">
                    Available 24/7 • Completely Free • Serving the Community
                  </p>
                </div>
              </div>

              <!-- Bottom Memorial Line -->
              <div style="margin-top:15px; text-align:center; padding:5px; background:#f0fff0; border-radius:10px; border:1px dashed #008000;">
                <p style="margin:0; margin-bottom:13px; text-align:center; font-size:27px; font-weight:bold; color:#008000;">
                  🕯️In Loving Memory of Late Basanta Kumar Nath — His vision of free healthcare for all lives on through this service🕯️
                </p>
              </div>
            </div>
          </body>
        </html>
      `)
      iframeDoc.close()

      // 3. Wait for images to load inside the iframe
      const images = iframeDoc.querySelectorAll("img")
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete && img.naturalHeight > 0) {
                resolve()
              } else {
                img.onload = resolve
                img.onerror = resolve
              }
            })
        )
      )

      await new Promise((r) => setTimeout(r, 500))

      // 4. Capture the iframe body
      const elementToCapture = iframeDoc.body

      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      const finalHeight = imgHeight > pdfHeight ? pdfHeight : imgHeight
      const finalWidth = imgHeight > pdfHeight
        ? (pdfHeight * pdfWidth) / imgHeight
        : pdfWidth

      pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight)
      pdf.save(`${b.patient_name}-certificate.pdf`)

      toast.success("Certificate downloaded successfully!")
    } catch (error) {
      console.error("Certificate generation error:", error)
      toast.error("Failed to generate certificate")
    } finally {
      // 5. Always clean up the iframe
      if (iframe && iframe.parentNode) {
        document.body.removeChild(iframe)
      }
      setGeneratingCertId(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ambulance Booking Reports</CardTitle>
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
          {/* REPORT TYPE BUTTONS */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={reportType === "ambulance" ? "default" : "outline"}
              onClick={() => setReportType("ambulance")}
            >
              Ambulance Report
            </Button>
            <Button
              variant={reportType === "patient" ? "default" : "outline"}
              onClick={() => setReportType("patient")}
            >
              Patient Report
            </Button>
            <Button
              variant={reportType === "caretaker" ? "default" : "outline"}
              onClick={() => setReportType("caretaker")}
            >
              Care Taker Report
            </Button>
            <Button
              variant={reportType === "booking" ? "default" : "outline"}
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
                setFilters({ ...filters, patient: e.target.value })
              }
            />
            <Input
              placeholder="Mobile Number"
              value={filters.mobile}
              onChange={(e) =>
                setFilters({ ...filters, mobile: e.target.value })
              }
            />
            <Input
              placeholder="Driver Name"
              value={filters.driver}
              onChange={(e) =>
                setFilters({ ...filters, driver: e.target.value })
              }
            />
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          {/* TABLE */}
          <div className="border rounded-lg overflow-auto">
            <Table>
              {/* AMBULANCE REPORT */}
              {reportType === "ambulance" && (
                <>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Register No</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Patient Mobile</TableHead>
                      <TableHead>Driver Name</TableHead>
                      <TableHead>Driver Mobile</TableHead>
                      <TableHead>Vehicle Number</TableHead>
                      <TableHead>Ambulance Type</TableHead>
                      <TableHead>Pickup Photo</TableHead>
                      <TableHead>Drop Photo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>{b.id}</TableCell>
                          <TableCell>{b.registration_number}</TableCell>
                          <TableCell>{b.patient_name}</TableCell>
                          <TableCell>
                            {b.patient_contact || b.booker_phone}
                          </TableCell>
                          <TableCell>{b.driver?.name || "N/A"}</TableCell>
                          <TableCell>{b.driver?.phone || "N/A"}</TableCell>
                          <TableCell>
                            {b.driver?.vehicle_number || "N/A"}
                          </TableCell>
                          <TableCell>{b.ambulance_type}</TableCell>

                          <TableCell>
                            {b.pickup_proof_url ? (
                              <img
                                src={`${API_BASE_URL}/${b.pickup_proof_url}`}
                                alt="Pickup"
                                className="h-14 w-14 rounded object-cover cursor-pointer border"
                                onClick={() => setSelectedImage(`${API_BASE_URL}/${b.pickup_proof_url}`)}
                              />
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            {b.drop_proof_url ? (
                              <img
                                src={`${API_BASE_URL}/${b.drop_proof_url}`}
                                alt="Drop"
                                className="h-14 w-14 rounded object-cover cursor-pointer border"
                                onClick={() => setSelectedImage(`${API_BASE_URL}/${b.drop_proof_url}`)}
                              />
                            ) : (
                              "N/A"
                            )}
                          </TableCell>

                          <TableCell>{b.status}</TableCell>
                          <TableCell>
                            {b.created_at
                              ? new Date(b.created_at).toLocaleString()
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={12}
                          className="text-center py-6"
                        >
                          No reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </>
              )}

              {/* PATIENT REPORT */}
              {reportType === "patient" && (
                <>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Booking Time</TableHead>
                      <TableHead>Register No</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>Police Station</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Contact No</TableHead>
                      <TableHead>Aadhaar No</TableHead>
                      <TableHead>Medical Condition</TableHead>
                      <TableHead>Certificate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>{b.booking_date || "N/A"}</TableCell>
                          <TableCell>{b.booking_time || "N/A"}</TableCell>
                          <TableCell>{b.registration_number}</TableCell>
                          <TableCell>{b.patient_name}</TableCell>
                          <TableCell>{b.pickup_address}</TableCell>
                          <TableCell>
                            {b.patient_village || "N/A"}
                          </TableCell>
                          <TableCell>
                            {b.patient_police_station || "N/A"}
                          </TableCell>
                          <TableCell>
                            {b.patient_district || "N/A"}
                          </TableCell>
                          <TableCell>
                            {b.patient_pincode || "N/A"}
                          </TableCell>
                          <TableCell>{b.patient_age}</TableCell>
                          <TableCell>{b.patient_gender}</TableCell>
                          <TableCell>
                            {b.patient_contact || b.booker_phone}
                          </TableCell>
                          <TableCell>
                            {b.patient_aadhar || "N/A"}
                          </TableCell>
                          <TableCell>{b.medical_condition}</TableCell>
                          <TableCell>
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => generateCertificate(b)}
                              disabled={generatingCertId === b.id}
                            >
                              {generatingCertId === b.id
                                ? "Generating..."
                                : "Download"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={15}
                          className="text-center py-6"
                        >
                          No patient reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </>
              )}

              {/* CARE TAKER REPORT */}
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
                          <TableCell>{b.registration_number}</TableCell>
                          <TableCell>{b.patient_name}</TableCell>
                          <TableCell>
                            {b.caretaker_name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {b.caretaker_phone || "N/A"}
                          </TableCell>
                          <TableCell>
                            {b.caretaker_relation || "N/A"}
                          </TableCell>
                          <TableCell>{b.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-6"
                        >
                          No caretaker reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </>
              )}

              {/* BOOKING PERSON REPORT */}
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
                          <TableCell>{b.registration_number}</TableCell>
                          <TableCell>{b.booker_name || "N/A"}</TableCell>
                          <TableCell>{b.booker_phone || "N/A"}</TableCell>
                          <TableCell>{b.patient_name}</TableCell>
                          <TableCell>{b.ambulance_type}</TableCell>
                          <TableCell>{b.status}</TableCell>
                          <TableCell>
                            {b.created_at
                              ? new Date(b.created_at).toLocaleString()
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
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
              Total Reports: {filteredBookings.length}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* IMAGE PREVIEW DIALOG */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proof Photo</DialogTitle>
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