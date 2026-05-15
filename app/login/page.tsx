'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const { data: profile, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (err || !profile) {
        setError('Profil nenalezen. Zkontroluj e-mail nebo se zaregistruj.')
        return
      }
      localStorage.setItem('cosmatch_user', JSON.stringify(profile))
      router.push('/discover')
    } catch {
      setError('Chyba při přihlášení.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-pink-500 text-2xl font-bold">✦</span>
        <span className="text-xl font-bold text-gray-900">Cosmatch</span>
      </Link>
      <div className="card w-full max-w-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Přihlásit se</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-500 text-sm mb-1 block">E-mail</label>
            <input className="input" type="email" placeholder="email@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-3 rounded-2xl">{error}</p>}
          <button className="btn-primary w-full" onClick={handleLogin} disabled={loading}>
            {loading ? '⏳ Přihlašuji...' : 'Přihlásit se'}
          </button>
          <p className="text-center text-gray-400 text-sm">
            Nemáš účet?{' '}
            <Link href="/register" className="text-pink-500 hover:text-pink-600 font-semibold">Registrovat se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
