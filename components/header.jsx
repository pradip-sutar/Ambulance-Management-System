"use client"

import { Ambulance, Phone } from "lucide-react";


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary glow-primary overflow-hidden">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-foreground">ବସନ୍ତ କୁମାର ନାଥଙ୍କ ସ୍ମ୍ରୁତି ଉଦ୍ଦେଶ୍ୟରେ ନିଃଶୁଳ୍କ  ଆମ୍ବୁଲାନ୍ସ   ସେବା </span>
        </div>

        {/* Emergency Phone Link */}
        <a
          href="tel:9348616669"
          className="flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 hover:scale-105"
        >
          <Phone className="h-4 w-4" />
          <span>Emergency: 9348616669</span>
        </a>
      </div>
    </header>
  )
}
