
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * Cookie notice banner — Cosmatch only uses technically necessary cookies,
 * so legally we don't need explicit consent under GDPR Recital 30.
 * But best practice + transparency = show one-time dismissible notice.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem('cosmatch_cookies_ack')) {
      // Small delay so it doesn't pop up before page renders
      const t = setTimeout(() => setShow(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    try { localStorage.setItem('cosmatch_cookies_ack', '1') } catch {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="region"
      aria-label="Cookies oznámení"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-40
                 bg-white border border-gray-200 rounded-2xl shadow-lg p-5"
    >
      <p className="eyebrow text-pink-500 mb-2">Krátké oznámení</p>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Cosmatch používá <strong className="font-medium text-gray-900">jen technicky nezbytné cookies</strong> (přihlášení, ochrana proti botům). Žádný Google Analytics, žádný Facebook Pixel, žádné prodávání dat. <Link href="/cookies" className="text-pink-500 underline">Detaily</Link>.
      </p>
      <button
        onClick={dismiss}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 rounded-full transition"
      >
        Rozumím
      </button>
    </div>
  )
}
