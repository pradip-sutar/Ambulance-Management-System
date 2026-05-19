"use client" 

import Link from "next/link"
import { Header } from "@/components/header"
import { 
  ShieldCheck, Lock, Eye, Phone, Mail, MapPin, 
  ArrowRight, ArrowLeft, FileText, UserCheck, Server 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <Header />
      {/* ========================================= */}
      {/* HERO SECTION                              */}
      {/* ========================================= */}
      <section className="relative w-full overflow-hidden py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm mb-4">
            <ShieldCheck className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> Transparency & Trust
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Privacy{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            At Mo Ambulance Seba Service, we are committed to protecting the privacy and dignity of our patients and website visitors. This policy outlines how we handle your information.
          </p>
          
          <p className="mt-4 text-xs sm:text-sm text-gray-500 font-medium">
            Last Updated: May 2026
          </p>
        </div>
      </section>

      {/* ========================================= */}
      {/* MAIN CONTENT SECTION                      */}
      {/* ========================================= */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-10 md:space-y-14">
            
            {/* Introduction */}
            <PolicyBlock 
              icon={<FileText className="h-6 w-6 text-blue-600" />}
              title="1. Introduction"
              content="Mo Ambulance Seba Service  operates the website and ambulance services described on this platform. We are a non-profit, community-driven initiative based in  Dharmadaspur, Mahanga, Cuttack, Odisha. We respect your privacy and are committed to protecting any personal data you share with us."
            />

            {/* Information We Collect */}
            <PolicyBlock 
              icon={<Eye className="h-6 w-6 text-blue-600" />}
              title="2. Information We Collect"
              content="To provide our free emergency ambulance services effectively, we may collect the following information:"
            >
              <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base mt-3">
                <li><strong>Personal Identification:</strong> Name, phone number, and address of the patient or the person booking the ambulance.</li>
                <li><strong>Health & Medical Data:</strong> Brief nature of the medical emergency or patient condition to dispatch the Ambulance. </li>
                <li><strong>Location Data:</strong> Pick-up and drop-off locations to ensure rapid navigation and dispatch.</li>
                <li><strong>Website Usage Data:</strong> IP address, browser type, and pages visited, collected automatically via cookies to improve website performance.</li>
              </ul>
            </PolicyBlock>

            {/* How We Use Information */}
            <PolicyBlock 
              icon={<UserCheck className="h-6 w-6 text-blue-600" />}
              title="3. How We Use Your Information"
              content="Given the emergency nature of our services, your data is used strictly for operational and life-saving purposes:"
            >
              <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base mt-3">
                <li>To dispatch the nearest available ambulance to your location immediately.</li>
               
                <li>To contact you for updates, directions, or follow-up regarding the ambulance dispatch.</li>
                <li>To coordinate with hospitals or medical facilities if required for patient admission.</li>
                <li>To improve our website functionality and response times.</li>
              </ul>
            </PolicyBlock>

            {/* Data Sharing */}
            <PolicyBlock 
              icon={<ShieldCheck className="h-6 w-6 text-blue-600" />}
              title="4. Data Sharing & Confidentiality"
              content="We do NOT sell, trade, or rent your personal information to any third parties for marketing or commercial purposes. Your data is shared strictly on a need-to-know basis:"
            >
              <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base mt-3">
                <li><strong>Medical Staff & Drivers:</strong> Shared only with the assigned team responding to the emergency.</li>
                <li><strong>Hospitals:</strong> Shared with the receiving hospital’s emergency department to prepare for the patient’s arrival.</li>
                <li><strong>Legal Requirements:</strong> If required by law, regulation, or legal process involving a medical emergency investigation.</li>
              </ul>
            </PolicyBlock>

            {/* Data Security */}
            <PolicyBlock 
              icon={<Lock className="h-6 w-6 text-blue-600" />}
              title="5. Data Security"
              content="We implement reasonable security measures to protect your personal and medical information from unauthorized access, alteration, disclosure, or destruction. However, given the urgent nature of emergency services, communication may occasionally happen via standard phone calls or messaging, which are inherently less secure than encrypted channels. We strive to minimize any risks associated with data transmission."
            />

            {/* Data Retention */}
            <PolicyBlock 
              icon={<Server className="h-6 w-6 text-blue-600" />}
              title="6. Data Retention"
              content="We retain your personal and medical information only for as long as necessary to fulfill the purposes outlined in this policy, typically for the duration of the emergency service and a short period thereafter for record-keeping and service improvement. You may request deletion of your records at any time."
            />

            {/* Your Rights */}
            <PolicyBlock 
              icon={<UserCheck className="h-6 w-6 text-blue-600" />}
              title="7. Your Rights"
              content="As a user of our services, you have the right to:"
            >
              <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base mt-3">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of any inaccurate data.</li>
                <li>Request deletion of your data, provided there are no legal obligations requiring us to retain it.</li>
                <li>Opt-out of any non-essential communications.</li>
              </ul>
            </PolicyBlock>

            {/* Changes to Policy */}
            <PolicyBlock 
              icon={<FileText className="h-6 w-6 text-blue-600" />}
              title="8. Changes to This Policy"
              content="We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will post the updated policy on this page with a revised 'Last Updated' date. We encourage you to review this page periodically."
            />

          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* CONTACT SECTION                           */}
      {/* ========================================= */}
      <section className="py-10 sm:py-12 md:py-16 bg-slate-50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out to us directly.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Call Us</h4>
                  <a href="tel:9776696669" className="text-blue-700 hover:underline text-sm sm:text-base font-medium">9776696669</a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Location</h4>
                  <p className="text-gray-700 text-sm sm:text-base">Dharmadaspur, Mahanga, Cuttack, Odisha</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 text-sm sm:text-base">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </Link>
              <a href="tel:9776696669">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg text-sm sm:text-base">
                  <Phone className="mr-2 h-4 w-4" /> Contact Us
                </Button>
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ---------------- HELPER COMPONENT ---------------- */

function PolicyBlock({ icon, title, content, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <div className="pl-0 sm:pl-13 md:pl-13"> {/* Indent text slightly on larger screens if needed, but left-align is cleaner for legal text */}
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          {content}
        </p>
        {children}
      </div>
    </div>
  )
}