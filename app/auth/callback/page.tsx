'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isDisposableEmail } from '@/lib/disposableEmails'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // ── Auth refactor: profile is now keyed by auth.user.id (not email) ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event !== 'SIGNED_IN' || !session?.user) return
        await handleSignedIn(session.user)
        subscription.unsubscribe()
      }
    )

    // Fallback for OAuth callbacks where onAuthStateChange may not fire
    const timeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await handleSignedIn(session.user)
      } else {
        router.push('/login?error=oauth')
      }
      subscription.unsubscribe()
    }, 5000)

    async function handleSignedIn(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
      const email = user.email || ''

      // Block disposable emails
      if (email && isDisposableEmail(email)) {
        await supabase.auth.signOut()
        router.push('/login?error=disposable_email')
        return
      }

      const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || ''

      // Profile is keyed by auth.user.id — look it up
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        // Existing user — cache profile, go to discover
        try { localStorage.setItem('cosmatch_user', JSON.stringify(profile)) } catch {}
        router.push('/discover')
      } else {
        // New user — prefill name/email for register flow
        try { localStorage.setItem('cosmatch_oauth', JSON.stringify({ name, email })) } catch {}
        router.push('/register')
      }
    }

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Přihlašujeme tě…</p>
    </main>
  )
}
