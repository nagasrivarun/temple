import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_Telugu } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const teluguFont = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Temple Construction Fund | Sacred Space for All",
  description:
    "Join us in building a spiritual sanctuary for meditation, prayer, and community. Support our temple construction with your donation.",
   icons: {
    icon: [
      {
        url: "/k.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/k.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/k.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="te">
      <body
        className={`${teluguFont.className} antialiased overflow-x-hidden`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
