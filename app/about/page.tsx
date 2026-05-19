
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'About Cosmatch — Czech Numerology Dating App | Cosmatch'
const DESC = 'Cosmatch is the first Czech online dating app that matches users based on numerological compatibility calculated from their birth dates. Built in Prague, launching in 2026.'
const URL = 'https://cosmatch.cz/about'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: {
    canonical: URL,
    languages: {
      'en-US': URL,
      'cs-CZ': 'https://cosmatch.cz/jak-funguje-cosmatch',
      'x-default': URL,
    },
  },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['cosmatch', 'czech dating app', 'numerology dating', 'dating app birth date', 'european dating app', 'numerological compatibility'],
  authors: [{ name: 'Simona Cibulková', url: 'https://cosmatch.cz' }],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      name: 'About Cosmatch',
      url: URL,
      inLanguage: 'en-US',
      mainEntity: { '@id': 'https://cosmatch.cz/#organization' },
    },
    {
      '@type': 'Article',
      headline: TITLE, description: DESC,
      author: { '@type': 'Person', name: 'Simona Cibulková', jobTitle: 'Founder of Cosmatch' },
      publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
      datePublished: '2026-05-17', dateModified: '2026-05-17',
      inLanguage: 'en-US',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Cosmatch?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch is the first Czech online dating app that matches users based on numerological compatibility calculated from their birth dates. Built in Prague, launching in 2026.' },
        },
        {
          '@type': 'Question',
          name: 'How does Cosmatch work?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch calculates each user\'s life path number from their birth date and matches them with compatible numbers using 366 personology profiles from the book The Power of Birthdays. Five additional layers refine the match: intent, distance, activity, shared interests, and tension dynamics.' },
        },
        {
          '@type': 'Question',
          name: 'Is Cosmatch available outside the Czech Republic?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch launches in Prague, then Brno and Bratislava (Slovakia). Expansion to other European cities depends on demand. The web app works globally but matching density is highest in launch cities.' },
        },
        {
          '@type': 'Question',
          name: 'How is Cosmatch different from Tinder or Hinge?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch shows users five profiles per day, sorted by actual compatibility — not endless swipes. Match scoring uses numerological compatibility (35%), shared intent (30%), distance (15%), activity (15%), and interests (5%). No paid algorithmic positions, no ads, no data selling.' },
        },
        {
          '@type': 'Question',
          name: 'Does Cosmatch verify users?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch Serious tier (399 CZK/month, 249 CZK/month annual) requires mandatory ID verification through a renowned EU identity verification service. Free and Cosmatch+ tiers use Google/Facebook SSO and Cloudflare Turnstile bot protection.' },
        },
      ],
    },
  ],
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6 flex justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
        <Link href="/jak-funguje-cosmatch" className="text-sm text-gray-500 hover:text-gray-900 transition">Česky →</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">About</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Cosmatch is the first<br/><em className="italic text-pink-500">Czech numerology</em><br/>dating app.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Cosmatch.cz matches users based on numerological compatibility calculated from their
            birth dates. Five profiles per day instead of endless swiping. Built in Prague,
            launching in 2026.
          </p>
        </header>

        {/* What is Cosmatch — answer-ready */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">What is Cosmatch</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Definition.
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem] dropcap mb-4">
            <strong className="font-medium text-gray-900">Cosmatch is a Czech online dating application that pairs users based on numerological compatibility computed from their dates of birth.</strong> The app draws on 366 personology profiles from the book <em className="italic">The Power of Birthdays, Stars &amp; Numbers</em> (Goldschneider &amp; Elffers, 1994) and applies a five-layer compatibility algorithm.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Founded by Mgr. Ing. Simona Cibulková in 2026, Cosmatch operates from Prague, Czech Republic. The web application is built on Next.js, hosted on Cloudflare Pages, with Supabase (PostgreSQL) backing user data in Frankfurt EU data centers.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Cosmatch is funded exclusively by user subscriptions — no advertising, no data selling, no paid algorithmic positions. Three tiers: Free (5 likes/day), Cosmatch+ (from 249 CZK/month, 149 CZK/month annual), Cosmatch Serious (from 399 CZK/month, 249 CZK/month annual, with mandatory ID verification).
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* How it works — citation-ready blocks */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">How it works</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Five-layer compatibility.
          </h2>

          <div className="space-y-6">
            {[
              ['Layer I — Numerological compatibility (35%)', 'Calculates each user\'s life path number from birth date, references a 366×366 compatibility matrix from The Power of Birthdays. Returns base score plus relationship category: Soul Mate, Love & Friendship, Fatal Attraction, Beneficial, or Challenging.'],
              ['Layer II — Intent multiplier (30%)', 'Same relationship goal (serious/casual/etc.) multiplies score by 1.2. Opposite intent (serious vs casual) multiplies by 0.5. Prevents mismatched expectations.'],
              ['Layer III — Distance decay (15%)', 'Non-linear curve: 0–5 km = full bonus, 5–15 km = 66%, 15–30 km = 33%. Beyond user-set limit = profile excluded entirely.'],
              ['Layer IV — Activity boost (15%)', '+15 points for users active within 24h. ELO tiebreak: more popular profiles surface first for new users, ensuring strong first impression.'],
              ['Layer V — Shared interests + tension (5%)', 'Hobbies overlap plus tension factor for asymmetric matches (one sees fatal attraction, other sees challenge → "Magnetic Tension" label).'],
            ].map(([title, body], i) => (
              <div key={i} className="grid grid-cols-[auto,1fr] gap-x-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="roman text-2xl text-pink-500 leading-none pt-1">{['I','II','III','IV','V'][i]}</div>
                <div>
                  <h3 className="serif text-lg text-gray-900 font-medium mb-2 leading-tight">{title}</h3>
                  <p className="text-gray-700 leading-[1.7] text-[0.95rem]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Founder bio for E-E-A-T */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Founder</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Simona Cibulková.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Mgr. Ing. Simona Cibulková is the founder and sole operator of Cosmatch. Educated in business (Ing.) and humanities (Mgr.), she spent several years studying personology, relationship dynamics, and numerology before building Cosmatch.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cosmatch.cz is operated as a sole proprietorship under IČO 08419531, registered in Pnětluky, Czech Republic.
          </p>
          <p className="text-sm text-gray-500 italic">
            Contact: <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Sources */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Methodology &amp; sources</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            What Cosmatch is built on.
          </h2>
          <ul className="space-y-4">
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">The Power of Birthdays, Stars &amp; Numbers</strong> by Goldschneider &amp; Elffers (Crown, 1994) — 832-page reference of personology profiles for each day of the year, with complete compatibility matrix.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Datum narození a jeho vliv na náš charakter</strong> by Jitka Kadlecová (Eminent, 2006) — Czech personology tradition.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Pew Research CEE 2017</strong> — 43% of Czechs believe in fate; 44% in the existence of a soul.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">STEM/MARK 2025</strong> — 96% of Czech women aged 18–29 consider finding a partner difficult.
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow text-pink-500 mb-4">Try it</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Calculate your number.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Enter your birth date and see your numerological archetype in 30 seconds.
            No signup required.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Try the quiz
          </Link>
        </section>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Prague, Czech Republic · 2026.
            Numerology is not an empirical science — Cosmatch uses it as an interpretive framework for self-discovery and matchmaking, not as objective truth.
          </p>
        </footer>
      </article>
    </main>
  )
}
