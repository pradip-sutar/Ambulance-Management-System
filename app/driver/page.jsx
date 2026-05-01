"use client"

import { useEffect, useState } from "react"
import { Toaster } from "sonner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import DriverDashboard from "../../components/driver"

export default function AdminPage() {
  const [refresh, setRefresh] = useState(false)

  const reload = () => setRefresh(!refresh)

  return (
    <div className="flex min-h-screen flex-col">
      
      {/* HEADER */}
      <Header />

      {/* MAIN */}
      <main className="container mx-auto flex-1 px-4 py-10">
        <DriverDashboard refresh={refresh} onAction={reload} />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* TOAST */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}