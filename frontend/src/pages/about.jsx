import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "../components/header"
import { Heart, Shield, Clock, Truck, Phone, Star, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react" // Added ChevronLeft, ChevronRight
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Footer } from "../components/footer"

// Add your 10+ images here
const galleryImages = [
  "/slider-1.jpeg",
  "/slider-2.jpeg",
  "/slider-3.jpeg",
  "/slider-4.jpeg",
  "/slider-5.jpeg",
  "/slider-6.jpeg",
  "/slider-7.jpeg",
  "/slider-8.jpeg",
  "/slider-9.jpeg",
  "/slider-10.jpeg",
  "/slider-11.jpeg",
  "/slider-12.jpeg",
  "/slider-13.jpeg",
]

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null) // Now stores the index instead of the image URL

  // Number of images visible at once
  const visibleCount = 4 

  // Clone first 'visibleCount' images to the end for infinite loop effect
  const clonedImages = [...galleryImages, ...galleryImages.slice(0, visibleCount)]

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => prevIndex + 1)
    }, 3000) // Slide every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Handle infinite loop reset
  const handleTransitionEnd = () => {
    if (currentIndex >= galleryImages.length) {
      setIsTransitioning(false)
      setCurrentIndex(0)
    }
  }

  // Lightbox Navigation Functions
  const handleNextImage = (e) => {
    e.stopPropagation() // Prevents clicking the button from closing the modal
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const handlePrevImage = (e) => {
    e.stopPropagation() // Prevents clicking the button from closing the modal
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <div className="flex flex-col">
      <Header />
      
      {/* HERO SECTION */}
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
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-xl text-sm sm:text-base">
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Book Ambulance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO SLIDER SECTION - 4 VISIBLE, AUTO SLIDE 1 BY 1 */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm">Gallery</Badge>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Our Service In Action
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">Click on any image to view it in full size</p>
          </div>

          <div className="relative w-full">
            <div
              className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {clonedImages.map((img, index) => (
                <div 
                  key={index} 
                  className="flex-none w-full sm:w-1/2 lg:w-1/4 p-2 sm:p-3"
                >
                  <div 
                    className="relative h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden cursor-pointer group shadow-md"
                    // Use modulo to get the correct original index for the cloned images at the end
                    onClick={() => setLightboxIndex(index % galleryImages.length)}
                  >
                    <img
                      src={img}
                      alt={`Gallery Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">
                        View Image
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL WITH NAVIGATION BUTTONS */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)} // Click outside to close
        >
          {/* Close Button (Top Right) */}
          <button 
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="h-8 w-8 sm:h-10 sm:w-10" />
          </button>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrevImage}
            className="absolute left-3 sm:left-6 md:left-10 text-white/70 hover:text-white transition-colors z-50 bg-black/40 hover:bg-black/70 rounded-full p-2 sm:p-3 shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextImage}
            className="absolute right-3 sm:right-6 md:right-10 text-white/70 hover:text-white transition-colors z-50 bg-black/40 hover:bg-black/70 rounded-full p-2 sm:p-3 shadow-lg"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          
          {/* Main Enlarged Image */}
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <img 
              src={galleryImages[lightboxIndex]} 
              alt="Enlarged view" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </div>
        </div>
      )}

      {/* MISSION & MEMORIAL SECTION */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            <div className="space-y-4 sm:space-y-6">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm">Our Mission</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Serving the Community, One Ride at a Time
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
                Operating from Dharmadaspur, Mahanga, Jagannathpur, Salepur, Badachana, Cuttack, our free ambulance service was created to bridge the critical gap in emergency medical transport for rural and underserved communities. We operate 24/7, ensuring that a reliable, fully equipped ambulance is just a call away.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We handle everything from basic patient transport to critical care transfers, completely free of cost. Our dedicated drivers are trained to handle emergencies with care .
              </p>
            </div>

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

      {/* CORE VALUES / FEATURES */}
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

      {/* CTA SECTION */}
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
              <Link to="/">
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