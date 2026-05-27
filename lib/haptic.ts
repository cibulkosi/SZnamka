/**
 * Haptic feedback utility — funguje jak v PWA (Vibration API) tak v Capacitor native (iOS/Android).
 *
 * Vzory (podle Apple HIG + Material Design 3):
 *  - light:   toggle, switch tabu, otevření profilu, dropdown open (10 ms)
 *  - medium:  lajk fotky, prompt response, voucher submit (15 ms)
 *  - heavy:   send message, important confirm (20–30–20 ms)
 *  - success: nová shoda, premium aktivace, registrace dokončena (3× pulse)
 *  - error:   validation fail, neúspěšný login, špatný voucher (2× silnější pulse)
 *
 * Použití:
 *  import { haptic } from '@/lib/haptic'
 *  onClick={() => { haptic.medium(); handleLike() }}
 *
 * Respektuje prefers-reduced-motion (a11y) — když uživatel chce méně animací,
 * vypneme i haptics. To je doporučená praxe (haptics jsou „motion" v širším smyslu).
 */

type Mode = 'light' | 'medium' | 'heavy' | 'success' | 'error'

// Capacitor types — dynamicky importujeme, aby SSR build nepadl
type ImpactStyle = 'LIGHT' | 'MEDIUM' | 'HEAVY'
type NotificationType = 'SUCCESS' | 'WARNING' | 'ERROR'

// Lazy-load Capacitor Haptics — funguje jen v native (PWA dostane fallback)
let capacitorHaptics: any = null
let capacitorAvailable: boolean | null = null

async function getCapacitorHaptics() {
  if (capacitorAvailable === false) return null
  if (capacitorHaptics) return capacitorHaptics
  try {
    // Capacitor injects window.Capacitor.isNativePlatform()
    if (typeof window === 'undefined') return null
    const cap = (window as any).Capacitor
    if (!cap?.isNativePlatform?.()) {
      capacitorAvailable = false
      return null
    }
    const mod = await import('@capacitor/haptics')
    capacitorHaptics = mod
    capacitorAvailable = true
    return mod
  } catch {
    capacitorAvailable = false
    return null
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator === 'undefined') return
  if (!('vibrate' in navigator)) return
  try { navigator.vibrate(pattern) } catch { /* silent */ }
}

async function trigger(mode: Mode) {
  if (prefersReducedMotion()) return

  const cap = await getCapacitorHaptics()
  if (cap) {
    try {
      if (mode === 'light')   return cap.Haptics.impact({ style: cap.ImpactStyle.Light })
      if (mode === 'medium')  return cap.Haptics.impact({ style: cap.ImpactStyle.Medium })
      if (mode === 'heavy')   return cap.Haptics.impact({ style: cap.ImpactStyle.Heavy })
      if (mode === 'success') return cap.Haptics.notification({ type: cap.NotificationType.Success })
      if (mode === 'error')   return cap.Haptics.notification({ type: cap.NotificationType.Error })
    } catch { /* fall through to web fallback */ }
  }

  // Web fallback — Vibration API (Android Chrome supports; iOS Safari does NOT
  // — iOS user pocítí haptics jen v native Capacitor buildu)
  switch (mode) {
    case 'light':   return vibrate(10)
    case 'medium':  return vibrate(15)
    case 'heavy':   return vibrate([20, 30, 20])
    case 'success': return vibrate([10, 40, 10, 40, 10])
    case 'error':   return vibrate([50, 30, 50])
  }
}

export const haptic = {
  light:   () => trigger('light'),
  medium:  () => trigger('medium'),
  heavy:   () => trigger('heavy'),
  success: () => trigger('success'),
  error:   () => trigger('error'),
}
