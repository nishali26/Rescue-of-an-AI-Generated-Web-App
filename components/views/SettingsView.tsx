'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsView() {
  const [companyName, setCompanyName] = useState('InvoiceGuard Enterprise OS')
  const [billingEmail, setBillingEmail] = useState('admin@invoiceguard.io')
  const [currency, setCurrency] = useState('USD ($)')
  const [taxId, setTaxId] = useState('US-99482019-TX')
  
  // Toggles
  const [rlsEnabled, setRlsEnabled] = useState(true)
  const [mfaActive, setMfaActive] = useState(true)
  const [autoEncrypt, setAutoEncrypt] = useState(true)

  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const supabase = createClient()

  // Load saved settings on mount from localStorage or Supabase
  useEffect(() => {
    async function loadSettings() {
      // 1. Check localStorage first for instant client persistence
      const savedLocal = localStorage.getItem('invoiceguard_settings')
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal)
          setCompanyName(parsed.companyName || companyName)
          setBillingEmail(parsed.billingEmail || billingEmail)
          setCurrency(parsed.currency || currency)
          setTaxId(parsed.taxId || taxId)
          setRlsEnabled(parsed.rlsEnabled ?? true)
          setMfaActive(parsed.mfaActive ?? true)
          setAutoEncrypt(parsed.autoEncrypt ?? true)
        } catch (e) {
          console.error('Failed to parse local settings', e)
        }
      }

      // 2. Fetch authenticated user profile data
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setBillingEmail((prev) => (prev === 'admin@invoiceguard.io' ? user.email : prev))
      }
    }

    loadSettings()
  }, [supabase])

  // Save Settings handler (Persists to localStorage & Supabase)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setToastMessage(null)
    setErrorMsg(null)

    const settingsPayload = {
      companyName,
      billingEmail,
      currency,
      taxId,
      rlsEnabled,
      mfaActive,
      autoEncrypt,
      updatedAt: new Date().toISOString()
    }

    try {
      // 1. Save to browser localStorage (Guaranteed client persistence)
      localStorage.setItem('invoiceguard_settings', JSON.stringify(settingsPayload))

      // 2. Attempt to sync with Supabase auth metadata or user table if available
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.auth.updateUser({
          data: {
            company_name: companyName,
            billing_email: billingEmail,
            currency,
            tax_id: taxId
          }
        })
      }

      setSaving(false)
      setToastMessage('Workspace preferences & security protocols successfully saved and committed.')
      setTimeout(() => setToastMessage(null), 4000)
    } catch (err: any) {
      setSaving(false)
      setErrorMsg(err?.message || 'Failed to persist settings.')
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      
      {/* Top Header Eyebrow & Description */}
      <div>
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-[34px] h-[1.5px] bg-[#2A23FF]" />
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
            07 · System Configuration & Preferences
          </span>
        </div>
        <h1 className="text-[2.5rem] md:text-[3rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
          Workspace <span className="font-serif italic font-normal text-[#2A23FF]">settings</span>.
        </h1>
        <p className="text-[16px] text-[#4A463C] mt-2 leading-[1.55]">
          Manage organization profile, cryptographic security layers, and Supabase database integrations.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-[#1FAE5A]/15 border border-[#1FAE5A]/30 text-xs font-mono text-[#1FAE5A] font-semibold animate-fadeIn">
          ✓ {toastMessage}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#FF4D2E]/10 border border-[#FF4D2E]/30 text-xs font-mono text-[#FF4D2E]">
          Error: {errorMsg}
        </div>
      )}

      {/* Settings Form Container */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Section 1: Organization Profile */}
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-6">
          <div className="border-b border-[#16140F]/10 pb-4">
            <h2 className="text-xl font-[800] text-[#16140F] tracking-tight">Organization Profile</h2>
            <p className="text-xs text-[#4A463C] mt-0.5">Primary entity metadata displayed across official invoice documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                Workspace / Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
              />
            </div>

            <div>
              <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                Primary Billing Email
              </label>
              <input
                type="email"
                required
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
              />
            </div>

            <div>
              <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm font-mono text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="PKR (₨)">PKR (₨) - Pakistani Rupee</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10.5px] uppercase text-[#4A463C] font-semibold mb-1.5">
                Tax Identification Number (TIN)
              </label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full bg-[#E9E3D4]/60 border border-[#16140F]/15 rounded-xl px-4 py-2.5 text-sm font-mono text-[#16140F] focus:outline-none focus:border-[#2A23FF]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Security & RLS Protocols */}
        <div className="bg-[#F3EFE6] border border-[#16140F]/15 rounded-[18px] p-6 md:p-8 shadow-[0_10px_30px_rgba(22,20,15,0.03)] space-y-6">
          <div className="border-b border-[#16140F]/10 pb-4">
            <h2 className="text-xl font-[800] text-[#16140F] tracking-tight">Security & Database RLS</h2>
            <p className="text-xs text-[#4A463C] mt-0.5">Cryptographic enforcement and session isolation settings.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10">
              <div>
                <p className="font-semibold text-sm text-[#16140F]">Supabase Row-Level Security (RLS)</p>
                <p className="text-xs text-[#4A463C] mt-0.5">Enforces tenant separation by restricting database queries to authenticated UUIDs.</p>
              </div>
              <button
                type="button"
                onClick={() => setRlsEnabled(!rlsEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  rlsEnabled ? 'bg-[#2A23FF]' : 'bg-[#4A463C]/30'
                }`}
              >
                <div className={`bg-[#F3EFE6] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  rlsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10">
              <div>
                <p className="font-semibold text-sm text-[#16140F]">Multi-Factor Authentication (MFA)</p>
                <p className="text-xs text-[#4A463C] mt-0.5">Require hardware token or authenticator app for administrative login sessions.</p>
              </div>
              <button
                type="button"
                onClick={() => setMfaActive(!mfaActive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  mfaActive ? 'bg-[#2A23FF]' : 'bg-[#4A463C]/30'
                }`}
              >
                <div className={`bg-[#F3EFE6] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  mfaActive ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#E9E3D4]/40 border border-[#16140F]/10">
              <div>
                <p className="font-semibold text-sm text-[#16140F]">Automatic Invoice Encryption</p>
                <p className="text-xs text-[#4A463C] mt-0.5">Encrypts sensitive client metadata and financial amounts at rest.</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoEncrypt(!autoEncrypt)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoEncrypt ? 'bg-[#2A23FF]' : 'bg-[#4A463C]/30'
                }`}
              >
                <div className={`bg-[#F3EFE6] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoEncrypt ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#16140F] hover:bg-[#2A23FF] text-[#F3EFE6] font-mono text-xs uppercase tracking-wider font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving Changes…' : 'Save Workspace Settings →'}
          </button>
        </div>

      </form>
    </div>
  )
}