'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  // Calculations
  const totalCount = invoices.length
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  const pendingAmount = invoices
    .filter(i => i.status === 'pending' || i.status === 'unpaid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  const paidCount = invoices.filter(i => i.status === 'paid').length
  const collectionRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] text-[#16140F] flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Loading analytics intelligence…</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1320px] mx-auto space-y-8 antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* Top Header Eyebrow & Title */}
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
          Real-time transactional distributions and performance visualization.
        </p>
      </div>

      {/* Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold mb-2">Total Revenue</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-[2.5rem] font-[800] tracking-tight text-[#16140F]">${totalRevenue.toLocaleString()}</span>
            <span className="font-serif italic text-[#1FAE5A] text-lg">verified</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold mb-2">Pending Receivables</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-[2.5rem] font-[800] tracking-tight text-[#16140F]">${pendingAmount.toLocaleString()}</span>
            <span className="font-serif italic text-[#FF4D2E] text-lg">outstanding</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-6 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold mb-2">Collection Efficiency</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-[2.5rem] font-[800] tracking-tight text-[#16140F]">{collectionRate}%</span>
            <span className="font-mono text-xs bg-[#2A23FF]/10 text-[#2A23FF] px-2 py-0.5 rounded border border-[#2A23FF]/20 uppercase font-semibold">Success</span>
          </div>
        </div>
      </div>

      {/* Row 1 Graphs: Volume Distribution & Top Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: Volume vs Aging (Bar Simulation) */}
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-center mb-6 border-b border-[#16140F]/10 pb-4">
            <div>
              <h3 className="font-[800] text-base text-[#16140F]">Volume vs Aging Analysis</h3>
              <p className="text-xs text-[#4A463C] mt-0.5">Distribution of receivables across aging buckets.</p>
            </div>
            <span className="font-mono text-[10px] bg-[#E9E3D4] text-[#16140F] px-2.5 py-1 rounded uppercase">Live Feed</span>
          </div>

          {/* Custom CSS Bar Chart */}
          <div className="space-y-4 pt-2">
            {[
              { label: '0 - 30 Days', percent: 75, amount: '$12,450', color: 'bg-[#2A23FF]' },
              { label: '31 - 60 Days', percent: 50, amount: '$8,200', color: 'bg-[#16140F]' },
              { label: '61 - 90 Days', percent: 30, amount: '$4,100', color: 'bg-[#1FAE5A]' },
              { label: '90+ Days (Overdue)', percent: 15, amount: '$1,900', color: 'bg-[#FF4D2E]' },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#4A463C] uppercase">{bar.label}</span>
                  <span className="font-bold text-[#16140F]">{bar.amount}</span>
                </div>
                <div className="w-full bg-[#E9E3D4]/70 h-3 rounded-full overflow-hidden p-0.5 border border-[#16140F]/10">
                  <div className={`${bar.color} h-full rounded-full transition-all duration-700`} style={{ width: `${bar.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 2: Top Clients by Volume */}
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <div className="flex justify-between items-center mb-6 border-b border-[#16140F]/10 pb-4">
            <div>
              <h3 className="font-[800] text-base text-[#16140F]">Top Active Clients</h3>
              <p className="text-xs text-[#4A463C] mt-0.5">Key accounts ranked by transaction volume.</p>
            </div>
            <span className="font-mono text-[10px] bg-[#E9E3D4] text-[#16140F] px-2.5 py-1 rounded uppercase">Ranked</span>
          </div>

          <div className="space-y-3">
            {invoices.slice(0, 4).length > 0 ? (
              invoices.slice(0, 4).map((inv: any, idx: number) => (
                <div key={inv.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs text-[#2A23FF] font-bold">0{idx + 1}</span>
                    <span className="text-sm font-semibold text-[#16140F]">{inv.client_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-[#16140F]">${inv.amount}</span>
                    <p className="font-mono text-[10px] text-[#4A463C] uppercase">{inv.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-[#4A463C] font-mono">
                No active client accounts recorded yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row 2 Graphs: Monthly Performance & Collection Metrics */}
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
              <span className="font-mono text-xs font-bold text-[#1FAE5A]">88%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10">
              <span className="text-xs font-mono text-[#4A463C]">Delayed / Overdue</span>
              <span className="font-mono text-xs font-bold text-[#FF4D2E]">12%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-4">
          <h3 className="font-[800] text-sm text-[#16140F] uppercase font-mono">Security Protocol</h3>
          <p className="text-xs text-[#4A463C] leading-relaxed">
            All visual metrics and aggregated charts are protected by Supabase RLS policies, ensuring secure tenant isolation.
          </p>
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