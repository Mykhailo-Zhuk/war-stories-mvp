import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "War Stories — Історії з війни",
  description: "Платформа для написання, перегляду та зберігання історій та листів про війну",
  keywords: "війна, історії, листи, Україна, спогади, ветеран",
  authors: [{ name: "Mykhailo Zhuk" }],
  creator: "Mykhailo Zhuk",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#111",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
