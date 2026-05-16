'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Numerology life path calculation
function lifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/-/g, '').split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

// Archetypes by life path number
const ARCHETYPES: Record<number, {
  name: string
  emoji: string
  title: string
  description: string
  traits: string[]
  love: string
  shadow: string
  compatible: number[]
  color: string
}> = {
  1: {
    name: 'Průkopník',
    emoji: '✦',
    title: 'Číslo 1 — Průkopník',
    description: 'Jsi přirozeně nezávislý, kreativní a ambiciózní. Miluješ výzvy a jdeš vlastní cestou. V lásce hledáš partnera, který tě bude respektovat, ne řídit.',
    traits: ['Sebejistý', 'Kreativní', 'Přímý', 'Ambiciózní'],
    love: 'Potřebuješ prostor a respekt. Nejlépe se párujete s někým, kdo má svůj vlastní svět — ne s tím, kdo bude závislý na tvé pozornosti.',
    shadow: 'Tendence k příliš velké nezávislosti může bránit skutečné blízkosti.',
    compatible: [3, 5, 6],
    color: '#f97316',
  },
  2: {
    name: 'Diplomat',
    emoji: '✦',
    title: 'Číslo 2 — Diplomat',
    description: 'Jsi empatický, intuitivní a orientovaný na vztahy. Cítíš ostatní hlouběji než oni sami sebe. V lásce hledáš skutečnou duševní spřízněnost.',
    traits: ['Empatický', 'Intuitivní', 'Laskavý', 'Harmonický'],
    love: 'Potřebuješ jistotu a hlubší spojení. Nejlépe se párujete s někým klidným a spolehlivým, kdo oceňuje tvou citlivost.',
    shadow: 'Přílišná potřeba harmonie může vést k potlačování vlastních potřeb.',
    compatible: [4, 6, 8],
    color: '#8b5cf6',
  },
  3: {
    name: 'Tvůrce',
    emoji: '✦',
    title: 'Číslo 3 — Tvůrce',
    description: 'Jsi charismatický, expresivní a plný energie. Máš dar zaujmout každou místnost. V lásce potřebuješ partnera, se kterým nikdy nezažiješ nudu.',
    traits: ['Charismatický', 'Kreativní', 'Optimistický', 'Komunikativní'],
    love: 'Potřebuješ vzrušení a svobodu sebevyjádření. Nejlépe fungujete s někým, kdo tě obdivuje a dává ti prostor zářit.',
    shadow: 'Rozptýlenost a vyhýbání se hlubší zodpovědnosti může komplikovat dlouhodobé vztahy.',
    compatible: [1, 5, 9],
    color: '#ec4899',
  },
  4: {
    name: 'Stavitel',
    emoji: '✦',
    title: 'Číslo 4 — Stavitel',
    description: 'Jsi spolehlivý, systematický a věrný. Stavíš na pevných základech — ve všem, co děláš. V lásce hledáš stabilitu a skutečný závazek.',
    traits: ['Spolehlivý', 'Disciplinovaný', 'Věrný', 'Praktický'],
    love: 'Potřebuješ bezpečí a předvídatelnost. Nejlépe se párujete s někým, kdo sdílí tvé hodnoty a nebojí se budovat budoucnost krok za krokem.',
    shadow: 'Přílišná rigidita může bránit spontaneitě a nových zkušenostech.',
    compatible: [2, 6, 8],
    color: '#0ea5e9',
  },
  5: {
    name: 'Dobrodruh',
    emoji: '✦',
    title: 'Číslo 5 — Dobrodruh',
    description: 'Jsi svobodný duch, milovník změny a nových zkušeností. Nudíš se rutinou. V lásce potřebuješ partnera, který tě drží za ruku, ale ne za krk.',
    traits: ['Svobodný', 'Adaptabilní', 'Zvídavý', 'Energický'],
    love: 'Potřebuješ prostor a dobrodružství. Nejlépe fungujete s někým, kdo si tě dokáže uchovat — tím, že je sám zajímavý a nezávislý.',
    shadow: 'Strach ze závazku může způsobit, že opouštíš lidi dříve, než dostanete šanci na něco skutečně hlubokého.',
    compatible: [1, 3, 7],
    color: '#10b981',
  },
  6: {
    name: 'Pečovatel',
    emoji: '✦',
    title: 'Číslo 6 — Pečovatel',
    description: 'Jsi láskyplný, zodpovědný a orientovaný na rodinu. Tvůj domov je tvůj chrám. V lásce dáváš více, než bereš — ale zasloužíš si obojí.',
    traits: ['Laskavý', 'Zodpovědný', 'Loajální', 'Ochranitelský'],
    love: 'Potřebuješ oceňování a reciprocitu. Nejlépe se párujete s někým, kdo umí přijímat lásku stejně hluboce, jako ji dávat.',
    shadow: 'Přílišné pečování může vést k self-sacrificing vzorcům a zatrpklosti.',
    compatible: [2, 4, 9],
    color: '#f59e0b',
  },
  7: {
    name: 'Mudrc',
    emoji: '✦',
    title: 'Číslo 7 — Mudrc',
    description: 'Jsi analytický, hloubavý a spirituální. Vidíš pod povrch věcí. V lásce hledáš intelektuální a dušení spojení — povrchní vztahy tě vyčerpávají.',
    traits: ['Analytický', 'Intuitivní', 'Hledající', 'Nezávislý'],
    love: 'Potřebuješ prostor a hloubku. Nejlépe fungujete s někým, kdo respektuje tvou potřebu ticha a dokáže vést smysluplné rozhovory.',
    shadow: 'Izolace a přílišná sebeanalýza mohou bránit skutečné emocionální blízkosti.',
    compatible: [5, 9, 11],
    color: '#6366f1',
  },
  8: {
    name: 'Vůdce',
    emoji: '✦',
    title: 'Číslo 8 — Vůdce',
    description: 'Jsi ambiciózní, mocný a orientovaný na výsledky. Umíš přeměnit vizi ve skutečnost. V lásce hledáš rovnocenného partnera — ne obdivovatele.',
    traits: ['Ambiciózní', 'Silný', 'Sebevědomý', 'Strategický'],
    love: 'Potřebuješ respekt a rovnocennost. Nejlépe se párujete s někým, kdo má svůj vlastní úspěch a nebojí se stát po tvém boku.',
    shadow: 'Workoholismus a potřeba kontroly může způsobit, že vztahy odsouvají na druhé místo.',
    compatible: [2, 4, 6],
    color: '#dc2626',
  },
  9: {
    name: 'Idealista',
    emoji: '✦',
    title: 'Číslo 9 — Idealista',
    description: 'Jsi velkorysý, soucitný a globálně orientovaný. Cítíš utrpení světa a chceš ho měnit. V lásce hledáš partnera, který sdílí tvé hodnoty.',
    traits: ['Velkorysý', 'Idealistický', 'Soucitný', 'Moudrý'],
    love: 'Potřebuješ sdílené hodnoty a smysl. Nejlépe fungujete s někým, kdo se chce posunovat — ne jen existovat.',
    shadow: 'Přílišný idealismus může vést k zklamání z reálných partnerů, kteří nejsou dokonalí.',
    compatible: [3, 6, 9],
    color: '#0d9488',
  },
  11: {
    name: 'Vizionář',
    emoji: '✦',
    title: 'Master číslo 11 — Vizionář',
    description: 'Jsi mimořádně intuitivní, citlivý a inspirativní. Máš dar vidět věci, které ostatní přehlédnou. V lásce hledáš transcendentní spojení.',
    traits: ['Vizionářský', 'Intuitivní', 'Citlivý', 'Inspirativní'],
    love: 'Potřebuješ hluboké duševní a duchovní spojení. Povrchní vztahy tě vyčerpávají. Hledáš "svou druhou polovinu" v nejhlubším slova smyslu.',
    shadow: 'Příliš vysoká citlivost může způsobit přetížení a ústup ze vztahů.',
    compatible: [2, 6, 7],
    color: '#a855f7',
  },
  22: {
    name: 'Architekt',
    emoji: '✦',
    title: 'Master číslo 22 — Architekt',
    description: 'Jsi mistrovský stavitel — lidí, systémů, světů. Tvůj potenciál je obrovský. V lásce hledáš partnera, který rozumí tvé misi.',
    traits: ['Vizionářský', 'Praktický', 'Disciplinovaný', 'Inspirativní'],
    love: 'Potřebuješ partnera, který stojí pevně na zemi, ale dokáže snít s tebou. Nechceš tě kdokoliv — chceš svého člověka.',
    shadow: 'Obsese s dokonalostí a velikostí může zanechat osobní vztahy v ústraní.',
    compatible: [4, 8, 6],
    color: '#b45309',
  },
  33: {
    name: 'Mistr lásky',
    emoji: '✦',
    title: 'Master číslo 33 — Mistr lásky',
    description: 'Jsi ztělesnění soucitu, léčení a bezpodmínečné lásky. Jsou tě jen 0,3 % populace. V lásce dáváš dary, které si mnozí ani neumí představit.',
    traits: ['Láskyplný', 'Léčivý', 'Moudrý', 'Soucitný'],
    love: 'Potřebuješ partnera, který je schopen přijmout hloubku tvé lásky a opětovat ji. Mnozí se tvé intenzity bojí — ale ten pravý ji pozná.',
    shadow: 'Dávání bez hranic může vést k úplnému vyčerpání.',
    compatible: [6, 9, 3],
    color: '#ec4899',
  },
}

