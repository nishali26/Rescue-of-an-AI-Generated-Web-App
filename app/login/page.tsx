'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  // 1. States declare kar rahe hain user input aur loading/error ke liye
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // 2. Login button dabane par yeh function chalega
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Page ko refresh hone se rokta hai
    setLoading(true)
    setError(null)

    // Supabase se check karwa rahe hain ke email/password theek hain ya nahi
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message) // Agar galti hui toh error dikhao
      setLoading(false)
    } else {
      // Agar login successful ho gaya, toh dashboard par bhej do
      router.push('/dashboard')
      router.refresh()
    }
  }