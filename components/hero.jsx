"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, Truck, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0_/_0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(1_0_0_/_0.08)_0%,transparent_40%)]" />
      
      <div className="container relative mx-auto px-4 text-center">
        
        {/* Verified Badge */}
        <Badge 
          variant="secondary" 
          className="mb-6 bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/25"
        >
          <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          24/7 Verified Service
        </Badge>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl text-balance">
          Book an ambulance in seconds.
        </h1>

        {/* Subheading */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl text-pretty">
          Fast, reliable emergency medical transport when every second counts. 
          Our network of verified ambulances is ready to respond 24/7.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <StatIndicator 
            icon={<Clock className="h-5 w-5" />}
            value="< 12 min"
            label="Avg arrival"
          />
          <StatIndicator 
            icon={<Truck className="h-5 w-5" />}
            value="240+"
            label="Active fleet"
          />
          <StatIndicator 
            icon={<Users className="h-5 w-5" />}
            value="100%"
            label="Trained crew"
          />
        </div>

      </div>
    </section>
  )
}

function StatIndicator({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-sm text-white/70">{label}</p>
      </div>
    </div>
  )
}