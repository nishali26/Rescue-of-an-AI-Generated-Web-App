'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setInvoices(data)
      }

      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] text-[#16140F] flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Loading secure workspace…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3EFE6] flex text-[#16140F] antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* 1. Imported Sidebar Component */}
      <Sidebar />

      {/* 2. Right Side Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="w-full bg-[#F3EFE6]/90 backdrop-blur-md border border-[#16140F]/15 rounded-[18px] p-4 shadow-[0_10px_30px_rgba(22,20,15,0.04)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#16140F] text-[#F3EFE6] font-mono font-bold text-sm flex items-center justify-center">
              IG
            </div>
            <div>
              <h2 className="font-[800] text-[#16140F] text-sm tracking-tight">Workspace Overview</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#2A23FF]">Live Connection</span>
            </div>
          </div>

          {/* Balance & Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-[#E9E3D4]/50 px-3.5 py-1.5 rounded-xl border border-[#16140F]/10">
              <span className="font-mono text-[10.5px] uppercase text-[#4A463C]">Balance:</span>
              <span className="font-mono text-xs font-bold text-[#16140F]">$1,250.00</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2.5 bg-[#E9E3D4]/50 hover:bg-[#E9E3D4] px-3 py-1.5 rounded-xl border border-[#16140F]/15 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#2A23FF]/10 text-[#2A23FF] font-mono font-bold text-xs flex items-center justify-center">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-[#16140F] truncate max-w-[120px] hidden sm:block">
                  {user?.email}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#F3EFE6] border border-[#16140F]/15 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#16140F]/10">
                    <p className="font-mono text-[10px] text-[#4A463C]">Signed in as</p>
                    <p className="text-xs font-semibold text-[#16140F] truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#FF4D2E] hover:bg-[#FF4D2E]/10 flex items-center justify-between">
                      <span>Sign Out</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Section Eyebrow & Greeting */}
        <div>
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-[34px] h-[1.5px] bg-[#2A23FF]" />
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
              01 · Overview
            </span>
          </div>
          <h1 className="text-[2.5rem] md:text-[3rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
            Your workflow, at a <span className="font-serif italic font-normal text-[#2A23FF]">glance</span>.
          </h1>
          <p className="text-[16px] text-[#4A463C] mt-2 leading-[1.55]">
            Manage invoices and monitor secure client transactions in real time.
          </p>
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold mb-2">Total Invoices</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-[3rem] font-[800] tracking-tight text-[#16140F]">{invoices.length}</span>
              <span className="font-serif italic text-[#2A23FF] text-xl">records</span>
            </div>
          </div>

          <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold mb-2">System Status</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1FAE5A] animate-pulse" />
              <span className="text-xl font-[800] tracking-tight text-[#16140F]">Active & Secure</span>
            </div>
          </div>

          <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold mb-2">Security Rule</p>
            <div className="mt-1">
              <span className="font-mono text-xs bg-[#2A23FF]/10 text-[#2A23FF] px-2.5 py-1 rounded-md border border-[#2A23FF]/25 font-semibold uppercase">
                RLS Protected
              </span>
            </div>
          </div>
        </div>

        {/* Invoices List Section */}
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-center mb-6 border-b border-[#16140F]/10 pb-4">
            <div>
              <h2 className="text-xl font-[800] tracking-tight text-[#16140F]">Invoice Records</h2>
              <p className="text-xs text-[#4A463C] mt-0.5">Synced live from your Supabase database.</p>
            </div>
            <span className="font-mono text-[11px] bg-[#E9E3D4] text-[#16140F] px-3 py-1 rounded-full border border-[#16140F]/10 font-medium uppercase">
              Live Feed
            </span>
          </div>

          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#E9E3D4]/50 text-[#4A463C] font-mono uppercase text-[11px] tracking-[0.06em]">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Client Name</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16140F]/10 font-medium">
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-[#E9E3D4]/30 transition-colors">
                      <td className="px-4 py-4 text-[#16140F]">{inv.client_name}</td>
                      <td className="px-4 py-4 font-mono text-[#16140F]">${inv.amount}</td>
                      <td className="px-4 py-4 font-mono text-[#4A463C] text-xs">{inv.due_date}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-mono text-[10.5px] uppercase tracking-wider font-semibold ${
                          inv.status === 'paid' 
                            ? 'bg-[#1FAE5A]/15 text-[#1FAE5A] border border-[#1FAE5A]/30' 
                            : 'bg-[#FF4D2E]/15 text-[#FF4D2E] border border-[#FF4D2E]/30'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-[#16140F]/20 rounded-[12px] bg-[#E9E3D4]/20">
              <p className="text-sm font-semibold text-[#16140F]">No invoice records found.</p>
              <p className="text-xs text-[#4A463C] mt-1">Your secure database is connected and ready for entries.</p>
            </div>
          )}
        </div>

      </main>

    </div>
  )
}