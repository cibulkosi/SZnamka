'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, HOBBIES, COUNTRIES, EDUCATION_OPTIONS } from '@/lib/supabase'

const MONTHS = [
  'Leden/Jan','Únor/Feb','Březen/Mar','Duben/Apr','Květen/May','Červen/Jun',
  'Červenec/Jul','Srpen/Aug','Září/Sep','Říjen/Oct','Listopad/Nov','Prosinec/Dec'
]

const DAYS_IN_MONTH = [31,29,31,30,31,30,31,31,30,31,30,31]

// Krok 0 = základní info, 1 = magic moment, 2 = o tobě, 3 = záliby
type Step = 0 | 1 | 2 | 3

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)
  const [loading, setLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [error, setError] = useState('')
  const [personologyText, setPersonologyText] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    day: '', month: '', birth_year: '',
    gender: '', looking_for: '',
    city: '', country: 'CZ',
    bio: '', occupation: '', education: '', philosophy: '',
    hobbies: [] as string[], photos: [] as string[]
  })

  const birthday = form.month && form.day
    ? `${String(form.month).padStart(2,'0')}-${String(form.day).padStart(2,'0')}`
    : ''

  const toggleHobby = (h: string) => {
    setForm(f => ({
      ...f,
      hobbies: f.hobbies.includes(h) ? f.hobbies.filter(x => x !== h) : [...f.hobbies, h]
    }))
  }

  // Po zadání data v kroku 0 → načteme personologický text a ukážeme magic moment
  const handleStep0Continue = async () => {
    if (!form.name || !form.email || !form.password || !birthday) return
    setMagicLoading(true)
    try {
      const { data } = await supabase
        .from('personology')
        .select('opening')
        .eq('date_key', birthday)
        .single()
      setPersonologyText(data?.opening || '')
    } catch {
      setPersonologyText('')
    } finally {
      setMagicLoading(false)
      setStep(1)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !birthday) {
      setError('Vyplň všechna povinná pole.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error: dbErr } = await supabase.from('profiles').insert([{
        name: form.name,
        email: form.email,
        birthday,
        birth_year: parseInt(form.birth_year) || new Date().getFullYear() - 25,
        gender: form.gender || 'other',
        looking_for: form.looking_for || 'everyone',
        city: form.city,
        country: form.country,
        bio: form.bio,
        occupation: form.occupation,
        education: form.education,
        relationship_goal: form.philosophy, // pole philosophy dočasně drží intent
        hobbies: form.hobbies,
        photos: [],
        premium: false,
        active: true
      }])

      if (dbErr) throw dbErr

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', form.email)
        .single()

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

  const daysInSelectedMonth = form.month ? DAYS_IN_MONTH[parseInt(form.month) - 1] : 31

  // Počet progress kroků viditelných uživateli (bez magic momentu)
  const progressStep = step === 0 ? 1 : step === 1 ? 1 : step === 2 ? 2 : 3

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-pink-500 text-2xl font-bold">✦</span>
        <span className="text-xl font-bold text-gray-900">Cosmatch</span>
      </Link>

      {/* ── KROK 0: Základní info ── */}
      {step === 0 && (
        <div className="card w-full max-w-md p-8">
          <div className="flex gap-2 mb-8">
            {[1,2,3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= progressStep ? 'bg-pink-500' : 'bg-gray-100'}`} />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👋 Základní info</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Jméno *</label>
              <input className="input" placeholder="Tvoje jméno..." value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">E-mail *</label>
              <input className="input" type="email" placeholder="email@example.com" value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Heslo *</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))} />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">📅 Datum narození *</label>
              <div className="grid grid-cols-3 gap-2">
                <select className="input" value={form.day} onChange={e => setForm(f => ({...f, day: e.target.value}))}>
                  <option value="">Den</option>
                  {Array.from({length: daysInSelectedMonth}, (_,i) => i+1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select className="input" value={form.month} onChange={e => setForm(f => ({...f, month: e.target.value, day: ''}))}>
                  <option value="">Měsíc</option>
                  {MONTHS.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
                </select>
                <input className="input" type="number" placeholder="Rok" min="1940" max="2008"
                  value={form.birth_year} onChange={e => setForm(f => ({...f, birth_year: e.target.value}))} />
              </div>

              {/* ⚠️ ZÁMEK DATA NAROZENÍ */}
              {birthday && (
                <div className="mt-3 flex gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                  <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">🔒</span>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    <strong>Zadej skutečné datum.</strong> Cosmatch používá přesnou personologickou mechaniku — datum po registraci nelze změnit. Špatné datum povede k nefunkčním shodám.
                  </p>
                </div>
              )}
            </div>

            <button
              className="btn-primary w-full mt-4"
              onClick={handleStep0Continue}
              disabled={!form.name || !form.email || !form.password || !birthday || magicLoading}
            >
              {magicLoading ? '✨ Načítám tvůj profil...' : 'Pokračovat →'}
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Už máš účet?{' '}
            <Link href="/login" className="text-pink-500 hover:text-pink-600 font-semibold">Přihlásit se</Link>
          </p>
        </div>
      )}

      {/* ── KROK 1: MAGIC MOMENT ── */}
      {step === 1 && (
        <div className="card w-full max-w-md p-8 text-center">
          <div className="text-5xl mb-4">🪐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {form.name}, vesmír tě zná.
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Datum {form.day}. {MONTHS[parseInt(form.month)-1]?.split('/')[0]} odhaluje:
          </p>

          {personologyText ? (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-3xl p-6 mb-6 text-left">
              <p className="text-gray-700 text-sm leading-relaxed italic">
                &ldquo;{personologyText}&rdquo;
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-3xl p-6 mb-6 text-left">
              <p className="text-gray-700 text-sm leading-relaxed italic">
                &ldquo;Tvůj personologický profil je právě generován. Cosmatch porovná tvoje datum s tisíci ostatních a najde ty, kteří ti opravdu odpovídají.&rdquo;
              </p>
            </div>
          )}

          <p className="text-gray-400 text-xs mb-6">
            Cosmatch používá přesnou personologickou databázi 366 dat. Tvůj profil je unikátní.
          </p>

          <button className="btn-primary w-full" onClick={() => setStep(2)}>
            Skvělé, pokračovat →
          </button>
        </div>
      )}

      {/* ── KROK 2: O tobě ── */}
      {step === 2 && (
        <div className="card w-full max-w-md p-8">
          <div className="flex gap-2 mb-8">
            {[1,2,3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= 2 ? 'bg-pink-500' : 'bg-gray-100'}`} />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💫 O tobě</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-500 text-sm mb-2 block">Jsem</label>
              <div className="grid grid-cols-3 gap-2">
                {[['man','Muž 👨'],['woman','Žena 👩'],['other','Jiné 🌈']].map(([v,l]) => (
                  <button key={v} onClick={() => setForm(f => ({...f, gender: v}))}
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
                  <button key={v} onClick={() => setForm(f => ({...f, looking_for: v}))}
                    className={`py-2 px-3 rounded-2xl border text-sm font-medium transition-all ${form.looking_for === v ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">🎯 Hledám vztah</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['serious','💍 Vážný vztah'],
                  ['friendship','🤝 Přátelství'],
                  ['casual','✌️ Nezávazně'],
                  ['unsure','🤔 Zatím nevím'],
                ].map(([v,l]) => (
                  <button key={v} onClick={() => setForm(f => ({...f, philosophy: v}))}
                    className={`py-2 px-3 rounded-2xl border text-sm font-medium transition-all text-left ${form.philosophy === v ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-500 text-sm mb-1 block">Město</label>
                <input className="input" placeholder="Praha..." value={form.city}
                  onChange={e => setForm(f => ({...f, city: e.target.value}))} />
              </div>
              <div>
                <label className="text-gray-500 text-sm mb-1 block">Země</label>
                <select className="input" value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-1 block">Intro</label>
              <textarea className="input resize-none h-24" placeholder="Stručně se představte: originalita se cení!"
                value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-500 text-sm mb-1 block">💼 Povolání</label>
                <input className="input" placeholder="Architekt, učitelka..."
                  value={form.occupation} onChange={e => setForm(f => ({...f, occupation: e.target.value}))} />
              </div>
              <div>
                <label className="text-gray-500 text-sm mb-1 block">🎓 Vzdělání</label>
                <select className="input" value={form.education}
                  onChange={e => setForm(f => ({...f, education: e.target.value}))}>
                  <option value="">Vybrat...</option>
                  {EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setStep(0)}>← Zpět</button>
              <button className="btn-primary flex-1" onClick={() => setStep(3)}>Pokračovat →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── KROK 3: Záliby ── */}
      {step === 3 && (
        <div className="card w-full max-w-md p-8">
          <div className="flex gap-2 mb-8">
            {[1,2,3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= 3 ? 'bg-pink-500' : 'bg-gray-100'}`} />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Záliby</h2>
          <p className="text-gray-400 text-sm mb-4">Vyber co tě baví — záliby jsou součástí tvého skóre kompatibility</p>
          <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto mb-4">
            {HOBBIES.map(h => (
              <button key={h} onClick={() => toggleHobby(h)}
                className={`py-1.5 px-3 rounded-full text-sm border font-medium transition-all ${form.hobbies.includes(h) ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'}`}>
                {h}
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-3 rounded-2xl mb-3">{error}</p>}
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setStep(2)}>← Zpět</button>
            <button className="btn-primary flex-1" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Registruji...' : '🚀 Dokončit'}
            </button>
          </div>
        </div>
      )}

      {step !== 1 && (
        <p className="text-center text-gray-400 text-sm mt-6">
          Už máš účet?{' '}
          <Link href="/login" className="text-pink-500 hover:text-pink-600 font-semibold">Přihlásit se</Link>
        </p>
      )}
    </div>
  )
}
