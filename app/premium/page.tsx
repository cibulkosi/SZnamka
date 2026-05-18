
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile } from '@/lib/supabase'

const PADDLE_CLIENT_TOKEN = 'live_7067eb7e1dbaf8568cf7ce6600b'

type Tier = {
  id: 'free' | 'plus' | 'serious'
  priceId: string | null
  name: string
  pricePerMonth: string
  priceTagline: string
  audience: string
  description: string
  features: string[]
  ctaLabel: string
  highlight?: boolean
  badge?: string
}

const TIERS: Tier[] = [
  {
    id: 'free',
    priceId: null,
    name: 'Free',
    pricePerMonth: '0 Kč',
    priceTagline: 'navždy zdarma',
    audience: 'Pro každého, kdo Cosmatch zkouší',
    description: 'Plně použitelný start. Aby aplikace nebyla prázdná a měl jsi kde začít.',
    features: [
      'Neomezené prohlížení profilů',
      '5 lajků a 5 zpráv denně',
      'Základní štítek kompatibility u každého profilu',
      'Tvůj numerologický archetyp',
      'Bezpečnostní vrstva proti botům',
    ],
    ctaLabel: 'Aktuální plán',
  },
  {
    id: 'plus',
    priceId: 'pri_01krneagtvx17vy1yebscmr0a5',
    name: 'Cosmatch+',
    pricePerMonth: '199 Kč',
    priceTagline: 'měsíčně · 499 Kč / 3 měsíce · 1 499 Kč / rok',
    audience: 'Pro ty, co Cosmatch reálně používají',
    description: 'Dostupný standard za 199 Kč měsíčně. Vidíš všechno, ale dělá to za polovinu ceny Tinderu. Roční plán vychází na 125 Kč/měs (sleva 37 %).',
    features: [
      'Neomezené lajky a zprávy',
      'Hloubková personologická analýza',
      'Vidíš, kdo tě lajknul, dřív než ty je',
      'Prioritní zobrazení profilu ve feedu ostatních',
      'Pět filtrů včetně záměru a vzdálenosti',
      'Možnost vrátit poslední pass',
    ],
    ctaLabel: 'Vybrat Cosmatch+',
    highlight: true,
    badge: 'Nejoblíbenější',
  },
  {
    id: 'serious',
    priceId: 'pri_01krnededcj37m5g4bmy5y7zcy',
    name: 'Cosmatch Serious',
    pricePerMonth: '349 Kč',
    priceTagline: 'měsíčně · pro vážný vztah',
    audience: 'Pro 35+ kteří chtějí vědět, s kým mluví',
    description: 'Pro lidi, kteří už zbytečně netratí čas. Povinná ID verifikace každého Serious uživatele — žádné fake profily, žádné kompromisy.',
    features: [
      'Vše z Cosmatch+',
      'Povinná ID verifikace · zelený štítek „Ověřeno“',
      'Vidíš jen ostatní ověřené Serious uživatele',
      'Prémiové filtry: vzdělání, výška, přesný záměr',
      'Prioritní matchmaking s ostatními Serious',
      'Vlastní privátní podpora · odpovídáme do 12 h',
    ],
    ctaLabel: 'Vybrat Serious',
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
    { key: 'discover', href: '/discover', label: 'DISCOVER' },
    { key: 'matches', href: '/matches', label: 'SHODY' },
    { key: 'premium', href: '/premium', label: 'PREMIUM' },
    { key: 'profile', href: '/profile', label: 'PROFIL' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
      <div className="flex max-w-lg mx-auto">
        {items.map(item => (
          <Link key={item.key} href={item.href}
            className={`flex-1 py-4 text-center text-[10px] tracking-[0.15em] uppercase font-medium transition-colors ${
              active === item.key ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`}>
            {item.label}
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

  useEffect(() => {
    (async () => {
      const r = await loadCurrentProfile()
      if (r.kind === 'no-session') { router.push('/login'); return }
      if (r.kind === 'no-profile') { router.push('/register'); return }
      setUser(r.profile)
    })()
  }, [router])

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

  const handleCheckout = async (priceId: string | null, tierId: string) => {
    if (!priceId) return
    if (!paddleReady || !window.Paddle) {
      alert('Platební brána se načítá, zkus to za chvíli.')
      return
    }
    if (!user) return
    setLoading(tierId)
    try {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: user.email },
        customData: { userId: user.id, plan: tierId },
        successUrl: `${window.location.origin}/premium/success`,
        settings: { displayMode: 'overlay', theme: 'light', locale: 'cs' },
      })
    } catch (err) {
      console.error('Paddle checkout error:', err)
      alert('Chyba při otevírání platební brány. Zkus to prosím znovu.')
    } finally { setLoading(null) }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#FAF6F0] pb-32">
      {/* Top */}
      <div className="max-w-3xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/discover" className="text-sm text-gray-500 hover:text-gray-900 transition">← Zpět na Discover</Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12">

        {user.premium && (
          <div className="border border-pink-200 bg-pink-50 rounded-3xl p-6 mb-12">
            <p className="eyebrow text-pink-500 mb-2">Aktivní předplatné</p>
            <h2 className="serif text-xl text-gray-900 font-medium leading-tight mb-1">Jsi prémiový člen.</h2>
            <p className="text-gray-600 leading-relaxed text-sm">Děkujeme, že podporuješ český produkt.</p>
          </div>
        )}

        {/* Masthead */}
        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Předplatné</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Tři úrovně.<br/><em className="italic text-pink-500">Žádné triky</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Cosmatch nefinancuje žádný inzerent. Žije z toho, že ho používáš.
            Free verze je plně použitelná. Placené tarify ti dají rychlejší cestu
            ke kvalitnímu vztahu — ne lepší pozici v algoritmu.
          </p>
        </header>

        {/* Price summary — pro GoPay reviewer + uživatele */}
        <section className="mb-12 bg-white border border-gray-200 rounded-3xl p-8" id="ceny">
          <p className="eyebrow text-pink-500 mb-3">Cosmatch+ ceník</p>
          <h2 className="serif-display text-2xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Jedna služba, tři způsoby platby.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Měsíčně</p>
              <p className="serif-display text-3xl text-gray-900 font-medium tabular-nums">199 Kč</p>
              <p className="text-xs text-gray-500 mt-1">obnovení každých 30 dní</p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">3 měsíce</p>
              <p className="serif-display text-3xl text-gray-900 font-medium tabular-nums">499 Kč</p>
              <p className="text-xs text-emerald-600 mt-1">166 Kč/měs · sleva 16 %</p>
            </div>
            <div className="border border-pink-200 bg-pink-50 rounded-2xl p-5">
              <p className="text-xs text-pink-600 uppercase tracking-wider mb-1">Ročně</p>
              <p className="serif-display text-3xl text-gray-900 font-medium tabular-nums">1 499 Kč</p>
              <p className="text-xs text-pink-600 mt-1">125 Kč/měs · sleva 37 %</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Ceny včetně DPH (digitální služba dle § 54 ZDPH osvobozená). Platby zpracovává GoPay s.r.o.
            Předplatné se obnovuje automaticky, zrušení kdykoli v profilu bez sankce. Více v <a href="/opakovane-platby" className="text-pink-500 underline">Opakované platby</a>.
          </p>
        </section>

        {/* Tiers */}
        <section className="space-y-6 mb-20">
          {TIERS.map(tier => {
            const isCurrent = (tier.id === 'free' && !user.premium) || (tier.id !== 'free' && user.premium)
            return (
              <div key={tier.id}
                className={`rounded-3xl p-8 sm:p-10 border transition-all ${
                  tier.highlight
                    ? 'bg-white border-gray-900 shadow-md'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                  <div>
                    {tier.badge && (
                      <span className="inline-block eyebrow text-pink-500 mb-3">{tier.badge}</span>
                    )}
                    <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-2">
                      {tier.name}
                    </h2>
                    <p className="text-sm text-gray-500 italic">{tier.audience}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="serif-display text-4xl sm:text-5xl text-gray-900 font-medium tracking-tight tabular-nums">
                      {tier.pricePerMonth}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{tier.priceTagline}</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-8">
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-4 text-gray-700 text-[0.95rem] leading-relaxed">
                      <span className="text-pink-500 mt-2 flex-shrink-0 w-1 h-1 rounded-full bg-pink-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {tier.id === 'free' ? (
                  <button disabled
                    className="w-full bg-gray-100 text-gray-500 py-5 rounded-full text-base font-medium cursor-default">
                    {isCurrent ? 'Tvůj aktuální plán' : 'Free plán'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckout(tier.priceId, tier.id)}
                    disabled={!!loading || isCurrent}
                    className={`w-full py-5 rounded-full text-base font-medium transition-all active:scale-[0.99] disabled:cursor-not-allowed ${
                      tier.highlight
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white border border-gray-300 hover:border-gray-900 text-gray-900'
                    } ${(loading || isCurrent) ? 'opacity-60' : ''}`}
                  >
                    {loading === tier.id ? 'Otevírám platbu…' : isCurrent ? 'Aktivní' : tier.ctaLabel}
                  </button>
                )}
              </div>
            )
          })}
        </section>

        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-20">
          <p className="eyebrow text-emerald-600 mb-3">Důležité k Cosmatch Serious</p>
          <h3 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
            Ověření je povinné.
          </h3>
          <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-3">
            Hned po platbě tě nasměrujeme na rychlé ID ověření (občanský průkaz + selfie,
            zabere 2 minuty). Bez něj nezískáš zelený štítek ani neuvidíš ostatní ověřené.
          </p>
          <p className="text-sm text-gray-600 italic">
            Pokud ověření neuděláš do 7 dnů, peníze ti vrátíme zpět — bez ptaní.
          </p>
        </div>

        {/* Co je v ceně, co není */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Co Cosmatch nedělá</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Čtyři věci, které u nás <em className="italic text-pink-500">nikdy</em> neuvidíš.
          </h2>

          <div className="space-y-8">
            {[
              ['Placené pozice v algoritmu','Vzorec si můžeš přepočítat. Placené předplatné mění tvé možnosti, ne tvoji viditelnost ostatním.'],
              ['Skryté předplatné','Zrušíš jedním klikem v profilu. Žádný telefonát, žádné formuláře.'],
              ['Reklamy','Cosmatch financují uživatelé, ne inzerenti. Tvoje pozornost není zboží.'],
              ['Prodej dat','Tvoje datum narození nikdo neuvidí mimo Cosmatch. Žádné reklamní sítě, žádní brokeri.'],
            ].map(([t, b]) => (
              <div key={t} className="grid grid-cols-[auto,1fr] gap-x-6 border-b border-gray-200 pb-8 last:border-b-0">
                <span className="text-pink-500 text-2xl leading-none pt-0.5">·</span>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-2">{t}</h3>
                  <p className="text-gray-600 leading-relaxed">{b}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Časté otázky</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Co se nejčastěji ptáte.
          </h2>

          <div className="space-y-8">
            {[
              ['Mohu předplatné kdykoli zrušit?','Ano. Zrušení je v profilu jedním klikem. Zbývající dny ti zůstanou aktivní.'],
              ['Jak se platí?','Platbu zpracovává GoPay — česká platební instituce regulovaná ČNB. Přijímá Visa, Mastercard, Apple Pay i Google Pay. Faktura ti přijde automaticky e-mailem.'],
              ['Co se stane, když přejdu z Plus na Serious?','Doplatíš jen rozdíl za zbývající dny. Automaticky se zapne ID verifikace.'],
              ['Vrátíte mi peníze, když to nebude fungovat?','Do 14 dnů ano, bez vysvětlení. Po 14 dnech vyhodnocujeme případ od případu.'],
              ['Můžu platit ročně nebo kvartálně?','Ano — měsíčně 199 Kč, kvartálně 499 Kč (sleva 16 %, efektivně 166 Kč/měs), ročně 1 499 Kč (sleva 37 %, efektivně 125 Kč/měs). Pokud najdeš někoho dřív, zbývající dny ti zůstanou nebo můžeš požádat o vrácení alikvotní části.'],
            ].map(([q, a]) => (
              <details key={q as string} className="border-b border-gray-200 pb-8 last:border-b-0 group" open>
                <summary className="serif text-xl text-gray-900 font-medium leading-tight mb-3 cursor-pointer list-none">
                  {q}
                </summary>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer trust */}
        <footer className="border-t border-gray-200 pt-12">
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Cosmatch je financován výhradně předplatným uživatelů. Platby zpracovává GoPay
            (česká platební instituce regulovaná ČNB). Tvoje datum narození používáme jen
            k výpočtu kompatibility — nikdy ho neprodáme.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            <strong className="text-gray-700 font-medium">18+</strong> · Cosmatch je seznamovací služba určená výhradně osobám starším 18 let.
            Předplatné se obnovuje automaticky, můžeš ho kdykoli zrušit v <a href="/profile" className="underline hover:text-gray-700">profilu</a>.
            Detaily viz <a href="/opakovane-platby" className="underline hover:text-gray-700">Opakované platby</a> a <a href="/obchodni-podminky" className="underline hover:text-gray-700">Obchodní podmínky</a>.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/manifest-duvery" className="text-pink-500 hover:text-pink-600 transition">Manifest důvěry →</Link>
            <Link href="/verifikace" className="text-gray-500 hover:text-gray-900 transition">Jak ověřujeme profily</Link>
          </div>
        </footer>
      </div>

      <BottomNav active="premium" />
    </main>
  )
}
