import type { Metadata } from 'next'
import Link from 'next/link'
import { DEMO_PROFILES } from '@/lib/demoProfiles'

export const metadata: Metadata = {
  title: 'Demo profily — Cosmatch',
  description: 'Šest ukázkových profilů Cosmatch — jak vypadá kompatibilita podle data narození. Skutečné profily přibývají s otevřením v Praze.',
  robots: { index: false, follow: true },
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Spřízněné duše': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Láska a přátelství': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Osudová přitažlivost': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Magnetická tenze': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Prospěšný vztah': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      {/* Top */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        {/* Masthead */}
        <header className="mb-16">
          <p className="eyebrow mb-6 text-pink-500">Demo profily</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Šest lidí.<br />Šest <em className="italic text-pink-500">příběhů</em>.
          </h1>
          <hr className="rule w-16 border-gray-900 mb-8" />
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            Toto jsou ukázkové profily Cosmatch. Klikni na kterýkoli z nich a uvidíš, jak vypadá detail —
            fotky, hlášky, hlasová zpráva i tvoje shoda. Skutečné profily přibývají s otevřením betas v Praze.
          </p>
        </header>

        {/* Demo profile cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          {DEMO_PROFILES.map((p, idx) => {
            const cat = categoryColors[p.matchCategory] || categoryColors['Spřízněné duše']
            return (
              <Link
                key={p.id}
                href={`/demo/${p.id}`}
                className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all"
              >
                {/* Hero photo */}
                <div className="relative bg-gray-100" style={{ aspectRatio: '4/5' }}>
                  <img
                    src={p.photos[0]}
                    alt={`${p.name} - demo profil`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                  />
                  {p.verified && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs text-emerald-700 bg-white/95 px-2 py-1 rounded-full font-medium shadow-sm">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                      Ověřeno
                    </span>
                  )}
                  <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded-full shadow-sm">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Profil {String(idx + 1).padStart(2, '0')}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h2 className="serif text-xl text-gray-900 font-medium">{p.name}, {p.age}</h2>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{p.city} · {p.zodiac} · {p.occupation}</p>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">{p.bio}</p>

                  {/* Score + category */}
                  <div className={`-mx-1 px-4 py-3 rounded-2xl ${cat.bg} ${cat.border} border flex items-center justify-between`}>
                    <div>
                      <p className={`text-[10px] uppercase tracking-wider ${cat.text} font-medium`}>Kompatibilita</p>
                      <p className={`text-sm ${cat.text} font-medium`}>{p.matchCategory}</p>
                    </div>
                    <div className="text-right">
                      <p className="serif-display text-2xl text-gray-900 font-medium tabular-nums leading-none">{p.score}</p>
                      <p className="text-[10px] text-gray-500">% shody</p>
                    </div>
                  </div>

                  <p className="text-xs text-pink-600 mt-4 font-medium">Otevřít profil →</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10 mb-12 text-center">
          <p className="eyebrow text-pink-500 mb-4">Tvoji shodu uvidíš přímo</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            <em className="italic text-pink-500">Cosmatch</em> spočítá tvoji shodu.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
            Zjisti svůj numerologický archetyp za 30 sekund, přidej se na waitlist a získej voucher na 3 měsíce zdarma.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
              Spustit kvíz
            </Link>
            <Link href="/waitlist" className="inline-flex items-center justify-center text-gray-900 border border-gray-300 hover:border-gray-900 px-8 py-4 rounded-full text-base font-medium transition">
              Přidat se na waitlist
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed">
          Jména, fotky a data zde uvedená jsou ilustrativní — slouží jen pro představu o Cosmatch.
          Reálné profily nikdy nebudou vymyšlené. Fotky pochází z Unsplash a slouží jako placeholdery.
        </p>
      </article>
    </main>
  )
}
