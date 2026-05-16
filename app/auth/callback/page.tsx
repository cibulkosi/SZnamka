'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session?.user) {
        router.push('/login?error=oauth')
        return
      }

      const user = session.user
      const email = user.email || ''
      const name = user.user_metadata?.full_name || user.user_metadata?.name || ''

      // Zkontroluj, jestli profil již existuje
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (profile) {
        localStorage.setItem('cosmatch_user', JSON.stringify(profile))
        router.push('/discover')
      } else {
        // Nový uživatel — předvyplnit registraci z OAuth dat
        localStorage.setItem('cosmatch_oauth', JSON.stringify({ name, email }))
        router.push('/register')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🪐</div>
        <p className="text-gray-500 text-sm">Přihlašujeme tě...</p>
      </div>
    </div>
  )
}
