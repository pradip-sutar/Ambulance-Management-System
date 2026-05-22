import { useState } from "react"
import { Link } from "react-router-dom"
import { Header } from "../components/header"
import {
    Siren, HeartPulse, BedDouble, Flower2, Phone, ArrowRight,
    MapPin, Clock, Shield, CheckCircle2, Users, HandHeart, Droplets, Utensils, Trees
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Footer } from "../components/footer"

const services = [
    {
        icon: <Siren className="h-7 w-7" />,
        title: "Emergency Ambulance",
        description: "Immediate response for accidents, heart attacks, strokes, and other critical emergencies. Our vehicles are equipped with sirens, emergency lights, and life-saving tools to reach you fastest.",
        features: ["24/7 Availability", "Quick Dispatch", "First-Aid Ready"]
    },
    {
        icon: <BedDouble className="h-7 w-7" />,
        title: "Patient Transport",
        description: "Safe and comfortable non-emergency transport for patients who need to travel between hospitals, to diagnostic centers, or back home after discharge.",
        features: ["Comfortable Stretchers", "Smooth Transit", "Long Distance"]
    },
    {
        icon: <Users className="h-7 w-7" />,
        title: "Old Age Home Support",
        description: "Specialized medical transport tailored for senior citizens, ensuring gentle handling, comfortable seating, and immediate medical attention when required.",
        features: ["Gentle Handling", "Wheelchair Access", "Attendant Support"]
    },
    {
        icon: <Droplets className="h-7 w-7" />,
        title: "Blood Donation Camp",
        description: "We organize blood donation camps to support hospitals and save lives during emergencies. Our camps are conducted in a safe, hygienic, and well-managed environment with proper medical supervision.",
        features: ["Safe Donation Process", "Medical Supervision", "Emergency Blood Support"]
    },
    {
        icon: <Trees className="h-7 w-7" />,
        title: "Plantation Drive",
        description: "We organize plantation drives to promote a greener and healthier environment. Our team works with communities, schools, and organizations to plant and care for trees for a sustainable future.",
        features: ["Tree Plantation", "Community Participation", "Environmental Awareness"]
    },
    {
        icon: <Utensils className="h-7 w-7" />,
        title: "Food Distribution",
        description: "We collect surplus food from events, weddings, and community functions and distribute it to needy people in a safe and hygienic manner to reduce food waste and support the underprivileged.",
        features: ["Surplus Food Collection", "Hygienic Distribution", "Support for Needy People"]
    }
]

