"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useState, useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

/* -------------------------------------------------------
   FIX: Marker icon — use CDN URLs (most reliable approach)
   This avoids all issues with Next.js image imports,
   missing public folder files, and broken _getIconUrl.
------------------------------------------------------- */
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const defaultCenter = { lat: 20.2961, lng: 85.8245 }

function LocationMarker({ marker, setMarker, onSelectLocation }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      setMarker({ lat, lng })

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
        const data = await res.json()

        onSelectLocation({
          lat,
          lng,
          address: data?.display_name || `${lat}, ${lng}`,
        })
      } catch {
        onSelectLocation({
          lat,
          lng,
          address: `${lat}, ${lng}`,
        })
      }
    },
  })

  // FIX: Use default icon (no customIcon needed since we fixed L.Icon.Default)
  return marker ? <Marker position={marker} /> : null
}

export default function MapPicker({ onSelectLocation }) {
  const [marker, setMarker] = useState(null)

  // Fallback: ensure leaflet CSS is loaded (helps with some Next.js setups)
  useEffect(() => {
    const id = "leaflet-css"
    if (!document.getElementById(id)) {
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }
  }, [])

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      // FIX: Removed `key` prop — it was causing full remount on every click
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        marker={marker}
        setMarker={setMarker}
        onSelectLocation={onSelectLocation}
      />
    </MapContainer>
  )
}