'use client'
import { useEffect, useState } from 'react'
import { detectKarmicDebts, KARMIC_DEBT_MEANINGS } from '@/lib/archetypes'

/**
 * Klient komponenta, která čte ?date=YYYY-MM-DD z URL a zobrazí karmický dluh,
 * pokud uživatel v datu narození nějaký má.
 */
export default function KarmicDebtCard() {
  const [debts, setDebts] = useState<number[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const date = params.get('date')
    if (!date) return
    const detected = detectKarmicDebts(date)
    setDebts(detected)
  }, [])

  if (debts.length === 0) return null

  return (
    <section className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-16 mt-12">
      <p className="eyebrow text-amber-700 mb-3">Karmický dluh</p>
      <h2 className="serif text-xl text-gray-900 font-medium mb-4">
        Tvé datum narození nese {debts.length === 1 ? 'karmický dluh' : 'karmické dluhy'}: {debts.join(', ')}
      </h2>
      <div className="space-y-6">
        {debts.map(debt => {
          const info = KARMIC_DEBT_MEANINGS[debt]
          if (!info) return null
          return (
            <div key={debt} className="bg-white border border-amber-200 rounded-2xl p-6">
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">{info.title} → {info.redukce}</h3>
              <p className="text-gray-700 leading-relaxed mb-3 text-[0.95rem]">
                <strong className="text-gray-900 font-medium">Co to znamená:</strong> {info.meaning}
              </p>
              <p className="text-gray-700 leading-relaxed text-[0.95rem]">
                <strong className="text-gray-900 font-medium">Tvá lekce:</strong> {info.lesson}
              </p>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 italic mt-4">
        Karmické dluhy jsou specifické pre-reduction hodnoty (13, 14, 16, 19) z tvého data narození. Reprezentují „lekce z minulých životů" podle moderní pythagorejské tradice (Goodwin 1981, Decoz). Cca 20–30 % lidí má alespoň jeden.
      </p>
    </section>
  )
}
