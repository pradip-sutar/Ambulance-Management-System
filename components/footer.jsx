"use client"

import { Ambulance } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-card/50 py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 text-center sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          
          <span>&copy; {currentYear} created by Vichaarlab</span>
        </div>
        {/* <p className="text-sm text-muted-foreground">
          Emergency medical transport services
        </p> */}
      </div>
    </footer>
  )
}