type Step = 'input' | 'result' | 'capture'

export default function TestPage() {
  const [step, setStep] = useState<Step>('input')
  const [birthday, setBirthday] = useState('')
  const [name, setName] = useState('')
  const [lifePath, setLifePath] = useState<number | null>(null)
  const [archetype, setArchetype] = useState<typeof ARCHETYPES[number] | null>(null)
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [waitlistPos, setWaitlistPos] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState('')
  const [refCode, setRefCode] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !archetype) return
    setSubmitting(true)

    try {
      // Generate referral code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      setReferralCode(code)

      // Insert into waitlist table
      const { data, error } = await supabase
        .from('waitlist')
        .insert({
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
        .select('id')
        .single()

      if (error && error.code !== '23505') {
        // 23505 = unique violation (already signed up)
        console.error(error)
      }

      // Get position
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      setWaitlistPos(count || 1)
      setSubmitted(true)
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

  function shareOnIG() {
    // Generate canvas card (handled by share cards component)
    const url = `${window.location.origin}/test?ref=${referralCode}`
    if (navigator.share) {
      navigator.share({
        title: `Jsem ${archetype?.name} — zjisti své číslo`,
        text: `Cosmatch mě označil jako ${archetype?.name} (životní číslo ${lifePath}). Zjisti i ty své: `,
        url,
      })
    } else {
      copyReferralLink()
    }
  }

  if (!archetype && step === 'result') setStep('input')

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-lg mx-auto px-6 py-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="text-pink-500">✦</span> Cosmatch
          </Link>
        </div>

        {/* STEP: INPUT */}
        {step === 'input' && (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-4">✦</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Jaké je tvoje číslo?</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Zadej datum narození a za 10 sekund zjistíš svůj numerologický archetyp — a proč se
              pořád přitahuješ k určitému typu lidí.
            </p>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tvoje jméno (volitelné)</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Jana"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum narození</label>
                <input
                  type="date"
                  className="input w-full"
                  value={birthday}
                  onChange={e => setBirthday(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min="1940-01-01"
                />
              </div>
            </div>

            <button
              className="btn-primary w-full mt-6 py-4 text-lg"
              onClick={handleCalculate}
              disabled={!birthday}
            >
              Zjistit svůj archetyp
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Datum neukládáme bez tvého souhlasu.
            </p>
          </div>
        )}

        {/* STEP: RESULT */}
        {step === 'result' && archetype && (
          <div>
            <div className="card p-8 text-center mb-4" style={{ borderTop: `4px solid ${archetype.color}` }}>
              <div className="text-6xl font-black mb-2" style={{ color: archetype.color }}>{lifePath}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{name ? `${name}, jsi` : 'Jsi'}</h2>
              <h3 className="text-3xl font-black mb-4" style={{ color: archetype.color }}>{archetype.name}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{archetype.description}</p>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {archetype.traits.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: archetype.color }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-left mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">V lásce</p>
                <p className="text-gray-700 text-sm leading-relaxed">{archetype.love}</p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 text-left mb-6">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Tvůj stín</p>
                <p className="text-gray-700 text-sm leading-relaxed">{archetype.shadow}</p>
              </div>

              <div className="bg-pink-50 rounded-2xl p-4 text-left">
                <p className="text-xs font-semibold text-pink-500 uppercase tracking-wide mb-2">Nejlepší shoda</p>
                <p className="text-gray-700 text-sm">
                  Životní čísla{' '}
                  {archetype.compatible.map((n, i) => (
                    <span key={n}>
                      <strong>{n}</strong>{i < archetype.compatible.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  {' '}— najdi je na Cosmatch.
                </p>
              </div>
            </div>

            {/* CTA to email capture */}
            <div className="card p-6 text-center">
              <h4 className="font-bold text-gray-900 mb-2">Chceš najít svou skutečnou shodu?</h4>
              <p className="text-gray-500 text-sm mb-4">
                Cosmatch spouštíme brzy. Zaregistruj se jako první a získej 3 měsíce premium zdarma.
              </p>
              <button className="btn-primary w-full py-3" onClick={() => setStep('capture')}>
                Chci být první
              </button>
              <button className="text-gray-400 text-sm mt-3 underline" onClick={shareOnIG}>
                Sdílet výsledek
              </button>
            </div>
          </div>
        )}

        {/* STEP: EMAIL CAPTURE */}
        {step === 'capture' && !submitted && archetype && (
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${archetype.color}20` }}>
                <span className="text-2xl font-black" style={{ color: archetype.color }}>{lifePath}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Přidej se do waitlistu</h2>
              <p className="text-gray-500 text-sm">
                První uživatelé dostanou voucher na 3 měsíce Cosmatch+ zdarma.
              </p>
            </div>

            <form onSubmit={handleEmailCapture} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  className="input w-full"
                  placeholder="jana@email.cz"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Město (volitelné)</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Praha"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </div>
              {/* Honeypot */}
              <input name="website" style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                className="btn-primary w-full py-4"
                disabled={submitting || !email}
              >
                {submitting ? 'Ukládám...' : 'Rezervovat místo'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Žádný spam. Odhlásit se lze kdykoliv.{' '}
                <Link href="/manifest-duvery" className="underline">Manifest důvěry</Link>
              </p>
            </form>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {submitted && (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Jsi v tom!</h2>
            {waitlistPos && (
              <p className="text-gray-500 mb-2">Tvoje pořadí: <strong className="text-pink-500">#{waitlistPos}</strong></p>
            )}
            <p className="text-gray-500 text-sm mb-6">
              Pošleme ti e-mail, jakmile Cosmatch spustíme — s tvým voucherem na 3 měsíce zdarma.
            </p>

            {/* Referral */}
            <div className="bg-pink-50 rounded-2xl p-5 mb-6">
              <p className="text-sm font-semibold text-pink-600 mb-2">Posuň se v pořadí</p>
              <p className="text-gray-600 text-sm mb-4">
                Za každého přítele, který se přihlásí přes tvůj odkaz, postoupíš o 5 míst.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : 'https://cosmatch.cz'}/test?ref=${referralCode}`}
                  className="input flex-1 text-xs bg-white"
                />
                <button
                  className="btn-primary px-4 text-sm whitespace-nowrap"
                  onClick={copyReferralLink}
                >
                  {copied ? 'Zkopírováno!' : 'Kopírovat'}
                </button>
              </div>
            </div>

            <button className="btn-primary w-full py-3 mb-3" onClick={shareOnIG}>
              Sdílet výsledek
            </button>
            <Link href="/" className="text-gray-400 text-sm underline">Zpět na úvod</Link>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  )
}
