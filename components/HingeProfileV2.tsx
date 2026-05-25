'use client'
/**
 * HingeProfileV2 — discover feed profile card v /demo aesthetic
 *
 * Design language: identical to components/DemoProfileDetail (cream #F0EBE3,
 * rounded-3xl white cards, pink heart LikeButton bottom-right of photos,
 * category-colored compatibility card). Adapted to real Profile + Compatibility
 * data from Supabase.
 *
 * Missing fields for full /demo parity (will be added in Phase 2):
 *   - profile.prompts (3 Hinge-style question+answer cards)
 *   - profile.voice_prompt (voice waveform card)
 * Until DB migration, those sections are skipped gracefully.
 */
import { useEffect, useRef } from 'react'
import type { Profile, Compatibility } from '@/lib/supabase'
import { getZodiac } from '@/lib/supabase'
import { lifePathNumber, ARCHETYPES } from '@/lib/archetypes'

// ── Constants ─────────────────────────────────────────────────
const ZODIAC_SYMBOLS: Record<string, string> = {
  'Beran': '♈', 'Býk': '♉', 'Blíženci': '♊', 'Rak': '♋',
  'Lev': '♌', 'Panna': '♍', 'Váhy': '♎', 'Štír': '♏',
  'Střelec': '♐', 'Kozoroh': '♑', 'Vodnář': '♒', 'Ryby': '♓',
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Spřízněné duše': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Láska a přátelství': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Magnetická tenze': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Prospěšný vztah': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Náročný vztah': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Neutrální': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
}

function getCategoryLabel(compat: Compatibility | null): string {
  if (!compat) return 'Neutrální'
  if (compat.soul_mates) return 'Spřízněné duše'
  if (compat.love_friendship) return 'Láska a přátelství'
  if (compat.fatal_attraction) return 'Magnetická tenze'
  if (compat.beneficial) return 'Prospěšný vztah'
  if (compat.challenging) return 'Náročný vztah'
  return 'Neutrální'
}

// ── Icons ─────────────────────────────────────────────────────
const SaturnIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-50 -38 100 76">
    <g transform="rotate(-18)"><ellipse cx="0" cy="0" rx="40" ry="7" fill="none" stroke="#f9a8d4" strokeWidth="3.5" /></g>
    <circle cx="0" cy="0" r="18" fill="#ec4899" />
    <g transform="rotate(-18)"><path d="M -40 0 A 40 7 0 0 0 40 0" fill="none" stroke="#f9a8d4" strokeWidth="3.5" /></g>
  </svg>
)
const HeartIconStroke = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const HeartIconFill = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const SkipIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

function PhotoLikeButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      aria-label="Líbí se mi"
      type="button"
    >
      <HeartIconStroke size={22} />
    </button>
  )
}

// ── Main component ────────────────────────────────────────────
interface Props {
  profile: Profile
  compat: Compatibility | null
  enhancedScore: number
  onPass: () => void
  onLike: () => void
  actionState: 'like' | 'pass' | null
  currentUser?: Profile | null
}

