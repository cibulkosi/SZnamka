/**
 * Cosmatch empty states — Saturn brandmark + warm cream copy
 *
 * Použít všude, kde uživatel vidí prázdný feed/list:
 *   - <EmptyDiscover />     žádné nové profily
 *   - <EmptyMatches />      žádné shody zatím
 *   - <EmptyChats />        žádné konverzace
 *   - <EmptyLikes />        nikdo Tě ještě nelajknul
 *   - <EmptyVerifications /> admin verifications prázdné
 */

import Link from 'next/link'
import { vocative } from '@/lib/czech'

// Mini Saturn — reusable SVG (3 různé barvy podle kontextu)
function SaturnIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {/* zadní polovina prstenu */}
      <g transform="rotate(-18 50 50)">
        <path d="M 12 50 A 38 8 0 0 1 88 50" fill="none" stroke="#f9a8d4" strokeWidth="3"/>
      </g>
      {/* planeta */}
      <circle cx="50" cy="50" r="22" fill="#ec4899"/>
      {/* přední polovina prstenu */}
      <g transform="rotate(-18 50 50)">
        <path d="M 12 50 A 38 8 0 0 0 88 50" fill="none" stroke="#f9a8d4" strokeWidth="3"/>
      </g>
    </svg>
  )
}

function EmptyShell({
  title,
  body,
  ctaLabel,
  ctaHref,
  saturnSize = 80,
}: {
  title: string
  body: string
  ctaLabel?: string
  ctaHref?: string
  saturnSize?: number
}) {
  return (
    <div className="bg-white rounded-3xl p-10 text-center">
      <div className="flex justify-center mb-6 opacity-80">
        <SaturnIcon size={saturnSize} />
      </div>
      <h2 className="serif-display text-2xl text-gray-900 font-medium leading-tight mb-3">
        {title}
      </h2>
      <p className="text-gray-600 text-[15px] leading-relaxed max-w-sm mx-auto mb-6">
        {body}
      </p>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref}
          className="inline-block bg-gray-900 text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-gray-800 transition">
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}

export function EmptyDiscover() {
  return (
    <EmptyShell
      title="Nikoho dalšího právě nemám"
      body="Algoritmus dnes vyčerpal vrstvu Tobě kompatibilních profilů. Vrať se zítra — během noci dorazí noví."
      ctaLabel="Doplnit profil"
      ctaHref="/profile"
    />
  )
}

export function EmptyMatches({ firstName }: { firstName?: string }) {
  const voc = firstName ? vocative(firstName) : null
  return (
    <EmptyShell
      title={voc ? `${voc}, ještě žádná shoda` : 'Ještě žádná shoda'}
      body="Jakmile někomu dáš lajk a ona/on Tobě taky, objeví se tu jako shoda. Algoritmus mezitím počítá v pozadí."
      ctaLabel="Objevuj profily"
      ctaHref="/discover"
    />
  )
}

export function EmptyChats() {
  return (
    <EmptyShell
      title="Žádné konverzace"
      body="Až budeš mít první shodu, otevře se tady chat. Začni tím, koho ti algoritmus doporučí v Objevuj."
      ctaLabel="Objevuj profily"
      ctaHref="/discover"
    />
  )
}

export function EmptyLikes() {
  return (
    <EmptyShell
      title="Zatím Tě nikdo nelajknul"
      body="Algoritmus stále hledá, kdo by Ti mohl sedět. Vyplněnější profil = lepší shody. Přidej fotku a vyplň hodnoty."
      ctaLabel="Vylepšit profil"
      ctaHref="/profile"
    />
  )
}

export function EmptyVerifications() {
  return (
    <div className="bg-white rounded-3xl p-8 text-center">
      <p className="text-5xl mb-4">✨</p>
      <p className="text-gray-600">Žádné žádosti k vyřízení.</p>
    </div>
  )
}

export function EmptySwipeLimit({ premium }: { premium: boolean }) {
  if (premium) return (
    <EmptyShell
      title="Dnes jsi vyčerpala denní limit"
      body="Algoritmus dává prostor i pomalejšímu rozhodování. Vrať se zítra — uvidíš nové profily."
      saturnSize={64}
    />
  )
  return (
    <EmptyShell
      title="Free limit pro dnes"
      body="Vrať se zítra na 5 nových profilů. Nebo přepni na Cosmatch+ a uvidíš víc lidí každý den."
      ctaLabel="Cosmatch+"
      ctaHref="/premium"
      saturnSize={64}
    />
  )
}
