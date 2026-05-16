'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Numerology life-path calculation
function lifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/-/g, '').split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

type Archetype = {
  name: string
  tagline: string
  description: string
  traits: string[]
  love: string
  shadow: string
  compatible: number[]
  accent: string
}

const ARCHETYPES: Record<number, Archetype> = {
  1: {
    name: 'Průkopník',
    tagline: 'Nezávislý, kreativní, ambiciózní.',
    description: 'Jsi přirozeně nezávislý, kreativní a ambiciózní. Miluješ výzvy a jdeš vlastní cestou. V lásce hledáš partnera, který tě bude respektovat, ne řídit.',
    traits: ['Sebejistý', 'Kreativní', 'Přímý', 'Ambiciózní'],
    love: 'Potřebuješ prostor a respekt. Nejlépe se párujete s někým, kdo má svůj vlastní svět — ne s tím, kdo bude závislý na tvé pozornosti.',
    shadow: 'Tendence k příliš velké nezávislosti může bránit skutečné blízkosti.',
    compatible: [3, 5, 6],
    accent: '#C2410C',
  },
  2: {
    name: 'Diplomat',
    tagline: 'Empatický, intuitivní, orientovaný na vztahy.',
    description: 'Jsi empatický, intuitivní a orientovaný na vztahy. Cítíš ostatní hlouběji než oni sami sebe. V lásce hledáš skutečnou duševní spřízněnost.',
    traits: ['Empatický', 'Intuitivní', 'Laskavý', 'Harmonický'],
    love: 'Potřebuješ jistotu a hlubší spojení. Nejlépe se párujete s někým klidným a spolehlivým, kdo oceňuje tvou citlivost.',
    shadow: 'Přílišná potřeba harmonie může vést k potlačování vlastních potřeb.',
    compatible: [4, 6, 8],
    accent: '#6D28D9',
  },
  3: {
    name: 'Tvůrce',
    tagline: 'Charismatický, expresivní, plný energie.',
    description: 'Jsi charismatický, expresivní a plný energie. Máš dar zaujmout každou místnost. V lásce potřebuješ partnera, se kterým nikdy nezažiješ nudu.',
    traits: ['Charismatický', 'Kreativní', 'Optimistický', 'Komunikativní'],
    love: 'Potřebuješ vzrušení a svobodu sebevyjádření. Nejlépe fungujete s někým, kdo tě obdivuje a dává ti prostor zářit.',
    shadow: 'Rozptýlenost a vyhýbání se hlubší zodpovědnosti může komplikovat dlouhodobé vztahy.',
    compatible: [1, 5, 9],
    accent: '#DB2777',
  },
  4: {
    name: 'Stavitel',
    tagline: 'Spolehlivý, systematický, věrný.',
    description: 'Jsi spolehlivý, systematický a věrný. Stavíš na pevných základech — ve všem, co děláš. V lásce hledáš stabilitu a skutečný závazek.',
    traits: ['Spolehlivý', 'Disciplinovaný', 'Věrný', 'Praktický'],
    love: 'Potřebuješ bezpečí a předvídatelnost. Nejlépe se párujete s někým, kdo sdílí tvé hodnoty a nebojí se budovat budoucnost krok za krokem.',
    shadow: 'Přílišná rigidita může bránit spontaneitě a novým zkušenostem.',
    compatible: [2, 6, 8],
    accent: '#0369A1',
  },
  5: {
    name: 'Dobrodruh',
    tagline: 'Svobodný duch, milovník změny.',
    description: 'Jsi svobodný duch, milovník změny a nových zkušeností. Nudíš se rutinou. V lásce potřebuješ partnera, který tě drží za ruku, ale ne za krk.',
    traits: ['Svobodný', 'Adaptabilní', 'Zvídavý', 'Energický'],
    love: 'Potřebuješ prostor a dobrodružství. Nejlépe fungujete s někým, kdo si tě dokáže uchovat — tím, že je sám zajímavý a nezávislý.',
    shadow: 'Strach ze závazku tě nutí opouštět lidi dříve, než vztah dostane šanci na hloubku.',
    compatible: [1, 3, 7],
    accent: '#047857',
  },
  6: {
    name: 'Pečovatel',
    tagline: 'Láskyplný, zodpovědný, orientovaný na rodinu.',
    description: 'Jsi láskyplný, zodpovědný a orientovaný na rodinu. Tvůj domov je tvůj chrám. V lásce dáváš více, než bereš — ale zasloužíš si obojí.',
    traits: ['Laskavý', 'Zodpovědný', 'Loajální', 'Ochranitelský'],
    love: 'Potřebuješ oceňování a reciprocitu. Nejlépe se párujete s někým, kdo umí přijímat lásku stejně hluboce, jako ji dávat.',
    shadow: 'Přílišné pečování vede k sebeobětování a tiché zatrpklosti.',
    compatible: [2, 4, 9],
    accent: '#B45309',
  },
  7: {
    name: 'Mudrc',
    tagline: 'Analytický, hloubavý, spirituální.',
    description: 'Jsi analytický, hloubavý a spirituální. Vidíš pod povrch věcí. V lásce hledáš intelektuální a duševní spojení — povrchní vztahy tě vyčerpávají.',
    traits: ['Analytický', 'Intuitivní', 'Hledající', 'Nezávislý'],
    love: 'Potřebuješ prostor a hloubku. Nejlépe fungujete s někým, kdo respektuje tvou potřebu ticha a dokáže vést smysluplné rozhovory.',
    shadow: 'Izolace a přílišná sebeanalýza brání skutečné emocionální blízkosti.',
    compatible: [5, 9, 11],
    accent: '#4338CA',
  },
  8: {
    name: 'Vůdce',
    tagline: 'Ambiciózní, mocný, orientovaný na výsledky.',
    description: 'Jsi ambiciózní, mocný a orientovaný na výsledky. Umíš přeměnit vizi ve skutečnost. V lásce hledáš rovnocenného partnera — ne obdivovatele.',
    traits: ['Ambiciózní', 'Silný', 'Sebevědomý', 'Strategický'],
    love: 'Potřebuješ respekt a rovnocennost. Nejlépe se párujete s někým, kdo má svůj vlastní úspěch a nebojí se stát po tvém boku.',
    shadow: 'Workoholismus a potřeba kontroly odsouvají vztahy na druhou kolej.',
    compatible: [2, 4, 6],
    accent: '#B91C1C',
  },
  9: {
    name: 'Idealista',
    tagline: 'Velkorysý, soucitný, globálně orientovaný.',
    description: 'Jsi velkorysý, soucitný a globálně orientovaný. Cítíš utrpení světa a chceš ho měnit. V lásce hledáš partnera, který sdílí tvé hodnoty.',
    traits: ['Velkorysý', 'Idealistický', 'Soucitný', 'Moudrý'],
    love: 'Potřebuješ sdílené hodnoty a smysl. Nejlépe fungujete s někým, kdo se chce posouvat — ne jen existovat.',
    shadow: 'Přílišný idealismus vede ke zklamání z reálných partnerů, kteří nejsou dokonalí.',
    compatible: [3, 6, 9],
    accent: '#0F766E',
  },
  11: {
    name: 'Vizionář',
    tagline: 'Mistrovské číslo — intuitivní a inspirativní.',
    description: 'Jsi mimořádně intuitivní, citlivý a inspirativní. Máš dar vidět věci, které ostatní přehlédnou. V lásce hledáš transcendentní spojení.',
    traits: ['Vizionářský', 'Intuitivní', 'Citlivý', 'Inspirativní'],
    love: 'Potřebuješ hluboké duševní a duchovní spojení. Povrchní vztahy tě vyčerpávají. Hledáš svou druhou polovinu v nejhlubším slova smyslu.',
    shadow: 'Příliš vysoká citlivost způsobuje přetížení a ústup ze vztahů.',
    compatible: [2, 6, 7],
    accent: '#9333EA',
  },
  22: {
    name: 'Architekt',
    tagline: 'Mistrovské číslo — stavitel světů.',
    description: 'Jsi mistrovský stavitel — lidí, systémů, světů. Tvůj potenciál je obrovský. V lásce hledáš partnera, který rozumí tvé misi.',
    traits: ['Vizionářský', 'Praktický', 'Disciplinovaný', 'Inspirativní'],
    love: 'Potřebuješ partnera, který stojí pevně na zemi, ale dokáže snít s tebou. Nechceš kohokoliv — chceš svého člověka.',
    shadow: 'Obsese s dokonalostí a velikostí zanechává osobní vztahy v ústraní.',
    compatible: [4, 8, 6],
    accent: '#92400E',
  },
  33: {
    name: 'Mistr lásky',
    tagline: 'Mistrovské číslo — léčitel a soucit.',
    description: 'Jsi ztělesnění soucitu, léčení a bezpodmínečné lásky. Tvořích jen 0,3 % populace. V lásce dáváš dary, které si mnozí ani neumí představit.',
    traits: ['Láskyplný', 'Léčivý', 'Moudrý', 'Soucitný'],
    love: 'Potřebuješ partnera, který je schopen přijmout hloubku tvé lásky a opětovat ji. Mnozí se tvé intenzity bojí — ale ten pravý ji pozná.',
    shadow: 'Dávání bez hranic vede k úplnému vyčerpání.',
    compatible: [6, 9, 3],
    accent: '#BE185D',
  },
}

