'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface OverviewViewProps {
  invoices?: any[]
  user?: any
}

export default function OverviewView({ invoices: initialInvoices, user }: OverviewViewProps) {

  // ==========================================
  // FLAW 02 INTRODUCED: Hardcoded Secret Keys
  // ==========================================
  const HARDCODED_STRIPE_KEY = "EXPOSED_STRIPE_SECRET_KEY_FOR_AUDIT_DEMO_12345";
  const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.hardcoded_admin_bypass_token_999";
  // ==========================================


  // ==========================================
  // FLAW 03 INTRODUCED: BOLA / Insecure IDOR Lookup
  // ==========================================
  async function getInvoiceByIdVulnerable(invoiceId: string) {
    console.log("Searching for ID:", invoiceId.trim());
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId.trim())

    console.log("Query Response - Data:", data, "Error:", error);

    if (error) {
      console.error("Error fetching vulnerable invoice:", error)
      return null
    }
    return data?.[0] || null
  }
  // ==========================================



  // ==========================================
  // FLAW 04 INTRODUCED: Missing API Timeout & Error Handling
  // ==========================================
  const [syncingApi, setSyncingApi] = useState(false)

  const handleExternalApiSyncVulnerable = async () => {
    setSyncingApi(true)

    // VULNERABILITY: Ek aisi external API ko call kar rahe hain jo down hai ya exist nahi karti.
    // Yahan na toh koi 'try/catch' block hai aur na hi 'AbortController' (timeout).
    // Is wajah se agar API slow ya dead ho, toh poora component hang ho jata hai!
    const response = await fetch('https://api.nonexistent-billing-gateway-99.com/v1/sync-invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: 'InvoiceGuard', timestamp: Date.now() })
    })

    const data = await response.json()
    console.log("API Sync Result:", data)
    setSyncingApi(false)
  }
  // ==========================================



  const [invoices, setInvoices] = useState<any[]>(initialInvoices || [])
  const [loading, setLoading] = useState(!initialInvoices)

  // Creative Invoice Form State
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Test function for Flaw 03 (BOLA)
  const [testInvoiceId, setTestInvoiceId] = useState('')
  const [testResult, setTestResult] = useState<any>(null)

  const handleTestBOLA = async () => {
    if (!testInvoiceId) return
    const result = await getInvoiceByIdVulnerable(testInvoiceId)
    setTestResult(result)
    console.log("BOLA Test Result (Any User Invoice):", result)
  }

  const supabase = createClient()

  // ==========================================
  // FLAW 08 INTRODUCED: Unoptimized Repeated Query
  // ==========================================
  useEffect(() => {
    // VULNERABILITY: Yahan dependency array `[]` missing hai! 
    // Iska matlab hai ke component jab bhi re-render hoga, 
    // yeh heavy database query bar-baar dobara fire hoti rahegi.
    fetchOverviewData()
  }) // <-- Missing dependency array brackets [] creates repeated/infinite fetching loop!
  // ==========================================

  async function fetchOverviewData() {
    setLoading(true)
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && !error) {
      setInvoices(data)
    }
    setLoading(false)
  }

  // Real Calculations from DB Invoices
  const totalBalance = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  const totalIncome = invoices
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  const totalExpenses = 0.00 // Real expenses tracked via ledger if applicable

  // Handle Creative Invoice Submission (Real Database Insert)
  const handleCreateCreativeInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !invoiceAmount) return

    setSubmitting(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      setErrorMsg('User not authenticated. Please log in again.')
      setSubmitting(false)
      return
    }

    const payload = {
      user_id: authUser.id,
      client_name: customerName,
      client_email: customerEmail || 'client@enterprise.io',
      amount: parseFloat(invoiceAmount) || 0,
      status: 'pending',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Quick Creative Invoice Retainer'
    }

    const { data, error } = await supabase.from('invoices').insert([payload]).select()

    if (error) {
     // ==========================================
    // FLAW 05 INTRODUCED: Swallowing Error
    // ==========================================
    // Hum error ko sirf console mein print kar rahe hain, 
    // lekin user ko screen par koi error message (setErrorMsg) nahi dikha rahe!
    console.error("Database insert failed silently:", error.message)
    
    // setErrorMsg(error.message) <-- Yeh line humne hata di taake user ko pata na chale!
    setSubmitting(false)
    return
    // ========================================== 
    }

    if (data && data.length > 0) {
      setInvoices([data[0], ...invoices])
      setSuccessMsg(`Invoice successfully created and stored in Supabase for ${customerName}!`)
      setCustomerName('')
      setCustomerEmail('')
      setInvoiceAmount('')
      setTimeout(() => setSuccessMsg(null), 5000)
    }

    setSubmitting(false)
  }

  const userDisplayName = user?.email ? user.email.split('@')[0] : 'Nisha'

  if (loading) {
    return (
      <div className="py-24 text-[#16140F] flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Loading live Supabase workspace overview…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* Top Greeting & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#16140F]/10">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <div className="w-[24px] h-[1.5px] bg-[#2A23FF]" />
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
              01 · Executive Overview (Live DB)
            </span>
          </div>
          <h1 className="text-[2.2rem] font-[800] tracking-tight text-[#16140F] capitalize">
            Hello, <span className="font-serif italic font-normal text-[#2A23FF]">{userDisplayName}</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search live workflow…"
              className="bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2 text-xs font-mono text-[#16140F] placeholder-[#4A463C]/60 focus:outline-none focus:border-[#2A23FF] w-60"
            />
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E9E3D4]/60 border border-[#16140F]/15 flex items-center justify-center text-[#16140F] cursor-pointer hover:bg-[#E9E3D4]">
            🔔
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Metrics + Creative Invoice Form) & Right Column (Black Card + Transaction History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#D9E2EC] border border-[#16140F]/15 p-5 rounded-[22px] shadow-sm space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] border border-[#16140F]/10 flex items-center justify-center text-sm">
                💳
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#4A463C] font-semibold">Settled Balance</p>
                <p className="font-mono text-[10px] text-[#4A463C]">Real DB Records</p>
              </div>
              <p className="text-2xl font-[800] text-[#16140F] font-mono">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-[#E2E8F0] border border-[#16140F]/15 p-5 rounded-[22px] shadow-sm space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] border border-[#16140F]/10 flex items-center justify-center text-sm">
                📈
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#4A463C] font-semibold">Total Billed</p>
                <p className="font-mono text-[10px] text-[#4A463C]">Real DB Records</p>
              </div>
              <p className="text-2xl font-[800] text-[#16140F] font-mono">
                ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-[#FCE7F3] border border-[#16140F]/15 p-5 rounded-[22px] shadow-sm space-y-4">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] border border-[#16140F]/10 flex items-center justify-center text-sm">
                📉
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#4A463C] font-semibold">Total Records</p>
                <p className="font-mono text-[10px] text-[#4A463C]">Supabase Table</p>
              </div>
              <p className="text-2xl font-[800] text-[#16140F] font-mono">
                {invoices.length} Invoices
              </p>
            </div>
          </div>

          {/* Creative Invoice Generator Form (Direct DB Insert) */}
          <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[22px] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-[800] text-[#16140F]">Creative invoice</h2>
                <p className="text-xs text-[#4A463C]">Saves directly into Supabase PostgreSQL database.</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#16140F] text-[#F3EFE6] flex items-center justify-center font-bold text-lg">
                +
              </div>
            </div>

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-[#1FAE5A]/15 border border-[#1FAE5A]/30 text-xs font-mono text-[#1FAE5A] font-semibold">
                ✓ {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#FF4D2E]/10 border border-[#FF4D2E]/30 text-xs font-mono text-[#FF4D2E]">
                Error: {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCreativeInvoice} className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="block font-mono text-[11px] uppercase text-[#4A463C] font-semibold">Customer name</label>
                <div className="flex items-center justify-between border-b border-[#16140F]/15 pb-2">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full bg-transparent text-sm text-[#16140F] placeholder-[#4A463C]/50 focus:outline-none"
                  />
                  <span className="text-sm text-[#4A463C]">👤</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[11px] uppercase text-[#4A463C] font-semibold">Customer email</label>
                <div className="flex items-center justify-between border-b border-[#16140F]/15 pb-2">
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter customer email"
                    className="w-full bg-transparent text-sm text-[#16140F] placeholder-[#4A463C]/50 focus:outline-none"
                  />
                  <span className="text-sm text-[#4A463C]">✉️</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[11px] uppercase text-[#4A463C] font-semibold">Invoice Amount ($)</label>
                <div className="flex items-center justify-between border-b border-[#16140F]/15 pb-2">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    placeholder="1500.00"
                    className="w-full bg-transparent text-sm font-mono text-[#16140F] placeholder-[#4A463C]/50 focus:outline-none"
                  />
                  <span className="text-sm text-[#4A463C]">💵</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"

                /* ==========================================
                  FLAW 06 INTRODUCED: Missing Submit Lock     
                  ========================================== */

                 // disabled={submitting}
                  className="w-full bg-[#16140F] hover:bg-[#2A23FF] text-[#F3EFE6] font-mono text-xs uppercase tracking-wider font-semibold py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Storing in Database…' : 'Commit Invoice to Database →'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): Black Credit Card & Real Database Ledger */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="flex justify-between items-center">
            <h3 className="font-[800] text-base text-[#16140F]">My cards</h3>
            <button type="button" className="w-9 h-9 rounded-full bg-[#F3EFE6] border border-[#16140F]/15 flex items-center justify-center font-bold text-lg hover:bg-[#E9E3D4] cursor-pointer">
              +
            </button>
          </div>

          <div className="bg-[#16140F] text-[#F3EFE6] p-7 rounded-[24px] shadow-2xl relative overflow-hidden space-y-12 border border-[#F3EFE6]/10">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#2A23FF]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold tracking-widest text-[#F3EFE6] uppercase">{userDisplayName} Doe</span>
              <div className="flex space-x-1">
                <div className="w-4 h-4 rounded-full bg-red-500 opacity-80" />
                <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-80 -ml-2" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#F3EFE6]/50">Live Balance</span>
              <p className="text-3xl font-[800] font-mono tracking-tight text-[#F3EFE6]">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex justify-between items-end font-mono text-xs text-[#F3EFE6]/80 pt-2">
              <span>3459 •••• •••• 4356</span>
              <span>12/20-124</span>
            </div>
          </div>

          {/* ================= FLAW 03 TEST UI ================= */}
  <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-sm font-mono font-bold text-red-800 mb-2">🚨 Flaw 03 Test (BOLA / IDOR Bypass)</h3>
    <div className="flex gap-2">
      <input 
        type="text" 
        placeholder="Enter any Invoice ID (e.g., 1, 2, 5...)" 
        value={testInvoiceId}
        onChange={(e) => setTestInvoiceId(e.target.value)}
        className="px-3 py-1 text-sm border rounded bg-white"
      />
      <button 
        onClick={handleTestBOLA}
        className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-mono"
      >
        Fetch Without Owner Check
      </button>
    </div>
    {testResult && (
      <pre className="mt-2 p-2 bg-black text-green-400 text-xs rounded overflow-x-auto">
        {JSON.stringify(testResult, null, 2)}
      </pre>
    )}
  </div>
  {/* =================================================== */}


  {/* ================= FLAW 04 TEST UI ================= */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="text-sm font-mono font-bold text-amber-800 mb-2">⚠️ Flaw 04 Test (Missing API Timeout & Error Handling)</h3>
        <p className="text-xs text-gray-600 mb-3">
          Yeh button external payment/billing provider ko sync karta hai bina kisi error handling ya timeout ke.
        </p>
        <button 
          onClick={handleExternalApiSyncVulnerable}
          disabled={syncingApi}
          className="px-4 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 font-mono transition-colors"
        >
          {syncingApi ? 'Syncing with Dead Gateway (Hanging)...' : 'Sync External Billing API'}
        </button>
      </div>
      {/* =================================================== */}

          {/* Live Supabase Invoices List */}
          <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[22px] p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-[#16140F]/10 pb-3">
              <h3 className="font-[800] text-sm text-[#16140F]">Live database records</h3>
              <span className="font-mono text-[11px] text-[#2A23FF] font-semibold">
                Total: {invoices.length}
              </span>
            </div>

            <div className="space-y-4">
              {invoices.length > 0 ? (
                invoices.slice(0, 4).map((inv, i) => (
                  <div key={inv.id || i} className={`flex items-center justify-between ${i > 0 ? 'pt-3 border-t border-[#16140F]/10' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E9E3D4] flex items-center justify-center font-bold text-xs text-[#16140F]">
                        {inv.client_name ? inv.client_name.charAt(0).toUpperCase() : '💼'}
                      </div>
                      <div className="truncate max-w-[150px]">
                        <p className="text-xs font-semibold text-[#16140F] truncate">{inv.client_name}</p>
                        <p className="font-mono text-[10px] text-[#4A463C] uppercase">{inv.status}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#16140F]">
                      ${Number(inv.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 font-mono text-xs text-[#4A463C]">
                  No records in database yet. Create an invoice using the form on the left!
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}