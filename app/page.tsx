'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [lang, setLang] = useState<'cs'|'en'>('cs')
  const T = {
    cs: {
      tagline: 'Vesmír zná tvůj match',
      subtitle: 'Seznamka postavená na vědě o datech narození. Zjisti, kdo se k tobě opravdu hodí — na základě přes 2 350 stran personologického výzkumu.',
      cta: 'Začít zdarma',
      login: 'Přihlásit se',
      how: 'Jak to funguje',
      step1_title: 'Zadáš datum narození',
      step1_desc: 'Nic víc nepotřebujeme. Tvůj birthday je klíčem ke všemu.',
      step2_title: 'Algoritmus matchuje',
      step2_desc: 'Porovnáme tvé datum s každým profilem v databázi přes 5 kategorií kompatibility.',
      step3_title: 'Vidíš kdo se hodí',
      step3_desc: 'Oboustranné shody, jednostranné, osudová přitažlivost — vše přehledně.',
      cats: ['💚 Láska & přátelství', '🌟 Prospěšné', '🔥 Osudová přitažlivost', '⚡ Výzva', '🔮 Spřízněné duše'],
      mutual_label: '↔ Oboustranná shoda',
      mutual_desc: 'Když se dva hodí navzájem — to je ten magický moment.',
      stats1: '366', stats1l: 'dat v systému',
      stats2: '46 000+', stats2l: 'párů kompatibility',
      stats3: '5', stats3l: 'kategorií shody',
      footer: 'Cosmatch © 2026 · Postaveno na knize The Power of Birthdays, Stars & Numbers'
    },
    en: {
      tagline: 'The universe knows your match',
      subtitle: 'A dating app built on the science of birth dates. Discover who truly matches with you — based on 2,350 pages of personology research.',
      cta: 'Start for free',
      login: 'Login',
      how: 'How it works',
      step1_title: 'Enter your birthday',
      step1_desc: 'That\'s all we need. Your birth date is the key to everything.',
      step2_title: 'Algorithm matches',
      step2_desc: 'We compare your date with every profile across 5 compatibility categories.',
      step3_title: 'See who fits',
      step3_desc: 'Mutual matches, one-sided, fatal attractions — all clearly displayed.',
      cats: ['💚 Love & Friendship', '🌟 Beneficial', '🔥 Fatal Attraction', '⚡ Challenging', '🔮 Soul Mates'],
      mutual_label: '↔ Mutual Match',
      mutual_desc: 'When two people are listed for each other — that\'s the magic.',
      stats1: '366', stats1l: 'dates in system',
      stats2: '46,000+', stats2l: 'compatibility pairs',
      stats3: '5', stats3l: 'match categories',
      footer: 'Cosmatch © 2026 · Built on The Power of Birthdays, Stars & Numbers'
    }
  }[lang]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 40%, #0f0520 70%, #1a0533 100%)', color: '#fff' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪐</span>
          <span className="text-xl font-bold text-white">Cosmatch</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
            className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 transition-all"
          >
            {lang === 'cs' ? '🇬🇧 EN' : '🇨🇿 CS'}
          </button>
          <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
            {T.login}
          </Link>
          <Link href="/register" className="btn-primary text-sm py-2 px-4">
            {T.cta}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2 text-purple-300 text-sm mb-6">
          <span>🔮</span> Personologie · Astrologie · Věda
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {T.tagline.split(' ').map((word, i) => (
            <span key={i} className={i === T.tagline.split(' ').length - 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>
        <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          {T.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-lg py-4 px-8">
            ✨ {T.cta}
          </Link>
          <a href="#how" className="btn-secondary text-lg py-4 px-8">
            {T.how} ↓
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {[
            [T.stats1, T.stats1l],
            [T.stats2, T.stats2l],
            [T.stats3, T.stats3l],
          ].map(([num, label], i) => (
            <div key={i} className="dark-card text-center py-6 px-4">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{num}</div>
              <div className="text-white/60 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{T.how}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📅', title: T.step1_title, desc: T.step1_desc },
            { icon: '🔭', title: T.step2_title, desc: T.step2_desc },
            { icon: '💫', title: T.step3_title, desc: T.step3_desc },
          ].map((step, i) => (
            <div key={i} className="dark-card p-6 text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="text-white/40 text-sm font-mono mb-2">0{i+1}</div>
              <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">5 kategorií shody</h2>
        <p className="text-white/60 text-center mb-10 max-w-xl mx-auto">Každé datum má jiný vztah s každým jiným datem. My ti ukážeme všechny dimenze.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {T.cats.map((cat, i) => (
            <div key={i} className="dark-card p-4 text-center text-sm font-medium">
              {cat}
            </div>
          ))}
          <div className="dark-card p-4 text-center text-sm font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 col-span-2 md:col-span-1">
            {T.mutual_label}
          </div>
        </div>
        <div className="dark-card p-6 text-center max-w-xl mx-auto">
          <div className="text-3xl mb-3">↔</div>
          <p className="text-white/70">{T.mutual_desc}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="dark-card max-w-2xl mx-auto p-12">
          <h2 className="text-3xl font-bold mb-4">Připraven/a začít?</h2>
          <p className="text-white/60 mb-8">Registrace je zdarma. Zadej datum narození a objev svůj match.</p>
          <Link href="/register" className="btn-primary text-lg py-4 px-10 inline-block">
            ✨ {T.cta}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-6 text-white/30 text-sm border-t border-white/10">
        {T.footer}
      </footer>
    </div>
  )
}
