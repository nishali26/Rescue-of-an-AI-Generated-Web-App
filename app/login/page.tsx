'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EFE6] px-4 text-[#16140F] antialiased selection:bg-[#2A23FF] selection:text-[#F3EFE6]">
      <div className="max-w-[420px] w-full bg-[#F3EFE6] border border-[#16140F]/15 p-8 md:p-10 rounded-[18px] shadow-[0_20px_40px_rgba(22,20,15,0.06)] relative">
        
        {/* Top Eyebrow */}
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="w-[34px] h-[1.5px] bg-[#2A23FF]" />
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#2A23FF] font-medium">
            01 · Authentication
          </span>
        </div>

        {/* Header with signature italic-serif turn */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#16140F] text-[#F3EFE6] font-mono font-bold text-base mb-4 shadow-md">
            IG
          </div>
          <h1 className="text-[2.2rem] font-[800] leading-[1.0] tracking-tight text-[#16140F]">
            Sign in, <span className="font-serif italic font-normal text-[#2A23FF]">securely</span>.
          </h1>
          <p className="text-[15px] text-[#4A463C] mt-2.5 leading-[1.55]">
            Access your secure invoice tracker and real-time dashboard.
          </p>
        </div>

        {/* Error message box */}
        {error && (
          <div className="mb-6 p-4 rounded-[8px] bg-[#FF4D2E]/10 border border-[#FF4D2E]/20 text-[14px] text-[#FF4D2E] font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="block font-mono text-[11.5px] tracking-[0.06em] uppercase text-[#4A463C] font-semibold">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#E9E3D4]/50 border border-[#16140F]/15 rounded-[8px] text-[#16140F] placeholder-[#4A463C]/50 focus:outline-none focus:border-[#2A23FF] focus:bg-[#F3EFE6] transition-all text-[16px]"
              placeholder="e.g. name@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-[11.5px] tracking-[0.06em] uppercase text-[#4A463C] font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#E9E3D4]/50 border border-[#16140F]/15 rounded-[8px] text-[#16140F] placeholder-[#4A463C]/50 focus:outline-none focus:border-[#2A23FF] focus:bg-[#F3EFE6] transition-all text-[16px]"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full text-[#F3EFE6] bg-[#16140F] hover:bg-[#2A23FF] font-mono text-[12.5px] tracking-[0.05em] uppercase font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A23FF] disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating…' : 'Sign In'}</span>
              {!loading && <span className="text-sm">→</span>}
            </button>
          </div>

          {/* Link to Register */}
          <div className="text-center pt-4 border-t border-[#16140F]/10 mt-6">
            <p className="text-[14px] text-[#4A463C]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-[#2A23FF] underline underline-offset-[3px] hover:decoration-2">
                Create account
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  )
}