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

  const handleGoogleSSO = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback` },
    })
  }

  const handleFacebookSSO = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-pink-500 text-2xl font-bold">✦</span>
        <span className="text-xl font-bold text-gray-900">Cosmatch</span>
      </Link>
      <div className="card w-full max-w-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Přihlásit se</h2>

        {/* SSO tlačítka */}
        <div className="space-y-3 mb-5">
          <button
            onClick={handleGoogleSSO}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Přihlásit přes Google
          </button>
          <button
            onClick={handleFacebookSSO}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white hover:border-blue-200 hover:bg-blue-50 transition-all font-medium text-gray-700"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Přihlásit přes Facebook
          </button>
        </div>

        {/* Oddělovač */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400 text-xs">nebo e-mailem</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

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
