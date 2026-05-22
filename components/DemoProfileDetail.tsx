'use client'
import Link from 'next/link'
import type { DemoProfile } from '@/lib/demoProfiles'

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Spřízněné duše': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Láska a přátelství': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Osudová přitažlivost': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Magnetická tenze': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Prospěšný vztah': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
}

const HeartIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const SaturnIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-50 -38 100 76" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-18)"><ellipse cx="0" cy="0" rx="40" ry="7" fill="none" stroke="#f9a8d4" strokeWidth="3.5" /></g>
    <circle cx="0" cy="0" r="18" fill="#ec4899" />
    <g transform="rotate(-18)"><path d="M -40 0 A 40 7 0 0 0 40 0" fill="none" stroke="#f9a8d4" strokeWidth="3.5" /></g>
  </svg>
)

const LikeButton = () => (
  <div className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center" aria-hidden>
    <HeartIcon size={22} />
  </div>
)

const VoiceWaveform = () => {
  const heights = [8, 14, 22, 18, 28, 32, 26, 20, 14, 10, 6, 12, 24, 30, 28, 20, 16, 22, 26, 18, 12, 8, 14, 20, 24, 30, 26, 22, 18, 14, 8, 12, 18, 24, 28, 22, 16, 12, 8, 6, 4, 8, 12, 16, 20, 14, 10, 6, 4, 2]
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <svg width="100%" height="40" viewBox="0 0 320 40" preserveAspectRatio="none">
        {heights.map((h, i) => (
          <rect key={i} x={i * 6.4} y={20 - h / 2} width="3" height={h} fill="#ec4899" rx="1.5" />
        ))}
      </svg>
    </div>
  )
}

