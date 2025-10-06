import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Vortex",
  description: "Stream the latest movies and TV shows with Vortex Cinema Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-outfit`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
