'use client'
import { useState, useEffect, useRef } from 'react'
import { lifePathNumber, ARCHETYPES, type Archetype } from '@/lib/archetypes'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)





type Step = 'intro' | 'birthday' | 'result' | 'capture' | 'done'

function makeVoucher(): string {
  const part = () => Math.random().toString(36).substring(2, 6).toUpperCase()
  return `COSMATCH-${part()}-${part()}`
}

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
  const [voucherCode, setVoucherCode] = useState('')
  const [refCode, setRefCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [voucherCopied, setVoucherCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
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
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !archetype) return
    setSubmitting(true)
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      const voucher = makeVoucher()
      setReferralCode(code)
      setVoucherCode(voucher)
      const { error } = await supabase.from('waitlist').insert({
        email,
        name: name || null,
        city: city || null,
        birthday,
        life_path: lifePath,
        archetype: archetype.name,
        referral_code: code,
        referred_by: refCode || null,
        voucher_code: voucher,
        source: 'quiz',
      })

      // Fire-and-forget welcome email (Edge Function with Resend)
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/waitlist-welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ email, name: name || null, voucher_code: voucher, archetype: archetype.name, life_path: lifePath, source: 'quiz' }),
      }).catch(() => { /* email is best-effort */ })
      if (error && error.code !== '23505') console.error(error)
      const { count } = await supabase.from('waitlist_public').select('*', { count: 'exact', head: true })
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

  /**
   * Draws a 1080x1920 (9:16) shareable card to the offscreen canvas.
   * Returns the Blob if successful, else null.
   */
  function drawCard(): Promise<Blob | null> {
    return new Promise(resolve => {
      const canvas = canvasRef.current
      if (!canvas || !archetype) return resolve(null)

      const W = 1080, H = 1920
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(null)

      // Background — cream with subtle radial accent
      ctx.fillStyle = '#FAF6F0'
      ctx.fillRect(0, 0, W, H)
      const grad = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H*0.4, W*0.7)
      grad.addColorStop(0, 'rgba(236,72,153,0.06)')
      grad.addColorStop(1, 'rgba(236,72,153,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Top wordmark
      ctx.fillStyle = '#1C1C1E'
      ctx.font = '600 38px "Inter", -apple-system, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('COSMATCH', W/2, 130)

      // Eyebrow above number
      ctx.fillStyle = '#ec4899'
      ctx.font = '500 26px "Inter", sans-serif'
      ctx.fillText('TVŮJ NUMEROLOGICKÝ ARCHETYP', W/2, 360)

      // Big number
      ctx.fillStyle = archetype.accent || '#ec4899'
      ctx.font = '500 460px Georgia, "Times New Roman", serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(lifePath), W/2, 720)

      // Archetype name (italic)
      ctx.fillStyle = '#1C1C1E'
      ctx.textBaseline = 'alphabetic'
      ctx.font = 'italic 600 110px Georgia, serif'
      ctx.fillText(archetype.name, W/2, 1100)

      // Tagline — wrap to multiple lines if needed
      ctx.fillStyle = '#4B5563'
      ctx.font = '400 36px "Inter", sans-serif'
      wrapText(ctx, archetype.tagline || '', W/2, 1200, W - 200, 50)

      // Hairline rule
      ctx.strokeStyle = 'rgba(28,28,30,0.2)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(W/2 - 40, H - 240); ctx.lineTo(W/2 + 40, H - 240); ctx.stroke()

      // Bottom CTA
      ctx.fillStyle = '#1C1C1E'
      ctx.font = '500 34px "Inter", sans-serif'
      ctx.fillText('Zjisti své číslo', W/2, H - 170)
      ctx.fillStyle = '#ec4899'
      ctx.font = '500 28px "Inter", sans-serif'
      ctx.fillText('cosmatch.cz', W/2, H - 120)

      canvas.toBlob(blob => resolve(blob), 'image/png', 0.95)
    })
  }

  /** Helper: word-wrap text, center-aligned. */
  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ')
    let line = ''
    const lines: string[] = []
    for (const w of words) {
      const test = line + w + ' '
      if (ctx.measureText(test).width > maxWidth && line !== '') {
        lines.push(line.trim())
        line = w + ' '
      } else {
        line = test
      }
    }
    lines.push(line.trim())
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight))
  }

  async function downloadCard() {
    setDownloading(true)
    try {
      const blob = await drawCard()
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cosmatch-${archetype?.name?.toLowerCase() || 'archetyp'}-${lifePath}.png`
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    } finally { setDownloading(false) }
  }

  async function shareResult() {
    const url = `${window.location.origin}/test?ref=${referralCode || ''}`
    const text = `Jsem „${archetype?.name}" (číslo ${lifePath}) — zjisti i své na Cosmatch.`

    // Try Web Share API with PNG file (supported on iOS Safari, Chrome Android)
    if (navigator.share && archetype) {
      try {
        const blob = await drawCard()
        if (blob && navigator.canShare?.({ files: [new File([blob], 'cosmatch.png', { type: 'image/png' })] })) {
          await navigator.share({
            title: 'Cosmatch — Tvůj numerologický archetyp',
            text,
            url,
            files: [new File([blob], 'cosmatch.png', { type: 'image/png' })],
          })
          return
        }
        // Fallback — share without file
        await navigator.share({ title: 'Cosmatch', text, url })
        return
      } catch { /* user cancelled or share failed — fall through */ }
    }
    // Last resort — just copy link
    copyReferralLink()
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
              Proč pořád<br/>přitahuješ<br/><em className="italic text-pink-500">stejný typ</em><br/>lidí?
            </h1>
            <hr className="rule w-12 border-gray-900 mb-8" />
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Tvoje datum narození zná odpověď. Cosmatch ti za 30 sekund spočítá tvůj
              numerologický archetyp a ukáže ti, jaký partner ti skutečně sedí.
            </p>
            <p className="text-gray-500 leading-relaxed mb-12">
              Zdarma. Bez registrace. Nemusíš se přihlašovat, pokud nechceš.
            </p>

            <button
              onClick={() => setStep('birthday')}
              className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all"
            >
              Začít kvíz
            </button>

            <p className="text-xs text-gray-400 text-center mt-6">
              Cosmatch je první česká seznamka, která tě páruje podle data narození.
            </p>
          </div>
        )}

        {/* STEP: BIRTHDAY */}
        {step === 'birthday' && (
          <div className="pt-4">
            <p className="eyebrow text-gray-400 mb-6">Krok 1 ze 2</p>
            <h2 className="serif-display text-4xl sm:text-5xl text-gray-900 font-medium leading-[1.1] tracking-tight mb-6">
              Kdy ses narodil/a?
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
              <p className="eyebrow text-pink-500 mb-3">Co tě čeká v aplikaci</p>
              <h3 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">
                Tohle je jen úvod.
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-[1.0625rem]">
                Tvoje životní číslo je <strong className="text-gray-900 font-medium">numerologický základ</strong> —
                kdo jsi v jádru. V Cosmatch aplikaci ale uvidíš svůj <strong className="text-gray-900 font-medium">kompletní profil podle dne narození</strong>
                (1 z 366 unikátních archetypů) a kompatibilitu s konkrétními lidmi, kteří hledají taky.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
                Algoritmus shody čerpá ze 4 vrstev: profily Goldschneidera, harmonie životních čísel,
                elementární souznění a astrologické aspekty.
                <a href="/jak-funguje-cosmatch" className="text-pink-500 hover:underline"> Detail výpočtu →</a>
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

              <button
                onClick={downloadCard}
                disabled={downloading}
                className="w-full mt-3 bg-white text-gray-900 border border-gray-300 hover:border-gray-900 py-4 rounded-full text-sm font-medium transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {downloading ? 'Generuji obrázek…' : 'Stáhnout kartu (1080 × 1920)'}
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Karta ve formátu pro Instagram Stories. Stáhne se jako PNG.
              </p>
            </div>

            {voucherCode && (
              <>
                <hr className="rule my-12" />
                <div className="text-left">
                  <p className="eyebrow text-pink-500 mb-3">Tvůj voucher</p>
                  <h3 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
                    Tři měsíce Cosmatch+ zdarma.
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
                    Tento kód si ulož. Připíšeme ho i k tobě do e-mailu — uplatníš ho
                    při spuštění aplikace.
                  </p>
                  <div className="bg-white border-2 border-dashed border-pink-300 rounded-2xl p-5 flex items-center gap-3 mb-2">
                    <code className="flex-1 bg-transparent text-pink-600 text-base font-bold font-mono truncate text-center">
                      {voucherCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(voucherCode).then(() => {
                          setVoucherCopied(true); setTimeout(() => setVoucherCopied(false), 2000)
                        })
                      }}
                      className="px-4 py-2 bg-gray-900 text-white text-sm rounded-full font-medium hover:bg-gray-800 transition flex-shrink-0"
                    >
                      {voucherCopied ? 'Zkopírováno' : 'Kopírovat'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Voucher je vázán na tvůj e-mail. Pošleme ti ho i v potvrzovacím mailu.
                  </p>
                </div>
              </>
            )}

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

      {/* Hidden offscreen canvas for 9:16 share card */}
      <canvas ref={canvasRef} aria-hidden="true" style={{
        position: 'fixed', left: '-99999px', top: '-99999px',
        width: '1080px', height: '1920px', pointerEvents: 'none',
      }} />
    </main>
  )
}