type Step = 'intro' | 'birthday' | 'result' | 'capture' | 'done'

export default function TestPage() {
  const [step, setStep] = useState<Step>('intro')
  const [birthday, setBirthday] = useState('')
  const [name, setName] = useState('')
  const [lifePath, setLifePath] = useState<number | null>(null)
  const [archetype, setArchetype] = useState<Archetype | null>(null)
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [waitlistPos, setWaitlistPos] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState('')
  const [refCode, setRefCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref')
      if (ref) setRefCode(ref)
    }
  }, [])

  function handleCalculate() {
    if (!birthday) return
    const lp = lifePathNumber(birthday)
    const arc = ARCHETYPES[lp] || ARCHETYPES[9]
    setLifePath(lp)
    setArchetype(arc)
    setStep('result')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !archetype) return
    setSubmitting(true)
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      setReferralCode(code)
      const { error } = await supabase.from('waitlist').insert({
        email,
        name: name || null,
        city: city || null,
        birthday,
        life_path: lifePath,
        archetype: archetype.name,
        referral_code: code,
        referred_by: refCode || null,
        source: 'quiz',
      })
      if (error && error.code !== '23505') console.error(error)
      const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true })
      setWaitlistPos(count || 1)
      setStep('done')
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  function copyReferralLink() {
    const url = `${window.location.origin}/test?ref=${referralCode}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function shareResult() {
    const url = `${window.location.origin}/test?ref=${referralCode || ''}`
    if (navigator.share) {
      navigator.share({
        title: `Jsem ${archetype?.name} — Cosmatch`,
        text: `Cosmatch mě označil jako „${archetype?.name}\" (číslo ${lifePath}). Zjisti i své: `,
        url,
      })
    } else {
      copyReferralLink()
    }
  }

  // Step indicator helper
  const stepIndex: Record<Step, number> = { intro: 0, birthday: 1, result: 2, capture: 3, done: 4 }
  const idx = stepIndex[step]

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      {/* Top bar */}
      <div className="max-w-xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Cosmatch
        </Link>
        {step !== 'intro' && step !== 'done' && (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1 w-6 rounded-full transition-all ${i <= idx - 1 ? 'bg-pink-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto px-6 pt-10 pb-24">

        {/* STEP: INTRO */}
        {step === 'intro' && (
          <div className="pt-8">
            <p className="eyebrow text-pink-500 mb-6">Numerologický kvíz</p>
            <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
              Proč se pořád<br/>přitahuješ<br/>k <em className="italic text-pink-500">stejnému typu</em><br/>lidí?
            </h1>
            <hr className="rule w-12 border-gray-900 mb-8" />
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Tvoje datum narození zná odpověď. Cosmatch ti za 30 sekund spočítá tvůj
              numerologický archetyp a ukáže ti, jaký partner ti skutečně sedí.
            </p>
            <p className="text-gray-500 leading-relaxed mb-12">
              Zdarma. Bez registrace. Bez e-mailu, dokud sám nechceš.
            </p>

            <button
              onClick={() => setStep('birthday')}
              className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all"
            >
              Začít kvíz
            </button>

            <p className="text-xs text-gray-400 text-center mt-6">
              Cosmatch je první česká seznamka založená na numerologické kompatibilitě.
            </p>
          </div>
        )}

        {/* STEP: BIRTHDAY */}
        {step === 'birthday' && (
          <div className="pt-4">
            <p className="eyebrow text-gray-400 mb-6">Krok 1 ze 2</p>
            <h2 className="serif-display text-4xl sm:text-5xl text-gray-900 font-medium leading-[1.1] tracking-tight mb-6">
              Kdy ses narodil?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10 text-[1.0625rem]">
              Zadej přesný datum narození. Rok je důležitý — ovlivňuje životní číslo.
            </p>

            <div className="space-y-6 mb-10">
              <div>
                <label className="eyebrow text-gray-500 mb-3 block">Datum narození</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={e => setBirthday(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-2xl text-gray-900 focus:outline-none transition-colors serif"
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="eyebrow text-gray-500 mb-3 block">Tvoje jméno <span className="normal-case tracking-normal text-gray-400 ml-2">(volitelné)</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tak, jak chceš být oslovován"
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              disabled={!birthday}
              onClick={handleCalculate}
              className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Spočítat můj archetyp
            </button>

            <button
              onClick={() => setStep('intro')}
              className="block mx-auto mt-6 text-sm text-gray-400 hover:text-gray-700 transition"
            >
              ← Zpět
            </button>
          </div>
        )}

        {/* STEP: RESULT */}
        {step === 'result' && archetype && (
          <div className="pt-4">
            <p className="eyebrow text-gray-400 mb-4">Tvůj výsledek</p>
            <div className="mb-8">
              <div
                className="serif-display text-[7rem] sm:text-[9rem] font-medium leading-none mb-2"
                style={{ color: archetype.accent }}
              >
                {lifePath}
              </div>
              <h2 className="serif-display text-4xl sm:text-5xl text-gray-900 font-medium leading-tight tracking-tight mb-3">
                {archetype.name}
              </h2>
              <p className="text-gray-500 text-[1.0625rem]">{archetype.tagline}</p>
            </div>

            <hr className="rule mb-10" />

            <div className="space-y-10">
              <section>
                <p className="eyebrow text-gray-500 mb-3">Kdo jsi</p>
                <p className="text-gray-800 leading-[1.75] text-[1.0625rem] dropcap">
                  {archetype.description}
                </p>
              </section>

              <section>
                <p className="eyebrow text-gray-500 mb-3">Vlastnosti</p>
                <div className="flex flex-wrap gap-2">
                  {archetype.traits.map(t => (
                    <span
                      key={t}
                      className="px-4 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <p className="eyebrow text-gray-500 mb-3">V lásce</p>
                <p className="text-gray-800 leading-[1.75] text-[1.0625rem]">
                  {archetype.love}
                </p>
              </section>

              <section>
                <p className="eyebrow text-gray-500 mb-3">Stín</p>
                <p className="text-gray-800 leading-[1.75] text-[1.0625rem]">
                  {archetype.shadow}
                </p>
              </section>

              <section>
                <p className="eyebrow text-gray-500 mb-3">Nejlépe ti sedí čísla</p>
                <div className="flex gap-3">
                  {archetype.compatible.map(n => (
                    <div
                      key={n}
                      className="serif-display text-4xl font-medium text-gray-900 border border-gray-300 rounded-2xl w-16 h-16 flex items-center justify-center"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <hr className="rule my-12" />

            <div className="bg-white rounded-3xl p-8 border border-gray-100">
              <p className="eyebrow text-pink-500 mb-3">Další krok</p>
              <h3 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">
                Najdi svůj protějšek
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
                Cosmatch spočítá kompatibilitu mezi tvým a partnerovým datem — z 366 personologických
                profilů. Přidej se do waitlistu a buď u toho jako první.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Prvních 1 000 dostane voucher na 3 měsíce Cosmatch+ zdarma.
              </p>
              <button
                onClick={() => setStep('capture')}
                className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all"
              >
                Chci být první
              </button>
              <button
                onClick={shareResult}
                className="block w-full text-sm text-gray-500 hover:text-gray-900 mt-4 py-2 transition"
              >
                Sdílet výsledek →
              </button>
            </div>
          </div>
        )}

        {/* STEP: CAPTURE */}
        {step === 'capture' && archetype && (
          <div className="pt-4">
            <p className="eyebrow text-gray-400 mb-6">Krok 2 ze 2</p>
            <h2 className="serif-display text-4xl sm:text-5xl text-gray-900 font-medium leading-[1.1] tracking-tight mb-6">
              Buď u toho<br/>jako <em className="italic text-pink-500">{archetype.name}</em>.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10 text-[1.0625rem]">
              Pošleme ti e-mail, jakmile Cosmatch spustíme v Praze. Plus voucher na 3 měsíce
              Cosmatch+ zdarma — pokud jsi mezi prvními tisíci.
            </p>

            <form onSubmit={handleEmailCapture} className="space-y-6 mb-8">
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
                <label className="eyebrow text-gray-500 mb-3 block">Město <span className="normal-case tracking-normal text-gray-400 ml-2">(volitelné)</span></label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Praha · Brno · Bratislava…"
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!email || submitting}
                className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Přidávám tě…' : 'Přidat mě na waitlist'}
              </button>
            </form>

            <button
              onClick={() => setStep('result')}
              className="block mx-auto text-sm text-gray-400 hover:text-gray-700 transition"
            >
              ← Zpět na výsledek
            </button>

            <p className="text-xs text-gray-400 text-center mt-10 leading-relaxed">
              Neposíláme spam. Pouze jeden e-mail, když Cosmatch spustíme v tvém městě.
              Odhlášení jedním klikem.
            </p>
          </div>
        )}

        {/* STEP: DONE */}
        {step === 'done' && archetype && (
          <div className="pt-8 text-center">
            <p className="eyebrow text-pink-500 mb-6">Jsi na seznamu</p>
            <div
              className="serif-display text-[8rem] font-medium leading-none mb-4"
              style={{ color: archetype.accent }}
            >
              {waitlistPos}
            </div>
            <p className="text-gray-500 mb-10">tvoje pozice ve waitlistu</p>

            <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
              Vítej, <em className="italic text-pink-500">{archetype.name}</em>.
            </h2>
            <p className="text-gray-700 leading-relaxed mb-12 max-w-md mx-auto">
              Pošleme ti e-mail s voucherem, jakmile Cosmatch spustíme. Mezitím — chceš postoupit?
            </p>

            <hr className="rule mb-12" />

            <div className="text-left">
              <p className="eyebrow text-gray-500 mb-3">Posuň se v pořadí</p>
              <h3 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
                Za každého přítele postoupíš o 5 míst.
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
                Pozvi někoho, koho zajímá numerologie nebo kdo si zaslouží lepší seznamku.
                Pomáháš si i jim.
              </p>

              {referralCode && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-3 mb-4">
                  <input
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'https://cosmatch.cz'}/test?ref=${referralCode}`}
                    className="flex-1 bg-transparent text-gray-700 text-sm font-mono truncate focus:outline-none"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-full font-medium hover:bg-gray-800 transition flex-shrink-0"
                  >
                    {copied ? 'Zkopírováno' : 'Kopírovat'}
                  </button>
                </div>
              )}

              <button
                onClick={shareResult}
                className="w-full bg-pink-500 text-white py-5 rounded-full text-base font-medium hover:bg-pink-600 active:scale-[0.99] transition-all"
              >
                Sdílet výsledek a získat pozici
              </button>
            </div>

            <hr className="rule my-12" />

            <Link
              href="/manifest-duvery"
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              Přečti si, čemu se zavazujeme →
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
