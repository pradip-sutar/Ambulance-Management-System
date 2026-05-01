"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix marker icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})


const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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

  return marker ?<Marker position={marker} icon={customIcon} /> : null
}

export default function MapPicker({ onSelectLocation }) {
  const [marker, setMarker] = useState(null)

  return (
    <MapContainer
      key={marker?.lat || "default"}
      center={defaultCenter}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
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