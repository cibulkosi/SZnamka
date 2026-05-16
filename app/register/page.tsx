'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, HOBBIES, COUNTRIES, EDUCATION_OPTIONS } from '@/lib/supabase'

const MONTHS = [
  'Leden','Únor','Březen','Duben','Květen','Červen',
  'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'
]
const DAYS_IN_MONTH = [31,29,31,30,31,30,31,31,30,31,30,31]

const HINGE_PROMPTS = [
  'Dám se přesvědčit, pokud...',
  'Moje cestovní zásada je...',
  'Dva pravdy a lež:',
  'Nejlepší věc, co se mi stala tento týden:',
  'Nejzajímavější místo, kde jsem byl/a:',
  'Způsob jak najít cestu k mému srdci:',
  'Nepřeceňovaná radost:',
  'Moje ideální neděle:',
  'Přiznam se...',
  'Jednou jsem odvážně...',
  'Hledám parťáka na...',
]

const SUPABASE_FUNCTIONS_URL = 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1'

type Step = 0 | 1 | 2 | 3 | 4
type PhotoFile = { file: File; preview: string }


// SHA-256 hash hesla — email jako salt (běží v prohlížeči přes Web Crypto API)
async function hashPassword(password: string, email: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'cosmatch_' + email.toLowerCase())
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
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
    bio: '', occupation: '', education: '',
    hobbies: [] as string[],
    prompt_q: HINGE_PROMPTS[0], prompt_a: '',
  })

  const birthday = form.month && form.day
    ? `${String(form.month).padStart(2,'0')}-${String(form.day).padStart(2,'0')}`
    : ''

  // OAuth prefill — přijde z Google/Facebook redirect
  useEffect(() => {
    const oauthData = localStorage.getItem('cosmatch_oauth')
    if (oauthData) {
      try {
        const { name, email } = JSON.parse(oauthData)
        setForm(f => ({ ...f, name: name || f.name, email: email || f.email }))
        localStorage.removeItem('cosmatch_oauth')
        setStep(1)
      } catch { /* ignore */ }
    }
  }, [])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const toggleHobby = (h: string) => set('hobbies',
    form.hobbies.includes(h) ? form.hobbies.filter((x: string) => x !== h) : [...form.hobbies, h])

  // Geolokace přes browser + Nominatim
  const detectLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
        const data = await res.json()
        const city = data.address?.city || data.address?.town || data.address?.village || ''
        const country = data.address?.country_code?.toUpperCase() || 'CZ'
        if (city) set('city', city)
        if (country) set('country', country)
      } catch { /* ignore */ }
    })
  }

  // SSO handlers
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
    e.preventDefault()
    addPhotos(e.dataTransfer.files)
  }, [addPhotos])

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const urls: string[] = []
    for (const { file } of form.photos) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('userId', userId)
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/upload-photo`, { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) urls.push(json.url)
    }
    return urls
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !birthday) {
      setError('Vyplň všechna povinná pole.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const userId = crypto.randomUUID()
      const photoUrls = form.photos.length > 0 ? await uploadPhotos(userId) : []
      const passwordHash = await hashPassword(form.password, form.email)

      const { error: dbErr } = await supabase.from('profiles').insert([{
        id: userId,
        name: form.name,
        email: form.email,
        birthday,
        birth_year: parseInt(form.birth_year) || new Date().getFullYear() - 25,
        birth_time: form.birth_time || null,
        birth_place: form.birth_place || null,
        gender: form.gender || 'other',
        looking_for: form.looking_for || 'everyone',
        relationship_goal: form.relationship_goal || 'unsure',
        age_min: form.age_min,
        age_max: form.age_max,
        city: form.city,
        country: form.country,
        bio: form.bio,
        occupation: form.occupation,
        education: form.education,
        hobbies: form.hobbies,
        photos: photoUrls,
        prompt_q: form.prompt_q || null,
        prompt_a: form.prompt_a || null,
        password_hash: passwordHash,
        premium: false,
        active: true,
      }])

      if (dbErr) throw dbErr

      const { data: profile } = await supabase
        .from('profiles').select('*').eq('email', form.email).single()

      if (profile) {
        localStorage.setItem('cosmatch_user', JSON.stringify(profile))
        router.push('/discover')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Chyba při registraci.')
    } finally {
      setLoading(false)
    }
  }

  const daysInMonth = form.month ? DAYS_IN_MONTH[parseInt(form.month) - 1] : 31

  const ProgressBar = ({ current }: { current: number }) => (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
          i < current - 1 ? 'bg-pink-500' : i === current - 1 ? 'bg-pink-400' : 'bg-gray-100'
        }`} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-pink-500 text-2xl font-bold">✦</span>
        <span className="text-xl font-bold text-gray-900">Cosmatch</span>
      </Link>

      {/* ═══ KROK 0 — Vytvoř účet ═══ */}
      {step === 0 && (
        <div className="card w-full max-w-md p-8">
          <ProgressBar current={1} />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">👋 Vytvoř si účet</h2>
          <p className="text-gray-400 text-sm mb-6">Začínáme — jen základní info</p>

          {/* SSO tlačítka */}
          <div className="space-y-3 mb-5">
            <button
              onClick={handleGoogleSSO}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Pokračovat přes Google
            </button>
            <button
              onClick={handleFacebookSSO}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-2xl bg-white hover:border-blue-200 hover:bg-blue-50 transition-all font-medium text-gray-700"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Pokračovat přes Facebook
            </button>
          </div>

          {/* Oddělovač */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-400 text-xs">nebo e-mailem</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Jméno *</label>
              <input className="input" placeholder="Jak ti říkají?" value={form.name}
                onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">E-mail *</label>
              <input className="input" type="email" placeholder="tvuj@email.cz" value={form.email}
                onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Heslo *</label>
              <input className="input" type="password" placeholder="min. 8 znaků" value={form.password}
                onChange={e => set('password', e.target.value)} />
            </div>
            <button className="btn-primary w-full mt-2" onClick={() => setStep(1)}
              disabled={!form.name || !form.email || !form.password}>
              Pokračovat →
            </button>
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            Už máš účet?{' '}
            <Link href="/login" className="text-pink-500 hover:text-pink-600 font-semibold">Přihlásit se</Link>
          </p>
        </div>
      )}

      {/* ═══ KROK 1 — Datum narození ═══ */}
      {step === 1 && (
        <div className="card w-full max-w-md p-8">
          <ProgressBar current={2} />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">🌟 Datum narození</h2>
          <p className="text-gray-400 text-sm mb-6">Základ personologické kompatibility</p>
          <div className="space-y-4">
            <div>
              <label className="text-gray-500 text-sm mb-2 block">📅 Datum *</label>
              <div className="grid grid-cols-3 gap-2">
                <select className="input" value={form.day} onChange={e => set('day', e.target.value)}>
                  <option value="">Den</option>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}.</option>
                  ))}
                </select>
                <select className="input" value={form.month}
                  onChange={e => { set('month', e.target.value); set('day', '') }}>
                  <option value="">Měsíc</option>
                  {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <input className="input" type="number" placeholder="Rok" min="1940" max="2007"
                  value={form.birth_year} onChange={e => set('birth_year', e.target.value)} />
              </div>
            </div>

            {form.month && !form.day && (
              <p className="text-xs text-pink-500 mt-1">👆 Vyber ještě den</p>
            )}

            {birthday && (
              <div className="flex gap-2 bg-amber-50 border border-amber-300 rounded-2xl p-4">
                <span className="text-amber-500 text-lg flex-shrink-0">🔒</span>
                <p className="text-amber-800 text-xs leading-relaxed">
                  <strong className="text-amber-900 block mb-1">Zadejte své skutečné datum narození.</strong>
                  Cosmatch není založen na náhodě, ale na přesných výpočtech vaší a partnerovy osobnosti.
                  Falešné datum povede k nefunkčním shodám. <strong>Datum po registraci nelze změnit.</strong>
                </p>
              </div>
            )}

            <div>
              <label className="text-gray-500 text-sm mb-1 block">
                ⏰ Čas narození <span className="text-gray-300">(nepovinné — pro přesnější shody)</span>
              </label>
              <input className="input" type="time" value={form.birth_time}
                onChange={e => set('birth_time', e.target.value)} />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">
                📍 Místo narození <span className="text-gray-300">(nepovinné)</span>
              </label>
              <input className="input" placeholder="Praha, Brno, Bratislava..." value={form.birth_place}
                onChange={e => set('birth_place', e.target.value)} />
            </div>
            <div className="flex gap-3 pt-2">
              <button className="btn-secondary flex-1" onClick={() => setStep(0)}>← Zpět</button>
              <button className="btn-primary flex-1" onClick={() => setStep(2)}
                disabled={!birthday || !form.birth_year}>
                Pokračovat →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ KROK 2 — Fotky ═══ */}
      {step === 2 && (
        <div className="card w-full max-w-md p-8">
          <ProgressBar current={3} />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">📸 Tvoje fotky</h2>
          <p className="text-gray-400 text-sm mb-6">Přidej 1–6 fotek. Profily s fotkami dostávají 8× více shod.</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {form.photos.map((p, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80 transition-colors">
                  ✕
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Hlavní
                  </span>
                )}
              </div>
            ))}
            {form.photos.length < 6 && (
              <button onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop} onDragOver={e => e.preventDefault()}
                className="aspect-square rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 flex flex-col items-center justify-center text-pink-400 hover:border-pink-400 hover:bg-pink-100 transition-all cursor-pointer">
                <span className="text-2xl mb-1">+</span>
                <span className="text-xs">Přidat</span>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
            multiple className="hidden" onChange={e => addPhotos(e.target.files)} />
          <p className="text-gray-300 text-xs text-center mb-6">JPG / PNG / WebP · max 10 MB / foto</p>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setStep(1)}>← Zpět</button>
            <button className="btn-primary flex-1" onClick={() => setStep(3)}>
              {form.photos.length === 0 ? 'Přeskočit →' : 'Pokračovat →'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ KROK 3 — O tobě ═══ */}
      {step === 3 && (
        <div className="card w-full max-w-md p-8">
          <ProgressBar current={4} />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">💫 O tobě</h2>
          <p className="text-gray-400 text-sm mb-6">Kdo jsi a koho hledáš</p>
          <div className="space-y-5">
            <div>
              <label className="text-gray-500 text-sm mb-2 block">Jsem</label>
              <div className="grid grid-cols-3 gap-2">
                {[['man','Muž 👨'],['woman','Žena 👩'],['other','Jiné 🌈']].map(([v,l]) => (
                  <button key={v} onClick={() => set('gender', v)}
                    className={`py-2 px-3 rounded-2xl border text-sm font-medium transition-all ${form.gender === v ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">Hledám</label>
              <div className="grid grid-cols-3 gap-2">
                {[['men','Muže 👨'],['women','Ženy 👩'],['everyone','Všechny 💫']].map(([v,l]) => (
                  <button key={v} onClick={() => set('looking_for', v)}
                    className={`py-2 px-3 rounded-2xl border text-sm font-medium transition-all ${form.looking_for === v ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">
                Věkové rozmezí: <strong className="text-gray-700">{form.age_min}–{form.age_max} let</strong>
              </label>
              <div className="flex gap-3 items-center">
                <input type="range" min="18" max="70" value={form.age_min}
                  onChange={e => set('age_min', Math.min(parseInt(e.target.value), form.age_max - 1))}
                  className="flex-1 accent-pink-500" />
                <input type="range" min="19" max="80" value={form.age_max}
                  onChange={e => set('age_max', Math.max(parseInt(e.target.value), form.age_min + 1))}
                  className="flex-1 accent-pink-500" />
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">🎯 Hledám</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['serious','💍 Vážný vztah'],
                  ['friendship','🤝 Přátelství'],
                  ['casual','✌️ Nezávazně'],
                  ['unsure','🤔 Zatím nevím'],
                ].map(([v,l]) => (
                  <button key={v} onClick={() => set('relationship_goal', v)}
                    className={`py-2.5 px-3 rounded-2xl border text-sm font-medium transition-all text-left ${form.relationship_goal === v ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Lokace s GPS */}
            <div>
              <label className="text-gray-500 text-sm mb-2 block">📍 Kde žiješ?</label>
              <button type="button" onClick={detectLocation}
                className="w-full mb-2 py-2.5 px-4 rounded-2xl border-2 border-dashed border-pink-200 text-pink-500 text-sm font-medium hover:border-pink-400 hover:bg-pink-50 transition-all flex items-center justify-center gap-2">
                📡 Zjistit automaticky (GPS)
              </button>
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="Město..." value={form.city}
                  onChange={e => set('city', e.target.value)} />
                <select className="input" value={form.country} onChange={e => set('country', e.target.value)}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button className="btn-secondary flex-1" onClick={() => setStep(2)}>← Zpět</button>
              <button className="btn-primary flex-1" onClick={() => setStep(4)}>Pokračovat →</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ KROK 4 — Profil ═══ */}
      {step === 4 && (
        <div className="card w-full max-w-md p-8">
          <ProgressBar current={5} />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">✨ Dokonči profil</h2>
          <p className="text-gray-400 text-sm mb-6">Pár detailů, díky kterým tě ostatní poznají</p>
          <div className="space-y-5">
            <div>
              <label className="text-gray-500 text-sm mb-1 block">💬 Intro</label>
              <textarea className="input resize-none h-20" placeholder="Napiš něco zajímavého o sobě..."
                value={form.bio} onChange={e => set('bio', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-500 text-sm mb-1 block">💼 Povolání</label>
                <input className="input" placeholder="Architekt..."
                  value={form.occupation} onChange={e => set('occupation', e.target.value)} />
              </div>
              <div>
                <label className="text-gray-500 text-sm mb-1 block">🎓 Vzdělání</label>
                <select className="input" value={form.education} onChange={e => set('education', e.target.value)}>
                  <option value="">Vybrat...</option>
                  {EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">🎯 Záliby <span className="text-gray-300 text-xs">(ovlivňují kompatibilitu)</span></label>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
                {HOBBIES.map(h => (
                  <button key={h} onClick={() => toggleHobby(h)}
                    className={`py-1 px-2.5 rounded-full text-xs border font-medium transition-all ${
                      form.hobbies.includes(h)
                        ? 'bg-pink-500 border-pink-500 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                    }`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">💡 Odpověz na otázku</label>
              <select className="input mb-2" value={form.prompt_q}
                onChange={e => set('prompt_q', e.target.value)}>
                {HINGE_PROMPTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input className="input" placeholder="Tvoje odpověď..."
                value={form.prompt_a} onChange={e => set('prompt_a', e.target.value)} />
            </div>
            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-3 rounded-2xl">{error}</p>
            )}
            <div className="flex gap-3 pt-1">
              <button className="btn-secondary flex-1" onClick={() => setStep(3)}>← Zpět</button>
              <button className="btn-primary flex-1" onClick={handleSubmit} disabled={loading}>
                {loading ? '⏳ Registruji...' : '🚀 Hotovo!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
