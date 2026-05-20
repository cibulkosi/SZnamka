
'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, HOBBIES, MIN_HOBBIES, MAX_HOBBIES, COUNTRIES, EDUCATION_OPTIONS } from '@/lib/supabase'
import { lifePathNumber, ARCHETYPES, MAGIC_MOMENT_PARTNER_LINE } from '@/lib/archetypes'

const MONTHS = [
  'Leden','Únor','Březen','Duben','Květen','Červen',
  'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'
]
const DAYS_IN_MONTH = [31,29,31,30,31,30,31,31,30,31,30,31]

const HINGE_PROMPTS = [
  'Dám se přesvědčit, pokud…',
  'Moje cestovní zásada je…',
  'Dvě pravdy a jedna lež:',
  'Nejlepší věc tento týden:',
  'Nejzajímavější místo, kde jsem byl/a:',
  'Cesta k mému srdci vede přes…',
  'Nepřeceňovaná radost:',
  'Moje ideální neděle:',
  'Přiznám se…',
  'Jednou jsem se odvážil/a…',
  'Hledám parťáka na…',
]

const SUPABASE_FUNCTIONS_URL = 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1'

type Step = 0 | 1 | 2 | 3 | 4
type PhotoFile = { file: File; preview: string }

async function hashPassword(password: string, email: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'cosmatch_' + email.toLowerCase())
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── UI helper components — MUST be defined OUTSIDE the component
// Otherwise React remounts inputs on every keystroke (focus loss bug)
function Underline(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors ${props.className || ''}`}
    />
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <label className="eyebrow text-gray-500 mb-3 block">{children}</label>
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
        active
          ? 'bg-gray-900 border-gray-900 text-white'
          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-900'
      }`}
    >{children}</button>
  )
}

