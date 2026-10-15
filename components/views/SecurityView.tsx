'use client'

import React, { useState, useMemo } from 'react'

export default function SecurityView() {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'INFO' | 'WARNING' | 'CRITICAL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock security audit logs (simulating Supabase RLS and Auth events)
  const auditLogs = [
    {
      id: 'log-8891',
      timestamp: '2026-10-16 03:15:22 UTC',
      event: 'SUPABASE_RLS_POLICY_ENFORCED',
      severity: 'INFO',
      ip: '192.168.1.45',
      user: 'admin@invoiceguard.io',
      details: 'Strict tenant isolation query executed successfully on "invoices" table.'
    },
    {
      id: 'log-8890',
      timestamp: '2026-10-15 22:40:11 UTC',
      event: 'ADMIN_SESSION_MFA_VERIFIED',
      severity: 'INFO',
      ip: '192.168.1.45',
      user: 'admin@invoiceguard.io',
      details: 'Hardware authenticator token challenge passed successfully.'
    },
    {
      id: 'log-8889',
      timestamp: '2026-10-15 18:12:05 UTC',
      event: 'UNAUTHORIZED_API_RATE_LIMIT',
      severity: 'WARNING',
      ip: '45.33.22.11',
      user: 'Anonymous',
      details: 'Excessive GET requests blocked by Edge Firewall (Rate limit: 120 req/min).'
    },
    {
      id: 'log-8888',
      timestamp: '2026-10-14 09:05:40 UTC',
      event: 'DATABASE_ENCRYPTION_KEY_ROTATED',
      severity: 'INFO',
      ip: 'System Cron',
      user: 'Root Daemon',
      details: 'AES-256-GCM master key successfully rotated across all client payloads.'
    },
    {
      id: 'log-8887',
      timestamp: '2026-10-13 14:50.18 UTC',
      event: 'FAILED_SIGN_IN_ATTEMPT',
      severity: 'CRITICAL',
      ip: '185.220.101.5',
      user: 'unknown@malicious.net',
      details: 'Invalid password hash supplied. IP temporarily quarantined by fail2ban.'
    },
  ]

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity
      const matchesSearch =
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery)
      return matchesSeverity && matchesSearch
    })
  }, [filterSeverity, searchQuery])

  return (
    <div className="space-y-8 animate-fadeIn antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* Top Header Eyebrow & Description */}
      <div>
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-[34px] h-[1.5px] bg-[#2A23FF]" />
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
            06 · Cryptographic Audit & Security Logs
          </span>
        </div>
        <h1 className="text-[2.5rem] md:text-[3rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
          Security <span className="font-serif italic font-normal text-[#2A23FF]">logs</span>.
        </h1>
        <p className="text-[16px] text-[#4A463C] mt-2 leading-[1.55]">
          Real-time immutability audit trail monitoring Supabase RLS policies, firewall challenges, and auth events.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">RLS Firewall Status</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1FAE5A] animate-pulse" />
            <span className="text-xl font-[800] text-[#16140F]">Active & Enforced</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Quarantined IPs (24h)</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-[2rem] font-[800] text-[#16140F] font-mono">1</span>
            <span className="font-serif italic text-[#FF4D2E] text-sm">blocked</span>
          </div>
        </div>

        <div className="bg-[#F3EFE6] border border-[#16140F]/15 p-5 rounded-[18px] shadow-[0_10px_30px_rgba(22,20,15,0.03)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Compliance Standard</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-xl font-[800] text-[#16140F] font-mono">SOC2 / ISO-27001</span>
          </div>
        </div>
      </div>

      {/* Main Audit Trail Register */}
      <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-[#16140F]/10 pb-5">
          <div className="flex items-center space-x-1.5 bg-[#E9E3D4]/60 p-1 rounded-xl border border-[#16140F]/10 w-fit">
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'INFO', label: 'Info' },
              { id: 'WARNING', label: 'Warning' },
              { id: 'CRITICAL', label: 'Critical' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterSeverity(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase transition-all cursor-pointer ${
                  filterSeverity === tab.id
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
              placeholder="Search event, user or IP…"
              className="w-full bg-[#E9E3D4]/50 border border-[#16140F]/15 rounded-xl px-4 py-2 text-xs font-mono text-[#16140F] placeholder-[#4A463C]/60 focus:outline-none focus:border-[#2A23FF]"
            />
          </div>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E9E3D4]/50 text-[#4A463C] font-mono uppercase text-[10.5px] tracking-[0.06em] border-y border-[#16140F]/10">
                  <th className="py-3.5 px-4 rounded-l-lg">Severity</th>
                  <th className="py-3.5 px-4">Event Signature</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Origin IP</th>
                  <th className="py-3.5 px-4">Context / Details</th>
                  <th className="py-3.5 px-4 text-right rounded-r-lg">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16140F]/10 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#E9E3D4]/35 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                          log.severity === 'CRITICAL'
                            ? 'bg-[#FF4D2E]/15 text-[#FF4D2E] border border-[#FF4D2E]/30'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                            : 'bg-[#1FAE5A]/15 text-[#1FAE5A] border border-[#1FAE5A]/30'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#2A23FF]">{log.event}</td>
                    <td className="py-4 px-4 font-mono text-xs text-[#4A463C]">{log.timestamp}</td>
                    <td className="py-4 px-4 font-mono text-xs text-[#16140F]">{log.ip}</td>
                    <td className="py-4 px-4 text-xs text-[#4A463C] max-w-xs truncate">{log.details}</td>
                    <td className="py-4 px-4 font-mono text-xs text-[#16140F] text-right">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#16140F]/20 rounded-[14px] bg-[#E9E3D4]/20">
            <p className="text-sm font-semibold text-[#16140F]">No security events match the current filter.</p>
          </div>
        )}

        <div className="pt-4 border-t border-[#16140F]/10 flex justify-between items-center text-[11px] font-mono text-[#4A463C]">
          <span>Cryptographic Hash Integrity: SHA-256 Verified</span>
          <button
            type="button"
            onClick={() => window.print()}
            className="hover:text-[#16140F] uppercase underline cursor-pointer"
          >
            Export Compliance Audit Report →
          </button>
        </div>

      </div>

    </div>
  )
}