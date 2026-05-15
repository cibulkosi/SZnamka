'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, HOBBIES, COUNTRIES, EDUCATION_OPTIONS } from '@/lib/supabase'

const MONTHS = [
  'Leden/Jan','Únor/Feb','Březen/Mar','Duben/Apr','Květen/May','Červen/Jun',
  'Červenec/Jul','Srpen/Aug','Září/Sep','Říjen/Oct','Listopad/Nov','Prosinec/Dec'
]

const DAYS_IN_MONTH = [31,29,31,30,31,30,31,31,30,31,30,31]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
        philosophy: form.philosophy,
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

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-pink-500 text-2xl font-bold">✦</span>
        <span className="text-xl font-bold text-gray-900">Cosmatch</span>
      </Link>

      <div className="card w-full max-w-md p-8">
        {/* Progress bary */}
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-pink-500' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">👋 Základní info</h2>
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
            </div>
            <button className="btn-primary w-full mt-4" onClick={() => setStep(2)}
              disabled={!form.name || !form.email || !birthday}>
              Pokračovat →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💫 O tobě</h2>
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
            <div>
              <label className="text-gray-500 text-sm mb-1 block">✨ Moje životní filozofie</label>
              <textarea className="input resize-none h-20" placeholder="Co tě žene vpřed, co věříš..."
                value={form.philosophy} onChange={e => setForm(f => ({...f, philosophy: e.target.value}))} />
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setStep(1)}>← Zpět</button>
              <button className="btn-primary flex-1" onClick={() => setStep(3)}>Pokračovat →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Záliby</h2>
            <p className="text-gray-400 text-sm">Vyber co tě baví (nepovinné)</p>
            <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
              {HOBBIES.map(h => (
                <button key={h} onClick={() => toggleHobby(h)}
                  className={`py-1.5 px-3 rounded-full text-sm border font-medium transition-all ${form.hobbies.includes(h) ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'}`}>
                  {h}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-3 rounded-2xl">{error}</p>}
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setStep(2)}>← Zpět</button>
              <button className="btn-primary flex-1" onClick={handleSubmit} disabled={loading}>
                {loading ? '⏳ Registruji...' : '🚀 Dokončit'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          Už máš účet?{' '}
          <Link href="/login" className="text-pink-500 hover:text-pink-600 font-semibold">Přihlásit se</Link>
        </p>
      </div>
    </div>
  )
}