function PrimaryBtn({ children, disabled, onClick, type }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void; type?: 'button'|'submit' }) {
  return (
    <button type={type || 'button'} onClick={onClick} disabled={disabled}
      className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
    >{children}</button>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    day: '', month: '', birth_year: '',
    birth_time: '', birth_place: '',
    photos: [] as PhotoFile[],
    gender: '', looking_for: '', relationship_goal: '',
    age_min: 18, age_max: 55,
    city: '', country: 'CZ',
    latitude: null as number | null, longitude: null as number | null,
    bio: '', occupation: '', education: '',
    hobbies: [] as string[],
    prompt_q: HINGE_PROMPTS[0], prompt_a: '',
    voucher_code: '',
  })

  const birthday = form.month && form.day
    ? `${String(form.month).padStart(2,'0')}-${String(form.day).padStart(2,'0')}`
    : ''

  const [showBirthdayModal, setShowBirthdayModal] = useState(false)
  const [birthdayStage, setBirthdayStage] = useState<'confirm' | 'magic'>('confirm')
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const openBirthdayConfirm = () => {
    if (!birthday || !form.birth_year) return
    // Age verification: must be 18+
    const year = parseInt(form.birth_year)
    const month = parseInt(form.month) - 1 // JS months 0-indexed
    const day = parseInt(form.day)
    const dob = new Date(year, month, day)
    const today = new Date()
    let age = today.getFullYear() - year
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    if (age < 18) {
      setError('Cosmatch je určen výhradně osobám starším 18 let. Pokud jsi pod 18 let, počkej prosím do plnoletosti.')
      return
    }
    if (age > 100) {
      setError('Zadej prosím správné datum narození.')
      return
    }
    setError('')
    setShowBirthdayModal(true)
  }

  useEffect(() => {
    ;(window as Window & { __ts_cb__?: (t: string) => void; __ts_exp__?: () => void }).__ts_cb__ = (token: string) => setTurnstileToken(token)
    ;(window as Window & { __ts_cb__?: (t: string) => void; __ts_exp__?: () => void }).__ts_exp__ = () => setTurnstileToken('')
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    s.async = true
    document.head.appendChild(s)
    return () => { try { document.head.removeChild(s) } catch {} }
  }, [])

  useEffect(() => {
    const oauthData = localStorage.getItem('cosmatch_oauth')
    if (oauthData) {
      try {
        const { name, email } = JSON.parse(oauthData)
        setForm(f => ({ ...f, name: name || f.name, email: email || f.email }))
        localStorage.removeItem('cosmatch_oauth')
        setStep(1)
      } catch {}
    }
  }, [])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))
  const toggleHobby = (h: string) => {
    if (form.hobbies.includes(h)) {
      set('hobbies', form.hobbies.filter((x: string) => x !== h))
    } else if (form.hobbies.length < MAX_HOBBIES) {
      set('hobbies', [...form.hobbies, h])
    }
    // Pokud už uživatel má MAX_HOBBIES, ignoruj kliknutí (musí nejdřív odznačit)
  }

  const detectLocation = () => {
    if (!navigator.geolocation) { setGeoError('Tvůj prohlížeč nepodporuje GPS.'); return }
    setGeoLoading(true); setGeoError('')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'cs', 'User-Agent': 'cosmatch.cz/1.0' } })
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || ''
          const country = data.address?.country_code?.toUpperCase() || 'CZ'
          if (city) set('city', city)
          if (country) set('country', country)
          set('latitude', latitude); set('longitude', longitude)
          if (!city) setGeoError('Město se nepodařilo zjistit — zadej ho ručně.')
        } catch { setGeoError('Nepodařilo se načíst polohu. Zadej město ručně.') }
        finally { setGeoLoading(false) }
      },
      err => {
        setGeoLoading(false)
        if (err.code === 1) setGeoError('Přístup k poloze byl zamítnut.')
        else if (err.code === 2) setGeoError('Polohu se nepodařilo zjistit.')
        else setGeoError('Vypršel čas pro zjištění polohy.')
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleGoogleSSO = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback` },
    })
  }
  const handleFacebookSSO = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback` },
    })
  }

  const addPhotos = useCallback((files: FileList | null) => {
    if (!files) return
    const cur = form.photos
    const newPhotos: PhotoFile[] = []
    for (let i = 0; i < files.length && cur.length + newPhotos.length < 6; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue
      newPhotos.push({ file, preview: URL.createObjectURL(file) })
    }
    set('photos', [...cur, ...newPhotos])
  }, [form.photos])

  const removePhoto = (idx: number) => {
    const updated = [...form.photos]
    URL.revokeObjectURL(updated[idx].preview)
    updated.splice(idx, 1)
    set('photos', updated)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); addPhotos(e.dataTransfer.files)
  }, [addPhotos])

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const urls: string[] = []
    for (const { file } of form.photos) {
      const fd = new FormData(); fd.append('file', file); fd.append('userId', userId)
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/upload-photo`, { method: 'POST', body: fd })
      const json = await res.json(); if (json.url) urls.push(json.url)
    }
    return urls
  }

  const handleSubmit = async () => {
    if (honeypot) { setLoading(true); await new Promise(r => setTimeout(r, 1500)); setLoading(false); return }
    if (form.gender === 'man' || form.gender === 'male') {
      try {
        const { data: capData } = await supabase.rpc('is_male_cap_reached')
        if (capData === true) { window.location.href = '/waitlist?reason=gender_cap'; return }
      } catch {}
    }
    if (!form.name || !form.email || !birthday) { setError('Vyplň všechna povinná pole.'); return }
    if (form.hobbies.length < MIN_HOBBIES) { setError(`Vyber alespoň ${MIN_HOBBIES} záliby — pomůže nám tě lépe párovat.`); return }
    if (turnstileToken) {
      try {
        const v = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-turnstile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ token: turnstileToken }),
        })
        const vd = await v.json()
        if (!vd.success) { setError('Ověření bezpečnosti selhalo.'); setTurnstileToken(''); return }
      } catch {}
    }
    setLoading(true); setError('')
    try {
      // Auth refactor: use Supabase Auth session id as profile id (must match auth.users.id)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setError('Tvoje přihlášení vypršelo. Přihlaš se znovu přes Google/Facebook.')
        setLoading(false)
        return
      }
      const userId = session.user.id
      // Make sure the email matches what they registered with via OAuth
      const finalEmail = form.email || session.user.email || ''
      const photoUrls = form.photos.length > 0 ? await uploadPhotos(userId) : []
      const passwordHash = form.password ? await hashPassword(form.password, finalEmail) : null
      const { error: dbErr } = await supabase.from('profiles').insert([{
        id: userId, name: form.name, email: finalEmail, birthday,
        birth_year: parseInt(form.birth_year) || new Date().getFullYear() - 25,
        birth_time: form.birth_time || null, birth_place: form.birth_place || null,
        gender: form.gender || 'other', looking_for: form.looking_for || 'everyone',
        relationship_goal: form.relationship_goal || 'unsure',
        age_min: form.age_min, age_max: form.age_max,
        city: form.city, country: form.country,
        bio: form.bio, occupation: form.occupation, education: form.education,
        hobbies: form.hobbies, photos: photoUrls,
        latitude: form.latitude ?? null, longitude: form.longitude ?? null,
        last_seen: new Date().toISOString(),
        prompt_q: form.prompt_q || null, prompt_a: form.prompt_a || null,
        password_hash: passwordHash, premium: false, active: true,
      }])
      if (dbErr) throw dbErr

      // Voucher redemption (optional — silently no-op if voucher_code empty or invalid)
      if (form.voucher_code && form.voucher_code.trim()) {
        try {
          const { data: redeemResult } = await supabase.rpc('redeem_voucher', {
            p_user_id: userId,
            p_code: form.voucher_code.trim().toUpperCase(),
          })
          if (redeemResult?.ok && redeemResult.is_founding_member) {
            // Stored — badge will show in profile based on is_founding_member flag
            console.info('Founding member badge granted, position:', redeemResult.position)
          } else if (!redeemResult?.ok) {
            console.warn('Voucher redemption failed:', redeemResult?.error)
          }
        } catch (e) { console.warn('Voucher RPC error:', e) }
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (profile) { localStorage.setItem('cosmatch_user', JSON.stringify(profile)); router.push('/discover') }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Chyba při registraci.')
    } finally { setLoading(false) }
  }

  const daysInMonth = form.month ? DAYS_IN_MONTH[parseInt(form.month) - 1] : 31

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      {/* Top */}
      <div className="max-w-xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
        <div className="flex items-center gap-1.5">
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`h-1 w-5 rounded-full transition-all ${i <= step ? 'bg-pink-500' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 pt-10 pb-24">

        {/* STEP 0 — SSO */}
        {step === 0 && (
          <>
            <p className="eyebrow text-pink-500 mb-6">Krok 1 z 5 · Účet</p>
            <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
              Vítej u <em className="italic text-pink-500">Cosmatch</em>.
            </h1>
            <hr className="rule w-12 border-gray-900 mb-8" />
            <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-10">
              Přihlásíme tě bezpečně přes Google nebo Facebook.
            </p>

            <div className="space-y-3 mb-10">
              <button onClick={handleGoogleSSO}
                className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white border border-gray-200 hover:border-gray-900 rounded-full text-base font-medium text-gray-900 transition-all active:scale-[0.99]">
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Pokračovat přes Google
              </button>
              <button onClick={handleFacebookSSO}
                className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white border border-gray-200 hover:border-gray-900 rounded-full text-base font-medium text-gray-900 transition-all active:scale-[0.99]">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Pokračovat přes Facebook
              </button>
              <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)}
                tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
            </div>

            <p className="text-xs text-gray-400 leading-relaxed text-center">
              Pokračováním souhlasíš s{' '}
              <Link href="/obchodni-podminky" className="underline hover:text-gray-700">Obchodními podmínkami</Link>
              {' '}a{' '}
              <Link href="/zasady-ochrany-osobnich-udaju" className="underline hover:text-gray-700">Zásadami ochrany osobních údajů</Link>.
              <br />
              Náš závazek vůči tobě →{' '}
              <Link href="/manifest-duvery" className="underline hover:text-gray-700">Manifest důvěry</Link>
            </p>

            <hr className="rule my-10" />
            <p className="text-center text-sm text-gray-500">
              Už máš účet?{' '}
              <Link href="/login" className="text-pink-500 hover:text-pink-600 font-medium">Přihlásit se →</Link>
            </p>
          </>
        )}

        {/* STEP 1 — BIRTHDAY */}
        {step === 1 && (
          <>
            <p className="eyebrow text-pink-500 mb-6">Krok 2 z 5 · Otisk osudu</p>
            <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
              Kdy ses<br/><em className="italic text-pink-500">narodil/a</em>?
            </h1>
            <hr className="rule w-12 border-gray-900 mb-8" />
            <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-10">
              Tvoje datum je neměnný základ kompatibility. Vyber přesný den, měsíc a rok —
              z toho vychází vše ostatní. Pro přesnější a hlubší analýzy doporučujeme přidat
              také čas a místo narození.
            </p>

            <div className="space-y-7 mb-10">
              <div>
                <Eyebrow>Datum narození</Eyebrow>
                <div className="grid grid-cols-3 gap-3">
                  <select value={form.day} onChange={e => set('day', e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 py-3 text-lg text-gray-900 focus:outline-none appearance-none">
                    <option value="">Den</option>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}.</option>)}
                  </select>
                  <select value={form.month} onChange={e => { set('month', e.target.value); set('day', '') }}
                    className="bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 py-3 text-lg text-gray-900 focus:outline-none appearance-none">
                    <option value="">Měsíc</option>
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <input type="number" placeholder="Rok" min="1925" max={String(new Date().getFullYear() - 18)}
                    value={form.birth_year} onChange={e => set('birth_year', e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 py-3 text-lg text-gray-900 focus:outline-none w-full" />
                </div>
                {form.month && !form.day && <p className="text-xs text-pink-500 mt-2">Vyber ještě den.</p>}
              </div>

              <div>
                <Eyebrow>Čas narození <span className="normal-case tracking-normal text-gray-400 ml-2">(nepovinné)</span></Eyebrow>
                <Underline type="time" value={form.birth_time} onChange={e => set('birth_time', e.target.value)} />
              </div>

              <div>
                <Eyebrow>Místo narození <span className="normal-case tracking-normal text-gray-400 ml-2">(nepovinné)</span></Eyebrow>
                <Underline placeholder="Praha · Brno · Bratislava…" value={form.birth_place}
                  onChange={e => set('birth_place', e.target.value)} />
              </div>
            </div>

            <PrimaryBtn disabled={!birthday || !form.birth_year} onClick={openBirthdayConfirm}>Pokračovat</PrimaryBtn>
            <button onClick={() => setStep(0)} className="block mx-auto mt-6 text-sm text-gray-400 hover:text-gray-700 transition">← Zpět</button>
          </>
        )}

        {/* STEP 2 — PHOTOS */}
        {step === 2 && (
          <>
            <p className="eyebrow text-pink-500 mb-6">Krok 3 z 5 · Fotky</p>
            <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
              Ukaž se,<br/><em className="italic text-pink-500">jak vypadáš</em>.
            </h1>
            <hr className="rule w-12 border-gray-900 mb-8" />
            <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-8">
              Stačí jedna fotka. Další můžeš přidat kdykoli později. Profily s alespoň
              jednou fotkou dostávají osmkrát víc shod.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {form.photos.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  <img src={p.preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(i)}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black transition">×</button>
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 bg-white text-gray-900 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full font-medium">Hlavní</span>
                  )}
                </div>
              ))}
              {form.photos.length < 6 && (
                <button onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop} onDragOver={e => e.preventDefault()}
                  className="aspect-square rounded-2xl border border-dashed border-gray-300 bg-white/40 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition serif text-3xl">
                  +
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
              onChange={e => addPhotos(e.target.files)} />
            <p className="text-xs text-gray-400 mb-10">JPG / PNG / WebP · max 10 MB / foto · až 6 fotek</p>

            <PrimaryBtn onClick={() => setStep(3)}>{form.photos.length === 0 ? 'Přeskočit zatím' : 'Pokračovat'}</PrimaryBtn>
            <button onClick={() => setStep(1)} className="block mx-auto mt-6 text-sm text-gray-400 hover:text-gray-700 transition">← Zpět</button>
          </>
        )}

        {/* STEP 3 — ABOUT */}
        {step === 3 && (
          <>
            <p className="eyebrow text-pink-500 mb-6">Krok 4 z 5 · O tobě</p>
            <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
              Kdo jsi<br/>a <em className="italic text-pink-500">koho hledáš</em>?
            </h1>
            <hr className="rule w-12 border-gray-900 mb-10" />

            <div className="space-y-10 mb-10">
              <div>
                <Eyebrow>Jsem</Eyebrow>
                <div className="flex flex-wrap gap-2">
                  {[['man','Muž'],['woman','Žena'],['other','Jiné']].map(([v,l]) => (
                    <Pill key={v} active={form.gender === v} onClick={() => set('gender', v)}>{l}</Pill>
                  ))}
                </div>
              </div>

              <div>
                <Eyebrow>Hledám</Eyebrow>
                <div className="flex flex-wrap gap-2">
                  {[['men','Muže'],['women','Ženy'],['everyone','Všechny']].map(([v,l]) => (
                    <Pill key={v} active={form.looking_for === v} onClick={() => set('looking_for', v)}>{l}</Pill>
                  ))}
                </div>
              </div>

              <div>
                <Eyebrow>Záměr</Eyebrow>
                <div className="flex flex-wrap gap-2">
                  {[['serious','Vážný vztah'],['friendship','Přátelství'],['casual','Nezávazně'],['unsure','Zatím nevím']].map(([v,l]) => (
                    <Pill key={v} active={form.relationship_goal === v} onClick={() => set('relationship_goal', v)}>{l}</Pill>
                  ))}
                </div>
              </div>

              <div>
                <Eyebrow>Věkové rozmezí · {form.age_min}–{form.age_max} let</Eyebrow>
                <div className="flex gap-4 items-center">
                  <input type="range" min="18" max="70" value={form.age_min}
                    onChange={e => set('age_min', Math.min(parseInt(e.target.value), form.age_max - 1))}
                    className="flex-1 accent-pink-500" />
                  <input type="range" min="19" max="80" value={form.age_max}
                    onChange={e => set('age_max', Math.max(parseInt(e.target.value), form.age_min + 1))}
                    className="flex-1 accent-pink-500" />
                </div>
              </div>

              <div>
                <Eyebrow>Kde žiješ</Eyebrow>
                <button type="button" onClick={detectLocation} disabled={geoLoading}
                  className="w-full mb-3 py-3 px-5 rounded-full border border-gray-300 hover:border-gray-900 text-sm font-medium text-gray-700 hover:text-gray-900 transition disabled:opacity-50">
                  {geoLoading ? 'Zjišťuji polohu…' : 'Zjistit automaticky'}
                </button>
                {geoError && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 mb-3">{geoError}</p>}
                <div className="grid grid-cols-2 gap-3">
                  <Underline placeholder="Město" value={form.city} onChange={e => set('city', e.target.value)} />
                  <select value={form.country} onChange={e => set('country', e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 py-3 text-lg text-gray-900 focus:outline-none appearance-none">
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <PrimaryBtn onClick={() => setStep(4)}>Pokračovat</PrimaryBtn>
            <button onClick={() => setStep(2)} className="block mx-auto mt-6 text-sm text-gray-400 hover:text-gray-700 transition">← Zpět</button>
          </>
        )}

        {/* STEP 4 — PROFILE */}
        {step === 4 && (
          <>
            <p className="eyebrow text-pink-500 mb-6">Krok 5 z 5 · Profil</p>
            <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
              Pár detailů,<br/>aby <em className="italic text-pink-500">tě poznali</em>.
            </h1>
            <hr className="rule w-12 border-gray-900 mb-10" />

            <div className="space-y-10 mb-10">
              <div>
                <Eyebrow>Jak ti říkat</Eyebrow>
                <Underline value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tvoje jméno" />
              </div>
              <div>
                <Eyebrow>E-mail</Eyebrow>
                <Underline type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jana@example.cz" />
              </div>

              <div>
                <Eyebrow>Krátké intro</Eyebrow>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
                  placeholder="Napiš pár vět o sobě…" rows={3}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Eyebrow>Povolání</Eyebrow>
                  <Underline value={form.occupation} onChange={e => set('occupation', e.target.value)} placeholder="Architekt…" />
                </div>
                <div>
                  <Eyebrow>Vzdělání</Eyebrow>
                  <select value={form.education} onChange={e => set('education', e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 py-3 text-lg text-gray-900 focus:outline-none appearance-none">
                    <option value="">Vybrat…</option>
                    {EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <Eyebrow>Záliby <span className="normal-case tracking-normal text-gray-400 ml-2">vybráno: {form.hobbies.length} / {MAX_HOBBIES} <span className={form.hobbies.length < MIN_HOBBIES ? "text-pink-500" : "text-emerald-600"}>(min {MIN_HOBBIES})</span></span></Eyebrow>
                <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto">
                  {HOBBIES.map(h => (
                    <button key={h} type="button" onClick={() => toggleHobby(h)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                        form.hobbies.includes(h)
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-900'
                      }`}
                    >{h}</button>
                  ))}
                </div>
              </div>

              <div>
                <Eyebrow>Otázka, na kterou odpovíš</Eyebrow>
                <select value={form.prompt_q} onChange={e => set('prompt_q', e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 py-3 text-lg text-gray-900 focus:outline-none appearance-none mb-4">
                  {HINGE_PROMPTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <Underline value={form.prompt_a} onChange={e => set('prompt_a', e.target.value)} placeholder="Tvoje odpověď…" />
              </div>

              <div>
                <Eyebrow>Voucher kód <span className="normal-case tracking-normal text-gray-400 ml-2">volitelné</span></Eyebrow>
                <Underline
                  value={form.voucher_code}
                  onChange={e => set('voucher_code', e.target.value.toUpperCase())}
                  placeholder="např. K7XP9M2A"
                />
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Pokud jsi dostal/a kód z e-mailu po waitlist signup, vlož ho sem. Odemkne ti 3 měsíce Cosmatch+ zdarma až ho spustíme.
                </p>
              </div>

              {/* GDPR Article 9 explicit consent — required for processing gender/orientation/birth date */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-white space-y-3">
                <p className="eyebrow text-gray-500 mb-2">Souhlasy</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 accent-pink-500 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Souhlasím s <Link href="/obchodni-podminky" className="text-pink-500 underline">Obchodními podmínkami</Link> a <Link href="/zasady-ochrany-osobnich-udaju" className="text-pink-500 underline">Zásadami ochrany osobních údajů</Link>.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 accent-pink-500 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Výslovně souhlasím se zpracováním údajů o <strong>pohlaví, hledaném pohlaví a datu narození</strong> pro účely párování podle čl. 9 odst. 2 písm. a) GDPR. Bez tohoto souhlasu Cosmatch nemůže fungovat.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 accent-pink-500 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    <span className="text-gray-500">(volitelné)</span> Souhlasím s občasnými e-maily o novinkách Cosmatch. Můžeš kdykoli odhlásit.
                  </span>
                </label>
              </div>

              <div className="flex justify-center pt-4">
                <div className="cf-turnstile"
                  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                  data-callback="__ts_cb__" data-expired-callback="__ts_exp__" data-theme="light" />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">{error}</p>}
            </div>

            <PrimaryBtn onClick={handleSubmit} disabled={loading}>
              {loading ? 'Vytvářím tvůj profil…' : 'Hotovo'}
            </PrimaryBtn>
            <button onClick={() => setStep(3)} className="block mx-auto mt-6 text-sm text-gray-400 hover:text-gray-700 transition">← Zpět</button>
          </>
        )}
      </div>

      {/* BIRTHDAY CONFIRM MODAL */}
      {showBirthdayModal && (() => {
        const fullDate = `${form.birth_year}-${String(form.month).padStart(2,'0')}-${String(form.day).padStart(2,'0')}`
        const lp = lifePathNumber(fullDate)
        const archetype = ARCHETYPES[lp] || ARCHETYPES[9]
        const partnerLine = MAGIC_MOMENT_PARTNER_LINE[lp] || MAGIC_MOMENT_PARTNER_LINE[9]
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FAF6F0] rounded-3xl p-10 max-w-md w-full shadow-2xl">
              {birthdayStage === 'confirm' ? (
                <>
                  <p className="eyebrow text-pink-500 mb-4">Potvrzení</p>
                  <h3 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">
                    {String(form.day).padStart(2,'0')}. {['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'][parseInt(form.month)-1]} {form.birth_year}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-[1.0625rem] mb-8">
                    Datum narození <strong className="font-medium text-gray-900">nelze po registraci změnit</strong> —
                    je trvale svázané s tvým numerologickým profilem.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowBirthdayModal(false); setBirthdayStage('confirm') }}
                      className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-4 rounded-full font-medium transition">
                      Opravit
                    </button>
                    <button onClick={() => setBirthdayStage('magic')}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-medium transition">
                      Souhlasím
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="eyebrow mb-4" style={{ color: archetype.accent }}>Tvůj numerologický archetyp</p>
                  <h3 className="serif-display text-4xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-2">
                    <em className="italic" style={{ color: archetype.accent }}>{archetype.name}</em>
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">{archetype.tagline}</p>
                  <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                    {archetype.description}
                  </p>
                  <p className="text-gray-900 leading-[1.75] text-[1.0625rem] font-medium mb-8 border-l-2 pl-4" style={{ borderColor: archetype.accent }}>
                    {partnerLine}
                  </p>
                  <button onClick={() => { setShowBirthdayModal(false); setBirthdayStage('confirm'); setStep(2) }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-medium transition">
                    Pokračovat v registraci
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                    Tento výklad je interpretační rámec, ne predikce. Cosmatch staví na 366 archetypech podle dne narození pro skutečné matchování.
                  </p>
                </>
              )}
            </div>
          </div>
        )
      })()}
    </main>
  )
}
