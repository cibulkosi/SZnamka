'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DISTRICTS = [
  'Praha 1', 'Praha 2', 'Praha 3', 'Praha 4', 'Praha 5',
  'Praha 6', 'Praha 7', 'Praha 8', 'Praha 9', 'Praha 10',
]

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState<number | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [referralCode, setReferralCode] = useState('')
  const [refCode, setRefCode] = useState('')
  const [districtData, setDistrictData] = useState<Record<string, number>>({})
  const [copied, setCopied] = useState(false)
  const [reason, setReason] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) setRefCode(ref)
    const r = params.get('reason')
    if (r) setReason(r)

    // total count
    supabase.from('waitlist').select('*', { count: 'exact', head: true }).then(({ count }) => {
      setTotalCount(count || 0)
    })

    // district distribution
    supabase.from('waitlist').select('city').not('city', 'is', null).then(({ data }) => {
      if (!data) return
      const counts: Record<string, number> = {}
      for (const row of data) {
        const c = (row.city || '').trim()
        if (c) counts[c] = (counts[c] || 0) + 1
      }
      setDistrictData(counts)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) {
      // bot detected
      await new Promise(r => setTimeout(r, 1500))
      setSubmitted(true)
      return
    }
    if (!email) return
    setSubmitting(true)

    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      setReferralCode(code)

      const cityValue = district || city || null
      const { error } = await supabase.from('waitlist').insert({
        email,
        name: name || null,
        city: cityValue,
        referral_code: code,
        referred_by: refCode || null,
        source: 'landing',
      })
      if (error && error.code !== '23505') console.error(error)

      const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true })
      setPosition(count || 1)
      setSubmitted(true)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/waitlist?ref=${referralCode}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function share() {
    const url = `${window.location.origin}/waitlist?ref=${referralCode || ''}`
    if (navigator.share) {
      navigator.share({
        title: 'Cosmatch — Numerologická seznamka',
        text: 'První česká seznamka založená na numerologické kompatibilitě. Přidej se ke mně.',
        url,
      })
    } else {
      copyLink()
    }
  }

  const maxDistrictCount = Math.max(...Object.values(districtData), 1)
  const founderCount = 1000
  const remaining = Math.max(0, founderCount - totalCount)

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      {/* Top bar */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Cosmatch
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">

        {/* Reason banner — gender cap redirect */}
        {reason === 'gender_cap' && !submitted && (
          <div className="border border-pink-200 bg-pink-50 rounded-3xl p-6 mb-12">
            <p className="eyebrow text-pink-500 mb-2">Krátká pauza</p>
            <p className="text-gray-700 leading-relaxed text-[1.0625rem]">
              Právě teď přijímáme primárně ženy, abychom udrželi vyvážený poměr.
              Přidej se na waitlist — dáme ti vědět, jakmile budeš na řadě.
            </p>
          </div>
        )}

        {!submitted ? (
          <>
            {/* Masthead */}
            <header className="mb-16">
              <p className="eyebrow text-pink-500 mb-6">Waitlist · Pražská beta</p>
              <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
                Seznamka<br/>postavená na <em className="italic text-pink-500">numerologii</em>,<br/>ne na náhodě.
              </h1>
              <hr className="rule w-12 border-gray-900 mb-8" />
              <p className="text-lg text-gray-700 leading-relaxed mb-4 max-w-xl">
                Cosmatch spočítá kompatibilitu mezi tvým a partnerovým datem narození
                — z 366 personologických profilů. Místo swipování pro swipování
                ti nabízí důvod, proč se s někým potkat.
              </p>
              <p className="text-gray-500 leading-relaxed max-w-xl">
                Spouštíme v Praze. Brno a Bratislava potom. Prvních
                <strong className="font-medium text-gray-900"> 1\u202f000 lidí </strong>
                dostane voucher na 3\u202fměsíce Cosmatch+ zdarma.
              </p>
            </header>

            {/* Counter */}
            <section className="grid grid-cols-2 gap-6 mb-16">
              <div>
                <p className="eyebrow text-gray-500 mb-2">Na waitlistu</p>
                <p className="serif-display text-5xl text-gray-900 font-medium tracking-tight">
                  {totalCount.toLocaleString('cs-CZ')}
                </p>
              </div>
              <div>
                <p className="eyebrow text-gray-500 mb-2">Volných míst</p>
                <p className="serif-display text-5xl text-pink-500 font-medium tracking-tight">
                  {remaining.toLocaleString('cs-CZ')}
                </p>
                <p className="text-xs text-gray-400 mt-1">do "Zakládajících 1\u202f000"</p>
              </div>
            </section>

            <hr className="rule mb-16" />

            {/* Form */}
            <section className="mb-16">
              <p className="eyebrow text-pink-500 mb-4">Přidej se</p>
              <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
                Buď u toho jako první.
              </h2>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* honeypot */}
                <input
                  name="website"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jana@example.cz"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">
                    Jméno <span className="normal-case tracking-normal text-gray-400 ml-2">(volitelné)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jak ti říkat"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="eyebrow text-gray-500 mb-3 block">Město</label>
                  <select
                    value={city}
                    onChange={e => {
                      setCity(e.target.value)
                      if (e.target.value !== 'Praha') setDistrict('')
                    }}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">Vyber město</option>
                    <option value="Praha">Praha</option>
                    <option value="Brno">Brno</option>
                    <option value="Bratislava">Bratislava</option>
                    <option value="Jiné">Jiné</option>
                  </select>
                </div>

                {city === 'Praha' && (
                  <div>
                    <label className="eyebrow text-gray-500 mb-3 block">Čtvrť</label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="">Vyber čtvrť</option>
                      {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={!email || submitting}
                    className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Přidávám tě…' : 'Rezervovat místo'}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-4">
                    Žádný spam. Pouze e-mail, když spustíme.
                  </p>
                </div>
              </form>
            </section>

            <hr className="rule mb-16" />

            {/* District map */}
            <section className="mb-16">
              <p className="eyebrow text-pink-500 mb-4">Pražská mapa</p>
              <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-3">
                Kde už jsou ostatní?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
                Hustota waitlistu podle pražské čtvrti. Tam, kde žijí čísla, tam spustíme nejdřív.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {DISTRICTS.map(d => {
                  const count = districtData[d] || 0
                  const intensity = count / maxDistrictCount
                  return (
                    <div key={d} className="text-center">
                      <div
                        className="rounded-2xl py-6 mb-2 transition-all"
                        style={{
                          backgroundColor: `rgba(236, 72, 153, ${0.06 + intensity * 0.6})`,
                          border: '1px solid rgba(236, 72, 153, 0.15)',
                        }}
                      >
                        <div className="serif-display text-2xl font-medium text-gray-900">{count}</div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{d.replace('Praha ', 'P')}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            <hr className="rule mb-16" />

            {/* What you get */}
            <section className="mb-16">
              <p className="eyebrow text-pink-500 mb-4">Co dostaneš</p>
              <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
                Tři důvody být první.
              </h2>

              <div className="space-y-10">
                <div className="grid grid-cols-[auto,1fr] gap-x-8">
                  <div className="roman text-3xl text-pink-500 pt-1">I</div>
                  <div>
                    <h3 className="serif text-xl text-gray-900 font-medium mb-2">Voucher na 3 měsíce Cosmatch+</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Prvních 1\u202f000 dostane prémium zdarma — neomezené shody, otevírání profilů
                      bez čekání, hlubší analýzu.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-x-8">
                  <div className="roman text-3xl text-pink-500 pt-1">II</div>
                  <div>
                    <h3 className="serif text-xl text-gray-900 font-medium mb-2">Odznak Zakládajícího člena</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tvůj profil bude označen jako "Zakládající" — jako podpis u příběhu,
                      který pomáháš psát od první stránky.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-x-8">
                  <div className="roman text-3xl text-pink-500 pt-1">III</div>
                  <div>
                    <h3 className="serif text-xl text-gray-900 font-medium mb-2">Hlas v rozhodování</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Prvních 1\u202f000 dostane přístup k privátnímu chatu se zakladatelkou
                      a možnost ovlivnit, kam se Cosmatch posune.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust footer */}
            <footer className="border-t border-gray-200 pt-12 mt-16">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Cosmatch je financován výhradně předplatným uživatelů, ne reklamou ani prodejem dat.
                Tvoje datum narození používáme jen k výpočtu kompatibility.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/manifest-duvery" className="text-pink-500 hover:text-pink-600 transition">
                  Manifest důvěry →
                </Link>
                <Link href="/test" className="text-gray-500 hover:text-gray-900 transition">
                  Numerologický kvíz
                </Link>
              </div>
            </footer>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="pt-8">
            <p className="eyebrow text-pink-500 mb-6">Jsi na seznamu</p>
            <div className="serif-display text-[7rem] sm:text-[9rem] text-pink-500 font-medium leading-none tracking-tight mb-3">
              {position}
            </div>
            <p className="text-gray-500 mb-12 text-lg">tvoje pozice ve waitlistu</p>

            <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
              Děkujeme.<br/>Buď u toho.
            </h2>
            <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-12 max-w-xl">
              Pošleme ti e-mail jakmile spustíme — s voucherem na 3 měsíce Cosmatch+ zdarma.
              Mezitím ti dáváme nástroj, jak postoupit.
            </p>

            <hr className="rule mb-12" />

            <div className="mb-12">
              <p className="eyebrow text-pink-500 mb-3">Posuň se v pořadí</p>
              <h3 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
                Za každého přítele postoupíš o 5 míst.
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
                Pomáháš si i jim — dostanou stejný voucher.
              </p>

              {referralCode && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
                  <input
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'https://cosmatch.cz'}/waitlist?ref=${referralCode}`}
                    className="flex-1 bg-transparent text-gray-700 text-sm font-mono truncate focus:outline-none"
                  />
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-full font-medium hover:bg-gray-800 transition flex-shrink-0"
                  >
                    {copied ? 'Zkopírováno' : 'Kopírovat'}
                  </button>
                </div>
              )}

              <button
                onClick={share}
                className="w-full bg-pink-500 text-white py-5 rounded-full text-base font-medium hover:bg-pink-600 active:scale-[0.99] transition-all"
              >
                Sdílet a posunout se
              </button>
            </div>

            <hr className="rule mb-12" />

            <div className="text-center">
              <Link
                href="/test"
                className="text-sm text-gray-500 hover:text-gray-900 transition"
              >
                Zatím si zjisti svůj numerologický archetyp →
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
