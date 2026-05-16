'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Prague districts with approximate coordinates (for the map)
const PRAGUE_DISTRICTS = [
  { name: 'Praha 1', x: 50, y: 52, label: 'Staré Město' },
  { name: 'Praha 2', x: 54, y: 58, label: 'Vinohrady' },
  { name: 'Praha 3', x: 61, y: 52, label: 'Žižkov' },
  { name: 'Praha 4', x: 58, y: 68, label: 'Nusle' },
  { name: 'Praha 5', x: 40, y: 60, label: 'Smíchov' },
  { name: 'Praha 6', x: 38, y: 42, label: 'Dejvice' },
  { name: 'Praha 7', x: 46, y: 42, label: 'Holešovice' },
  { name: 'Praha 8', x: 58, y: 38, label: 'Karlín' },
  { name: 'Praha 9', x: 68, y: 38, label: 'Prosek' },
  { name: 'Praha 10', x: 68, y: 58, label: 'Vršovice' },
]

export default function WaitlistPage() {
  const [count, setCount] = useState<number>(0)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('Praha')
  const [refCode, setRefCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [waitlistPos, setWaitlistPos] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [districtData, setDistrictData] = useState<Record<string, number>>({})

  useEffect(() => {
    // Load count
    supabase.from('waitlist').select('*', { count: 'exact', head: true })
      .then(({ count: c }) => { if (c) setCount(c) })

    // Load district breakdown (approximate — based on city field)
    supabase.from('waitlist').select('city')
      .then(({ data }) => {
        const dist: Record<string, number> = {}
        data?.forEach(row => {
          if (row.city) {
            const d = row.city.trim()
            dist[d] = (dist[d] || 0) + 1
          }
        })
        setDistrictData(dist)
      })

    // Check for referral code in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref')
      if (ref) setRefCode(ref)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)

    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      setReferralCode(code)

      const { error } = await supabase
        .from('waitlist')
        .insert({
          email,
          name: name || null,
          city: city || null,
          referral_code: code,
          referred_by: refCode || null,
          source: 'waitlist',
        })

      if (error && error.code !== '23505') console.error(error)

      const { count: newCount } = await supabase
        .from('waitlist').select('*', { count: 'exact', head: true })

      setWaitlistPos(newCount || 1)
      setCount(newCount || count + 1)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/waitlist?ref=${referralCode}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#1a0533] text-white">
      <div className="max-w-lg mx-auto px-6 py-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-pink-400">✦</span> Cosmatch
          </Link>
        </div>

        {!submitted ? (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-block bg-pink-500 bg-opacity-20 border border-pink-500 border-opacity-30
                rounded-full px-4 py-1.5 text-pink-300 text-sm font-medium mb-6">
                Praha — brzy spouštíme
              </div>
              <h1 className="text-4xl font-black mb-4 leading-tight">
                Datování, které konečně<br />
                <span className="text-pink-400">dává smysl.</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Cosmatch spojuje lidi podle kompatibility dat narození — ne podle fotek a swipů.
                Přidej se na waitlist a získej 3 měsíce premium zdarma.
              </p>

              {/* Live counter */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-5 mb-8 border border-white border-opacity-10">
                <div className="text-5xl font-black text-pink-400 mb-1">
                  {count > 0 ? count.toLocaleString('cs-CZ') : '—'}
                </div>
                <div className="text-gray-400 text-sm">lidí čeká na spuštění</div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white bg-opacity-5 rounded-3xl p-6 mb-8 border border-white border-opacity-10">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-4">Zájem podle místa</p>
              <svg viewBox="0 0 100 100" className="w-full h-48">
                {/* Simple Prague map outline (approximate) */}
                <ellipse cx="52" cy="52" rx="38" ry="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                {PRAGUE_DISTRICTS.map(d => {
                  const intensity = districtData[d.label] || 0
                  const maxVal = Math.max(...Object.values(districtData), 1)
                  const opacity = 0.15 + (intensity / maxVal) * 0.7
                  return (
                    <g key={d.name}>
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={3 + (intensity / Math.max(maxVal, 1)) * 4}
                        fill="#ec4899"
                        opacity={opacity}
                      />
                      <text x={d.x} y={d.y + 8} textAnchor="middle"
                        fill="rgba(255,255,255,0.4)" fontSize="2.5">
                        {d.label}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Signup form */}
            <div className="bg-white bg-opacity-5 rounded-3xl p-6 border border-white border-opacity-10">
              <h2 className="text-xl font-bold mb-4">Rezervuj si místo</h2>
              {refCode && (
                <div className="bg-pink-500 bg-opacity-20 rounded-2xl p-3 mb-4 text-pink-300 text-sm">
                  Byl/a jsi pozván/a. Automaticky postoupíš o 5 míst.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl
                    px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
                  placeholder="Jméno (volitelné)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <input
                  type="email"
                  required
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl
                    px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
                  placeholder="E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <select
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl
                    px-4 py-3 text-white focus:outline-none focus:border-pink-400 bg-[#1a0533]"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                >
                  <option value="Praha">Praha</option>
                  <option value="Brno">Brno</option>
                  <option value="Bratislava">Bratislava</option>
                  <option value="Ostrava">Ostrava</option>
                  <option value="Plzeň">Plzeň</option>
                  <option value="Liberec">Liberec</option>
                  <option value="Jiné">Jiné město</option>
                </select>
                {/* Honeypot */}
                <input name="website" style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" />
                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="w-full py-4 rounded-2xl font-bold text-white bg-pink-500 hover:bg-pink-600
                    disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Ukládám...' : 'Chci být první'}
                </button>
              </form>
              <p className="text-gray-500 text-xs text-center mt-3">
                Žádný spam. Odhlásit se lze kdykoliv.
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-8 space-y-3">
              {[
                ['3 měsíce premium zdarma', 'Voucher pro prvních 500 uživatelů.'],
                ['Přeskočíš frontu za přátele', 'Za každého přítele postoupíš o 5 míst.'],
                ['Founding member odznak', 'Permanentní odznak na profilu.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-pink-500 bg-opacity-20 flex items-center
                    justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{title}</p>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="text-center mt-8 space-x-6 text-sm">
              <Link href="/test" className="text-pink-400 underline">Zjisti svůj archetyp</Link>
              <Link href="/manifest-duvery" className="text-gray-400 underline">Manifest důvěry</Link>
            </div>
          </>
        ) : (
          /* SUCCESS */
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500 bg-opacity-20 rounded-full flex items-center
              justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-2">Jsi na listině!</h2>
            {waitlistPos && (
              <p className="text-gray-300 mb-2">Tvoje pořadí: <strong className="text-pink-400">#{waitlistPos}</strong></p>
            )}
            <p className="text-gray-400 mb-8">
              Pošleme ti e-mail jakmile spustíme — s voucherem na 3 měsíce Cosmatch+ zdarma.
            </p>

            {/* Referral box */}
            <div className="bg-white bg-opacity-5 rounded-3xl p-6 mb-6 border border-white border-opacity-10">
              <p className="font-bold text-lg mb-1">Posuň se v pořadí</p>
              <p className="text-gray-400 text-sm mb-4">Za každého přítele, který se přihlásí přes tvůj odkaz, postoupíš o 5 míst.</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : 'https://cosmatch.cz'}/waitlist?ref=${referralCode}`}
                  className="flex-1 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl
                    px-3 py-2 text-white text-xs focus:outline-none"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-pink-500 rounded-xl text-white text-sm font-medium whitespace-nowrap"
                >
                  {copied ? 'Hotovo!' : 'Kopírovat'}
                </button>
              </div>
            </div>

            <Link href="/test" className="text-pink-400 underline text-sm">Zjisti svůj numerologický archetyp</Link>
          </div>
        )}
      </div>
    </div>
  )
}
