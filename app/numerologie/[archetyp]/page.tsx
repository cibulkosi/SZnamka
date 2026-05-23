import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARCHETYPES, BARNUM_DISCLOSURE } from '@/lib/archetypes'

const SLUG_TO_LP: Record<string, number> = {
  'prukopnik': 1, 'smiritel': 2, 'tvurce': 3, 'stavitel': 4,
  'dobrodruh': 5, 'pecovatel': 6, 'hledac': 7, 'vladar': 8,
  'humanista': 9, 'osvetitel': 11, 'stavitel-snu': 22, 'lecitel': 33,
}

type Props = { params: Promise<{ archetyp: string }> }

export async function generateStaticParams() {
  return Object.keys(SLUG_TO_LP).map(slug => ({ archetyp: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { archetyp } = await params
  const lp = SLUG_TO_LP[archetyp]
  if (!lp || !ARCHETYPES[lp]) return { title: 'Archetyp | Cosmatch' }

  const a = ARCHETYPES[lp]
  const TITLE = `${a.name} — Životní číslo ${lp} | Cosmatch`
  const DESC = `${a.tagline} ${a.description?.slice(0, 120)}...`
  const URL = `https://cosmatch.cz/numerologie/${archetyp}`

  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
    openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  }
}

export default async function ArchetypePage({ params }: Props) {
  const { archetyp } = await params
  const lp = SLUG_TO_LP[archetyp]
  if (!lp || !ARCHETYPES[lp]) notFound()

  const a = ARCHETYPES[lp]
  const accent = a.accent

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${a.name} — Životní číslo ${lp}`,
    description: a.description,
    author: { '@type': 'Organization', name: 'Cosmatch' },
    publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
    inLanguage: 'cs-CZ',
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/numerologie" className="text-sm text-gray-500 hover:text-gray-900 transition">← Numerologie</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-16">
          <p className="eyebrow mb-6" style={{ color: accent }}>Životní číslo {lp}</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-4">
            <em className="italic" style={{ color: accent }}>{a.name}</em>
          </h1>
          <p className="text-lg text-gray-500 mb-8">{a.tagline}</p>
          <hr className="rule w-12 mb-8" style={{ borderColor: accent }} />
        </header>

        {/* MIRROR — visible to all */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Zrcadlo (Mirror)</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Kdo jsi v jádru.
          </h2>
          <div className="prose prose-gray max-w-none">
            {(a.mirror || a.description).split('\n\n').map((para: string, i: number) => (
              <p key={i} className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">{para}</p>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* SHADOW — visible to all (transparentní, honest) */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Stín (Shadow)</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Tvoje slepá místa.
          </h2>
          <p className="text-sm text-gray-500 italic mb-6">
            Honest pohled na výzvy, pasti a slepá místa. Cosmatch nepředstírá, že Tvoje energie je jen pozitivní — všichni máme stín.
          </p>
          <div className="prose prose-gray max-w-none">
            {(a.shadowExtended || a.shadow).split('\n\n').map((para: string, i: number) => (
              <p key={i} className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">{para}</p>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* IN LOVE — visible to all */}
        <section className="mb-16">
          <p className="eyebrow mb-4" style={{ color: accent }}>V lásce</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Jak miluješ a co potřebuješ.
          </h2>
          <div className="prose prose-gray max-w-none">
            {(a.inLove || a.love).split('\n\n').map((para: string, i: number) => (
              <p key={i} className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">{para}</p>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Compatibility tiers */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Kompatibilita</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            S kým funguješ.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5">
              <p className="text-xs text-emerald-700 uppercase tracking-wider mb-2">Tier 1 · Harmonie</p>
              <p className="serif text-lg text-gray-900 font-medium mb-1">{a.tier1?.join(', ') || '—'}</p>
              <p className="text-xs text-gray-500 mt-2">Přirozené souznění.</p>
            </div>
            <div className="border border-amber-200 bg-amber-50 rounded-2xl p-5">
              <p className="text-xs text-amber-700 uppercase tracking-wider mb-2">Tier 2 · Růst</p>
              <p className="serif text-lg text-gray-900 font-medium mb-1">{a.tier2?.join(', ') || '—'}</p>
              <p className="text-xs text-gray-500 mt-2">Vyžaduje vědomou práci, ale velký potenciál.</p>
            </div>
            <div className="border border-pink-200 bg-pink-50 rounded-2xl p-5">
              <p className="text-xs text-pink-700 uppercase tracking-wider mb-2">Tier 3 · Tření</p>
              <p className="serif text-lg text-gray-900 font-medium mb-1">{a.tier3?.join(', ') || '—'}</p>
              <p className="text-xs text-gray-500 mt-2">Vysoké napětí — ne nutně nemožné, ale náročné.</p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 mb-12">
          <p className="text-xs text-gray-500 leading-relaxed">{BARNUM_DISCLOSURE} Viz <Link href="/zdroje-numerologie" className="text-pink-500 underline">zdroje</Link>.</p>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow mb-4" style={{ color: accent }}>Spusť kvíz</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Zjisti svoje životní číslo.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození — uvidíš výsledek za 30 sekund. Žádná registrace.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>

      </article>
    </main>
  )
}
