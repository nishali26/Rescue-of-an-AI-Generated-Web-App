import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // ==========================================
  // FIXED: Flaw 07 (Strict Environment Variable Validation)
  // ==========================================
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Agar production mein env variables missing hain, toh silent failure ki bajaye 
  // foran explicit error throw ho ga taake configuration issue foran pata chal jaye.
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY).')
  }
  // ==========================================

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}