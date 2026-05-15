'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function PremiumSuccessPage() {
  // Paddle webhook nastaví premium asynchronně — refreshni profil z DB
  useEffect(() => {
    const refreshUser = async () => {
      const raw = localStorage.getItem('cosmatch_user')
      if (!raw) return
      const u = JSON.parse(raw)
      const { data } = await supabase
        .from('profiles')
        .select('premium')
        .eq('id', u.id)
        .single()
      if (data?.premium) {
        localStorage.setItem('cosmatch_user', JSON.stringify({ ...u, premium: true }))
      }
    }
    // Počkej chvíli než webhook dorazí a DB se aktualizuje
    const t = setTimeout(refreshUser, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="card max-w-sm w-full p-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vítej v Premium!</h1>
        <p className="text-gray-500 mb-6">
          Platba proběhla úspěšně. Tvůj Premium přístup bude aktivní do pár sekund.
        </p>
        <Link
          href="/discover"
          className="btn-primary w-full text-center inline-block"
        >
          Začít procházet ✨
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Fakturu ti pošle Paddle na tvůj email.
        </p>
      </div>
    </div>
  )
}
