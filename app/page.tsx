'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="bg-[#FAF6F0] text-gray-900 overflow-x-hidden">

      {/* TOP NAV */}
      <nav className="absolute top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="serif-display text-2xl font-medium text-gray-900 tracking-tight">
            Cosmatch
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Přihlásit se
            </Link>
            <Link
              href="/test"
              className="text-sm text-white bg-gray-900 hover:bg-gray-800 px-5 py-2.5 rounded-full transition"
            >
              Kvíz zdarma
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-end pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.2fr_1fr] gap-16 items-end">
          <div>
            <p className="eyebrow text-pink-500 mb-6">Numerologická seznamka · Praha</p>
            <h1 className="serif-display text-[3.25rem] sm:text-7xl lg:text-[5.5rem] text-gray-900 font-medium leading-[0.98] tracking-tight mb-10">
              Najdi člověka,<br/>se kterým<br/><em className="italic text-pink-500">to dává smysl</em>.
            </h1>
            <hr className="rule w-16 border-gray-900 mb-8" />
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-10 max-w-xl">
              96\u202f% českých žen 18–29 považuje hledání partnera za obtížné.
              Cosmatch tu dynamiku mění — spočítá kompatibilitu mezi tvým a partnerovým
              datem narození z 366 personologických profilů. Místo swipování pro swipování
              ti dává důvod, proč se s někým potkat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/test"
                className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all"
              >
                Zjisti svůj archetyp
              </Link>
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center text-gray-900 border border-gray-300 hover:border-gray-900 px-8 py-5 rounded-full text-base font-medium transition-all"
              >
                Přidat se na waitlist
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Spouštíme v Praze. Prvních 1\u202f000 dostane voucher na 3\u202fměsíce zdarma.
            </p>
          </div>

          {/* Right column — quote card */}
          <div className="lg:pl-12">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
              <p className="eyebrow text-gray-400 mb-6">Z Manifestu důvěry</p>
              <p className="serif text-2xl text-gray-900 leading-[1.45] mb-8 italic">
                "Tinder vydělává na tom, jak dlouho v něm zůstaneš.
                My vyděláváme na tom, jak rychle nás opustíš."
              </p>
              <Link href="/manifest-duvery" className="text-sm text-pink-500 hover:text-pink-600 transition">
                Přečíst všech sedm závazků →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CZECH DATA STRIP — verifikované české zdroje */}
      <section className="border-y border-gray-200 bg-white/40">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="eyebrow text-pink-500 mb-8">Co o nás Češích říkají data</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16">
            <div>
              <div className="serif-display text-3xl sm:text-5xl text-gray-900 font-medium tracking-tight mb-2 tabular-nums">96 %</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                českých žen 18–29 let považuje hledání partnera za <em className="italic text-pink-500">obtížné</em>.
              </p>
              <p className="text-xs text-gray-400 mt-2">STEM/MARK, 2025</p>
            </div>
            <div>
              <div className="serif-display text-3xl sm:text-5xl text-gray-900 font-medium tracking-tight mb-2 tabular-nums">43 %</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                online Čechů věří horoskopům.<br/>Mezi ženami <em className="italic text-pink-500">56 %</em>.
              </p>
              <p className="text-xs text-gray-400 mt-2">Nielsen Admosphere</p>
            </div>
            <div>
              <div className="serif-display text-3xl sm:text-5xl text-gray-900 font-medium tracking-tight mb-2 tabular-nums">43 %</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Čechů věří v <em className="italic text-pink-500">osud</em>. Třetina v existenci spřízněné duše.
              </p>
              <p className="text-xs text-gray-400 mt-2">Pew CEE</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-10 leading-relaxed max-w-2xl">
            Cosmatch staví na ověřené české realitě, ne na importovaných statistikách.
            <Link href="/kompatibilita-podle-data-narozeni" className="text-pink-500 hover:text-pink-600 ml-1">
              Více v průvodci →
            </Link>
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — editorial three step */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow text-pink-500 mb-6">Jak to funguje</p>
          <h2 className="serif-display text-4xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-20">
            Tři kroky.<br/>Žádné dotazníky.
          </h2>

          <div className="space-y-16">
            {[
              {
                num: 'I',
                title: 'Zadej datum narození',
                body: 'Cosmatch z něj spočítá tvůj numerologický archetyp — jeden z dvanácti. Vidíš jméno, vlastnosti, stín, jak miluješ. Žádné dotazníky, žádné testy osobnosti.'
              },
              {
                num: 'II',
                title: 'Uvidíš profily, ne karty',
                body: 'Místo nekonečného swipování dostaneš pět profilů denně — seřazené podle skutečné kompatibility. Každý profil ti řekne, proč právě on.'
              },
              {
                num: 'III',
                title: 'Potkáš se v reálném světě',
                body: 'Match → zpráva → káva. Cosmatch je navržen tak, aby tě co nejrychleji odpojil — a vrátil zpátky do skutečného života.'
              },
            ].map((s) => (
              <div key={s.num} className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
                <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">{s.num}</div>
                <div>
                  <h3 className="serif text-2xl sm:text-3xl text-gray-900 font-medium leading-tight mb-3">{s.title}</h3>
                  <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARK READING — Pattern-style */}
      <section className="bg-[#0F0B14] text-white py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow text-pink-400 mb-6">Pět kategorií vztahu</p>
          <h2 className="serif-display text-4xl sm:text-6xl font-medium leading-[1.05] tracking-tight mb-12 text-white">
            Každý člověk s tebou<br/>má <em className="italic text-pink-400">jiný příběh</em>.
          </h2>
          <p className="text-white/70 text-lg leading-[1.8] mb-16 max-w-xl">
            Kniha The Power of Birthdays definuje pět typů vztahu mezi dvěma daty narození.
            Cosmatch je spočítal všech 46\u202f949 a ukazuje ti, jak by to mohlo vypadat,
            ještě než si napíšeš první zprávu.
          </p>

          <div className="space-y-8">
            {[
              { name: 'Spřízněné duše', body: 'Hluboké, klidné spojení. Přirozený soulad bez snahy. Vzácné a vyhledávané.' },
              { name: 'Láska a přátelství', body: 'Vzájemná podpora, sdílené hodnoty, pohoda. Dlouhodobý vztah, ne fireworky.' },
              { name: 'Osudová přitažlivost', body: 'Intenzivní magnetický tah. Vášeň, kterou nelze ovládat. Buď okouzlující, nebo destruktivní.' },
              { name: 'Prospěšný vztah', body: 'Komplementární partnerství — každý přináší něco, co druhému chybí. Růst.' },
              { name: 'Náročný vztah', body: 'Vztah plný napětí a transformace. Učí tě věci, které by ses jinde nenaučil.' },
            ].map((c, i) => (
              <div key={c.name} className="grid grid-cols-[auto,1fr] gap-x-8 border-b border-white/10 pb-8 last:border-b-0">
                <div className="serif text-xl text-pink-400 leading-none pt-1 tabular-nums">{String(i+1).padStart(2,'0')}</div>
                <div>
                  <h3 className="serif text-2xl font-medium text-white mb-2">{c.name}</h3>
                  <p className="text-white/65 leading-relaxed text-[1.0625rem]">{c.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link
              href="/demo"
              className="inline-flex items-center text-white border border-white/30 hover:border-white px-8 py-4 rounded-full text-base font-medium transition-all"
            >
              Prohlédnout demo profily
            </Link>
          </div>
        </div>
      </section>

      {/* WHY — editorial principles */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow text-pink-500 mb-6">Co Cosmatch nedělá</p>
          <h2 className="serif-display text-4xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-16">
            Méně. Pomaleji.<br/><em className="italic text-pink-500">S důvodem.</em>
          </h2>

          <div className="space-y-12">
            {[
              ['Žádné swipování pro swipování.', 'Dostaneš pět profilů denně — seřazené přesně pro tebe.'],
              ['Žádné falešné notifikace.', 'Když ti přijde zpráva, někdo ti opravdu napsal.'],
              ['Žádné placené pozice v algoritmu.', 'Vzorec si můžeš přepočítat. Placené předplatné mění tvé možnosti, ne tvoji viditelnost.'],
              ['Žádné reklamy. Nikdy.', 'Cosmatch financují uživatelé, ne inzerenti.'],
            ].map(([t, b]) => (
              <div key={t} className="border-b border-gray-200 pb-12 last:border-b-0">
                <h3 className="serif text-2xl sm:text-3xl text-gray-900 font-medium leading-tight mb-3">{t}</h3>
                <p className="text-gray-600 leading-relaxed text-[1.0625rem]">{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link href="/manifest-duvery" className="text-pink-500 hover:text-pink-600 transition font-medium">
              Přečti si všech sedm závazků →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="eyebrow text-pink-500 mb-6">Začni teď</p>
          <h2 className="serif-display text-4xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            30 sekund.<br/>Žádná registrace.
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-12 max-w-lg mx-auto">
            Zadej datum narození a uvidíš svůj numerologický archetyp.
            Pokud chceš pokračovat, přidáš se na waitlist.
          </p>
          <Link
            href="/test"
            className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all"
          >
            Spustit kvíz
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="serif-display text-xl font-medium text-gray-900 mb-1">Cosmatch</p>
            <p className="text-sm text-gray-500">© 2026 · Mgr. Ing. Simona Cibulková · Praha</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/test" className="text-gray-500 hover:text-gray-900 transition">Kvíz</Link>
            <Link href="/waitlist" className="text-gray-500 hover:text-gray-900 transition">Waitlist</Link>
            <Link href="/manifest-duvery" className="text-gray-500 hover:text-gray-900 transition">Manifest důvěry</Link>
            <Link href="/login" className="text-gray-500 hover:text-gray-900 transition">Přihlásit</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
