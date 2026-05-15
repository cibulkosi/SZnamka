'use client'
import Link from 'next/link'

const DEMO_PROFILES = [
  {
    name: 'Tereza', age: 28, city: 'Praha', birthday: '03-21',
    zodiac: '♈ Beran', bio: 'Miluji cestování, dobrou kávu a spontánní výlety do hor. Hledám někoho, s kým to bude dávat smysl.',
    hobbies: ['Cestování', 'Jóga', 'Fotografování', 'Vaření'],
    occupation: 'Grafická designérka', gradient: 'from-pink-400 to-rose-500',
    compat: { soul_mates: true, is_mutual: true, challenging: false, love_friendship: false, beneficial: false, fatal_attraction: false },
    score: 94,
    personology: 'Přirozený vůdce s magnetickým charismatem. Vesmír ti dal dar vidět možnosti tam, kde ostatní vidí překážky.',
  },
  {
    name: 'Jakub', age: 31, city: 'Brno', birthday: '07-14',
    zodiac: '♋ Rak', bio: 'Softwarový inženýr, nadšenec do vína a filmů. Hledám vztah s hloubkou, ne jen povrchní zábavu.',
    hobbies: ['Filmy', 'Hudba', 'Fitness', 'Cestování'],
    occupation: 'Software engineer', gradient: 'from-violet-400 to-purple-500',
    compat: { soul_mates: false, is_mutual: true, challenging: false, love_friendship: true, beneficial: false, fatal_attraction: false },
    score: 81,
    personology: 'Hluboká intuice a schopnost vcítit se. Tvoje emocionální inteligence tě dělá vzácným partnerem.',
  },
  {
    name: 'Klára', age: 26, city: 'Praha', birthday: '11-08',
    zodiac: '♏ Štír', bio: 'Archeoložka duší — baví mě hluboké rozhovory a lidé s příběhem. Ve volném čase maluju.',
    hobbies: ['Umění', 'Čtení', 'Příroda', 'Meditace'],
    occupation: 'Psycholožka', gradient: 'from-emerald-400 to-teal-500',
    compat: { soul_mates: false, is_mutual: false, challenging: false, love_friendship: false, beneficial: true, fatal_attraction: true },
    score: 73,
    personology: 'Magnetická síla a schopnost transformace. Máš dar vidět pravdu za povrchem věcí.',
  },
  {
    name: 'Martin', age: 34, city: 'Praha', birthday: '05-20',
    zodiac: '♉ Býk', bio: 'Šéfkuchař v duši, amatér v praxi. Miluji vaření, přírodu a psy. Hledám někoho, kdo nebojí zašpinit ruce.',
    hobbies: ['Vaření', 'Příroda', 'Zahradničení', 'Sport'],
    occupation: 'Produktový manažer', gradient: 'from-orange-400 to-amber-500',
    compat: { soul_mates: false, is_mutual: false, challenging: true, love_friendship: true, beneficial: false, fatal_attraction: false },
    score: 62,
    personology: 'Pevnost a spolehlivost jsou tvoje superschopnosti. Vytváříš bezpečné prostředí pro ty, kteří jsou ti blízcí.',
  },
  {
    name: 'Anežka', age: 29, city: 'Ostrava', birthday: '09-15',
    zodiac: '♍ Panna', bio: 'Doktorandka fyziky, která ráda tančí salsu. Protikladné combo? Možná. Ale funguje to!',
    hobbies: ['Tanec', 'Věda', 'Fitness', 'Cestování'],
    occupation: 'Vědkyně', gradient: 'from-cyan-400 to-blue-500',
    compat: { soul_mates: false, is_mutual: true, challenging: false, love_friendship: false, beneficial: true, fatal_attraction: false },
    score: 78,
    personology: 'Analytická mysl s vášní pro detail. Tvoje preciznost tě vede k dokonalosti ve všem, čeho se dotkneš.',
  },
  {
    name: 'Ondřej', age: 27, city: 'Praha', birthday: '12-22',
    zodiac: '♑ Kozoroh', bio: 'Muzikant a věčný snílek. Píšu texty písní a hledám múzu. Jsem milovník ticha i hlasitých koncertů.',
    hobbies: ['Hudba', 'Umění', 'Filmy', 'Čtení'],
    occupation: 'Hudebník / copywriter', gradient: 'from-indigo-400 to-violet-500',
    compat: { soul_mates: true, is_mutual: false, challenging: false, love_friendship: true, beneficial: false, fatal_attraction: false },
    score: 88,
    personology: 'Disciplína a ambice jdou ruku v ruce s tvou kreativitou. Jsi schopen budovat věci, které trvají.',
  },
]

