import {Inter ,  } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import "leaflet/dist/leaflet.css"

const inter = Inter({ subsets: ["latin"] })


export const metadata = {
  title: 'RapidCare - Emergency Ambulance Booking',
  description: 'Book an ambulance in seconds. Fast, reliable 24/7 emergency medical transport service.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}