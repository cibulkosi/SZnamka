'use client'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
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
    <main className="min-h-screen bg-[#FAF6F0] flex flex-col">
      {/* Top bar */}
      <div className="max-w-md mx-auto w-full px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Cosmatch
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="eyebrow text-pink-500 mb-6">Vítej zpátky</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Pokračuj tam,<br/>kde jsi <em className="italic text-pink-500">přestal/a</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-10" />

          <div className="space-y-3">
            <button
              onClick={handleGoogleSSO}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white border border-gray-200 hover:border-gray-900 rounded-full text-base font-medium text-gray-900 transition-all active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Pokračovat přes Google
            </button>

            <button
              onClick={handleFacebookSSO}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white border border-gray-200 hover:border-gray-900 rounded-full text-base font-medium text-gray-900 transition-all active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Pokračovat přes Facebook
            </button>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed text-center mt-8">
            Přihlášením souhlasíš s našimi
            {' '}<Link href="/manifest-duvery" className="underline hover:text-gray-700">podmínkami důvěry</Link>.
          </p>

          <hr className="rule my-10" />

          <p className="text-center text-sm text-gray-500">
            Ještě nemáš účet?{' '}
            <Link href="/register" className="text-pink-500 hover:text-pink-600 font-medium">
              Registrace zdarma →
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
