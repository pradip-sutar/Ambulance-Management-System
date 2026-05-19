"use client" 

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Heart, Shield, Clock, Truck, Phone, Users, Star, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"

// ✅ IMPORT SLIDER AND ITS CSS
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const slides = [
  "/slider-1.jpeg",
  "/slider-2.jpeg",
  "/slider-3.jpeg",
  "/slider-4.jpeg",
  "/slider-5.jpeg",
  "/slider-7.jpeg",
  "/slider-6.jpeg",
  "/slider-8.jpeg",
  "/slider-9.jpeg",
  "/slider-10.jpeg",
  "/slider-11.jpeg",
  "/slider-12.jpeg",
  "/slider-13.jpeg",
]

export default function AboutPage() {
  // ✅ LIGHTBOX STATE
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // ✅ OPEN LIGHTBOX
  const openLightbox = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  // ✅ CLOSE LIGHTBOX
  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  // ✅ NAVIGATE PHOTOS
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // ✅ KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen])

  // ✅ LOCK BODY SCROLL WHEN LIGHTBOX OPEN
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  // ✅ SLIDER SETTINGS
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  }

  return (
    <div className="flex flex-col">
      <Header />
      {/* ========================================= */}
      {/* HERO SECTION                              */}
      {/* ========================================= */}
      <section className="relative w-full overflow-hidden min-h-[60vh] sm:min-h-[70vh] flex items-center py-12 sm:py-16 md:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/hero-ambulance2.png')" }}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-800/60 z-10" />

        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 sm:mb-6 border border-white/20 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-white/90 backdrop-blur-md text-xs sm:text-sm">
              <Heart className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-red-400 fill-red-400" /> Non-Profit Initiative
            </Badge>
            
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
               "Mo Ambulance Seba Service” is not just a service  <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                — it is a mission of humanity, care, and
              </span>{" "}
              social responsibility. 
            </h1>
            
            <p className="mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-white/80">
             We believe that free ambulance seva is a humanitarian service, and no one should be denied emergency medical transport due to financial difficulties.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-xl text-sm sm:text-base">
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Book Ambulance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* MISSION & MEMORIAL SECTION                */}
      {/* ========================================= */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left: Mission Text */}
            <div className="space-y-4 sm:space-y-6">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm">Our Mission</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Serving the Community, One Ride at a Time
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
                Operating from Dharmadaspur, Mahanga, Jagannathpur, Salepur, Badachana, Cuttack, our free ambulance service was created to bridge the critical gap in emergency medical transport for rural and underserved communities. We operate 24/7, ensuring that a reliable, fully equipped ambulance is just a call away.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We handle everything from basic patient transport to critical care transfers, completely free of cost. Our dedicated drivers and medical staff are trained to handle emergencies with care and urgency.
              </p>
            </div>

            {/* Right: Memorial Dedication */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-50 to-white shadow-xl">
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-md whitespace-nowrap">
                  In Loving Memory
                </div>
                
                <div className="text-center mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
                    <Star className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 fill-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Late Basanta Kumar Nath</h3>
                  <p className="text-gray-600 italic leading-relaxed text-sm sm:text-base">
                    "His vision of free healthcare for all lives on through this service. We drive forward in his memory, ensuring no one is left behind in their hour of need."
                  </p>
                  <div className="pt-3 sm:pt-4 border-t border-green-200">
                    <p className="text-xs sm:text-sm font-semibold text-green-700">Founder & Son</p>
                    <p className="text-base sm:text-lg font-bold text-gray-800">Narendra Kumar Nath</p>
                    <p className="text-base sm:text-lg font-bold text-gray-800">Nagendra Nath</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* PHOTO SLIDER SECTION (REACT-SLICK)        */}
      {/* ========================================= */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm">Gallery</Badge>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Glimpse of Our Service
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Moments captured from our continuous efforts to save lives and serve the community. Click any photo to view full size.
            </p>
          </div>

          {/* ✅ MULTIPLE ITEMS SLIDER WITH CLICK-TO-OPEN */}
          <div className="max-w-7xl mx-auto">
            <Slider {...settings}>
              {slides.map((src, index) => (
                <div key={index} className="px-2">
                  <div
                    className="relative w-full h-[150px] sm:h-[150px] md:h-[200px] lg:h-[300px] bg-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={src}
                      alt={`Service Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* ✅ HOVER OVERLAY */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
                        🔍 View Full
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

        </div>
      </section>

      {/* ========================================= */}
      {/* LIGHTBOX MODAL                            */}
      {/* ========================================= */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-2 sm:left-6 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors duration-200"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-2 sm:right-6 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors duration-200"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={slides[currentIndex]}
              alt={`Service Photo ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Photo Counter */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs sm:text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {slides.length}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* CORE VALUES / FEATURES                    */}
      {/* ========================================= */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm">Why Choose Us</Badge>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Our Core Values
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to providing exceptional, unhindered emergency services to those who need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ValueCard 
              icon={<Heart className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Completely Free"
              description="No hidden charges, no billing. Our service is entirely funded by the community and donors to keep it free for patients."
            />
            <ValueCard 
              icon={<Clock className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="24/7 Availability"
              description="Emergencies don't wait for business hours. Our fleet and drivers are ready to dispatch at a moment's notice, day or night."
            />
            <ValueCard 
              icon={<Shield className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Verified & Safe"
              description="All our drivers and medical staff are background-verified and trained in first aid and emergency handling protocols."
            />
            <ValueCard 
              icon={<Truck className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Well-Equipped"
              description="From basic life support to ICU on wheels, our ambulances are fitted with the necessary medical equipment to stabilize patients."
            />
          </div>

        </div>
      </section>

      {/* ========================================= */}
      {/* CTA SECTION                               */}
      {/* ========================================= */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Need an Ambulance? Don't Hesitate.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              In an emergency, every second counts. Our dispatch team is standing by 24/7 to send help immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
              <a href="tel:9776696669">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg text-sm sm:text-base">
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Call 9776696669
                </Button>
              </a>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 text-sm sm:text-base">
                  Book Online <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ---------------- HELPER COMPONENTS ---------------- */

function ValueCard({ icon, title, description }) {
  return (
    <div className="group p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">{description}</p>
    </div>
  )
}