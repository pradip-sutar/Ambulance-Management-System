"use client"

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { useState, useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

/* FIX MARKER ICON */
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

/* ------------------------------------------
   AUTO CENTER TO CURRENT LOCATION
------------------------------------------- */
function CurrentLocation({ setMarker, onSelectLocation }) {
  const map = useMap()

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        const current = { lat, lng }

        setMarker(current)

        map.setView(current, 16)

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
      (err) => {
        console.error("Location error:", err)
      },
      {
        enableHighAccuracy: true,
      }
    )
  }, [map, setMarker, onSelectLocation])

  return null
}

/* ------------------------------------------
   CLICK LOCATION SELECTOR
------------------------------------------- */
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

  return marker ? <Marker position={marker} /> : null
}

/* ------------------------------------------
   MAIN COMPONENT
------------------------------------------- */
export default function MapPicker({ onSelectLocation }) {
  const [marker, setMarker] = useState(null)

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
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* AUTO CURRENT LOCATION */}
      <CurrentLocation
        setMarker={setMarker}
        onSelectLocation={onSelectLocation}
      />

      {/* CLICK TO CHANGE LOCATION */}
      <LocationMarker
        marker={marker}
        setMarker={setMarker}
        onSelectLocation={onSelectLocation}
      />
    </MapContainer>
  )
}