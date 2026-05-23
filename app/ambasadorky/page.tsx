'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BENEFITS = [
  ['Doživotní Cosmatch+', 'Premium účet zdarma, navždy. Bez podmínek.'],
  ['Ambasadorský odznak', 'Vidí ho každý, kdo si Tě otevře. Status, který si nikdo nekoupí.'],
  ['Vlastní referral kód', 'Sleduj, kolik lidí jsi přivedla a komu Cosmatch pomohl.'],
  ['Uzavřená komunita', 'Privátní skupina s ostatními ambasadorkami a zakladatelkou.'],
  ['Vliv na vývoj', 'Zpětná vazba, beta verze, přímý kontakt. Cosmatch se utváří i tebou.'],
]

const REQUIREMENTS = [
  'Alespoň 500 sledujících na Instagramu, TikToku nebo YouTube.',
  'Autentický zájem o numerologii, kompatibilitu nebo vztahy.',
  'Ochota vytvořit minimálně dva příspěvky / reels o Cosmatch měsíčně.',
  'Aktivní vlastní profil na Cosmatch.',
  'Bydliště Praha, Brno nebo Bratislava.',
]

export default function AmbasadorkyPage() {
  const [form, setForm] = useState({ name: '', email: '', city: '', instagram: '', tiktok: '', followers: '', motivation: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.motivation) return
    setSubmitting(true); setError('')
    try {
      const { error: dbErr } = await supabase.from('ambassadors').insert({
        name: form.name, email: form.email,
        city: form.city || null, instagram: form.instagram || null,
        tiktok: form.tiktok || null, followers: parseInt(form.followers) || null,
        motivation: form.motivation, status: 'pending',
      })
      if (dbErr) {
        if (dbErr.code === '23505') setError('Tento e-mail je už přihlášen.')
        else setError('Něco se pokazilo. Zkus to prosím znovu.')
        return
      }
      setSubmitted(true)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally { setSubmitting(false) }
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {!submitted ? (
          <>
            {/* Masthead */}
            <header className="mb-16">
              <p className="eyebrow text-pink-500 mb-6">Program ambasadorek</p>
              <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
                Buď tváří<br/><em className="italic text-pink-500">revoluce</em> v datování.
              </h1>
              <hr className="rule w-12 border-gray-900 mb-8" />
              <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
                Hledáme dvacet žen v Praze, Brně a Bratislavě, které věří, že správné
                spojení není otázka algoritmů, ale dat. A chtějí to říct světu.
              </p>
            </header>

            {/* Benefits */}
            <section className="mb-16">
              <p className="eyebrow text-pink-500 mb-4">Co od nás dostaneš</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
                Pět věcí, které nikdo jiný nedostane.
              </h2>
              <div className="space-y-10">
                {BENEFITS.map(([t, d], i) => (
                  <div key={t} className="grid grid-cols-[auto,1fr] gap-x-8 border-b border-gray-200 pb-10 last:border-b-0">
                    <div className="serif text-2xl text-pink-500 leading-none pt-1 tabular-nums">{String(i+1).padStart(2,'0')}</div>
                    <div>
                      <h3 className="serif text-xl text-gray-900 font-medium mb-2">{t}</h3>
                      <p className="text-gray-600 leading-relaxed">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="rule mb-16" />

            {/* Requirements */}
            <section className="mb-16">
              <p className="eyebrow text-pink-500 mb-4">Co od Tebe potřebujeme</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
                Pět věcí, které musíš splňovat.
              </h2>
              <ul className="space-y-4">
                {REQUIREMENTS.map((r, i) => (
                  <li key={i} className="grid grid-cols-[auto,1fr] gap-4">
                    <span className="roman text-lg text-pink-500 leading-none pt-1">{['I','II','III','IV','V'][i]}</span>
                    <span className="text-gray-700 leading-relaxed text-[1.0625rem]">{r}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="rule mb-16" />

            {/* Form */}
            <section>
              <p className="eyebrow text-pink-500 mb-4">Přihláška</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
                Pošli nám pár řádků o sobě.
              </h2>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">Jméno</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jana Nováková"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">E-mail</label>
                  <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="jana@example.cz"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">Město</label>
                  <select value={form.city} onChange={e => set('city', e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 py-3 text-lg text-gray-900 focus:outline-none appearance-none">
                    <option value="">Vyber město</option>
                    <option value="Praha">Praha</option>
                    <option value="Brno">Brno</option>
                    <option value="Bratislava">Bratislava</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="eyebrow text-gray-500 mb-3 block">Instagram <span className="normal-case tracking-normal text-gray-400 ml-2">(volitelné)</span></label>
                    <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@jana"
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="eyebrow text-gray-500 mb-3 block">TikTok <span className="normal-case tracking-normal text-gray-400 ml-2">(volitelné)</span></label>
                    <input value={form.tiktok} onChange={e => set('tiktok', e.target.value)} placeholder="@jana"
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">Sledujících celkem</label>
                  <input type="number" value={form.followers} onChange={e => set('followers', e.target.value)} placeholder="2500"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">Proč chceš být ambasadorka</label>
                  <textarea required value={form.motivation} onChange={e => set('motivation', e.target.value)} rows={4}
                    placeholder="Pár vět o tom, proč Ti dává Cosmatch smysl…"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors resize-none" />
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">{error}</p>}

                <button type="submit" disabled={submitting || !form.name || !form.email || !form.motivation}
                  className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                  {submitting ? 'Odesílám…' : 'Odeslat přihlášku'}
                </button>

                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Vybereme dvacet ambasadorek. Ozveme se do tří týdnů, ať už budeš vybrána, nebo ne.
                </p>
              </form>
            </section>
          </>
        ) : (
          /* SUCCESS */
          <div className="pt-8 text-center">
            <p className="eyebrow text-pink-500 mb-6">Přihláška odeslána</p>
            <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
              Děkujeme,<br/><em className="italic text-pink-500">{form.name.split(' ')[0] || 'kámoška'}</em>.
            </h1>
            <hr className="rule w-12 border-gray-900 mx-auto mb-8" />
            <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-12 max-w-md mx-auto">
              Tvoji přihlášku jsme dostali. Vyhodnotíme ji a ozveme se do tří týdnů
              — ať už budeš vybraná nebo ne. Děkujeme, že chceš být u toho.
            </p>
            <Link href="/" className="text-pink-500 font-medium hover:text-pink-600 transition">
              Zpět na úvod →
            </Link>
          </div>
        )}
      </article>
    </main>
  )
}
