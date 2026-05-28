
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
      datePublished: '2026-05-17', dateModified: '2026-05-21',
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
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch calculates a numerology life path number from each user\'s birth date and applies a personology-tradition framework. A seven-layer compatibility score combines birth-date compatibility (35%), shared values & intent (20%), personality fit (15%), intimacy alignment (10%), lifestyle habits (10%), shared interests (5%) and recent activity (5%). Distance, age, and family plans are user-configurable filters, not score components.' },
        },
        {
          '@type': 'Question',
          name: 'Is Cosmatch available outside the Czech Republic?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch launches in Prague, then Brno and Bratislava (Slovakia). Expansion to other European cities depends on demand. The web app works globally but matching density is highest in launch cities.' },
        },
        {
          '@type': 'Question',
          name: 'How is Cosmatch different from Tinder or Hinge?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch shows users five profiles per day, sorted by actual compatibility — not endless swipes. The compatibility score combines birth-date compatibility (35%), values & intent (20%), personality (15%), intimacy (10%), lifestyle (10%), shared interests (5%) and activity (5%). Distance, age, and family plans are user-configurable filters, not score components. No paid algorithmic positions, no ads, no data selling.' },
        },
        {
          '@type': 'Question',
          name: 'Does Cosmatch verify users?',
          acceptedAnswer: { '@type': 'Answer', text: 'Cosmatch uses Google/Facebook SSO and Cloudflare Turnstile bot protection on all accounts. ID verification with verified badge is planned for a later phase.' },
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
            <strong className="font-medium text-gray-900">Cosmatch is a Czech online dating application that pairs users based on numerological compatibility computed from their dates of birth.</strong> The app draws on the personology tradition (Pythagorean numerology synthesised with astrological birth-date interpretation) and applies a seven-layer compatibility algorithm.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Founded by Mgr. Ing. Simona Cibulková in 2026, Cosmatch operates from Prague, Czech Republic. The web application is built on Next.js, hosted on Cloudflare Pages, with Supabase (PostgreSQL) backing user data in Frankfurt EU data centers.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Cosmatch is funded exclusively by user subscriptions — no advertising, no data selling, no paid algorithmic positions. Two tiers at launch: Free (5 likes/day) and Cosmatch+ (249 CZK/month, 597 CZK/quarter — 20 % off, 2 088 CZK/year — 30 % off). A verified tier with mandatory ID verification is planned for later.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* How it works — citation-ready blocks */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">How it works</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Seven-layer compatibility.
          </h2>

          <div className="space-y-6">
            {[
              ['Layer I — Birth-date compatibility (35%)', 'Looks up each user pair via a personology compatibility framework. Returns one of five relationship categories: Soul Mates, Love & Friendship, Beneficial, Fatal Attraction, or Challenging (labelled "Magnetic Tension" in the app).'],
              ['Layer II — Values & intent (20%)', 'Family plans (children yes/no), relationship goal (serious / casual / friendship), religion, financial outlook. Shared long-term values predict relationship durability better than early-stage chemistry.'],
              ['Layer III — Personality & teamwork (15%)', 'Visionary vs realiser, introvert vs extrovert, lark vs owl, conflict style. Complementary patterns work; two identical profiles converge into boredom.'],
              ['Layer IV — Intimacy alignment (10%)', 'Libido frequency match (1–5). In long-term relationships, intimacy alignment functions as insurance against silent frustration.'],
              ['Layer V — Lifestyle (10%)', 'Smoking, alcohol, diet, exercise. Smoking can be a hard dealbreaker. Day-to-day cohabitation friction lives here.'],
              ['Layer VI — Shared interests (5%)', 'Hobby tag overlap (3–8 tags from 45 options). Common ground for the first date, not the main factor for long-term fit.'],
              ['Layer VII — Recent activity (5%)', 'Online within 24h = 100 pts, week = 75, month = 50, older = 30. Even a perfect match goes nowhere if the other person has stopped using the app.'],
            ].map(([title, body], i) => (
              <div key={i} className="grid grid-cols-[auto,1fr] gap-x-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="roman text-2xl text-pink-500 leading-none pt-1">{['I','II','III','IV','V','VI','VII'][i]}</div>
                <div>
                  <h3 className="serif text-lg text-gray-900 font-medium mb-2 leading-tight">{title}</h3>
                  <p className="text-gray-700 leading-[1.7] text-[0.95rem]">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500 leading-relaxed">
            <strong className="text-gray-700 font-medium">Filters (not score):</strong> distance,
            age range, height, body type, family plans, smoking dealbreaker. These exclude profiles
            from the user\'s feed but never penalise the compatibility score itself.
          </p>
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
            Cosmatch.cz is operated as a sole proprietorship under IČO 08419531, registered in Prague 5, Czech Republic.
          </p>
          <p className="text-sm text-gray-500 italic">
            Contact: <Link href="/kontakt" className="text-pink-500 underline">contact form</Link>
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
              <strong className="text-gray-900 font-medium">Personology tradition</strong> — Pythagorean numerology synthesised with astrological interpretation of birth dates, developed across the 20th-century reference literature.
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
          <p className="text-xs text-gray-500 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Prague, Czech Republic · 2026.
            Numerology is not an empirical science — Cosmatch uses it as an interpretive framework for self-discovery and matchmaking, not as objective truth.
          </p>
        </footer>
      </article>
    </main>
  )
}
