import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // ==========================================
  // FLAW 07 INTRODUCED: Missing Production Env Fallback
  // ==========================================
  // VULNERABILITY: Agar production (jaise Vercel) par env variables missing hon,
  // toh code invalid placeholder URLs use karega. Is se build to pass ho jayegi,
  // lekin runtime par saari database requests chup-chaap fail ho jayengi!
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://broken-placeholder-url.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'invalid_missing_anon_key_999'
  // ==========================================

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}