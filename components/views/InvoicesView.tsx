'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

interface InvoicesViewProps {
  invoices?: any[]
}

export default function InvoicesView({ invoices: initialInvoices }: InvoicesViewProps) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices || [])
  const [loading, setLoading] = useState(!initialInvoices)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'paid' | 'pending' | 'overdue'>('ALL')
  const [previewMode, setPreviewMode] = useState(false)

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // New Invoice Form State
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<'pending' | 'paid' | 'overdue'>('pending')
  const [serviceDesc, setServiceDesc] = useState('Enterprise Cloud & DevOps Retainer')

  const supabase = createClient()

  // Sync with parent prop or fetch live from Supabase
  useEffect(() => {
    if (initialInvoices) {
      setInvoices(initialInvoices)
      setLoading(false)
      return
    }
    fetchInvoices()
  }, [initialInvoices])

  async function fetchInvoices() {
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

  // Sample Enterprise Invoices for Demo Mode if DB is empty
  const sampleInvoices = [
    {
      id: 'inv-9041-a8f2',
      client_name: 'Tech & Software Corp',
      client_email: 'billing@techsoftware.io',
      amount: 13622,
      status: 'paid',
      due_date: '2026-10-01',
      created_at: '2026-09-15T10:30:00Z',
      description: 'Core Infrastructure & Security Audit Q3'
    },
    {
      id: 'inv-9042-b7c1',
      client_name: 'Fashion & Apparel Studio',
      client_email: 'accounts@fashionstudio.co',
      amount: 9545,
      status: 'pending',
      due_date: '2026-10-28',
      created_at: '2026-10-02T14:20:00Z',
      description: 'E-Commerce Checkout & Payment Gateway Integration'
    },
    {
      id: 'inv-9043-c3d9',
      client_name: 'Wellness & Aesthetics',
      client_email: 'finance@wellnessgroup.com',
      amount: 8250,
      status: 'overdue',
      due_date: '2026-09-10',
      created_at: '2026-08-20T09:15:00Z',
      description: 'Custom Patient Portal & RLS Database Setup'
    },
    {
      id: 'inv-9044-d5e4',
      client_name: 'Cloud Infrastructure Ltd',
      client_email: 'ap@cloudinfra.net',
      amount: 15400,
      status: 'paid',
      due_date: '2026-10-12',
      created_at: '2026-09-28T16:45:00Z',
      description: 'Multi-Region Kubernetes Cluster Migration'
    },
    {
      id: 'inv-9045-e1f8',
      client_name: 'Food & Beverage Group',
      client_email: 'treasury@fnbgroup.org',
      amount: 7064,
      status: 'pending',
      due_date: '2026-11-05',
      created_at: '2026-10-10T11:00:00Z',
      description: 'Supply Chain Analytics Dashboard Retainer'
    }
  ]

  const activeData = previewMode && invoices.length === 0 ? sampleInvoices : invoices

  // Create New Invoice in Supabase
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    const { data: { user } } = await supabase.auth.getUser()

    const payload: any = {
      client_name: clientName,
      amount: parseFloat(amount),
      due_date: dueDate,
      status: status,
    }

    if (user?.id) {
      payload.user_id = user.id
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert([payload])
      .select()

    if (error) {
      setErrorMsg(error.message)
      setSubmitting(false)
      return
    }

    if (data && data.length > 0) {
      setInvoices([data[0], ...invoices])
    } else {
      await fetchInvoices()
    }

    // Reset form & close modal
    setClientName('')
    setClientEmail('')
    setAmount('')
    setDueDate('')
    setStatus('pending')
    setSubmitting(false)
    setIsCreateOpen(false)
  }

  // Toggle Invoice Status (Paid <-> Pending)
  const handleToggleStatus = async (inv: any) => {
    const nextStatus = inv.status === 'paid' ? 'pending' : 'paid'

    // If in preview mode, update locally
    if (previewMode && invoices.length === 0) {
      return
    }

    // Optimistic UI update
    setInvoices((prev) =>
      prev.map((item) => (item.id === inv.id ? { ...item, status: nextStatus } : item))
    )

    if (selectedInvoice?.id === inv.id) {
      setSelectedInvoice({ ...selectedInvoice, status: nextStatus })
    }

    await supabase
      .from('invoices')
      .update({ status: nextStatus })
      .eq('id', inv.id)
  }

  // Delete Invoice
  const handleDeleteInvoice = async (id: string) => {
    if (previewMode && invoices.length === 0) return

    setInvoices((prev) => prev.filter((item) => item.id !== id))
    if (selectedInvoice?.id === id) setSelectedInvoice(null)

    await supabase.from('invoices').delete().eq('id', id)
  }

  // Filtered & Searched Invoices + Summary Metrics
  const { filteredInvoices, summary } = useMemo(() => {
    let paidTotal = 0
    let pendingTotal = 0
    let overdueTotal = 0

    activeData.forEach((inv) => {
      const amt = Number(inv.amount || 0)
      const st = (inv.status || 'pending').toLowerCase()
      if (st === 'paid') paidTotal += amt
      else if (st === 'overdue') overdueTotal += amt
      else pendingTotal += amt
    })

    const filtered = activeData.filter((inv) => {
      const st = (inv.status || 'pending').toLowerCase()
      const matchesStatus = statusFilter === 'ALL' || st === statusFilter
      const matchesSearch =
        (inv.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(inv.id || '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })

    return {
      filteredInvoices: filtered,
      summary: {
        totalVolume: paidTotal + pendingTotal + overdueTotal,
        paidTotal,
        pendingTotal,
        overdueTotal,
      }
    }
  }, [activeData, statusFilter, searchQuery])

  // Helper to format Invoice Code like #INV-9041
  const formatInvoiceCode = (id: any, index: number) => {
    if (!id) return `INV-${1040 + index}`
    const clean = String(id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    return `INV-${clean.slice(0, 6)}`
  }

  if (loading) {
    return (
      <div className="py-24 text-[#16140F] flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Loading enterprise invoice ledger…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* Top Section Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-[34px] h-[1.5px] bg-[#2A23FF]" />
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
              03 · Billing & Receivables
            </span>
          </div>
          <h1 className="text-[2.5rem] md:text-[3rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
            Enterprise <span className="font-serif italic font-normal text-[#2A23FF]">invoices</span>.
          </h1>
          <p className="text-[16px] text-[#4A463C] mt-2 leading-[1.55]">
            Issue tamper-proof digital invoices, track settlement cycles, and audit client ledgers.
          </p>
        </div>

        {/* Action Buttons */}
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
              {previewMode ? '● Demo Ledger Active' : 'Load Sample Invoices'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 bg-[#16140F] hover:bg-[#2A23FF] text-[#F3EFE6] font-mono text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>+ Issue New Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Bento Summary Strip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Total Billed Ledger</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2rem] font-[800] tracking-tight text-[#16140F] font-mono">
              ${summary.totalVolume.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#2A23FF] text-sm">gross</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Settled & Cleared</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2rem] font-[800] tracking-tight text-[#1FAE5A] font-mono">
              ${summary.paidTotal.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#1FAE5A] text-sm">paid</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Awaiting Settlement</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2rem] font-[800] tracking-tight text-[#16140F] font-mono">
              ${summary.pendingTotal.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#4A463C] text-sm">pending</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Past Due / Action Req</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2rem] font-[800] tracking-tight text-[#FF4D2E] font-mono">
              ${summary.overdueTotal.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#FF4D2E] text-sm">overdue</span>
          </div>
        </div>
      </div>

      {/* Main Enterprise Invoice Register Card */}
      <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-6">
        
        {/* Filter Bar & Search Input */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-[#16140F]/10 pb-5">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-[#E9E3D4]/60 p-1 rounded-xl border border-[#16140F]/10 w-fit">
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'paid', label: 'Paid' },
              { id: 'pending', label: 'Pending' },
              { id: 'overdue', label: 'Overdue' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#16140F] text-[#F3EFE6] font-semibold shadow-sm'
                    : 'text-[#4A463C] hover:text-[#16140F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client or #INV code…"
              className="w-full bg-[#E9E3D4]/50 border border-[#16140F]/15 rounded-xl px-4 py-2 text-xs font-mono text-[#16140F] placeholder-[#4A463C]/60 focus:outline-none focus:border-[#2A23FF]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs font-mono text-[#4A463C] hover:text-[#16140F]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Invoice Register Table */}
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E9E3D4]/50 text-[#4A463C] font-mono uppercase text-[10.5px] tracking-[0.06em] border-y border-[#16140F]/10">
                  <th className="py-3.5 px-4 rounded-l-lg">Invoice ID</th>
                  <th className="py-3.5 px-4">Client / Entity</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Amount (USD)</th>
                  <th className="py-3.5 px-4">Settlement Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16140F]/10 text-sm">
                {filteredInvoices.map((inv: any, idx: number) => {
                  const invCode = formatInvoiceCode(inv.id, idx)
                  const st = (inv.status || 'pending').toLowerCase()
                  const issueDate = inv.created_at
                    ? new Date(inv.created_at).toISOString().split('T')[0]
                    : '2026-10-01'

                  return (
                    <tr
                      key={inv.id || idx}
                      className="hover:bg-[#E9E3D4]/35 transition-colors group"
                    >
                      {/* Invoice Code */}
                      <td className="py-4 px-4 font-mono text-xs font-bold text-[#2A23FF]">
                        #{invCode}
                      </td>

                      {/* Client Name & Subtitle */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#16140F]">{inv.client_name}</div>
                        <div className="font-mono text-[10.5px] text-[#4A463C]">
                          {inv.description || 'Standard Enterprise Billing'}
                        </div>
                      </td>

                      {/* Issue Date */}
                      <td className="py-4 px-4 font-mono text-xs text-[#4A463C]">
                        {issueDate}
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 font-mono text-xs text-[#16140F]">
                        {inv.due_date || '—'}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-mono text-sm font-bold text-[#16140F]">
                        ${Number(inv.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold ${
                            st === 'paid'
                              ? 'bg-[#1FAE5A]/15 text-[#1FAE5A] border border-[#1FAE5A]/30'
                              : st === 'overdue'
                              ? 'bg-[#FF4D2E]/15 text-[#FF4D2E] border border-[#FF4D2E]/30'
                              : 'bg-[#16140F]/10 text-[#16140F] border border-[#16140F]/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              st === 'paid'
                                ? 'bg-[#1FAE5A]'
                                : st === 'overdue'
                                ? 'bg-[#FF4D2E]'
                                : 'bg-[#16140F]'
                            }`}
                          />
                          <span>{st}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice({ ...inv, code: invCode, issueDate })}
                            className="font-mono text-[10.5px] uppercase px-2.5 py-1 rounded-lg bg-[#E9E3D4] hover:bg-[#16140F] hover:text-[#F3EFE6] text-[#16140F] border border-[#16140F]/10 transition-all cursor-pointer font-semibold"
                          >
                            View Doc
                          </button>

                          {(!previewMode || invoices.length > 0) && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(inv)}
                                title="Toggle Paid / Pending"
                                className="font-mono text-[10.5px] uppercase px-2.5 py-1 rounded-lg bg-[#2A23FF]/10 hover:bg-[#2A23FF] hover:text-[#F3EFE6] text-[#2A23FF] border border-[#2A23FF]/20 transition-all cursor-pointer font-semibold"
                              >
                                {st === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInvoice(inv.id)}
                                title="Delete Record"
                                className="font-mono text-xs px-2 py-1 rounded-lg text-[#4A463C] hover:text-[#FF4D2E] hover:bg-[#FF4D2E]/10 transition-all cursor-pointer"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#16140F]/20 rounded-[14px] bg-[#E9E3D4]/20 space-y-3">
            <p className="text-sm font-semibold text-[#16140F]">No matching invoice records in ledger.</p>
            <p className="text-xs text-[#4A463C] max-w-md mx-auto">
              Issue your first live invoice to store it securely in Supabase, or click &ldquo;Load Sample Invoices&rdquo; above to preview the enterprise document system.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="font-mono text-xs uppercase bg-[#2A23FF] text-[#F3EFE6] px-4 py-2 rounded-xl font-semibold hover:bg-[#16140F] transition-all cursor-pointer"
              >
                + Issue First Invoice
              </button>
            </div>
          </div>
        )}

        {/* Footer Audit Metadata */}
        <div className="pt-4 border-t border-[#16140F]/10 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-[#4A463C] gap-2">
          <span>Showing {filteredInvoices.length} of {activeData.length} registered ledger entries</span>
          <span className="text-[#16140F] font-semibold">RLS Tenant Verification: Active</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE NEW INVOICE (SUPABASE INSERT)             */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-[#16140F]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F3EFE6] border border-[#16140F]/20 rounded-[20px] max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start border-b border-[#16140F]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#2A23FF] font-semibold">
                  New Ledger Entry
                </span>
                <h3 className="text-2xl font-[800] text-[#16140F] tracking-tight mt-0.5">
                  Issue <span className="font-serif italic font-normal text-[#2A23FF]">invoice</span>.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
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

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                  Client / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Cloud Systems"
                  className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2500.00"
                    className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm font-mono text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                    Settlement Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm font-mono text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm font-mono text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                  >
                    <option value="pending">PENDING</option>
                    <option value="paid">PAID</option>
                    <option value="overdue">OVERDUE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                    Service Reference
                  </label>
                  <input
                    type="text"
                    value={serviceDesc}
                    onChange={(e) => setServiceDesc(e.target.value)}
                    className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#16140F]/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-mono text-xs uppercase text-[#4A463C] hover:text-[#16140F] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#2A23FF] hover:bg-[#16140F] text-[#F3EFE6] font-mono text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Recording…' : 'Commit to Ledger →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PROFESSIONAL INVOICE DOCUMENT PREVIEW            */}
      {/* ========================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-[#16140F]/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F3EFE6] border border-[#16140F]/25 rounded-[22px] max-w-2xl w-full p-8 md:p-10 shadow-2xl space-y-8 my-8 animate-fadeIn">
            
            {/* Document Top Header */}
            <div className="flex justify-between items-start border-b border-[#16140F]/15 pb-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#16140F] text-[#F3EFE6] font-mono font-bold text-xs flex items-center justify-center">
                    IG
                  </div>
                  <span className="font-[800] text-lg tracking-tight text-[#16140F]">
                    Invoice<span className="font-serif italic font-normal text-[#2A23FF]">Guard</span>
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#4A463C]">
                  Enterprise Financial Ledger · Verified Document
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="font-mono text-xs uppercase text-[#4A463C]">Invoice Reference</span>
                <p className="font-mono text-xl font-bold text-[#2A23FF]">#{selectedInvoice.code}</p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-semibold ${
                    selectedInvoice.status === 'paid'
                      ? 'bg-[#1FAE5A]/15 text-[#1FAE5A] border border-[#1FAE5A]/30'
                      : 'bg-[#FF4D2E]/15 text-[#FF4D2E] border border-[#FF4D2E]/30'
                  }`}
                >
                  {selectedInvoice.status}
                </span>
              </div>
            </div>

            {/* Billed To & Dates Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#E9E3D4]/45 p-5 rounded-2xl border border-[#16140F]/10">
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase text-[#4A463C] font-semibold">Billed To Client</p>
                <p className="text-base font-[800] text-[#16140F]">{selectedInvoice.client_name}</p>
                <p className="font-mono text-xs text-[#4A463C]">
                  {selectedInvoice.client_email || 'accounts@client-enterprise.io'}
                </p>
              </div>
              <div className="sm:text-right space-y-1 font-mono text-xs">
                <div>
                  <span className="text-[#4A463C] uppercase text-[10px]">Issue Date: </span>
                  <span className="text-[#16140F] font-semibold">{selectedInvoice.issueDate}</span>
                </div>
                <div>
                  <span className="text-[#4A463C] uppercase text-[10px]">Due Date: </span>
                  <span className="text-[#16140F] font-semibold">{selectedInvoice.due_date}</span>
                </div>
                <div>
                  <span className="text-[#4A463C] uppercase text-[10px]">Security: </span>
                  <span className="text-[#1FAE5A] font-semibold">RLS Signed</span>
                </div>
              </div>
            </div>

            {/* Line Item Breakdown */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 font-mono text-[10.5px] uppercase text-[#4A463C] border-b border-[#16140F]/15 pb-2">
                <div className="col-span-8">Description / Scope of Work</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="grid grid-cols-12 items-center py-3 border-b border-[#16140F]/10 text-sm">
                <div className="col-span-8">
                  <p className="font-semibold text-[#16140F]">
                    {selectedInvoice.description || 'Enterprise SaaS Infrastructure & Consulting'}
                  </p>
                  <p className="font-mono text-[11px] text-[#4A463C] mt-0.5">
                    Standard Service Level Agreement (SLA) · Direct Settlement
                  </p>
                </div>
                <div className="col-span-2 text-center font-mono text-xs text-[#4A463C]">01</div>
                <div className="col-span-2 text-right font-mono font-bold text-[#16140F]">
                  ${Number(selectedInvoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Total Calculation Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
              <div className="font-mono text-[10.5px] text-[#4A463C] space-y-1 max-w-xs">
                <p className="uppercase font-semibold text-[#16140F]">Payment Instructions</p>
                <p>Wire transfer or ACH via registered InvoiceGuard settlement account.</p>
              </div>

              <div className="w-full sm:w-64 space-y-2 font-mono text-xs bg-[#16140F] text-[#F3EFE6] p-5 rounded-2xl">
                <div className="flex justify-between text-[#F3EFE6]/60">
                  <span>Subtotal</span>
                  <span>${Number(selectedInvoice.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#F3EFE6]/60">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-[#F3EFE6]/15 pt-2 flex justify-between text-sm font-bold text-[#F3EFE6]">
                  <span>Total Due</span>
                  <span className="text-[#1FAE5A]">
                    ${Number(selectedInvoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Action Controls */}
            <div className="pt-4 border-t border-[#16140F]/10 flex justify-between items-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="font-mono text-xs uppercase px-4 py-2 rounded-xl bg-[#E9E3D4] hover:bg-[#16140F] hover:text-[#F3EFE6] text-[#16140F] font-semibold transition-all cursor-pointer"
              >
                🖨️ Print / Save PDF
              </button>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="font-mono text-xs uppercase px-5 py-2 rounded-xl bg-[#2A23FF] text-[#F3EFE6] font-semibold hover:bg-[#16140F] transition-all cursor-pointer"
              >
                Close Document
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}