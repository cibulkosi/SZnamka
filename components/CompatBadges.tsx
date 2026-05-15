import type { Compatibility } from '@/lib/supabase'

const CAT_CONFIG = [
  { key: 'soul_mates',       label: '🔮 Spřízněné duše',       labelEn: '🔮 Soul Mates',        cls: 'bg-violet-600/80 border-violet-400/40' },
  { key: 'love_friendship',  label: '💚 Láska & přátelství',   labelEn: '💚 Love & Friendship', cls: 'bg-pink-600/80 border-pink-400/40' },
  { key: 'beneficial',       label: '🌟 Prospěšné',             labelEn: '🌟 Beneficial',         cls: 'bg-emerald-600/80 border-emerald-400/40' },
  { key: 'fatal_attraction', label: '🔥 Osudová přitažlivost', labelEn: '🔥 Fatal Attraction',  cls: 'bg-orange-600/80 border-orange-400/40' },
  { key: 'challenging',      label: '⚡ Výzva',                 labelEn: '⚡ Challenging',        cls: 'bg-yellow-600/80 border-yellow-400/40' },
]

export function CompatBadges({ compat, lang = 'cs' }: { compat: Compatibility | null, lang?: 'cs'|'en' }) {
  if (!compat) return <div className="text-white/40 text-xs">No compatibility data</div>

  return (
    <div className="flex flex-wrap gap-1.5">
      {compat.is_mutual && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold bg-cyan-500/30 border border-cyan-400/50 text-cyan-300">
          ↔ {lang === 'cs' ? 'Oboustranná' : 'Mutual'}
        </span>
      )}
      {CAT_CONFIG.map(cat => {
        const active = compat[cat.key as keyof Compatibility]
        if (!active) return null
        return (
          <span key={cat.key} className={`inline-flex items-center text-xs px-2 py-1 rounded-full border text-white ${cat.cls}`}>
            {lang === 'cs' ? cat.label : cat.labelEn}
          </span>
        )
      })}
    </div>
  )
}

export function ScoreRing({ score }: { score: number }) {
  const r = 24, circ = 2 * Math.PI * r
  const prog = (score / 100) * circ
  const color = score >= 70 ? '#a855f7' : score >= 40 ? '#ec4899' : '#f59e0b'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${prog} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 32 32)" />
      </svg>
      <span className="absolute text-sm font-bold" style={{color}}>{score}</span>
    </div>
  )
}
