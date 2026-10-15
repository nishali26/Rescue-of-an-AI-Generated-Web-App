import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InvoiceGuard - Enterprise SaaS Dashboard',
  description: 'Professional invoice and payment tracking built with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F3EFE6] text-[#16140F] antialiased min-h-screen selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
        {children}
      </body>
    </html>
  )
}