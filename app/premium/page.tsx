'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Paddle client-side token + price IDs
const PADDLE_CLIENT_TOKEN = 'live_7067eb7e1dbaf8568cf7ce6600b'
const PLANS = [
  {
    id: 'monthly',
    priceId: 'pri_01krneagtvx17vy1yebscmr0a5',
    name: 'Měsíční',
    price: '299 Kč',
    period: '/ měsíc',
    badge: null,
    features: ['Neomezený přístup ke všem profilům', 'Pokročilé filtry kompatibility', 'Vidíš kdo tě lajknul'],
  },
  {
    id: 'quarterly',
    priceId: 'pri_01krnededcj37m5g4bmy5y7zcy',
    name: 'Čtvrtletní',
    price: '747 Kč',
    period: '/ 3 měsíce',
    badge: 'NEJOBLÍBENĚJŠÍ',
    subtext: '249 Kč/měs — ušetříš 150 Kč',
    features: ['Neomezený přístup ke všem profilům', 'Pokročilé filtry kompatibility', 'Vidíš kdo tě lajknul', 'Personologický profil celý'],
  },
  {
    id: 'annual',
    priceId: 'pri_01krneexhsqjx4t16vt6aje0qq',
    name: 'Roční',
    price: '1 988 Kč',
    period: '/ rok',
    badge: 'NEJLEPŠÍ HODNOTA',
    subtext: '166 Kč/měs — ušetříš 600 Kč',
    features: ['Neomezený přístup ke všem profilům', 'Pokročilé filtry kompatibility', 'Vidíš kdo tě lajknul', 'Personologický profil celý', 'Prioritní podpora'],
  },
]

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle: any
  }
}

function BottomNav({ active }: { active: string }) {
  const items = [
    { key: 'discover', href: '/discover', label: 'DISCOVER', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    )},
    { key: 'matches', href: '/matches', label: 'SHODY', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { key: 'premium', href: '/premium', label: 'PREMIUM', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )},
    { key: 'profile', href: '/profile', label: 'PROFIL', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
      <div className="flex max-w-lg mx-auto">
        {items.map(item => (
          <Link key={item.key} href={item.href}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors ${
              active === item.key ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default function PremiumPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string; name: string; premium: boolean } | null>(null)
  const [paddleReady, setPaddleReady] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  // Načti uživatele
  useEffect(() => {
    const raw = localStorage.getItem('cosmatch_user')
    if (!raw) { router.push('/login'); return }
    setUser(JSON.parse(raw))
  }, [router])

  // Načti Paddle.js
  useEffect(() => {
    const existing = document.getElementById('paddle-js')
    if (existing) { setPaddleReady(true); return }

    const script = document.createElement('script')
    script.id = 'paddle-js'
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN })
        setPaddleReady(true)
      }
    }
    document.head.appendChild(script)
  }, [])

  const handleCheckout = async (priceId: string, planId: string) => {
    if (!paddleReady || !window.Paddle) {
      alert('Paddle se načítá, zkus to za chvíli.')
      return
    }
    if (!user) return
    setLoading(planId)

    try {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: user.email },
        customData: { userId: user.id, plan: planId },
        successUrl: `${window.location.origin}/premium/success`,
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'cs',
        },
      })
    } catch (err) {
      console.error('Paddle checkout error:', err)
      alert('Chyba při otevírání platební brány. Zkus to prosím znovu.')
    } finally {
      setLoading(null)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <Link href="/discover" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🪐</span>
            <span className="font-bold text-gray-900">Cosmatch Premium</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Premium badge */}
        {user.premium && (
          <div className="card p-4 mb-6 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="font-semibold text-pink-700">Jsi Premium člen/ka!</p>
            <p className="text-sm text-gray-500 mt-1">Těšíš se z plného přístupu ke všem funkcím.</p>
          </div>
        )}

        {/* Hero text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-1.5 text-pink-600 text-sm font-medium mb-4">
            ✨ Odemkni plný potenciál
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Najdi svůj dokonalý match
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium ti dá přístup ke všem profilům, pokročilým filtrům a uvidíš kdo tě lajknul dřív, než ty je.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="flex flex-col gap-4 mb-8">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`card p-5 relative transition-all ${
                plan.badge === 'NEJOBLÍBENĚJŠÍ'
                  ? 'border-pink-300 ring-2 ring-pink-200 shadow-md'
                  : plan.badge === 'NEJLEPŠÍ HODNOTA'
                  ? 'border-purple-200'
                  : ''
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
                  plan.badge === 'NEJOBLÍBENĚJŠÍ'
                    ? 'bg-pink-500 text-white'
                    : 'bg-purple-500 text-white'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{plan.name}</h2>
                  {plan.subtext && (
                    <p className="text-xs text-pink-600 font-medium mt-0.5">{plan.subtext}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-pink-500 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.priceId, plan.id)}
                disabled={!!loading || user.premium}
                className={`w-full font-semibold py-3 px-6 rounded-2xl transition-all duration-200 ${
                  plan.badge === 'NEJOBLÍBENĚJŠÍ'
                    ? 'btn-primary'
                    : 'btn-secondary border border-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id
                  ? '⌛ Otevírám...'
                  : user.premium
                  ? 'Aktivní'
                  : 'Vybrat plán'}
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: '🔒', text: 'Bezpečná platba' },
            { icon: '↩️', text: 'Zrušení kdykoliv' },
            { icon: '🇪🇺', text: 'EU faktura s DPH' },
          ].map((b, i) => (
            <div key={i} className="text-center">
              <div className="text-xl mb-1">{b.icon}</div>
              <p className="text-xs text-gray-500">{b.text}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Časté otázky</h3>
          <div className="space-y-4">
            {[
              { q: 'Mohu předplatné kdykoli zrušit?', a: 'Ano, předplatné zrušíš kdykoliv ve svém účtu. Zbývající dny ti zůstanou aktivní.' },
              { q: 'Jak se platí?', a: 'Platbu zpracovává Paddle — přijímají karty Visa, Mastercard, i Apple/Google Pay.' },
              { q: 'Dostanu fakturu?', a: 'Paddle automaticky vystaví fakturu s DPH dle EU pravidel a pošle ji na tvůj email.' },
            ].map((faq, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-gray-800">{faq.q}</p>
                <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav active="premium" />
    </div>
  )
}