export default function ServicesPage() {
    return (
        <div className="flex flex-col">
            <Header />
            {/* ========================================= */}
            {/* HERO SECTION                              */}
            {/* ========================================= */}
            <section className="relative w-full overflow-hidden min-h-[50vh] sm:min-h-[60vh] flex items-center py-12 sm:py-16 md:py-20">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/hero-ambulance2.png')" }}
                />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-800/60 z-10" />

                <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <Badge variant="secondary" className="mb-4 sm:mb-6 border border-white/20 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-white/90 backdrop-blur-md text-md sm:text-sm">
                            <Siren className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" /> Our Services
                        </Badge>

                        <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
                            Comprehensive & Free{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Medical Transport
                            </span>{" "}
                            Services
                        </h1>

                        <p className="mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-white/80">
                            From critical emergencies to non-emergency transports, we provide a wide range of ambulance services completely free of cost. No one should suffer due to lack of transport.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <a href="tel:9776696669">
                                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-xl text-sm sm:text-base">
                                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Call Now: 9776696669
                                </Button>
                            </a>
                            <Link to="/"> {/* Changed href to to */}
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 text-black hover:bg-white/10 backdrop-blur-sm text-sm sm:text-base">
                                    Book Online <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================= */}
            {/* SERVICES GRID SECTION                     */}
            {/* ========================================= */}
            <section className="py-12 sm:py-16 md:py-24 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-8 sm:mb-12">
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm">What We Offer</Badge>
                        <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            Ambulance Services for Every Need
                        </h2>
                        <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                            Every service is rendered with utmost care, professionalism, and at absolutely zero cost to the patient or their family.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                features={service.features}
                            />
                        ))}
                    </div>

                </div>
            </section>

            {/* ========================================= */}
            {/* HOW IT WORKS SECTION                      */}
            {/* ========================================= */}
            <section className="py-12 sm:py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-8 sm:mb-12">
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs sm:text-sm">Simple Process</Badge>
                        <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            How to Get Help
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        <StepCard
                            step="01"
                            icon={<Phone className="h-8 w-8 text-blue-600" />}
                            title="Call Us"
                            description="Dial our 24/7 helpline number in case of an emergency or for transport needs."
                        />
                        <StepCard
                            step="02"
                            icon={<Clock className="h-8 w-8 text-blue-600" />}
                            title="Quick Dispatch"
                            description="Our nearest ambulance is immediately dispatched to your location without delay."
                        />
                        <StepCard
                            step="03"
                            icon={<Shield className="h-8 w-8 text-blue-600" />}
                            title="Safe Transport"
                            description="Patient is carefully shifted and stabilized by our trained medical staff."
                        />
                        <StepCard
                            step="04"
                            icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
                            title="Zero Billing"
                            description="Reach the hospital safely. No bills, no charges, no financial burden."
                        />
                    </div>

                </div>
            </section>

            {/* ========================================= */}
            {/* COVERAGE AREAS SECTION                    */}
            {/* ========================================= */}
            <section className="py-12 sm:py-16 md:py-24 bg-blue-950 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">

                        {/* Left Content */}
                        <div>
                            <Badge
                                variant="outline"
                                className="text-blue-300 border-blue-400 bg-blue-900/50 text-xs sm:text-sm mb-4"
                            >
                                Coverage Area
                            </Badge>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                                Serving Cuttack & Surrounding Regions
                            </h2>

                            <p className="mt-4 text-blue-200 text-sm sm:text-base md:text-lg leading-relaxed">
                                We are continuously expanding our network to ensure that rural and
                                underserved communities have access to immediate medical transport.
                                Currently operational across key areas.
                            </p>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-8">

                            {/* Pickup Area */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-blue-300">
                                    Pickup Areas
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <LocationCard name="Mulabasanta Gram Panchyat" />
                                    <LocationCard name="Kusupur Gram Panchyat" />
                                    <LocationCard name="Kuhunda Gram Panchyat" />
                                    <LocationCard name="Balichandrapur Gram Panchyat" />
                                </div>
                            </div>

                            {/* Drop Hospitals */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-blue-300">
                                    Govt. Hospitals
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <LocationCard name="CHC, Mahanga" />
                                    <LocationCard name="CHC, Badachana " />
                                    <LocationCard name="SCB Medical, Cuttack" />
                                    <LocationCard name="CHC, Jagannathpur" />
                                    <LocationCard name="CHC, Salepur" />
                                    <LocationCard name="PHC, Nadiasahaspur" />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
            
            {/* ========================================= */}
            {/* CTA SECTION                               */}
            {/* ========================================= */}
            <section className="py-12 sm:py-16 md:py-24 bg-white border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            Don't Wait in an Emergency
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600">
                            Save our number now. When seconds matter, we are just a call away, ready to serve you for free.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
                            <a href="tel:9776696669">
                                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg text-sm sm:text-base">
                                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Call 9776696669
                                </Button>
                            </a>
                            <Link to="/"> {/* Changed href to to */}
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-black-600 hover:bg-blue-50 text-sm sm:text-base">
                                    Back to Home <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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

function ServiceCard({ icon, title, description, features }) {
    return (
        <div className="group bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-5 flex-grow">{description}</p>

            <div className="border-t border-gray-100 pt-4 mt-auto">
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

function StepCard({ step, icon, title, description }) {
    return (
        <div className="text-center p-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 text-5xl font-extrabold text-blue-50 z-0 select-none">
                {step}
            </div>
            <div className="relative z-10">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

function LocationCard({ name }) {
    return (
        <div className="flex items-center gap-3 bg-blue-900/50 p-4 rounded-xl border border-blue-800/50 backdrop-blur-sm hover:bg-blue-900/70 transition-colors duration-200">
            <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            <span className="font-semibold text-white text-sm sm:text-base">{name}</span>
        </div>
    )
}