'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [lang, setLang] = useState<'cs'|'en'>('cs')
  const isCs = lang === 'cs'

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0010' }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto" style={{ background: 'rgba(10,0,16,0.75)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪐</span>
          <span className="text-xl font-bold text-white">Cosmatch</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(isCs ? 'en' : 'cs')}
            className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 transition-all"
          >
            {isCs ? '🇬🇧 EN' : '🇨🇿 CS'}
          </button>
          <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
            {isCs ? 'Přihlásit se' : 'Login'}
          </Link>
          <Link href="/register" className="btn-primary text-sm py-2 px-4">
            {isCs ? 'Začít zdarma' : 'Start free'}
          </Link>
        </div>
      </nav>

      {/* ── HERO — mlhovina/galaxie jako pozadí ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=85&auto=format&fit=crop"
            alt="Vesmír — galaxie"
            className="w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,0,16,0.4) 0%, rgba(10,0,16,0.15) 40%, rgba(10,0,16,0.95) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2 text-purple-300 text-sm mb-8">
            <span>🔮</span>
            {isCs ? 'Personologie · Věda o datech narození' : 'Personology · The Science of Birth Dates'}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {isCs ? (
              <>Vesmír zná<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">tvůj match</span></>
            ) : (
              <>The universe knows<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">your match</span></>
            )}
          </h1>

          <p className="text-white/85 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {isCs
              ? 'Seznamka postavená na vědě o datech narození. Tvůj personologický profil — z přes 2 350 stran výzkumu — najde ty, kteří ti opravdu odpovídají.'
              : 'A dating app built on the science of birth dates. Your personology profile — from 2,350+ pages of research — finds people who truly match you.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/register" className="btn-primary text-lg py-4 px-8">
              ✨ {isCs ? 'Začít zdarma' : 'Start for free'}
            </Link>
            <Link
              href="/demo"
              className="text-lg py-4 px-8 rounded-2xl font-semibold transition-all border border-white/40 hover:border-white/70 hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
            >
              👁 {isCs ? 'Prohlédnout demo' : 'Browse demo'}
            </Link>
          </div>

          <p className="text-white/40 text-sm">
            {isCs ? 'Žádná kreditní karta. Registrace za 30 sekund.' : 'No credit card. Sign up in 30 seconds.'}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6" style={{ background: 'rgba(255,255,255,0.025)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {[
            ['366', isCs ? 'personol. profilů' : 'personology profiles'],
            ['133 000+', isCs ? 'párů kompatibility' : 'compatibility pairs'],
            ['5', isCs ? 'kategorií shody' : 'match categories'],
          ].map(([num, label], i) => (
            <div key={i} className="text-center py-8 px-4 rounded-3xl border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">{num}</div>
              <div className="text-white/50 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── JAK TO FUNGUJE ── */}
      <section id="how" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {isCs ? 'Jak to funguje' : 'How it works'}
        </h2>
        <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
          {isCs ? 'Žádné dotazníky. Žádné testy osobnosti. Stačí datum.' : 'No questionnaires. No personality tests. Just your birthdate.'}
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '📅', num: '01',
              title: isCs ? 'Zadáš datum narození' : 'Enter your birthday',
              desc: isCs ? 'Nic víc nepotřebujeme. Tvůj birthday odemkne tvůj přesný personologický profil.' : 'That\'s all we need. Your birthday unlocks your exact personology profile.',
            },
            {
              icon: '🔭', num: '02',
              title: isCs ? 'Vesmír ti ukáže tvůj profil' : 'The universe shows your profile',
              desc: isCs ? 'Ihned po zadání data uvidíš svůj personologický výtah. Tento "magic moment" tě překvapí přesností.' : 'Right after entering your date, you\'ll see your personology excerpt. This magic moment will surprise you.',
            },
            {
              icon: '💫', num: '03',
              title: isCs ? 'Najdeš svůj match' : 'Find your match',
              desc: isCs ? 'Algoritmus porovná tvoje datum se všemi v databázi přes 5 kategorií kompatibility a seřadí je.' : 'The algorithm compares your date with everyone across 5 compatibility categories and ranks them.',
            },
          ].map((step, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
              <div className="text-5xl mb-5">{step.icon}</div>
              <div className="text-white/20 text-sm font-mono mb-3">{step.num}</div>
              <h3 className="font-bold text-lg mb-3 text-white">{step.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 KATEGORIÍ — mlhovina v pozadí ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80&auto=format&fit=crop"
            alt="Mlhovina"
            className="w-full h-full object-cover"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,0,16,0.65)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {isCs ? '5 kategorií shody' : '5 match categories'}
          </h2>
          <p className="text-white/50 text-center mb-14 max-w-xl mx-auto">
            {isCs
              ? 'Každé datum má jiný vztah s každým jiným datem. Uvidíš všechny dimenze.'
              : 'Every date has a different relationship with every other date. You\'ll see all dimensions.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: '🔮', label: isCs ? 'Spřízněné duše' : 'Soul Mates', cls: 'border-violet-400/40 bg-violet-500/15' },
              { icon: '💚', label: isCs ? 'Láska & přátelství' : 'Love & Friendship', cls: 'border-emerald-400/40 bg-emerald-500/15' },
              { icon: '🔥', label: isCs ? 'Osudová přitažlivost' : 'Fatal Attraction', cls: 'border-orange-400/40 bg-orange-500/15' },
              { icon: '🌟', label: isCs ? 'Prospěšné' : 'Beneficial', cls: 'border-yellow-400/40 bg-yellow-500/15' },
              { icon: '⚡', label: isCs ? 'Výzva' : 'Challenging', cls: 'border-blue-400/40 bg-blue-500/15' },
              { icon: '↔', label: isCs ? 'Oboustranná shoda' : 'Mutual Match', cls: 'border-cyan-400/40 bg-cyan-500/15' },
            ].map((cat, i) => (
              <div key={i} className={`p-5 rounded-2xl border ${cat.cls} text-center`}>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-white font-semibold text-sm">{cat.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/demo" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors border border-purple-400/30 hover:border-purple-400/60 px-5 py-2.5 rounded-full">
              👁 {isCs ? 'Podívat se na demo profily' : 'See demo profiles'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROČ COSMATCH ── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          {isCs ? 'Proč Cosmatch?' : 'Why Cosmatch?'}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: '🎯', title: isCs ? 'Záměrné seznamování' : 'Intentional dating', desc: isCs ? 'Cosmatch přináší slow dating — méně swipů, ale každý s hlubším smyslem. 5 swipů denně zdarma.' : 'Cosmatch brings slow dating — fewer swipes, but each with deeper meaning. 5 free swipes per day.' },
            { icon: '🔬', title: isCs ? 'Věda, ne náhoda' : 'Science, not luck', desc: isCs ? '133 000+ párů kompatibility předpočítaných z 2 350 stran personologického výzkumu Garyho Goldschneidera.' : '133,000+ compatibility pairs pre-calculated from 2,350 pages of Gary Goldschneider\'s research.' },
            { icon: '🛡️', title: isCs ? 'Bezpečné prostředí' : 'Safe environment', desc: isCs ? 'Žádné boty, žádné fake profily. Každý účet je svázán s reálným datem narození.' : 'No bots, no fake profiles. Every account is tied to a real birth date.' },
            { icon: '🇨🇿', title: isCs ? 'Česká komunita' : 'Czech community', desc: isCs ? 'Navrženo pro česky mluvící uživatele — CZ/SK priorita, plná lokalizace, platby v CZK přes Paddle.' : 'Designed for Czech-speaking users — CZ/SK priority, full localization, CZK payments via Paddle.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-5 p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-3xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA — hvězdné nebe v pozadí ── */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80&auto=format&fit=crop"
            alt="Hvězdné nebe"
            className="w-full h-full object-cover"
            style={{ opacity: 0.45 }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,0,16,0.5) 0%, rgba(50,0,70,0.35) 50%, rgba(10,0,16,0.85) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isCs ? 'Připravena/a začít?' : 'Ready to start?'}
          </h2>
          <p className="text-white/65 text-lg mb-10">
            {isCs ? 'Registrace je zdarma. Zadej datum narození a objev svůj match.' : 'Registration is free. Enter your birthday and discover your match.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg py-4 px-10 inline-block">
              ✨ {isCs ? 'Začít zdarma' : 'Start for free'}
            </Link>
            <Link href="/demo" className="text-lg py-4 px-8 rounded-2xl font-semibold transition-all border border-white/30 hover:border-white/60 inline-block" style={{ background: 'rgba(255,255,255,0.08)' }}>
              👁 Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="text-center py-10 px-6 border-t border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">🪐</span>
          <span className="font-bold text-white/80">Cosmatch</span>
        </div>
        <p className="text-white/30 text-sm">
          {isCs
            ? '© 2026 Cosmatch · Postaveno na knize The Power of Birthdays, Stars & Numbers'
            : '© 2026 Cosmatch · Built on The Power of Birthdays, Stars & Numbers'}
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-white/30 text-sm">
          <Link href="/login" className="hover:text-white/60 transition-colors">{isCs ? 'Přihlásit se' : 'Login'}</Link>
          <Link href="/register" className="hover:text-white/60 transition-colors">{isCs ? 'Registrace' : 'Register'}</Link>
          <Link href="/demo" className="hover:text-white/60 transition-colors">Demo</Link>
        </div>
      </footer>
    </div>
  )
}
