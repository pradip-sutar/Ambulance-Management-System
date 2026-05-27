import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import XLSX from "xlsx-js-style"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"

import { Button } from "../components/ui/button"

import { getBookings } from "../components/api/adminApi"

import { toast } from "sonner"
import {
  ArrowLeft, FileDown, Filter, FileText,
  UserRound, HeartPulse, Ambulance, ClipboardList, ImageOff
} from "lucide-react"

export default function ReportPage() {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatingCertId, setGeneratingCertId] = useState(null)
  const [reportType, setReportType] = useState("ambulance")
  const [selectedImage, setSelectedImage] = useState(null)

  const ambulanceLogo = "/ambulance_logo.png"
  const ambulancePhoto = "/ambulance.jpeg"
  const footerPhoto = "/footer.jpeg"

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const [filters, setFilters] = useState({
    patient: "",
    mobile: "",
    driver: "",
    startDate: "",
    endDate: "",
  })

  // ✅ HELPER: Fixes double-slash issue in image URLs
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // ✅✅✅ NEW HELPER: Convert image URL to base64 data URL
  // This solves html2canvas CORS issues — base64 images don't need CORS
  const toBase64 = async (url) => {
    if (!url) return null;
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      // Retry without cors mode (for same-origin resources)
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      } catch {
        return null;
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + " | " + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "assigned" || status === "online") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "completed") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await getBookings()
      const data = Array.isArray(res)
        ? res
        : res?.data || res?.bookings || res?.results || []
      setBookings(data)
    } catch {
      toast.error("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {

      const patientMatch = (
        b.patient_name ||
        b.booker_name ||
        ""
      )
        .toLowerCase()
        .includes(filters.patient.toLowerCase())

      const mobileMatch = (
        b.patient_contact ||
        b.booker_phone ||
        ""
      ).includes(filters.mobile)

      const driverMatch = (
        b.driver?.name ||
        ""
      )
        .toLowerCase()
        .includes(filters.driver.toLowerCase())

      let dateMatch = true

      if (filters.startDate && filters.endDate) {
        const bookingDate = new Date(b.created_at)

        const start = new Date(filters.startDate)
        const end = new Date(filters.endDate)

        end.setHours(23, 59, 59, 999)

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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <ClipboardList className="h-6 w-6 animate-pulse text-blue-600" />
          <p className="text-lg font-medium">Loading Reports...</p>
        </div>
      </div>
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
        "Date & Time": b.created_at ? formatDate(b.created_at) : "N/A",
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
        "Date & Time": b.created_at ? formatDate(b.created_at) : "N/A",
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
      // ✅✅✅ CONVERT ALL IMAGES TO BASE64 FIRST
      // This is the key fix — base64 images have no CORS issues with html2canvas
      const [
        logoBase64,
        photoBase64,
        signatureBase64,
        footerBase64,
        pickupBase64,
        dropBase64,
      ] = await Promise.all([
        toBase64(ambulanceLogo),
        toBase64(ambulancePhoto),
        toBase64("/signature.png"),
        toBase64(footerPhoto),
        toBase64(getImageUrl(b.pickup_proof_url)),
        toBase64(getImageUrl(b.drop_proof_url)),
      ])

      iframe = document.createElement("iframe")
      iframe.style.position = "absolute"
      iframe.style.left = "-9999px"
      iframe.style.top = "0"
      iframe.style.width = "850px"
      iframe.style.height = "1200px"
      iframe.style.border = "none"
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document

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
            <div style="border:4px solid #008000; border-radius:20px; padding:20px; background-color:#ffffff;">
              
              <!-- Memorial Dedication -->
              <div style="text-align:center; margin-bottom:15px; padding:10px; background:linear-gradient(135deg, #f0fff0, #ffffff); border-radius:10px; border:1px solid #008000;">
                <p style="margin:0; font-size:14px; font-weight:bold; color:#555555;">Dedicated in Loving Memory of</p>
                <p style="margin:4px 0 0 0; font-size:18px; font-weight:bold; color:#008000;">Late Basanta Kumar Nath</p>
              </div>

              <!-- Header Section -->
              <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                ${logoBase64
          ? `<img src="${logoBase64}" style="width:180px; height:180px; border-radius:50%; object-fit:cover;" />`
          : `<div style="width:180px; height:180px; border-radius:50%; background:#f0f0f0;"></div>`
        }
                <div style="text-align:center;flex:1;color:#000000;">
                  <h2 style="color:#008000;font-size:30px;margin:0;">FREE</h2>
                  <h2 style="color:#FF0000;font-size:30px;margin:0;">AMBULANCE</h2>
                  <h2 style="color:#008000;margin-top:10px;">SERVICE CERTIFICATE</h2>
                  <h3 style="margin:0px;padding:0px;">Dharmadaspur,Mahanga,Cuttack,Pin:754204</h3>
                  <h3 style="margin:0px;padding:0px;">📞 9776696669,9348616669,9006706355</h3>
                </div>
                ${photoBase64
          ? `<img src="${photoBase64}" style="width:220px; height:220px; border-radius:20px; object-fit:cover;padding-right:10px;" />`
          : `<div style="width:220px; height:220px; border-radius:20px; background:#f0f0f0;"></div>`
        }
              </div>
             
              <!-- Details Section -->
              <div style="margin-top:10px; border:2px solid #008000; border-radius:15px; padding:20px; color:#000000;">
                <div style="display:flex; justify-content:space-between; gap:20px; align-items:flex-start;">
                  <div style="flex:2;">
                    <p><strong>Date:</strong> ${b.created_at ? new Date(b.created_at).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Service ID:</strong> ${b.id}</p>
                    <p><strong>Patient Name:</strong> <span style="
  font-size:18px;
  font-weight:900;
 color:#000000;
  text-transform:uppercase;
">
  ${b.patient_name || "N/A"}
</span></p>
                    <p style="margin:0; font-size:14px; color:#333333;">
                      <strong>Contact Number:</strong> ${b.patient_contact || b.booker_phone || "N/A"}
                    </p>
                    <p><strong>Pickup Location:</strong> ${b.pickup_address || "N/A"}</p>
                    <p><strong>Drop Location:</strong> ${b.drop_address || "N/A"}</p>
                    <p><strong>Driver Name:</strong> <span style="
  font-size:18px;
  font-weight:900;
 color:#000000;
  text-transform:uppercase;
">
  ${b.driver?.name || "N/A"}
</span></p>
                    <p><strong>Vehicle Number:</strong> ${b.driver?.vehicle_number || "N/A"}</p>
                    <p><strong>Ambulance Type:</strong> ${b.ambulance_type || "N/A"}</p>
                  </div>

                  ${(pickupBase64 || dropBase64) ? `
                  <div style="flex:1; display:flex; flex-direction:column; gap:12px; align-items:center;">
                    <div style="text-align:center;">
                      <p style="margin:0 0 5px 0; font-size:13px; font-weight:bold;">Pickup</p>
                      ${pickupBase64
            ? `<img src="${pickupBase64}" style="width:200px; height:170px; object-fit:cover; border-radius:8px; border:1px solid #ccc;" />`
            : `<div style="width:200px; height:170px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; border-radius:8px; color:#888; font-size:12px;">No Photo</div>`
          }
                    </div>
                    <div style="text-align:center;">
                      <p style="margin:0 0 5px 0; font-size:13px; font-weight:bold;">Drop</p>
                      ${dropBase64
            ? `<img src="${dropBase64}" style="width:200px; height:170px; object-fit:cover; border-radius:8px; border:1px solid #ccc;" />`
            : `<div style="width:200px; height:170px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; border-radius:8px; color:#888; font-size:12px;">No Photo</div>`
          }
                    </div>
                  </div>
                  ` : ''}
                </div>

                <div style="margin-top:20px; padding:10px; border:2px dashed #008000; font-size:24px; font-weight:bold; color:#FF0000; text-align:center; border-radius:10px;">
                  ₹0 (FREE SERVICE)
                </div>
                <p style="margin-top:15px; text-align:center; font-size:16px; color:#333333;">
                  This ambulance service is provided completely free of cost as a charitable service to the community.
                </p>
              </div>
             
              <!-- Signature Section -->
              <div style="margin-top:40px; display:flex; justify-content:flex-end; padding:0 40px;">
               <div style="text-align:center; width:45%;">
                  ${signatureBase64
          ? `<img src="${signatureBase64}" style="width:160px; height:70px; object-fit:contain; margin-bottom:-10px;" />`
          : `<div style="width:160px; height:70px;"></div>`
        }
                  <div style="border-bottom:2px solid #000; width:100%; margin-bottom:8px;"></div>
                  <p style="margin:0; font-weight:bold; font-size:16px;">Founder Signature</p>
                  <p style="margin:4px 0 0 0; color:#555; font-size:13px;">Nagendra Nath</p>
                </div>
              </div>

              <!-- Footer Photo -->
              <div style="margin-top:30px; border-radius:15px; overflow:hidden; border:2px solid #008000; position:relative;">
                ${footerBase64
          ? `<img src="${footerBase64}" style="width:100%; height:120px; object-fit:cover; display:block;" />`
          : `<div style="width:100%; height:120px; background:#f0f0f0;"></div>`
        }
                <div style="position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent, rgba(0,128,0,0.9)); padding:6px; text-align:center; color:#ffffff;">
                  <p style="margin:0; font-size:16px; font-weight:bold; letter-spacing:1px;">FOR EMERGENCY &amp; FREE AMBULANCE SERVICE</p>
                  <p style="margin:3px 0 0 0;font-weight:bold; font-size:15px; opacity:0.9;">Available 24/7 • Completely Free • Serving the Community</p>
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

      // Wait for images inside iframe to load
      const images = iframeDoc.querySelectorAll("img")
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete && img.naturalHeight > 0) resolve()
              else {
                img.onload = resolve
                img.onerror = resolve
              }
            })
        )
      )

      await new Promise((r) => setTimeout(r, 500))

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
      const finalWidth = imgHeight > pdfHeight ? (pdfHeight * pdfWidth) / imgHeight : pdfWidth

      pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight)
      pdf.save(`${b.patient_name || "certificate"}-certificate.pdf`)

      toast.success("Certificate downloaded successfully!")
    } catch (error) {
      console.error("Certificate generation error:", error)
      toast.error("Failed to generate certificate")
    } finally {
      if (iframe && iframe.parentNode) document.body.removeChild(iframe)
      setGeneratingCertId(null)
    }
  }

  const reportTabs = [
    { value: "ambulance", label: "Ambulance", icon: Ambulance },
    { value: "patient", label: "Patient", icon: HeartPulse },
    { value: "caretaker", label: "Care Taker", icon: UserRound },
    { value: "booking", label: "Booking Person", icon: ClipboardList },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              Booking Reports
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-10">Filter, view, and export booking data</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate("/admin")} className="flex-1 sm:flex-none">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none">
              <FileDown className="h-4 w-4 mr-2" /> Export Excel
            </Button>
          </div>
        </div>

        {/* REPORT TYPE TABS */}
        <div className="bg-slate-100 p-1.5 rounded-xl inline-flex gap-1 flex-wrap">
          {reportTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setReportType(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reportType === tab.value
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-200"
                }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3 text-slate-600">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter Reports</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <Input
                placeholder="Patient Name"
                value={filters.patient}
                onChange={(e) => setFilters({ ...filters, patient: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
              <Input
                placeholder="Mobile Number"
                value={filters.mobile}
                onChange={(e) => setFilters({ ...filters, mobile: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
              <Input
                placeholder="Driver Name"
                value={filters.driver}
                onChange={(e) => setFilters({ ...filters, driver: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="bg-slate-50 border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                {reportType === "ambulance" && (
                  <>
                    <TableHeader className="bg-slate-50 border-b border-slate-100">
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Booking ID</TableHead>
                        <TableHead className="whitespace-nowrap">Register No</TableHead>
                        <TableHead className="whitespace-nowrap">Patient Name</TableHead>
                        <TableHead className="whitespace-nowrap">Patient Mobile</TableHead>
                        <TableHead className="whitespace-nowrap">Driver Name</TableHead>
                        <TableHead className="whitespace-nowrap">Driver Mobile</TableHead>
                        <TableHead className="whitespace-nowrap">Vehicle No</TableHead>
                        <TableHead className="whitespace-nowrap">Amb. Type</TableHead>
                        <TableHead className="whitespace-nowrap">Pickup Photo</TableHead>
                        <TableHead className="whitespace-nowrap">Drop Photo</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="whitespace-nowrap">Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                          <TableRow key={b.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">{b.id}</TableCell>
                            <TableCell className="whitespace-nowrap">{b.registration_number}</TableCell>
                            <TableCell className="font-medium text-slate-800 whitespace-nowrap">{b.patient_name}</TableCell>
                            <TableCell className="whitespace-nowrap">{b.patient_contact || b.booker_phone}</TableCell>
                            <TableCell className="whitespace-nowrap">{b.driver?.name || "N/A"}</TableCell>
                            <TableCell className="whitespace-nowrap">{b.driver?.phone || "N/A"}</TableCell>
                            <TableCell className="whitespace-nowrap">{b.driver?.vehicle_number || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-slate-50">{b.ambulance_type}</Badge>
                            </TableCell>
                            <TableCell>
                              {b.pickup_proof_url ? (
                                <img
                                  src={getImageUrl(b.pickup_proof_url)}
                                  alt="Pickup"
                                  className="h-14 w-14 rounded-md object-cover cursor-pointer border border-slate-200 hover:opacity-80 transition-opacity shadow-sm"
                                  onClick={() => setSelectedImage(getImageUrl(b.pickup_proof_url))}
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                                  <ImageOff className="h-5 w-5" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {b.drop_proof_url ? (
                                <img
                                  src={getImageUrl(b.drop_proof_url)}
                                  alt="Drop"
                                  className="h-14 w-14 rounded-md object-cover cursor-pointer border border-slate-200 hover:opacity-80 transition-opacity shadow-sm"
                                  onClick={() => setSelectedImage(getImageUrl(b.drop_proof_url))}
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                                  <ImageOff className="h-5 w-5" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(b.status)}>{b.status}</Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-xs text-slate-600">
                              {formatDate(b.created_at)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={12} className="h-24 text-center text-slate-500">
                            No reports found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </>
                )}

                {reportType === "patient" && (
                  <>
                    <TableHeader className="bg-slate-50 border-b border-slate-100">
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Date</TableHead>
                        <TableHead className="whitespace-nowrap">Time</TableHead>
                        <TableHead className="whitespace-nowrap">Register No</TableHead>
                        <TableHead className="whitespace-nowrap">Patient Name</TableHead>
                        <TableHead className="whitespace-nowrap">Address</TableHead>
                        <TableHead className="whitespace-nowrap">Village</TableHead>
                        <TableHead className="whitespace-nowrap">Police Station</TableHead>
                        <TableHead className="whitespace-nowrap">District</TableHead>
                        <TableHead className="whitespace-nowrap">Pincode</TableHead>
                        <TableHead className="whitespace-nowrap">Age</TableHead>
                        <TableHead className="whitespace-nowrap">Gender</TableHead>
                        <TableHead className="whitespace-nowrap">Contact No</TableHead>
                        <TableHead className="whitespace-nowrap">Aadhaar</TableHead>
                        <TableHead className="whitespace-nowrap">Condition</TableHead>
                        <TableHead className="whitespace-nowrap">Certificate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                          <TableRow key={b.id} className="hover:bg-slate-50/50">
                            <TableCell className="whitespace-nowrap">{b.booking_date || "N/A"}</TableCell>
                            <TableCell>{b.booking_time || "N/A"}</TableCell>
                            <TableCell>{b.registration_number}</TableCell>
                            <TableCell className="font-medium text-slate-800 whitespace-nowrap">{b.patient_name}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{b.pickup_address}</TableCell>
                            <TableCell>{b.patient_village || "N/A"}</TableCell>
                            <TableCell>{b.patient_police_station || "N/A"}</TableCell>
                            <TableCell>{b.patient_district || "N/A"}</TableCell>
                            <TableCell>{b.patient_pincode || "N/A"}</TableCell>
                            <TableCell>{b.patient_age}</TableCell>
                            <TableCell>{b.patient_gender}</TableCell>
                            <TableCell>{b.patient_contact || b.booker_phone}</TableCell>
                            <TableCell>{b.patient_aadhar || "N/A"}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{b.medical_condition}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => generateCertificate(b)}
                                disabled={generatingCertId === b.id}
                              >
                                {generatingCertId === b.id ? "Wait..." : "PDF"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={15} className="h-24 text-center text-slate-500">
                            No patient reports found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </>
                )}

                {reportType === "caretaker" && (
                  <>
                    <TableHeader className="bg-slate-50 border-b border-slate-100">
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Booking ID</TableHead>
                        <TableHead className="whitespace-nowrap">Register No</TableHead>
                        <TableHead className="whitespace-nowrap">Patient Name</TableHead>
                        <TableHead className="whitespace-nowrap">Care Taker Name</TableHead>
                        <TableHead className="whitespace-nowrap">Care Taker Mobile</TableHead>
                        <TableHead className="whitespace-nowrap">Relationship</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                          <TableRow key={b.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">{b.id}</TableCell>
                            <TableCell>{b.registration_number}</TableCell>
                            <TableCell className="font-medium text-slate-800 whitespace-nowrap">{b.patient_name}</TableCell>
                            <TableCell>{b.caretaker_name || "N/A"}</TableCell>
                            <TableCell>{b.caretaker_phone || "N/A"}</TableCell>
                            <TableCell>{b.caretaker_relation || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(b.status)}>{b.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                            No caretaker reports found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </>
                )}

                {reportType === "booking" && (
                  <>
                    <TableHeader className="bg-slate-50 border-b border-slate-100">
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Booking ID</TableHead>
                        <TableHead className="whitespace-nowrap">Register No</TableHead>
                        <TableHead className="whitespace-nowrap">Booker Name</TableHead>
                        <TableHead className="whitespace-nowrap">Booker Mobile</TableHead>
                        <TableHead className="whitespace-nowrap">Patient Name</TableHead>
                        <TableHead className="whitespace-nowrap">Amb. Type</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="whitespace-nowrap">Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                          <TableRow key={b.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">{b.id}</TableCell>
                            <TableCell>{b.registration_number}</TableCell>
                            <TableCell>{b.booker_name || "N/A"}</TableCell>
                            <TableCell>{b.booker_phone || "N/A"}</TableCell>
                            <TableCell className="font-medium text-slate-800 whitespace-nowrap">{b.patient_name}</TableCell>
                            <TableCell>{b.ambulance_type}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(b.status)}>{b.status}</Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-xs text-slate-600">
                              {formatDate(b.created_at)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                            No booking person reports found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </>
                )}
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* TOTAL COUNTER */}
        <div className="flex justify-end">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-slate-600">
            Total Results: <span className="text-blue-600 font-bold">{filteredBookings.length}</span>
          </div>
        </div>

      </div>

      {/* IMAGE PREVIEW DIALOG */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-2 bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-h-[80vh] w-auto rounded-lg object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}