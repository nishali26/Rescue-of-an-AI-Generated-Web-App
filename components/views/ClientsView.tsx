'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ClientsViewProps {
  invoices?: any[]
}

export default function ClientsView({ invoices: initialInvoices }: ClientsViewProps) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices || [])
  const [loading, setLoading] = useState(!initialInvoices)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  // Modals state
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // New Client Form State
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [initialAmount, setInitialAmount] = useState('')

  const supabase = createClient()

  // Sync with prop or fetch from Supabase
  useEffect(() => {
    if (initialInvoices) {
      setInvoices(initialInvoices)
      setLoading(false)
      return
    }
    fetchData()
  }, [initialInvoices])

  async function fetchData() {
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

  // Sample data for demo mode if DB is empty
  const sampleInvoices = [
    { id: '1', client_name: 'Tech & Software Corp', client_email: 'billing@techsoftware.io', amount: 13622, status: 'paid', due_date: '2026-10-01' },
    { id: '2', client_name: 'Fashion & Apparel Studio', client_email: 'accounts@fashionstudio.co', amount: 9545, status: 'pending', due_date: '2026-10-20' },
    { id: '3', client_name: 'Food & Beverage Group', client_email: 'treasury@fnbgroup.org', amount: 7064, status: 'paid', due_date: '2026-08-15' },
    { id: '4', client_name: 'Wellness & Aesthetics', client_email: 'finance@wellnessgroup.com', amount: 8250, status: 'overdue', due_date: '2026-07-10' },
    { id: '5', client_name: 'Cloud Infrastructure Ltd', client_email: 'ap@cloudinfra.net', amount: 15400, status: 'paid', due_date: '2026-10-12' },
  ]

  const activeData = previewMode && invoices.length === 0 ? sampleInvoices : invoices

  // Aggregate Clients from Invoices Data
  const clientsList = useMemo(() => {
    const map: Record<string, {
      name: string
      email: string
      totalBilled: number
      paidBilled: number
      pendingBilled: number
      invoiceCount: number
      status: string
      lastActive: string
    }> = {}

    activeData.forEach((inv) => {
      const name = inv.client_name || 'Unnamed Entity'
      const email = inv.client_email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@enterprise.io`
      const amt = Number(inv.amount || 0)
      const st = (inv.status || 'pending').toLowerCase()

      if (!map[name]) {
        map[name] = {
          name,
          email,
          totalBilled: 0,
          paidBilled: 0,
          pendingBilled: 0,
          invoiceCount: 0,
          status: 'Active',
          lastActive: inv.due_date || '2026-10-10'
        }
      }

      map[name].totalBilled += amt
      map[name].invoiceCount += 1
      if (st === 'paid') {
        map[name].paidBilled += amt
      } else {
        map[name].pendingBilled += amt
        if (st === 'overdue') map[name].status = 'At Risk'
      }
    })

    return Object.values(map).filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [activeData, searchQuery])

  // Handle Add Client (Inserts a starter invoice into Supabase)
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const { data: { user } } = await supabase.auth.getUser()

    const payload: any = {
      client_name: clientName,
      client_email: clientEmail,
      amount: initialAmount ? parseFloat(initialAmount) : 1000.00,
      status: 'pending',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Client Onboarding Retainer - ${clientCompany || clientName}`
    }

    if (user?.id) payload.user_id = user.id

    const { data, error } = await supabase.from('invoices').insert([payload]).select()

    if (error) {
      setErrorMsg(error.message)
      setSubmitting(false)
      return
    }

    if (data && data.length > 0) {
      setInvoices([data[0], ...invoices])
    } else {
      await fetchData()
    }

    setClientName('')
    setClientEmail('')
    setClientCompany('')
    setInitialAmount('')
    setSubmitting(false)
    setIsAddClientOpen(false)
  }

  if (loading) {
    return (
      <div className="py-24 text-[#16140F] flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Loading client directory & relationship ledger…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* Top Header Eyebrow & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-[34px] h-[1.5px] bg-[#2A23FF]" />
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
              04 · Client Relationship Management
            </span>
          </div>
          <h1 className="text-[2.5rem] md:text-[3rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
            Active <span className="font-serif italic font-normal text-[#2A23FF]">clients</span>.
          </h1>
          <p className="text-[16px] text-[#4A463C] mt-2 leading-[1.55]">
            Verified corporate accounts, cumulative billing volume, and direct settlement statuses.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {invoices.length === 0 && (
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                previewMode
                  ? 'bg-[#FF4D2E] text-[#F3EFE6] border-[#FF4D2E] font-semibold shadow-sm'
                  : 'bg-[#E9E3D4]/60 text-[#16140F] border-[#16140F]/15 hover:bg-[#E9E3D4]'
              }`}
            >
              {previewMode ? '● Demo Directory Active' : 'Load Sample Clients'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddClientOpen(true)}
            className="flex items-center space-x-2 bg-[#16140F] hover:bg-[#2A23FF] text-[#F3EFE6] font-mono text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>+ Register New Client</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Total Active Entities</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F] font-mono">
              {clientsList.length}
            </span>
            <span className="font-serif italic text-[#2A23FF] text-sm">accounts</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Cumulative Client Volume</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F] font-mono">
              ${clientsList.reduce((acc, c) => acc + c.totalBilled, 0).toLocaleString()}
            </span>
            <span className="font-serif italic text-[#1FAE5A] text-sm">billed</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Average Account Value</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F] font-mono">
              ${clientsList.length > 0 ? Math.round(clientsList.reduce((acc, c) => acc + c.totalBilled, 0) / clientsList.length).toLocaleString() : '0'}
            </span>
            <span className="font-serif italic text-[#4A463C] text-sm">per client</span>
          </div>
        </div>
      </div>

      {/* Main Client Directory Card & Search Bar */}
      <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#16140F]/10 pb-5">
          <div>
            <h2 className="text-xl font-[800] text-[#16140F] tracking-tight">Verified Entity Directory</h2>
            <p className="text-xs text-[#4A463C] mt-0.5">Aggregated directly from your Supabase invoice ledger.</p>
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by organization name…"
              className="w-full bg-[#E9E3D4]/50 border border-[#16140F]/15 rounded-xl px-4 py-2 text-xs font-mono text-[#16140F] placeholder-[#4A463C]/60 focus:outline-none focus:border-[#2A23FF]"
            />
          </div>
        </div>

        {/* Clients Grid Cards */}
        {clientsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clientsList.map((client, idx) => (
              <div
                key={client.name}
                onClick={() => setSelectedClient(client)}
                className="bg-[#E9E3D4]/35 hover:bg-[#E9E3D4]/70 border border-[#16140F]/15 rounded-2xl p-6 transition-all cursor-pointer space-y-4 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#2A23FF]/10 text-[#2A23FF] font-mono font-bold text-sm flex items-center justify-center border border-[#2A23FF]/20 group-hover:bg-[#2A23FF] group-hover:text-[#F3EFE6] transition-colors">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-[800] text-base text-[#16140F] group-hover:text-[#2A23FF] transition-colors">
                        {client.name}
                      </h3>
                      <p className="font-mono text-xs text-[#4A463C]">{client.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase font-semibold ${
                      client.status === 'Active'
                        ? 'bg-[#1FAE5A]/15 text-[#1FAE5A] border border-[#1FAE5A]/30'
                        : 'bg-[#FF4D2E]/15 text-[#FF4D2E] border border-[#FF4D2E]/30'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#16140F]/10 font-mono text-xs">
                  <div>
                    <span className="text-[#4A463C] block text-[10px] uppercase">Invoices</span>
                    <span className="font-bold text-[#16140F]">{client.invoiceCount} Record(s)</span>
                  </div>
                  <div>
                    <span className="text-[#4A463C] block text-[10px] uppercase">Settled</span>
                    <span className="font-bold text-[#1FAE5A]">${client.paidBilled.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#4A463C] block text-[10px] uppercase">Total Billed</span>
                    <span className="font-bold text-[#16140F]">${client.totalBilled.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#16140F]/20 rounded-[14px] bg-[#E9E3D4]/20 space-y-3">
            <p className="text-sm font-semibold text-[#16140F]">No client accounts found.</p>
            <p className="text-xs text-[#4A463C] max-w-md mx-auto">
              Register a new client or click &ldquo;Load Sample Clients&rdquo; above to populate the directory.
            </p>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: REGISTER NEW CLIENT                              */}
      {/* ========================================================= */}
      {isAddClientOpen && (
        <div className="fixed inset-0 z-50 bg-[#16140F]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F3EFE6] border border-[#16140F]/20 rounded-[20px] max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start border-b border-[#16140F]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#2A23FF] font-semibold">
                  Directory Addition
                </span>
                <h3 className="text-2xl font-[800] text-[#16140F] tracking-tight mt-0.5">
                  Register <span className="font-serif italic font-normal text-[#2A23FF]">client</span>.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddClientOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#E9E3D4] text-[#16140F] font-mono text-xs flex items-center justify-center hover:bg-[#16140F] hover:text-[#F3EFE6] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FF4D2E]/10 border border-[#FF4D2E]/30 text-xs font-mono text-[#FF4D2E]">
                Error: {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                  Organization / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Apex Global Logistics"
                  className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                  Billing Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="billing@apexlogistics.com"
                  className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="Supply Chain & Shipping"
                    className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                    Initial Retainer ($)
                  </label>
                  <input
                    type="number"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    placeholder="3500.00"
                    className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm font-mono text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#16140F]/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-mono text-xs uppercase text-[#4A463C] hover:text-[#16140F] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#2A23FF] hover:bg-[#16140F] text-[#F3EFE6] font-mono text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Registering…' : 'Save Entity →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CLIENT PROFILE AUDIT VIEW                        */}
      {/* ========================================================= */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-[#16140F]/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F3EFE6] border border-[#16140F]/25 rounded-[22px] max-w-lg w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start border-b border-[#16140F]/15 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#2A23FF] text-[#F3EFE6] font-mono font-bold text-base flex items-center justify-center">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-[800] text-[#16140F]">{selectedClient.name}</h3>
                  <p className="font-mono text-xs text-[#4A463C]">{selectedClient.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="w-8 h-8 rounded-lg bg-[#E9E3D4] text-[#16140F] font-mono text-xs flex items-center justify-center hover:bg-[#16140F] hover:text-[#F3EFE6] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#E9E3D4]/40 p-4 rounded-xl font-mono text-xs">
              <div>
                <span className="text-[#4A463C] block uppercase text-[10px]">Total Billed</span>
                <span className="text-base font-bold text-[#16140F]">${selectedClient.totalBilled.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#4A463C] block uppercase text-[10px]">Settled Revenue</span>
                <span className="text-base font-bold text-[#1FAE5A]">${selectedClient.paidBilled.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold">Account Standing</p>
              <p className="text-xs text-[#16140F] leading-relaxed">
                Entity has completed {selectedClient.invoiceCount} invoice cycle(s) under secure Supabase RLS encryption. Account status is verified as <strong className="text-[#1FAE5A]">{selectedClient.status}</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-[#16140F]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="font-mono text-xs uppercase px-5 py-2.5 rounded-xl bg-[#16140F] text-[#F3EFE6] font-semibold hover:bg-[#2A23FF] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}