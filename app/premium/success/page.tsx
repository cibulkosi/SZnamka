'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { supabase, loadCurrentProfile } from '@/lib/supabase'

export default function PremiumSuccessPage() {
  // GoPay webhook nastaví premium asynchronně — refreshni profil z DB
  useEffect(() => {
    const refreshUser = async () => {
      const r = await loadCurrentProfile()
      if (r.kind !== 'ok') return
      const u = r.profile
      const { data } = await supabase
        .from('profiles')
        .select('premium')
        .eq('id', u.id)
        .single()
      if (data?.premium) {
        try { localStorage.setItem('cosmatch_user', JSON.stringify({ ...u, premium: true })) } catch {}
      }
    }
    const t = setTimeout(refreshUser, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="eyebrow text-pink-500 mb-6">Platba úspěšná</p>
        <h1 className="serif-display text-5xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
          Vítej v <em className="italic text-pink-500">Cosmatch+</em>.
        </h1>
        <hr className="rule w-12 border-gray-900 mx-auto mb-8" />
        <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-12">
          Platba proběhla úspěšně. Tvůj prémiový přístup je aktivní během pár sekund.
          Fakturu pošle GoPay na tvůj e-mail.
        </p>
        <Link href="/discover"
          className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-5 rounded-full text-base font-medium hover:bg-gray-800 transition">
          Začít prohlížet profily
        </Link>
      </div>
    </main>
  )
}
