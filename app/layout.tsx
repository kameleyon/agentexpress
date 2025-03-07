import type React from "react"
import type { Metadata } from "next"
import { League_Spartan, Nunito_Sans, Inter } from "next/font/google"
import "./globals.css"

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
  weight: ["300", "400", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AgentExpress - Zero Code AI Agents",
  description: "Plug-and-play AI agents for everyone. No coding required.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${leagueSpartan.variable} ${nunitoSans.variable} ${inter.variable} font-sans`}>{children}</body>
    </html>
  )
}



import './globals.css'