const COMPAT_BADGES = [
  { key: 'is_mutual', label: '↔ Oboustranná', cls: 'bg-cyan-500/30 border-cyan-400/50 text-cyan-300' },
  { key: 'soul_mates', label: '🔮 Spřízněné duše', cls: 'bg-violet-600/80 border-violet-400/40 text-white' },
  { key: 'love_friendship', label: '💚 Láska & přátelství', cls: 'bg-pink-600/80 border-pink-400/40 text-white' },
  { key: 'beneficial', label: '🌟 Prospěšné', cls: 'bg-emerald-600/80 border-emerald-400/40 text-white' },
  { key: 'fatal_attraction', label: '🔥 Osudová', cls: 'bg-orange-600/80 border-orange-400/40 text-white' },
  { key: 'challenging', label: '⚡ Výzva', cls: 'bg-yellow-600/80 border-yellow-400/40 text-white' },
]

function ScoreRing({ score }: { score: number }) {
  const r = 22, circ = 2 * Math.PI * r
  const prog = (score / 100) * circ
  const color = score >= 80 ? '#a855f7' : score >= 60 ? '#ec4899' : '#f59e0b'
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${prog} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 28 28)" />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  )
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-pink-500 text-xl font-bold">✦</span>
              <span className="font-bold text-gray-900">Cosmatch</span>
              <span className="text-xs text-gray-400 font-normal ml-1">— demo</span>
            </div>
          </div>
          <Link href="/register" className="btn-primary text-sm py-2 px-4">
            ✨ Registrovat se
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Info banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-3xl p-5 mb-8 flex items-start gap-4">
          <span className="text-2xl">🪐</span>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Ukázkové profily — jak Cosmatch vypadá zevnitř</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Skóre kompatibility je vypočítáno na základě tvého data narození. Po registraci uvidíš reálné profily seřazené přesně pro tebe — žádné náhodné swipy.
            </p>
            <Link href="/register" className="inline-flex items-center gap-1.5 mt-3 text-pink-500 hover:text-pink-600 font-semibold text-sm transition-colors">
              Vytvořit svůj profil zdarma →
            </Link>
          </div>
        </div>

        {/* Filter bar (dekorativní) */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-gray-500 tracking-wide">{DEMO_PROFILES.length} UKÁZKOVÝCH PROFILŮ</span>
          <div className="flex gap-1.5">
            {['Vše', '75%+', '50%+'].map((f, i) => (
              <span key={i} className={`text-xs px-3 py-1 rounded-full font-semibold ${i === 0 ? 'bg-pink-500 text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Profily — 2 sloupce na desktop, 1 na mobilu */}
        <div className="grid md:grid-cols-2 gap-5">
          {DEMO_PROFILES.map((p, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Fotka — gradient avatar */}
              <div className={`relative h-56 bg-gradient-to-br ${p.gradient} flex items-end`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-8xl font-bold opacity-30">{p.name[0]}</span>
                </div>
                {/* Score ring */}
                <div className="absolute top-3 right-3">
                  <ScoreRing score={p.score} />
                </div>
                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
                {/* Jméno */}
                <div className="relative p-4 w-full">
                  <h3 className="text-white font-bold text-xl">{p.name}, {p.age}</h3>
                  <p className="text-white/70 text-sm">📍 {p.city} · {p.zodiac}</p>
                  {p.hobbies.slice(0, 3).map(h => (
                    <span key={h} className="inline-block bg-white/20 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full mr-1 mt-1 border border-white/30">{h}</span>
                  ))}
                </div>
              </div>

              {/* Spodní obsah */}
              <div className="p-4">
                {/* Compat badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {COMPAT_BADGES.map(b => {
                    if (!p.compat[b.key as keyof typeof p.compat]) return null
                    return (
                      <span key={b.key} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${b.cls}`}>{b.label}</span>
                    )
                  })}
                </div>

                {/* Povolání */}
                {p.occupation && (
                  <p className="text-xs text-gray-400 mb-2">💼 {p.occupation}</p>
                )}

                {/* Bio */}
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">{p.bio}</p>

                {/* Personologický výtah */}
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 mb-3">
                  <p className="text-xs font-semibold text-purple-600 mb-1">🔮 Personologický profil</p>
                  <p className="text-purple-700 text-xs leading-relaxed italic">&ldquo;{p.personology}&rdquo;</p>
                </div>

                {/* CTA tlačítka */}
                <div className="flex gap-2 mt-2">
                  <button
                    disabled
                    className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-gray-300 border border-gray-100 bg-gray-50 cursor-not-allowed"
                  >
                    ✕ Pass
                  </button>
                  <Link href="/register" className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-center" style={{ background: '#E91E8C', color: 'white' }}>
                    ♥ Registrovat se
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-10">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-white text-2xl font-bold mb-3">Zaujaly tě ukázkové profily?</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Zadej datum narození a okamžitě uvidíš svůj personologický profil. Pak ti ukážeme reálné lidi seřazené právě pro tebe.
          </p>
          <Link href="/register" className="btn-primary text-lg py-4 px-10 inline-block">
            ✨ Začít zdarma — 30 sekund
          </Link>
          <p className="text-white/30 text-xs mt-4">Žádná kreditní karta. Žádný závazek.</p>
        </div>
      </div>
    </div>
  )
}
