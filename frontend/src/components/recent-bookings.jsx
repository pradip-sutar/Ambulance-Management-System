"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, MapPin, User, Users, Ambulance, Clock } from "lucide-react"

const ambulanceTypeLabels = {
  basic: "Basic",
  als: "Advanced Life Support",
  icu: "ICU",
  neonatal: "Neonatal",
}

export function RecentBookings({ bookings }) {
  return (
    <Card className="shadow-card border-border/50 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ClipboardList className="h-5 w-5 text-primary" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Ambulance className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-medium text-foreground">No bookings yet</h3>
      <p className="text-sm text-muted-foreground">
        Your dispatched ambulances will appear here
      </p>
    </div>
  )
}

function BookingCard({ booking }) {
  const timeAgo = getTimeAgo(booking.created_at)

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 transition-all hover:shadow-card">
      {/* Header with Status Badge */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Ambulance className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {ambulanceTypeLabels[booking.ambulanceType] || booking.ambulanceType}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </p>
          </div>
        </div>
        <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20">
          Dispatched
        </Badge>
      </div>

      {/* Patient Info */}
      <div className="mb-3 space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <span className="font-medium text-foreground">{booking.patientName}</span>
            <span className="text-muted-foreground">, {booking.patientAge} yrs</span>
            <p className="text-muted-foreground line-clamp-1">{booking.medicalCondition}</p>
          </div>
        </div>
      </div>

      {/* Booker Info */}
      <div className="mb-3 flex items-center gap-2 text-sm">
        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">Booked by:</span>
        <span className="font-medium text-foreground">{booking.bookerName}</span>
      </div>

      {/* Caretaker Info */}
      {booking.caretakerName && (
        <div className="mb-3 flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">Caretaker:</span>
          <span className="font-medium text-foreground">
            {booking.caretakerName}
            {booking.caretakerRelation && ` (${booking.caretakerRelation})`}
          </span>
        </div>
      )}

      {/* Pickup Address */}
      <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2 text-sm">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-foreground line-clamp-2">{booking.pickupAddress}</p>
      </div>
    </div>
  )
}

function getTimeAgo(date) {
  if (!date) return "N/A"

  const d = new Date(date)

  if (isNaN(d.getTime())) return "Invalid date"

  const now = new Date()
  const diffInSeconds = Math.floor((now - d) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
}