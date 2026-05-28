'use client'

import { useEffect, useState } from 'react'

const SUBJECTS = [
  { value: 'obecna', label: 'Obecná otázka' },
  { value: 'reklamace', label: 'Reklamace nebo odstoupení od smlouvy' },
  { value: 'gdpr', label: 'GDPR žádost (přístup, výmaz, oprava)' },
  { value: 'hlaseni', label: 'Hlášení podezřelého profilu' },
  { value: 'spoluprace', label: 'Spolupráce, ambasadorství, PR' },
  { value: 'jine', label: 'Jiné' },
] as const

type SubjectValue = (typeof SUBJECTS)[number]['value']

const FUNCTION_URL =
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdotpadgbchhecwitbpe.supabase.co') +
  '/functions/v1/contact-form'

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkb3RwYWRnYmNoaGVjd2l0YnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDQzNTEsImV4cCI6MjA5MDk4MDM1MX0.1OUSDOo4cUIYuI1nwT4DTddAU9bIfJwCiDuj2ED2wS0'

export default function KontaktForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState<SubjectValue>('obecna')
  const [message, setMessage] = useState('')
  const [hpCompany, setHpCompany] = useState('') // honeypot — must stay empty
  const [turnstileToken, setTurnstileToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(
      window as Window & { __ts_kontakt_cb__?: (t: string) => void; __ts_kontakt_exp__?: () => void }
    ).__ts_kontakt_cb__ = (token: string) => setTurnstileToken(token)
    ;(
      window as Window & { __ts_kontakt_cb__?: (t: string) => void; __ts_kontakt_exp__?: () => void }
    ).__ts_kontakt_exp__ = () => setTurnstileToken('')
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    s.async = true
    document.head.appendChild(s)
    return () => {
      try {
        document.head.removeChild(s)
      } catch {}
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Vyplň prosím všechna pole.')
      return
    }
    if (message.trim().length < 5) {
      setError('Zpráva je příliš krátká (minimum 5 znaků).')
      return
    }
    if (message.length > 5000) {
      setError('Zpráva je příliš dlouhá (max 5 000 znaků).')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Neplatný e-mail.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
          turnstile_token: turnstileToken,
          hp_company: hpCompany, // honeypot
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Nepodařilo se odeslat. Zkus to prosím znovu.')
        setSubmitting(false)
        return
      }
      setSubmitted(true)
      setSubmitting(false)
    } catch (err) {
      console.error(err)
      setError('Chyba sítě. Zkus to prosím znovu.')
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-emerald-200 rounded-3xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <h2 className="serif-display text-3xl text-gray-900 font-medium mb-3">
          Děkujeme.
        </h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          Tvoji zprávu jsme přijali a obvykle odpovídáme do <strong className="text-gray-900 font-medium">48 hodin</strong>.
        </p>
        <p className="text-sm text-gray-500">
          U žádostí podle GDPR je zákonný limit 30 dní (obvykle stíháme do týdne).
        </p>
      </div>
    )
  }

  const charCount = message.length

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Jméno */}
      <div>
        <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
          Jméno
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
          autoComplete="name"
          className="w-full bg-transparent border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-gray-900 placeholder-gray-400 transition"
          placeholder="Tvoje jméno"
        />
      </div>

      {/* E-mail */}
      <div>
        <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
          E-mail (kam Ti odpovíme)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
          autoComplete="email"
          className="w-full bg-transparent border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-gray-900 placeholder-gray-400 transition"
          placeholder="ty@example.com"
        />
      </div>

      {/* Téma */}
      <div>
        <label htmlFor="subject" className="block text-sm text-gray-700 mb-2">
          Téma
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as SubjectValue)}
          required
          className="w-full bg-transparent border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-gray-900 transition appearance-none cursor-pointer"
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Zpráva */}
      <div>
        <label htmlFor="message" className="block text-sm text-gray-700 mb-2">
          Zpráva
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={5}
          maxLength={5000}
          rows={6}
          className="w-full bg-white border border-gray-300 rounded-2xl focus:border-gray-900 outline-none p-4 text-gray-900 placeholder-gray-400 transition resize-y"
          placeholder="Stručně popiš, s čím Ti můžeme pomoct…"
        />
        <p className="text-xs text-gray-500 mt-1 text-right tabular-nums">
          {charCount} / 5 000
        </p>
      </div>

      {/* Honeypot — skryté pole, lidé ho neuvidí; pokud ho bot vyplní, zprávu zahodíme */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={hpCompany}
            onChange={(e) => setHpCompany(e.target.value)}
          />
        </label>
      </div>

      {/* Turnstile */}
      <div className="flex justify-center pt-2">
        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADQh9ih6B36BUAa0'}
          data-callback="__ts_kontakt_cb__"
          data-expired-callback="__ts_kontakt_exp__"
          data-theme="light"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed px-8 py-4 rounded-full text-base font-medium transition-all"
      >
        {submitting ? 'Odesílám…' : 'Odeslat zprávu'}
      </button>

      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Odesláním souhlasíš s tím, že Tvůj e-mail a zprávu zpracujeme pro účely odpovědi.
        Detail v <a href="/zasady-ochrany-osobnich-udaju" className="underline hover:text-gray-900">Zásadách ochrany osobních údajů</a>.
      </p>
    </form>
  )
}
