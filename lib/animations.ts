/**
 * Cosmatch microinteractions — lightweight animations bez Framer Motion.
 *
 *   - heartBurst(element)     → pink heart particles explosion
 *   - matchConfetti()          → canvas-confetti přes celou obrazovku
 *   - successPulse(element)    → krátký scale-up + glow
 *
 * Vše respektuje prefers-reduced-motion (a11y).
 */

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/**
 * Heart burst — vystřelí 5-8 pink ❤ particles z pozice elementu.
 * Použít na PhotoLikeButton click.
 */
export function heartBurst(originElement: HTMLElement | null) {
  if (!originElement || prefersReducedMotion()) return
  if (typeof window === 'undefined') return

  const rect = originElement.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const count = 6 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div')
    heart.textContent = '❤'
    heart.style.position = 'fixed'
    heart.style.left = `${cx}px`
    heart.style.top = `${cy}px`
    heart.style.fontSize = `${18 + Math.random() * 16}px`
    heart.style.color = '#ec4899'
    heart.style.pointerEvents = 'none'
    heart.style.zIndex = '9999'
    heart.style.transform = 'translate(-50%, -50%)'
    heart.style.transition = 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 900ms ease-out'

    document.body.appendChild(heart)

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
    const distance = 60 + Math.random() * 60
    const targetX = Math.cos(angle - Math.PI / 2) * distance
    const targetY = Math.sin(angle - Math.PI / 2) * distance - 30 // mírně nahoru

    requestAnimationFrame(() => {
      heart.style.transform = `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 60 - 30}deg)`
      heart.style.opacity = '0'
    })
    setTimeout(() => heart.remove(), 1000)
  }
}

/**
 * Match confetti — canvas-confetti přes celou obrazovku (lazy-load).
 * Použít při nové oboustranné shodě.
 */
export async function matchConfetti() {
  if (prefersReducedMotion() || typeof window === 'undefined') return
  try {
    const mod = await import('canvas-confetti')
    const confetti = mod.default

    // Cosmatch brand barvy
    const colors = ['#ec4899', '#f9a8d4', '#F0EBE3', '#fbbf24']

    // Levá strana
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      ticks: 200,
    })
    // Pravá strana
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      ticks: 200,
    })
    // Střed po 200 ms
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors,
        ticks: 200,
        gravity: 0.6,
      })
    }, 200)
  } catch {
    // graceful degrade
  }
}

/**
 * Success pulse — krátký scale-up s pink glow.
 * Použít na success state (uložení profile, povolení push, atd.)
 */
export function successPulse(element: HTMLElement | null) {
  if (!element || prefersReducedMotion()) return
  element.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease-out'
  element.style.transform = 'scale(1.08)'
  element.style.boxShadow = '0 0 0 8px rgba(236, 72, 153, 0.25)'
  setTimeout(() => {
    element.style.transform = ''
    element.style.boxShadow = ''
  }, 320)
}
