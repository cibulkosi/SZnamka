
'use client'
import Link from 'next/link'

const DEMO_PROFILES = [
  {
    name: 'Tereza', age: 28, city: 'Praha', zodiac: 'Beran',
    bio: 'Miluji cestování, dobrou kávu a spontánní výlety do hor. Hledám někoho, s kým to bude dávat smysl.',
    occupation: 'Grafická designérka', hobbies: ['Cestování', 'Jóga', 'Fotografování', 'Vaření'],
    label: 'Spřízněné duše · oboustranná shoda', accent: '#9333EA', score: 94, verified: true,
  },
  {
    name: 'Jakub', age: 31, city: 'Brno', zodiac: 'Rak',
    bio: 'Softwarový inženýr, nadšenec do vína a filmů. Hledám vztah s hloubkou, ne jen povrchní zábavu.',
    occupation: 'Software engineer', hobbies: ['Filmy', 'Hudba', 'Fitness', 'Cestování'],
    label: 'Láska a přátelství · oboustranná shoda', accent: '#DB2777', score: 81, verified: false,
  },
  {
    name: 'Klára', age: 26, city: 'Praha', zodiac: 'Štír',
    bio: 'Archeoložka duší — baví mě hluboké rozhovory a lidé s příběhem. Ve volném čase maluju.',
    occupation: 'Psycholožka', hobbies: ['Umění', 'Čtení', 'Příroda', 'Meditace'],
    label: 'Osudová přitažlivost', accent: '#C2410C', score: 73, verified: true,
  },
  {
    name: 'Martin', age: 34, city: 'Praha', zodiac: 'Býk',
    bio: 'Šéfkuchař v duši, amatér v praxi. Miluji vaření, přírodu a psy. Hledám někoho, kdo se nebojí zašpinit ruce.',
    occupation: 'Produktový manažer', hobbies: ['Vaření', 'Příroda', 'Zahradničení', 'Sport'],
    label: 'Magnetická tenze · výzva', accent: '#B45309', score: 62, verified: false,
  },
  {
    name: 'Anežka', age: 29, city: 'Ostrava', zodiac: 'Panna',
    bio: 'Doktorandka fyziky, která ráda tančí salsu. Protikladné combo? Možná. Ale funguje to!',
    occupation: 'Vědkyně', hobbies: ['Tanec', 'Věda', 'Fitness', 'Cestování'],
    label: 'Prospěšný vztah · oboustranná shoda', accent: '#047857', score: 78, verified: true,
  },
  {
    name: 'Ondřej', age: 27, city: 'Praha', zodiac: 'Kozoroh',
    bio: 'Muzikant a věčný snílek. Píšu texty písní a hledám múzu. Jsem milovník ticha i hlasitých koncertů.',
    occupation: 'Hudebník · copywriter', hobbies: ['Hudba', 'Umění', 'Filmy', 'Čtení'],
    label: 'Spřízněné duše', accent: '#6D28D9', score: 88, verified: false,
  },
]

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      {/* Top */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Masthead */}
        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Demo profily</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Šest lidí.<br/>Šest <em className="italic text-pink-500">příběhů</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Toto jsou ukázkové profily Cosmatch — abys viděla, jak vypadá hloubka,
            kterou stavíme. Skutečné profily přibývají s otevřením betas v Praze.
          </p>
        </header>

        {/* Profiles */}
        <section className="space-y-6 mb-16">
          {DEMO_PROFILES.map((p, i) => (
            <article key={p.name}
              className="bg-white border border-gray-100 rounded-3xl p-8 transition-all hover:border-gray-200">

              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="eyebrow text-gray-500 mb-2">Profil {String(i+1).padStart(2,'0')}</p>
                  <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-2 flex items-center gap-3 flex-wrap">
                    {p.name}, {p.age}
                    {p.verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        Ověřeno
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {p.city} <span className="text-gray-300 mx-1.5">·</span> {p.zodiac} <span className="text-gray-300 mx-1.5">·</span> {p.occupation}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="serif-display text-4xl font-medium tabular-nums leading-none" style={{ color: p.accent }}>
                    {p.score}
                  </p>
                  <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-1">skóre</p>
                </div>
              </div>

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6 italic serif">
                „{p.bio}“
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {p.hobbies.map(h => (
                  <span key={h} className="text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1">{h}</span>
                ))}
              </div>

              <div className="pt-5 border-t border-gray-100">
                <p className="eyebrow text-gray-500 mb-2">Kompatibilita</p>
                <p className="serif text-base font-medium" style={{ color: p.accent }}>{p.label}</p>
              </div>
            </article>
          ))}
        </section>

        {/* CTA */}
        <section className="bg-white border border-gray-100 rounded-3xl p-10">
          <p className="eyebrow text-pink-500 mb-4">Tvoji shodu uvidíš na ostro</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Cosmatch spočítá tvoji.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zjisti svůj numerologický archetyp za 30 sekund, přidej se na waitlist a buď u toho jako první.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
              Spustit kvíz
            </Link>
            <Link href="/waitlist" className="inline-flex items-center justify-center text-gray-900 border border-gray-300 hover:border-gray-900 px-8 py-4 rounded-full text-base font-medium transition">
              Přidat se na waitlist
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed mt-12">
          Jména, fotky a data zde uvedená jsou ilustrativní — slouží jen pro představu o Cosmatch.
          Reálné profily nikdy nebudou vymyšlené.
        </p>
      </div>
    </main>
  )
}
