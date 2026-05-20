
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile } from '@/lib/supabase'

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
    description: 'Plně použitelný start. Aby aplikace nebyla prázdná a měl/a jsi kde začít.',
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
    priceId: null,
    name: 'Cosmatch+',
    pricePerMonth: '249 Kč',
    priceTagline: 'měsíčně · 597 Kč / 3 měsíce · 2 088 Kč / rok',
    audience: 'Pro ty, co Cosmatch reálně používají',
    description: 'Dostupný standard za 249 Kč měsíčně. Vidíš všechno, ale o 36 % levněji než Tinder Gold. Roční plán 2 088 Kč — sleva 30 %.',
    features: [
      'Neomezené lajky a zprávy',
      'Hloubková analýza podle data narození',
      'Vidíš, kdo tě lajknul, dřív než ty je',
      'Prioritní zobrazení profilu ve feedu ostatních',
      'Pět filtrů včetně záměru a vzdálenosti',
      'Možnost vrátit poslední pass',
    ],
    ctaLabel: 'Vybrat Cosmatch+',
    highlight: true,
    badge: 'Nejoblíbenější',
  },
  // Druhá placená úroveň (s ID verifikací) — bude přidána po dosažení 1 000+ platících
  // ID verifikace + green badge přijde s ním
]

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
  const [user, setUser] = useState<{ id: string; email: string; name: string; premium: boolean; premium_until?: string | null; premium_source?: string | null } | null>(null)

  useEffect(() => {
    (async () => {
      const r = await loadCurrentProfile()
      if (r.kind === 'no-session') { router.push('/login'); return }
      if (r.kind === 'no-profile') { router.push('/register'); return }
      setUser(r.profile)
    })()
  }, [router])



  // Předplatné Cosmatch+ se kupuje výhradně v mobilní aplikaci pro iOS / Android.
  // Web na cosmatch.cz prozatím slouží jen pro registraci a prohlížení; platby
  // probíhají přes Apple App Store / Google Play (in-app purchase).
  // Mobilní aplikace se připravuje — viz roadmap.

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

        {/* Price summary — pro reviewera + uživatele */}
        <section className="mb-12 bg-white border border-gray-200 rounded-3xl p-8" id="ceny">
          <p className="eyebrow text-pink-500 mb-3">Ceník Cosmatch+</p>
          <h2 className="serif-display text-2xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Jedna služba, tři způsoby platby.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Měsíčně</p>
              <p className="serif-display text-3xl text-gray-900 font-medium tabular-nums">249 Kč</p>
              <p className="text-xs text-gray-500 mt-1">obnovení každých 30 dní</p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">3 měsíce</p>
              <p className="serif-display text-3xl text-gray-900 font-medium tabular-nums">597 Kč</p>
              <p className="text-xs text-emerald-600 mt-1">Sleva 20 %</p>
            </div>
            <div className="border border-pink-200 bg-pink-50 rounded-2xl p-5">
              <p className="text-xs text-pink-600 uppercase tracking-wider mb-1">Ročně</p>
              <p className="serif-display text-3xl text-gray-900 font-medium tabular-nums">2 088 Kč</p>
              <p className="text-xs text-pink-600 mt-1">Sleva 30 %</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Ceny včetně DPH (digitální služba dle § 54 ZDPH osvobozená). Předplatné se obnovuje automaticky,
            zrušení kdykoli v profilu bez sankce. Více v <a href="/opakovane-platby" className="text-pink-500 underline">Opakované platby</a>.
          </p>
        </section>

        {/* Akce pro zakládajících 2 000 ověřených uživatelů */}
        <section className="mb-12 bg-pink-50 border border-pink-200 rounded-3xl p-8">
          <p className="eyebrow text-pink-600 mb-3">Spouštěcí akce · pro všechny zakládající</p>
          <h2 className="serif-display text-2xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Zakládající členové dostávají Cosmatch+ <em className="italic text-pink-500">zdarma</em>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="border border-pink-200 bg-white rounded-2xl p-5">
              <p className="text-xs text-pink-600 uppercase tracking-wider mb-1">Prvních 500 ověřených</p>
              <p className="serif-display text-3xl text-gray-900 font-medium">6 měsíců zdarma</p>
              <p className="text-xs text-gray-500 mt-2">Po ověření profilu (jméno, fotka, e‑mail).</p>
            </div>
            <div className="border border-pink-200 bg-white rounded-2xl p-5">
              <p className="text-xs text-pink-600 uppercase tracking-wider mb-1">Dalších 1 500 ověřených</p>
              <p className="serif-display text-3xl text-gray-900 font-medium">3 měsíce zdarma</p>
              <p className="text-xs text-gray-500 mt-2">Po ověření profilu (jméno, fotka, e‑mail).</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Akce platí pro všechny ověřené uživatele bez ohledu na pohlaví, věk nebo jiné charakteristiky. Po vyčerpání 2 000 pozic se akce automaticky zavře. Kdokoli může získat voucher bez ohledu na pohlaví.
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
                ) : isCurrent ? (
                  <button disabled
                    className="w-full bg-gray-100 text-gray-500 py-5 rounded-full text-base font-medium cursor-default">
                    Aktivní
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="w-full py-5 px-6 rounded-3xl bg-pink-50 border border-pink-200 text-center">
                      <p className="text-sm font-medium text-pink-900 mb-1">Brzy v App Store a Google Play</p>
                      <p className="text-xs text-pink-700 leading-relaxed">
                        Cosmatch+ koupíš výhradně v mobilní aplikaci. Připravujeme ji.
                      </p>
                    </div>
                    <Link href="/waitlist"
                      className="block w-full text-center py-4 rounded-full text-base font-medium bg-gray-900 text-white hover:bg-gray-800 transition">
                      Být první v aplikaci
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </section>
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
              ['Jak se platí?','Cosmatch+ se kupuje v mobilní aplikaci pro iOS (Apple App Store) nebo Android (Google Play). Platí Apple, respektive Google — Visa, Mastercard, Apple Pay, Google Pay. DPH ve tvojí zemi se vybere a odvede automaticky.'],
              ['Vrátíte mi peníze, když to nebude fungovat?','Do 14 dnů ano, bez vysvětlení. Po 14 dnech vyhodnocujeme případ od případu.'],
              ['Můžu platit ročně nebo kvartálně?','Ano — Cosmatch+ má tři plány: měsíčně 249 Kč, kvartálně 597 Kč (sleva 20 %), ročně 2 088 Kč (sleva 30 %). Pokud najdeš někoho dřív, zbývající dny ti zůstanou aktivní nebo můžeš požádat o vrácení alikvotní části.'],
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
            Cosmatch je financován výhradně předplatným uživatelů přes mobilní aplikaci. Platby zpracovává Apple App Store / Google Play, DPH ve tvojí zemi se vybere a odvede automaticky.
            Tvoje datum narození používáme jen k výpočtu kompatibility — nikdy ho neprodáme.
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
