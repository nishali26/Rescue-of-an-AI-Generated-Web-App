import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InvoiceGuard - Secure SaaS Dashboard',
  description: 'Professional invoice and payment tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F3EFE6] text-[#16140F] antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}