'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BENEFITS = [
  { title: 'Cosmatch+ navždy zdarma', desc: 'Doživotní premium účet bez poplatků.' },
  { title: 'Ambasadorský odznak', desc: 'Permanentní odznak viditelný všem na profilu.' },
  { title: 'Vlastní referral kód', desc: 'Sleduj, kolik lidí sis přivedl/a a jak jim Cosmatch pomohl.' },
  { title: 'Přístup do uzavřené komunity', desc: 'Soukromá skupina s ostatními ambasadory a týmem.' },
  { title: 'Vliv na vývoj', desc: 'Zpětná vazba, betaverze nových funkcí, přímý kontakt se zakladatelkou.' },
]

const REQUIREMENTS = [
  'Min. 500 sledujících na alespoň jedné platformě (Instagram, TikTok, YouTube)',
  'Autentický zájem o numerologii, kompatibilitu nebo vztahy',
  'Ochota vytvořit min. 2 příspěvky / reels o Cosmatch za měsíc',
  'Aktivní profil na Cosmatch (vlastní účet)',
  'Bydliště Praha, Brno nebo Bratislava',
]

export default function AmbasadorkyPage() {
  const [form, setForm] = useState({
    name: '', email: '', city: '', instagram: '',
    tiktok: '', followers: '', motivation: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.motivation) return
    setSubmitting(true)
    setError('')

    try {
      const { error: dbErr } = await supabase
        .from('ambassadors')
        .insert({
          name: form.name,
          email: form.email,
          city: form.city || null,
          instagram: form.instagram || null,
          tiktok: form.tiktok || null,
          followers: parseInt(form.followers) || null,
          motivation: form.motivation,
          status: 'pending',
        })

      if (dbErr) {
        if (dbErr.code === '23505') {
          setError('Tento e-mail je už přihlášen.')
        } else {
          setError('Nastala chyba. Zkus to prosím znovu.')
        }
        return
      }
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="text-pink-500">✦</span> Cosmatch
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-block bg-pink-50 text-pink-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Program ambasadorek
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Buď tváří revoluce v datování
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Hledáme 20 žen v Praze, Brně a Bratislavě, které věří, že správné spojení
            není otázka algoritmů, ale dat. A chtějí to říct světu.
          </p>
        </div>

        {/* Benefits */}
        <div className="card p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Co získáš</h2>
          <div className="space-y-4">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                  <p className="text-gray-500 text-sm">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="card p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Co hledáme</h2>
          <ul className="space-y-3">
            {REQUIREMENTS.map(r => (
              <li key={r} className="flex gap-3 text-gray-600 text-sm">
                <span className="text-pink-500 flex-shrink-0 mt-0.5">✦</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        {!submitted ? (
          <div className="card p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Přihláška</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jméno *</label>
                  <input className="input w-full" value={form.name}
                    onChange={e => set('name', e.target.value)} placeholder="Jana" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input type="email" className="input w-full" value={form.email}
                    onChange={e => set('email', e.target.value)} placeholder="jana@email.cz" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Město</label>
                  <select className="input w-full bg-white" value={form.city}
                    onChange={e => set('city', e.target.value)}>
                    <option value="">Vyber...</option>
                    <option>Praha</option>
                    <option>Brno</option>
                    <option>Bratislava</option>
                    <option>Jiné</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Počet sledujících</label>
                  <input type="number" className="input w-full" value={form.followers}
                    onChange={e => set('followers', e.target.value)} placeholder="500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input className="input w-full" value={form.instagram}
                    onChange={e => set('instagram', e.target.value)} placeholder="@jananovak" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                  <input className="input w-full" value={form.tiktok}
                    onChange={e => set('tiktok', e.target.value)} placeholder="@jananovak" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proč chceš být ambasadorkou? *
                </label>
                <textarea
                  className="input w-full h-32 resize-none"
                  value={form.motivation}
                  onChange={e => set('motivation', e.target.value)}
                  placeholder="Co tě přitahuje na Cosmatch? Jaká je tvoje zkušenost s datováním? Jak bys šířila povědomí?"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 rounded-2xl p-3 text-sm">{error}</div>
              )}

              <button type="submit" className="btn-primary w-full py-4" disabled={submitting}>
                {submitting ? 'Odesílám...' : 'Odeslat přihlášku'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Odpovídáme do 7 dnů. Hledáme prvních 20 ambasadorek.
              </p>
            </form>
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-pink-500">✦</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Přihláška odeslána</h3>
            <p className="text-gray-500 mb-6">
              Díky! Ozveme se ti do 7 dnů na {form.email}.
              Vybíráme první vlnu 20 ambasadorek před spuštěním.
            </p>
            <Link href="/" className="btn-primary inline-block px-8 py-3">Zpět na úvod</Link>
          </div>
        )}

      </div>
    </div>
  )
}
