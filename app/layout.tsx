import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "War Stories — Історії з війни",
  description: "Платформа для написання, перегляду та зберігання історій та листів про війну",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-linear-bg text-linear-text">
        {children}
      </body>
    </html>
  )
}
