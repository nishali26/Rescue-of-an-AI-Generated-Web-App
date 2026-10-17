'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import OverviewView from '@/components/views/OverviewView'
import AnalyticsView from '@/components/views/AnalyticsView'
import InvoicesView from '@/components/views/InvoicesView'
import ClientsView from '@/components/views/ClientsView'
import TransactionsView from '@/components/views/TransactionsView'
import SecurityView from '@/components/views/SecurityView'
import SettingsView from '@/components/views/SettingsView'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fixed: Added 'security' to activeTab type definition
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'invoices' | 'clients' | 'transactions' | 'security' | 'settings'>('overview')
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
        <p className="animate-pulse">Loading secure workspace OS…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3EFE6] flex text-[#16140F] antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* 1. Permanent Static Sidebar with Tab Handler */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Right Side Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Top Header Navbar */}
        <header className="w-full bg-[#F3EFE6]/90 backdrop-blur-md border border-[#16140F]/15 rounded-[18px] p-4 shadow-[0_10px_30px_rgba(22,20,15,0.04)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#16140F] text-[#F3EFE6] font-mono font-bold text-sm flex items-center justify-center">
              IG
            </div>
            <div>
              <h2 className="font-[800] text-[#16140F] text-sm tracking-tight">Enterprise Workspace</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#2A23FF]">Active View: {activeTab}</span>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2.5 bg-[#E9E3D4]/50 hover:bg-[#E9E3D4] px-3 py-1.5 rounded-xl border border-[#16140F]/15 transition-all cursor-pointer"
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
                    <button type="button" onClick={handleSignOut} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#FF4D2E] hover:bg-[#FF4D2E]/10 flex items-center justify-between cursor-pointer">
                      <span>Sign Out</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- DYNAMIC VIEW RENDERING BASED ON ACTIVE TAB --- */}

        {activeTab === 'overview' && <OverviewView invoices={invoices} user={user} />}
        {activeTab === 'analytics' && <AnalyticsView invoices={invoices} />}
        {activeTab === 'invoices' && <InvoicesView invoices={invoices} />}
        {activeTab === 'clients' && <ClientsView invoices={invoices} />}
        {activeTab === 'transactions' && <TransactionsView invoices={invoices} />}
        {activeTab === 'security' && <SecurityView />}
        {activeTab === 'settings' && <SettingsView />}

      </main>

    </div>
  )
}