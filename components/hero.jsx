"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, Truck, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[85vh] flex items-center py-12 md:py-20 lg:py-0">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-[70%_center] md:bg-center z-0"
        style={{
          backgroundImage: "url('/hero-ambulance2.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-transparent z-10" />

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">

          {/* Verified Badge */}
          <Badge
            variant="secondary"
            className="mb-6 sm:mb-8 border border-white/20 bg-white/10 px-4 py-2 text-white/90 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            24/7 Verified Service
          </Badge>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Book an <br className="hidden sm:block" />
            ambulance in{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              seconds.
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
            Fast, reliable emergency medical transport when every second counts.
            Our network of verified ambulances is ready to respond 24/7.
          </p>

          {/* Stats Container */}
          {/* 
             Mobile: flex-row (Side-by-side, compact)
             sm+: grid-cols-3 (Standard cards)
          */}
          <div className="flex flex-1 flex-row gap-2 sm:grid sm:grid-cols-3 sm:gap-6">
            <StatIndicator
              icon={<Clock className="h-4 w-4 sm:h-6 sm:w-6" />}
              value="< 12 min"
              label="Avg arrival"
            />

            <StatIndicator
              icon={<Truck className="h-4 w-4 sm:h-6 sm:w-6" />}
              value="24/7"
              label="Emergency service"
            />

            <StatIndicator
              icon={<Users className="h-4 w-4 sm:h-6 sm:w-6" />}
              value="100%"
              label="Trained crew"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatIndicator({ icon, value, label }) {
  return (
    <div 
      className="
        group 
        flex-1 
        /* Mobile Layout: Horizontal Row */
        flex flex-row items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-md
        /* Desktop Layout: Vertical Column */
        sm:flex-0 sm:flex-col sm:items-start sm:gap-0 sm:rounded-2xl sm:px-6 sm:py-5
        transition-all hover:bg-white/15 hover:scale-[1.02]
      "
    >
      {/* Icon Container */}
      <div 
        className="
          flex shrink-0 items-center justify-center rounded-lg bg-blue-500/30 text-blue-100 
          h-8 w-8 /* Mobile Size */
          sm:mb-4 sm:h-14 sm:w-14 sm:rounded-xl /* Desktop Size */
          group-hover:bg-blue-500/50 transition-colors
        "
      >
        {icon}
      </div>

      {/* Text Content */}
      <div className="flex flex-col sm:mt-1">
        <h3 
          className="
            font-bold text-white tracking-tight
            text-lg /* Mobile Size */
            sm:text-3xl /* Desktop Size */
          "
        >
          {value}
        </h3>

        <p 
          className="
            font-medium text-white/70
            text-[10px] uppercase tracking-wide /* Mobile Size */
            sm:mt-1 sm:text-base sm:font-normal sm:tracking-normal /* Desktop Size */
          "
        >
          {label}
        </p>
      </div>
    </div>
  )
}