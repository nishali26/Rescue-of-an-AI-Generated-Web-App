'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const insightItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      index: '01',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
        </svg>
      )
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/analytics', 
      index: '02',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ]

  const managementItems = [
    { 
      name: 'Invoices', 
      href: '/dashboard/invoices', 
      index: '03',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      name: 'Clients', 
      href: '/dashboard/clients', 
      index: '04',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      name: 'Transactions', 
      href: '/dashboard/transactions', 
      index: '05',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    { 
      name: 'Security Logs', 
      href: '/dashboard/security', 
      index: '06',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      index: '07',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ]

  return (
    <aside className="w-64 bg-[#16140F] text-[#F3EFE6] border-r border-[#F3EFE6]/10 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto shadow-2xl">
      
      {/* Top Brand Section */}
      <div className="space-y-6 p-6">
        
        {/* App Logo & Title with Live Status Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F3EFE6]/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2A23FF] to-indigo-500 text-[#F3EFE6] font-mono font-bold text-sm flex items-center justify-center shadow-md">
              IG
            </div>
            <div>
              <h1 className="font-[800] text-[#F3EFE6] text-sm tracking-tight">InvoiceGuard</h1>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-[#FF4D2E] font-medium">
                Enterprise OS
              </span>
            </div>
          </div>
          <span className="font-mono text-[9px] bg-[#1FAE5A]/20 text-[#1FAE5A] px-2 py-0.5 rounded-full border border-[#1FAE5A]/35 uppercase tracking-wider font-semibold">
            Live
          </span>
        </div>

        {/* Group 1: INSIGHTS */}
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#F3EFE6]/40 px-3 mb-1.5">
            Insights
          </p>
          
          {insightItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#2A23FF] text-[#F3EFE6] shadow-lg shadow-[#2A23FF]/30 font-semibold'
                    : 'text-[#F3EFE6]/70 hover:bg-[#F3EFE6]/8 hover:text-[#F3EFE6]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${isActive ? 'text-[#F3EFE6]' : 'text-[#F3EFE6]/50 group-hover:text-[#F3EFE6]'}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-tight">{item.name}</span>
                </div>
                <span className={`font-mono text-[10.5px] ${isActive ? 'text-[#F3EFE6]/90' : 'text-[#F3EFE6]/30 group-hover:text-[#F3EFE6]/60'}`}>
                  {item.index}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Group 2: MANAGEMENT */}
        <div className="space-y-1 pt-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#F3EFE6]/40 px-3 mb-1.5">
            Management
          </p>
          
          {managementItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#2A23FF] text-[#F3EFE6] shadow-lg shadow-[#2A23FF]/30 font-semibold'
                    : 'text-[#F3EFE6]/70 hover:bg-[#F3EFE6]/8 hover:text-[#F3EFE6]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${isActive ? 'text-[#F3EFE6]' : 'text-[#F3EFE6]/50 group-hover:text-[#F3EFE6]'}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-tight">{item.name}</span>
                </div>
                <span className={`font-mono text-[10.5px] ${isActive ? 'text-[#F3EFE6]/90' : 'text-[#F3EFE6]/30 group-hover:text-[#F3EFE6]/60'}`}>
                  {item.index}
                </span>
              </Link>
            )
          })}
        </div>

      </div>

      {/* Bottom Security RLS Widget */}
      <div className="p-4 m-6 mt-2 rounded-xl bg-[#F3EFE6]/5 border border-[#F3EFE6]/10 space-y-1.5">
        <div className="files-center flex items-center justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#F3EFE6]/40">Database RLS</span>
          <div className="w-2 h-2 rounded-full bg-[#1FAE5A] shadow-[0_0_6px_rgba(31,174,90,0.5)] animate-pulse" />
        </div>
        <p className="font-mono text-[11px] text-[#F3EFE6]/80 font-medium">Secure Connection</p>
      </div>

    </aside>
  )
}