export default function DemoProfileDetail({ profile }: { profile: DemoProfile }) {
  const cat = categoryColors[profile.matchCategory] || categoryColors['Spřízněné duše']

  return (
    <main className="min-h-screen bg-[#F0EBE3]">
      <div className="sticky top-0 z-10 bg-[#F0EBE3]/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/demo" className="text-gray-500 hover:text-gray-900 transition text-sm">← Demo</Link>
          <div className="flex items-center gap-2">
            <SaturnIcon size={18} />
            <span className="text-sm text-gray-900 font-medium">{profile.name}</span>
          </div>
          <span className="text-gray-400" aria-hidden>•••</span>
        </div>
      </div>

      <article className="max-w-md mx-auto py-4 px-4 space-y-3">
        {/* Hero photo */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
          <img src={profile.photos[0]} alt={`${profile.name} - hlavní fotka`} className="w-full h-full object-cover" />
          <LikeButton />
        </div>

        {/* Name + meta */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-baseline gap-3 flex-wrap mb-3">
            <h1 className="serif-display text-4xl text-gray-900 font-medium leading-none">{profile.name}</h1>
            <span className="text-3xl text-gray-400 font-light">{profile.age}</span>
            {profile.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                Ověřeno
              </span>
            )}
            <span className="inline-block text-xs text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full font-medium">Demo</span>
          </div>
          <p className="text-gray-700 leading-relaxed text-[0.95rem] mb-4">{profile.bio}</p>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map(h => (
              <span key={h} className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{h}</span>
            ))}
          </div>
        </div>

        {/* Compatibility */}
        <div className={`rounded-3xl p-6 shadow-sm border ${cat.bg} ${cat.border}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`eyebrow ${cat.text} mb-1`}>Tvoje kompatibilita</p>
              <h2 className={`serif text-xl ${cat.text} font-medium leading-tight`}>{profile.matchCategory}</h2>
              <p className="text-xs text-gray-600 mt-1">{profile.matchLabel}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="serif-display text-5xl text-gray-900 font-medium tabular-nums leading-none">{profile.score}</p>
              <p className="text-xs text-gray-500 mt-1">% shody</p>
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
          <div className="grid grid-cols-3 gap-3 pb-3 border-b border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Věk</p>
              <p className="text-sm text-gray-900 font-medium">{profile.age}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Znamení</p>
              <p className="text-sm text-gray-900 font-medium">{profile.zodiac}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Archetyp</p>
              <p className="text-sm text-pink-600 font-medium">{profile.archetype.number} · {profile.archetype.name}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4l-2-2h-4L8 4v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z" /></svg>
              <span className="text-gray-700">{profile.occupation}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
              <span className="text-gray-700">{profile.city}</span>
            </div>
          </div>
        </div>

        {/* Photo 2 */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
          <img src={profile.photos[1]} alt={`${profile.name} - fotka 2`} className="w-full h-full object-cover" />
          <LikeButton />
        </div>

        {/* Prompt 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm relative pb-16">
          <p className="text-sm text-gray-500 mb-3">{profile.prompts[0].question}</p>
          <p className="serif text-2xl text-gray-900 font-medium leading-tight">{profile.prompts[0].answer}</p>
          <LikeButton />
        </div>

        {/* Photo 3 */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
          <img src={profile.photos[2]} alt={`${profile.name} - fotka 3`} className="w-full h-full object-cover" />
          <LikeButton />
        </div>

        {/* Voice prompt */}
        <div className="bg-white rounded-3xl p-6 shadow-sm relative pb-16">
          <p className="text-sm text-gray-500 mb-1">{profile.voicePrompt.question}</p>
          <p className="text-xs text-gray-400 mb-2">🎤 hlasová zpráva · {profile.voicePrompt.duration}</p>
          <VoiceWaveform />
          <p className="text-xs text-gray-400 italic">V aplikaci si nahrávku přehraješ — toto je jen ilustrace.</p>
          <LikeButton />
        </div>

        {/* Photo 4 */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
          <img src={profile.photos[3]} alt={`${profile.name} - fotka 4`} className="w-full h-full object-cover" />
          <LikeButton />
        </div>

        {/* Prompt 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm relative pb-16">
          <p className="text-sm text-gray-500 mb-3">{profile.prompts[1].question}</p>
          <p className="serif text-2xl text-gray-900 font-medium leading-tight">{profile.prompts[1].answer}</p>
          <LikeButton />
        </div>

        {/* Photo 5 */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
          <img src={profile.photos[4]} alt={`${profile.name} - fotka 5`} className="w-full h-full object-cover" />
          <LikeButton />
        </div>

        {/* Prompt 3 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm relative pb-16">
          <p className="text-sm text-gray-500 mb-3">{profile.prompts[2].question}</p>
          <p className="serif text-2xl text-gray-900 font-medium leading-tight">{profile.prompts[2].answer}</p>
          <LikeButton />
        </div>

        {/* Numerology archetyp */}
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-6 shadow-sm border border-pink-100">
          <div className="flex items-center gap-3 mb-3">
            <SaturnIcon size={24} />
            <p className="eyebrow text-pink-500">Životní číslo {profile.archetype.number}</p>
          </div>
          <h3 className="serif-display text-2xl text-gray-900 font-medium mb-2">{profile.archetype.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Datum narození {profile.name} se redukuje na životní číslo {profile.archetype.number}. Společně tvoříte vzor kompatibility <span className="font-medium text-pink-600">{profile.matchCategory}</span> — detail v <Link href="/jak-funguje-cosmatch" className="underline">algoritmu</Link>.
          </p>
          <Link href={`/numerologie/zivotni-cislo-${profile.archetype.number}`} className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 font-medium transition">
            Více o archetypu {profile.archetype.name} →
          </Link>
        </div>

        {/* Verification */}
        {profile.verified && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              </span>
              <div>
                <p className="serif text-base text-gray-900 font-medium leading-tight">Ověřený profil</p>
                <p className="text-xs text-gray-600 mt-0.5">Foto + e-mail + ID (Cosmatch+)</p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer + back */}
        <div className="bg-gray-100 rounded-3xl p-5 mt-6">
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Demo profil — jméno, fotky a data jsou ilustrativní.
            <span className="block mt-1">V aplikaci budou jen reálné profily uživatelů (viz <Link href="/manifest-duvery" className="underline">Manifest důvěry</Link>).</span>
          </p>
          <div className="flex gap-2">
            <Link href="/demo" className="flex-1 inline-flex items-center justify-center bg-white text-gray-900 border border-gray-200 hover:border-gray-900 px-4 py-3 rounded-full text-sm font-medium transition">
              ← Zpět na demo
            </Link>
            <Link href="/test" className="flex-1 inline-flex items-center justify-center bg-gray-900 text-white hover:bg-gray-800 px-4 py-3 rounded-full text-sm font-medium transition">
              Spustit kvíz
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
