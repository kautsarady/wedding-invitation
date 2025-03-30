import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Wedding Invitation - Muhammad Kautsar & Alifah Awina",
  description: "Join us in celebrating our special day",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Wedding Invitation - Muhammad Kautsar & Alifah Awina",
    description: "Join us in celebrating our special day on April 12, 2025",
    images: [
      {
        url: "/og-image.jpg", // This would need to be created and placed in the public folder
        width: 1200,
        height: 630,
        alt: "Muhammad Kautsar & Alifah Awina Wedding Invitation",
      },
    ],
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Parisienne:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Kiwi+Maru&family=Rubik&display=swap"
          rel="stylesheet"
        />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'