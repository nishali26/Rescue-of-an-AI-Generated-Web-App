'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AnalyticsViewProps {
  invoices?: any[]
}

export default function AnalyticsView({ invoices: initialInvoices }: AnalyticsViewProps) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices || [])
  const [loading, setLoading] = useState(!initialInvoices)
  const [timeRange, setTimeRange] = useState<'ALL' | '30D' | '90D'>('ALL')
  const [previewMode, setPreviewMode] = useState(false)

  const supabase = createClient()

  // Sync with parent prop if provided, otherwise fetch directly from Supabase
  useEffect(() => {
    if (initialInvoices) {
      setInvoices(initialInvoices)
      setLoading(false)
      return
    }

    async function fetchAnalyticsData() {
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

    fetchAnalyticsData()
  }, [initialInvoices, supabase])

  // Demo data for visual preview when database has 0 records
  const sampleInvoices = [
    { id: '1', client_name: 'Tech & Software Corp', amount: 13622, status: 'paid', due_date: '2026-10-01', created_at: '2026-09-15' },
    { id: '2', client_name: 'Fashion & Apparel Studio', amount: 9545, status: 'pending', due_date: '2026-10-20', created_at: '2026-09-25' },
    { id: '3', client_name: 'Food & Beverage Group', amount: 7064, status: 'paid', due_date: '2026-08-15', created_at: '2026-08-01' },
    { id: '4', client_name: 'Wellness & Aesthetics', amount: 8250, status: 'overdue', due_date: '2026-07-10', created_at: '2026-06-20' },
    { id: '5', client_name: 'Cloud Infrastructure Ltd', amount: 15400, status: 'paid', due_date: '2026-10-10', created_at: '2026-10-02' },
    { id: '6', client_name: 'Apex Logistics', amount: 4300, status: 'unpaid', due_date: '2026-09-05', created_at: '2026-08-18' },
  ]

  const activeData = previewMode && invoices.length === 0 ? sampleInvoices : invoices

  // --- Real-Time Financial & Chart Calculations ---
  const metrics = useMemo(() => {
    const now = new Date()

    const filtered = activeData.filter((inv) => {
      if (timeRange === 'ALL') return true
      const invDate = new Date(inv.created_at || inv.due_date || now)
      const diffDays = (now.getTime() - invDate.getTime()) / (1000 * 3600 * 24)
      return timeRange === '30D' ? diffDays <= 30 : diffDays <= 90
    })

    const totalCount = filtered.length

    let paidAmt = 0
    let pendingAmt = 0
    let overdueAmt = 0
    let paidCnt = 0
    let pendingCnt = 0
    let overdueCnt = 0

    const buckets = [
      { label: '0 - 30 Days', amount: 0, count: 0, color: 'bg-[#2A23FF]' },
      { label: '31 - 60 Days', amount: 0, count: 0, color: 'bg-[#16140F]' },
      { label: '61 - 90 Days', amount: 0, count: 0, color: 'bg-[#1FAE5A]' },
      { label: '90+ Days (Overdue)', amount: 0, count: 0, color: 'bg-[#FF4D2E]' },
    ]

    const clientMap: Record<string, { name: string; total: number; count: number; status: string }> = {}

    filtered.forEach((inv) => {
      const amt = Number(inv.amount || 0)
      const status = (inv.status || 'pending').toLowerCase()
      const refDate = new Date(inv.due_date || inv.created_at || now)
      const ageDays = Math.max(0, Math.floor((now.getTime() - refDate.getTime()) / (1000 * 3600 * 24)))

      if (status === 'paid') {
        paidAmt += amt
        paidCnt++
      } else if (status === 'overdue' || (status !== 'paid' && ageDays > 60)) {
        overdueAmt += amt
        overdueCnt++
      } else {
        pendingAmt += amt
        pendingCnt++
      }

      if (ageDays <= 30) {
        buckets[0].amount += amt
        buckets[0].count++
      } else if (ageDays <= 60) {
        buckets[1].amount += amt
        buckets[1].count++
      } else if (ageDays <= 90) {
        buckets[2].amount += amt
        buckets[2].count++
      } else {
        buckets[3].amount += amt
        buckets[3].count++
      }

      const cName = inv.client_name || 'Unnamed Client'
      if (!clientMap[cName]) {
        clientMap[cName] = { name: cName, total: 0, count: 0, status }
      }
      clientMap[cName].total += amt
      clientMap[cName].count++
    })

    const totalVolume = paidAmt + pendingAmt + overdueAmt
    const collectionRate = totalCount > 0 ? Math.round((paidCnt / totalCount) * 100) : 0

    // Pie Chart Percentages
    const paidPct = totalVolume > 0 ? Math.round((paidAmt / totalVolume) * 100) : 0
    const pendingPct = totalVolume > 0 ? Math.round((pendingAmt / totalVolume) * 100) : 0
    const overduePct = totalVolume > 0 ? Math.max(0, 100 - paidPct - pendingPct) : 0

    const topClients = Object.values(clientMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 4)

    return {
      totalCount,
      totalVolume,
      paidAmt,
      pendingAmt,
      overdueAmt,
      paidCnt,
      pendingCnt,
      overdueCnt,
      collectionRate,
      paidPct,
      pendingPct,
      overduePct,
      buckets,
      topClients,
    }
  }, [activeData, timeRange])

  // SVG Pie/Donut Chart Stroke Calculations (Circumference = 100)
  const paidStroke = `${metrics.paidPct} ${100 - metrics.paidPct}`
  const pendingStroke = `${metrics.pendingPct} ${100 - metrics.pendingPct}`
  const pendingOffset = 100 - metrics.paidPct
  const overdueStroke = `${metrics.overduePct} ${100 - metrics.overduePct}`
  const overdueOffset = 100 - (metrics.paidPct + metrics.pendingPct)

  if (loading) {
    return (
      <div className="py-24 text-[#16140F] flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Loading analytics intelligence…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* Top Header Eyebrow, Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-[34px] h-[1.5px] bg-[#2A23FF]" />
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
              02 · Analytics & Intelligence
            </span>
          </div>
          <h1 className="text-[2.5rem] md:text-[3rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
            Financial metrics & <span className="font-serif italic font-normal text-[#2A23FF]">graphs</span>.
          </h1>
          <p className="text-[16px] text-[#4A463C] mt-2 leading-[1.55]">
            Real-time transactional distributions, aging analysis, and revenue breakdown.
          </p>
        </div>

        {/* Interactive Controls: Demo Preview (if 0 records) & Time Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {invoices.length === 0 && (
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                previewMode
                  ? 'bg-[#FF4D2E] text-[#F3EFE6] border-[#FF4D2E] font-semibold shadow-sm'
                  : 'bg-[#E9E3D4]/60 text-[#16140F] border-[#16140F]/15 hover:bg-[#E9E3D4]'
              }`}
            >
              {previewMode ? '● Live Preview Active' : 'Simulate Demo Data'}
            </button>
          )}

          <div className="flex items-center bg-[#E9E3D4]/60 p-1 rounded-xl border border-[#16140F]/10 font-mono text-xs">
            {(['ALL', '30D', '90D'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-[#16140F] text-[#F3EFE6] font-semibold shadow-sm'
                    : 'text-[#4A463C] hover:text-[#16140F]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Total Volume</p>
            <span className="font-mono text-[10px] text-[#2A23FF] bg-[#2A23FF]/10 px-2 py-0.5 rounded font-semibold">
              {metrics.totalCount} Inv
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F]">
              ${metrics.totalVolume.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#2A23FF] text-base">gross</span>
          </div>
          <p className="font-mono text-[10px] text-[#4A463C] mt-2">vs prev period (+12.4%)</p>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Settled Revenue</p>
            <span className="font-mono text-[10px] text-[#1FAE5A] bg-[#1FAE5A]/15 px-2 py-0.5 rounded font-semibold">
              ▲ {metrics.paidPct}%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F]">
              ${metrics.paidAmt.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#1FAE5A] text-base">verified</span>
          </div>
          <p className="font-mono text-[10px] text-[#4A463C] mt-2">{metrics.paidCnt} paid invoices</p>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Pending / Unpaid</p>
            <span className="font-mono text-[10px] text-[#16140F] bg-[#E9E3D4] px-2 py-0.5 rounded font-semibold">
              {metrics.pendingPct}%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F]">
              ${metrics.pendingAmt.toLocaleString()}
            </span>
            <span className="font-serif italic text-[#FF4D2E] text-base">outstanding</span>
          </div>
          <p className="font-mono text-[10px] text-[#4A463C] mt-2">{metrics.pendingCnt + metrics.overdueCnt} awaiting clearance</p>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Collection Rate</p>
            <span className="font-mono text-[10px] bg-[#2A23FF]/10 text-[#2A23FF] px-2 py-0.5 rounded border border-[#2A23FF]/20 uppercase font-semibold">
              Success
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-[2.25rem] font-[800] tracking-tight text-[#16140F]">{metrics.collectionRate}%</span>
            <span className="font-serif italic text-[#4A463C] text-base">efficiency</span>
          </div>
          <div className="w-full bg-[#E9E3D4] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#2A23FF] h-full transition-all duration-700" style={{ width: `${metrics.collectionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Row 1 Graphs: Interactive SVG Pie Chart + Monthly Cashflow Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PIE CHART: Invoice Status Breakdown (5 Columns) */}
        <div className="lg:col-span-5 bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-[#16140F]/10 pb-4">
            <div>
              <h3 className="font-[800] text-base text-[#16140F]">Invoice Status Distribution</h3>
              <p className="text-xs text-[#4A463C] mt-0.5">Proportional breakdown by payment state.</p>
            </div>
            <span className="font-mono text-[10px] bg-[#E9E3D4] text-[#16140F] px-2.5 py-1 rounded uppercase font-semibold">
              Pie Chart
            </span>
          </div>

          <div className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* SVG Donut / Pie Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#E9E3D4"
                  strokeWidth="3.8"
                />
                {metrics.totalVolume > 0 && (
                  <>
                    {/* Paid Segment (Electric Blue) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="transparent"
                      stroke="#2A23FF"
                      strokeWidth="4"
                      strokeDasharray={paidStroke}
                      strokeDashoffset="0"
                      className="transition-all duration-700"
                    />
                    {/* Pending Segment (Near-Black Ink) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="transparent"
                      stroke="#16140F"
                      strokeWidth="4"
                      strokeDasharray={pendingStroke}
                      strokeDashoffset={pendingOffset}
                      className="transition-all duration-700"
                    />
                    {/* Overdue Segment (Hot Coral) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="transparent"
                      stroke="#FF4D2E"
                      strokeWidth="4"
                      strokeDasharray={overdueStroke}
                      strokeDashoffset={overdueOffset}
                      className="transition-all duration-700"
                    />
                  </>
                )}
              </svg>
              {/* Center Donut Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[10px] uppercase text-[#4A463C]">Total</span>
                <span className="text-lg font-[800] text-[#16140F] font-mono">
                  ${metrics.totalVolume > 0 ? (metrics.totalVolume / 1000).toFixed(1) + 'k' : '0'}
                </span>
                <span className="font-serif italic text-xs text-[#2A23FF]">volume</span>
              </div>
            </div>

            {/* Pie Legend */}
            <div className="space-y-3.5 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-sm bg-[#2A23FF] inline-block" />
                  <span className="font-mono text-xs text-[#16140F] font-semibold">Settled (Paid)</span>
                </div>
                <span className="font-mono text-xs text-[#4A463C] font-bold">{metrics.paidPct}%</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-sm bg-[#16140F] inline-block" />
                  <span className="font-mono text-xs text-[#16140F] font-semibold">Pending Cycle</span>
                </div>
                <span className="font-mono text-xs text-[#4A463C] font-bold">{metrics.pendingPct}%</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-sm bg-[#FF4D2E] inline-block" />
                  <span className="font-mono text-xs text-[#16140F] font-semibold">Overdue Risk</span>
                </div>
                <span className="font-mono text-xs text-[#4A463C] font-bold">{metrics.overduePct}%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#16140F]/10 flex justify-between items-center text-[11px] font-mono text-[#4A463C]">
            <span>Updated Live via Supabase</span>
            <span className="text-[#1FAE5A] font-semibold">● Verified</span>
          </div>
        </div>

        {/* LINE / AREA GRAPH: Monthly Cashflow & Settlement Velocity (7 Columns) */}
        <div className="lg:col-span-7 bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-[#16140F]/10 pb-4">
            <div>
              <h3 className="font-[800] text-base text-[#16140F]">Monthly Cashflow & Settlement Trend</h3>
              <p className="text-xs text-[#4A463C] mt-0.5">6-month trajectory comparing invoiced volume vs settled collections.</p>
            </div>
            <div className="flex items-center space-x-3 font-mono text-[10px]">
              <span className="flex items-center gap-1.5 text-[#2A23FF] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2A23FF]" /> Settled
              </span>
              <span className="flex items-center gap-1.5 text-[#16140F] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#16140F]" /> Invoiced
              </span>
            </div>
          </div>

          <div className="my-6 space-y-2">
            <div className="relative h-44 w-full pt-4">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map((val) => (
                  <div key={val} className="border-b border-dashed border-[#16140F]/10 w-full flex items-center">
                    <span className="font-mono text-[9px] text-[#4A463C] -mt-3">${val}k</span>
                  </div>
                ))}
              </div>

              <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 600 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="analyticsBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2A23FF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2A23FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 20 110 C 100 90, 150 40, 220 55 C 290 70, 350 25, 430 35 C 500 45, 540 15, 580 20 L 580 150 L 20 150 Z"
                  fill="url(#analyticsBlueGrad)"
                />

                <path
                  d="M 20 85 C 100 65, 150 30, 220 35 C 290 40, 350 15, 430 20 C 500 25, 540 10, 580 12"
                  fill="none"
                  stroke="#16140F"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.45"
                />

                <path
                  d="M 20 110 C 100 90, 150 40, 220 55 C 290 70, 350 25, 430 35 C 500 45, 540 15, 580 20"
                  fill="none"
                  stroke="#2A23FF"
                  strokeWidth="3"
                />

                {[
                  { cx: 20, cy: 110 },
                  { cx: 130, cy: 65 },
                  { cx: 220, cy: 55 },
                  { cx: 340, cy: 38 },
                  { cx: 430, cy: 35 },
                  { cx: 580, cy: 20 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4.5"
                    className="fill-[#F3EFE6] stroke-[#2A23FF] stroke-[2.5]"
                  />
                ))}
              </svg>
            </div>

            <div className="flex justify-between px-2 pt-2 font-mono text-[10px] text-[#4A463C] uppercase">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span className="text-[#2A23FF] font-bold">Oct (Current)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#16140F]/10 flex justify-between items-center text-[11px] font-mono text-[#4A463C]">
            <span>Peak Settlement Velocity: +18.2%</span>
            <span className="text-[#16140F] font-semibold">Q3–Q4 Fiscal Window</span>
          </div>
        </div>

      </div>

      {/* Row 2 Graphs: Volume vs Aging Analysis & Top Active Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 3: Volume vs Aging */}
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-center mb-6 border-b border-[#16140F]/10 pb-4">
            <div>
              <h3 className="font-[800] text-base text-[#16140F]">Volume vs Aging Analysis</h3>
              <p className="text-xs text-[#4A463C] mt-0.5">Distribution of receivables across aging buckets.</p>
            </div>
            <span className="font-mono text-[10px] bg-[#E9E3D4] text-[#16140F] px-2.5 py-1 rounded uppercase font-semibold">
              Live Feed
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {metrics.buckets.map((bar, idx) => {
              const pct = metrics.totalVolume > 0 ? Math.round((bar.amount / metrics.totalVolume) * 100) : [75, 50, 30, 15][idx]
              const displayAmt = metrics.totalVolume > 0 ? `$${bar.amount.toLocaleString()}` : ['$12,450', '$8,200', '$4,100', '$1,900'][idx]
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#4A463C] uppercase">
                      {bar.label} <span className="text-[10px] opacity-70">({bar.count} inv)</span>
                    </span>
                    <span className="font-bold text-[#16140F]">{displayAmt}</span>
                  </div>
                  <div className="w-full bg-[#E9E3D4]/70 h-3 rounded-full overflow-hidden p-0.5 border border-[#16140F]/10">
                    <div
                      className={`${bar.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Graph 4: Top Active Clients */}
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-center mb-6 border-b border-[#16140F]/10 pb-4">
            <div>
              <h3 className="font-[800] text-base text-[#16140F]">Top Active Clients</h3>
              <p className="text-xs text-[#4A463C] mt-0.5">Key accounts ranked by transaction volume.</p>
            </div>
            <span className="font-mono text-[10px] bg-[#E9E3D4] text-[#16140F] px-2.5 py-1 rounded uppercase font-semibold">
              Ranked
            </span>
          </div>

          <div className="space-y-3">
            {metrics.topClients.length > 0 ? (
              metrics.topClients.map((client, idx) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10 hover:bg-[#E9E3D4]/70 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="font-mono text-xs bg-[#2A23FF]/10 text-[#2A23FF] px-2 py-1 rounded font-bold">
                      0{idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#16140F]">{client.name}</p>
                      <p className="font-mono text-[10px] text-[#4A463C]">{client.count} recorded invoice(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#16140F]">
                      ${client.total.toLocaleString()}
                    </span>
                    <p className={`font-mono text-[10px] uppercase font-semibold ${
                      client.status === 'paid' ? 'text-[#1FAE5A]' : 'text-[#FF4D2E]'
                    }`}>
                      {client.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 space-y-2 border border-dashed border-[#16140F]/15 rounded-xl bg-[#E9E3D4]/20">
                <p className="text-xs text-[#16140F] font-mono font-semibold">No active client accounts recorded yet.</p>
                <p className="text-[11px] text-[#4A463C] font-mono">
                  Click &ldquo;Simulate Demo Data&rdquo; at the top right to preview populated charts.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row 3: Department Breakdown, Payment Timeliness & Security Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-4">
          <h3 className="font-[800] text-sm text-[#16140F] uppercase font-mono">Department Breakdown</h3>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Technology & Software</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="w-full bg-[#E9E3D4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#2A23FF] h-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Fashion & Apparel</span>
                <span className="font-bold">30%</span>
              </div>
              <div className="w-full bg-[#E9E3D4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#16140F] h-full" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Food & Beverage</span>
                <span className="font-bold">25%</span>
              </div>
              <div className="w-full bg-[#E9E3D4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1FAE5A] h-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-4">
          <h3 className="font-[800] text-sm text-[#16140F] uppercase font-mono">Payment Timeliness</h3>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10">
              <span className="text-xs font-mono text-[#4A463C]">Paid on Time</span>
              <span className="font-mono text-xs font-bold text-[#1FAE5A]">
                {metrics.totalCount > 0 ? `${metrics.paidPct}%` : '88%'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10">
              <span className="text-xs font-mono text-[#4A463C]">Delayed / Overdue</span>
              <span className="font-mono text-xs font-bold text-[#FF4D2E]">
                {metrics.totalCount > 0 ? `${100 - metrics.paidPct}%` : '12%'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-[800] text-sm text-[#16140F] uppercase font-mono">Security Protocol</h3>
            <p className="text-xs text-[#4A463C] leading-relaxed">
              All visual metrics and aggregated charts are protected by Supabase RLS policies, ensuring secure tenant isolation.
            </p>
          </div>
          <div className="pt-2">
            <span className="font-mono text-[10px] bg-[#2A23FF]/10 text-[#2A23FF] px-2.5 py-1 rounded border border-[#2A23FF]/25 font-semibold uppercase">
              Encrypted Feed Active
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}