export default function HingeProfileV2({ profile, compat, enhancedScore, onPass, onLike, actionState }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }) }, [profile.id])

  const age = profile.birth_year ? new Date().getFullYear() - profile.birth_year : null
  const zodiac = getZodiac(profile.birthday) || ''
  const matchCategory = getCategoryLabel(compat)
  const cat = CATEGORY_COLORS[matchCategory]
  const firstName = profile.name?.split(' ')[0] || 'Profil'
  const lp = profile.birthday ? lifePathNumber(profile.birthday) : null
  const archetype = lp ? ARCHETYPES[lp] : null
  const photos = (profile.photos || []).filter(Boolean)

  return (
    <div className={`relative h-full flex flex-col bg-[#F0EBE3] transition-opacity duration-300 ${
      actionState === 'like' ? 'opacity-70' : actionState === 'pass' ? 'opacity-50' : ''
    }`}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#F0EBE3]/95 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-gray-500 text-sm">Discover</span>
          <div className="flex items-center gap-2">
            <SaturnIcon size={18} />
            <span className="text-sm text-gray-900 font-medium">{firstName}</span>
          </div>
          <span className="text-gray-400" aria-hidden>•••</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ paddingBottom: '120px' }}>
        <article className="max-w-md mx-auto py-4 px-4 space-y-3">
          {photos[0] && (
            <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
              <img src={photos[0]} alt={firstName} className="w-full h-full object-cover" />
              <PhotoLikeButton onClick={onLike} />
            </div>
          )}

          {/* Name + bio + hobbies */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-baseline gap-3 flex-wrap mb-3">
              <h1 className="serif-display text-4xl text-gray-900 font-medium leading-none">{firstName}</h1>
              {age && <span className="text-3xl text-gray-400 font-light">{age}</span>}
              {profile.verified && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  Ověřeno
                </span>
              )}
            </div>
            {profile.bio && <p className="text-gray-700 leading-relaxed text-[0.95rem] mb-4">{profile.bio}</p>}
            {profile.hobbies && profile.hobbies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map(h => (
                  <span key={h} className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{h}</span>
                ))}
              </div>
            )}
          </div>

          {/* Compatibility card — category-colored */}
          {compat && (
            <div className={`rounded-3xl p-6 shadow-sm border ${cat.bg} ${cat.border}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`eyebrow ${cat.text} mb-2`}>Tvoje kompatibilita</p>
                  <h2 className={`serif-display text-2xl ${cat.text} font-medium leading-tight`}>{matchCategory}</h2>
                  {compat.is_mutual && (
                    <p className="text-xs text-gray-600 mt-1.5">Oboustranná shoda — vidíte se oba navzájem.</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="serif-display text-5xl text-gray-900 font-medium tabular-nums leading-none">{enhancedScore}</p>
                  <p className="text-xs text-gray-500 mt-1">% shody</p>
                </div>
              </div>
            </div>
          )}

          {/* Info bar */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
              {age && (
                <div className="px-3 py-4 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6V3"/><path d="M10 3h4"/><rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M4 14c2 1 4 1 6 0s4-1 6 0 4 1 4 0"/><circle cx="12" cy="8" r="1.5"/>
                  </svg>
                  <span className="text-base text-gray-900 font-medium tabular-nums">{age}</span>
                </div>
              )}
              {zodiac && (
                <div className="px-3 py-4 flex items-center justify-center gap-2">
                  <span className="text-lg text-gray-500" aria-hidden>{ZODIAC_SYMBOLS[zodiac] || '✦'}</span>
                  <span className="text-base text-gray-900 font-medium">{zodiac}</span>
                </div>
              )}
            </div>
            <div>
              {archetype && lp && (
                <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100">
                  <SaturnIcon size={22} />
                  <span className="text-[0.95rem] text-gray-900">
                    Životní číslo <span className="font-medium text-pink-600 tabular-nums">{lp}</span> — <span className="font-medium">{archetype.name}</span>
                  </span>
                </div>
              )}
              {profile.occupation && (
                <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <span className="text-[0.95rem] text-gray-800">{profile.occupation}</span>
                </div>
              )}
              {profile.city && (
                <div className="flex items-center gap-4 px-5 py-3.5">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  <span className="text-[0.95rem] text-gray-800">{profile.city}</span>
                </div>
              )}
            </div>
          </div>

          {photos[1] && (
            <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
              <img src={photos[1]} alt={`${firstName} - fotka 2`} className="w-full h-full object-cover" />
              <PhotoLikeButton onClick={onLike} />
            </div>
          )}

          {profile.philosophy && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-3">Životní filozofie</p>
              <p className="serif text-xl text-gray-900 font-medium leading-relaxed italic">&ldquo;{profile.philosophy}&rdquo;</p>
            </div>
          )}

          {photos[2] && (
            <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
              <img src={photos[2]} alt={`${firstName} - fotka 3`} className="w-full h-full object-cover" />
              <PhotoLikeButton onClick={onLike} />
            </div>
          )}

          {/* Lifestyle pills */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-3">Životní styl</p>
            <div className="flex flex-wrap gap-2">
              {profile.relationship_type === 'serious' && <span className="text-xs text-pink-700 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full font-medium">Vážný vztah</span>}
              {profile.relationship_type === 'friendship' && <span className="text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full font-medium">Přátelství</span>}
              {profile.relationship_type === 'casual' && <span className="text-xs text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full font-medium">Nezávazně</span>}
              {profile.smoking === 'never' && <span className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">Nekouří</span>}
              {profile.alcohol === 'never' && <span className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">Nepije</span>}
              {profile.diet === 'vegan' && <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Vegan</span>}
              {profile.diet === 'vegetarian' && <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Vegetarián</span>}
              {profile.family_plans === 'want_kids' && <span className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Chce děti</span>}
              {profile.family_plans === 'no_kids' && <span className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">Nechce děti</span>}
            </div>
          </div>

          {/* Photos 4+ */}
          {photos.slice(3).map((p, i) => (
            <div key={`p${i+3}`} className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
              <img src={p} alt={`${firstName} - fotka ${i + 4}`} className="w-full h-full object-cover" />
              <PhotoLikeButton onClick={onLike} />
            </div>
          ))}
        </article>
      </div>

      {/* Bottom action bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#F0EBE3] via-[#F0EBE3]/95 to-transparent pt-8 pb-6 px-6">
        <div className="max-w-md mx-auto flex items-center justify-center gap-6">
          <button onClick={onPass} className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" aria-label="Přeskočit" type="button">
            <SkipIcon size={28} />
          </button>
          <button onClick={onLike} className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" style={{ backgroundColor: '#ec4899' }} aria-label="Líbí se mi" type="button">
            <HeartIconFill size={28} />
          </button>
        </div>
      </div>
    </div>
  )
}
