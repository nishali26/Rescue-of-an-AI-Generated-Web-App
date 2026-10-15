'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TransactionsViewProps {
  invoices?: any[]
}

export default function TransactionsView({ invoices: initialInvoices }: TransactionsViewProps) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices || [])
  const [loading, setLoading] = useState(!initialInvoices)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'completed' | 'pending' | 'failed'>('ALL')
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedTx, setSelectedTx] = useState<any | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (initialInvoices) {
      setInvoices(initialInvoices)
      setLoading(false)
      return
    }
    fetchTransactions()
  }, [initialInvoices])

  async function fetchTransactions() {
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

  // Sample transactions for demo mode if DB is empty
  const sampleTransactions = [
    { id: 'tx-901', client_name: 'Tech & Software Corp', amount: 13622, status: 'completed', created_at: '2026-10-12T10:30:00Z', method: 'Wire Transfer (ACH)' },
    { id: 'tx-902', client_name: 'Fashion & Apparel Studio', amount: 9545, status: 'pending', created_at: '2026-10-14T14:20:00Z', method: 'Credit Card (Stripe)' },
    { id: 'tx-903', client_name: 'Food & Beverage Group', amount: 7064, status: 'completed', created_at: '2026-09-28T09:15:00Z', method: 'Direct Deposit' },
    { id: 'tx-904', client_name: 'Wellness & Aesthetics', amount: 8250, status: 'failed', created_at: '2026-09-10T11:00:00Z', method: 'ACH Gateway' },
    { id: 'tx-905', client_name: 'Cloud Infrastructure Ltd', amount: 15400, status: 'completed', created_at: '2026-10-02T16:45:00Z', method: 'Wire Transfer (SWIFT)' },
  ]

  const activeData = previewMode && invoices.length === 0 ? sampleTransactions : invoices

  // Filtered & Searched Transactions + Metrics
  const { filteredTransactions, summary } = useMemo(() => {
    let totalCompleted = 0
    let totalPending = 0
    let totalVolume = 0

    activeData.forEach((tx) => {
      const amt = Number(tx.amount || 0)
      const st = (tx.status || 'pending').toLowerCase()
      totalVolume += amt
      if (st === 'paid' || st === 'completed') totalCompleted += amt
      else totalPending += amt
    })

    const filtered = activeData.filter((tx) => {
      const rawSt = (tx.status || 'pending').toLowerCase()
      const normalizedSt = rawSt === 'paid' ? 'completed' : rawSt === 'overdue' ? 'failed' : rawSt
      
      const matchesStatus = statusFilter === 'ALL' || normalizedSt === statusFilter
      const matchesSearch =
        (tx.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(tx.id || '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })

    return {
      filteredTransactions: filtered,
      summary: {
        totalVolume,
        totalCompleted,
        totalPending,
      }
    }
  }, [activeData, statusFilter, searchQuery])

  if (loading) {
    return (
      <div className="py-24 text-[#16140F] flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Loading secure transaction ledger…</p>
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
              05 · Financial Ledger & Settlement History
            </span>
          </div>
          <h1 className="text-[2.5rem] md:text-[3rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
            Secure <span className="font-serif italic font-normal text-[#2A23FF]">transactions</span>.
          </h1>
          <p className="text-[16px] text-[#4A463C] mt-2 leading-[1.55]">
            Immutable record of all incoming wire transfers, ACH gateways, and card settlements.
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
              {previewMode ? '● Demo Ledger Active' : 'Load Sample Transactions'}
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Total Ledger Volume</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F] font-mono">
              ${summary.totalVolume.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#2A23FF] text-sm">processed</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Completed Settlements</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#1FAE5A] font-mono">
              ${summary.totalCompleted.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#1FAE5A] text-sm">cleared</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Pending Gateway Clearance</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F] font-mono">
              ${summary.totalPending.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#4A463C] text-sm">in transit</span>
          </div>
        </div>
      </div>

      {/* Main Transactions Register Card */}
      <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-[#16140F]/10 pb-5">
          <div className="flex items-center space-x-1.5 bg-[#E9E3D4]/60 p-1 rounded-xl border border-[#16140F]/10 w-fit">
            {[
              { id: 'ALL', label: 'All Transactions' },
              { id: 'completed', label: 'Completed' },
              { id: 'pending', label: 'Pending' },
              { id: 'failed', label: 'Failed' },
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

          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client or transaction ID…"
              className="w-full bg-[#E9E3D4]/50 border border-[#16140F]/15 rounded-xl px-4 py-2 text-xs font-mono text-[#16140F] placeholder-[#4A463C]/60 focus:outline-none focus:border-[#2A23FF]"
            />
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E9E3D4]/50 text-[#4A463C] font-mono uppercase text-[10.5px] tracking-[0.06em] border-y border-[#16140F]/10">
                  <th className="py-3.5 px-4 rounded-l-lg">Transaction ID</th>
                  <th className="py-3.5 px-4">Entity / Client</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Gateway Method</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-lg">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16140F]/10 text-sm">
                {filteredTransactions.map((tx: any, idx: number) => {
                  const rawSt = (tx.status || 'pending').toLowerCase()
                  const st = rawSt === 'paid' ? 'completed' : rawSt === 'overdue' ? 'failed' : rawSt
                  const txId = `TX-${String(tx.id || idx).slice(0, 6).toUpperCase()}`
                  const timestamp = tx.created_at ? new Date(tx.created_at).toLocaleString() : '2026-10-14 12:00 PM'
                  const method = tx.method || 'Enterprise Wire (ACH)'

                  return (
                    <tr key={tx.id || idx} className="hover:bg-[#E9E3D4]/35 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs font-bold text-[#2A23FF]">{txId}</td>
                      <td className="py-4 px-4 font-semibold text-[#16140F]">{tx.client_name}</td>
                      <td className="py-4 px-4 font-mono text-xs text-[#4A463C]">{timestamp}</td>
                      <td className="py-4 px-4 font-mono text-xs text-[#16140F]">{method}</td>
                      <td className="py-4 px-4 font-mono text-sm font-bold text-[#16140F]">
                        ${Number(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold ${
                            st === 'completed'
                              ? 'bg-[#1FAE5A]/15 text-[#1FAE5A] border border-[#1FAE5A]/30'
                              : st === 'failed'
                              ? 'bg-[#FF4D2E]/15 text-[#FF4D2E] border border-[#FF4D2E]/30'
                              : 'bg-[#16140F]/10 text-[#16140F] border border-[#16140F]/20'
                          }`}
                        >
                          <span>{st}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTx({ ...tx, txId, timestamp, method, st })}
                          className="font-mono text-[10.5px] uppercase px-3 py-1 rounded-lg bg-[#E9E3D4] hover:bg-[#16140F] hover:text-[#F3EFE6] text-[#16140F] font-semibold transition-all cursor-pointer"
                        >
                          Audit Receipt
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#16140F]/20 rounded-[14px] bg-[#E9E3D4]/20 space-y-3">
            <p className="text-sm font-semibold text-[#16140F]">No transaction records found.</p>
            <p className="text-xs text-[#4A463C] max-w-md mx-auto">
              Click &ldquo;Load Sample Transactions&rdquo; above to preview secure ledger activity.
            </p>
          </div>
        )}
      </div>

      {/* TRANSACTION AUDIT MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-[#16140F]/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F3EFE6] border border-[#16140F]/25 rounded-[22px] max-w-lg w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start border-b border-[#16140F]/15 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#2A23FF] font-semibold">Cryptographic Audit</span>
                <h3 className="text-xl font-[800] text-[#16140F]">Receipt #{selectedTx.txId}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-8 h-8 rounded-lg bg-[#E9E3D4] text-[#16140F] font-mono text-xs flex items-center justify-center hover:bg-[#16140F] hover:text-[#F3EFE6] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs bg-[#E9E3D4]/40 p-4 rounded-xl border border-[#16140F]/10">
              <div className="flex justify-between">
                <span className="text-[#4A463C]">Client:</span>
                <span className="font-bold text-[#16140F]">{selectedTx.client_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A463C]">Timestamp:</span>
                <span className="text-[#16140F]">{selectedTx.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A463C]">Gateway Method:</span>
                <span className="text-[#16140F]">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A463C]">Settlement Status:</span>
                <span className="font-bold text-[#1FAE5A] uppercase">{selectedTx.st}</span>
              </div>
              <div className="flex justify-between border-t border-[#16140F]/15 pt-2 text-sm font-bold">
                <span>Amount:</span>
                <span className="text-[#2A23FF]">${Number(selectedTx.amount || 0).toLocaleString()} USD</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#16140F]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="font-mono text-xs uppercase px-5 py-2.5 rounded-xl bg-[#16140F] text-[#F3EFE6] font-semibold hover:bg-[#2A23FF] transition-all cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}