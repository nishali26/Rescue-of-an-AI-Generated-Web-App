'use client'

import { useState, useRef, useEffect } from 'react'

interface NavbarProps {
  userEmail?: string
  onSignOut: () => void
}

export default function Navbar({ userEmail, onSignOut }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full bg-[#F3EFE6]/90 backdrop-blur-md border border-[#16140F]/15 rounded-[18px] p-4 mb-8 shadow-[0_10px_30px_rgba(22,20,15,0.04)] flex items-center justify-between">
      
      {/* Left: Brand / Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-[#16140F] text-[#F3EFE6] font-mono font-bold text-base flex items-center justify-center shadow-md">
          IG
        </div>
        <div>
          <h2 className="font-[800] text-[#16140F] text-base tracking-tight">InvoiceGuard</h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#2A23FF] font-medium">
            Secure Workspace
          </span>
        </div>
      </div>

      {/* Middle: System Balance / Metric */}
      <div className="hidden md:flex items-center space-x-2.5 bg-[#E9E3D4]/50 px-4 py-2 rounded-xl border border-[#16140F]/10">
        <div className="w-2 h-2 rounded-full bg-[#1FAE5A] animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#4A463C] font-semibold">Balance:</span>
        <span className="font-mono text-sm font-bold text-[#16140F]">$1,250.00</span>
      </div>

      {/* Right: Profile Menu Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 bg-[#E9E3D4]/50 hover:bg-[#E9E3D4] px-3.5 py-2 rounded-xl border border-[#16140F]/15 transition-all focus:outline-none"
        >
          {/* User Initial Avatar */}
          <div className="w-8 h-8 rounded-lg bg-[#2A23FF]/10 text-[#2A23FF] border border-[#2A23FF]/20 flex items-center justify-center font-mono font-bold text-xs">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <div className="text-left hidden sm:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#4A463C]">Account</p>
            <p className="text-xs font-semibold text-[#16140F] truncate max-w-[150px]">{userEmail}</p>
          </div>

          {/* Dropdown Indicator Arrow */}
          <svg className={`w-3.5 h-3.5 text-[#4A463C] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="absolute right-0 mt-2.5 w-60 bg-[#F3EFE6] border border-[#16140F]/15 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-[#16140F]/10">
              <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#4A463C]">Signed in as</p>
              <p className="text-xs font-semibold text-[#16140F] truncate mt-0.5">{userEmail}</p>
            </div>

            {/* Links */}
            <div className="py-1">
              <a href="#profile" className="block px-4 py-2 text-xs font-medium text-[#16140F] hover:bg-[#E9E3D4]/60 transition-colors">
                Profile Settings
              </a>
              <a href="#security" className="block px-4 py-2 text-xs font-medium text-[#16140F] hover:bg-[#E9E3D4]/60 transition-colors">
                Security Logs
              </a>
            </div>

            {/* Sign Out Action */}
            <div className="border-t border-[#16140F]/10 pt-1">
              <button
                onClick={onSignOut}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-[#FF4D2E] hover:bg-[#FF4D2E]/10 transition-colors flex items-center justify-between"
              >
                <span>Sign Out</span>
                <span>→</span>
              </button>
            </div>

          </div>
        )}
      </div>

    </header>
  )
}