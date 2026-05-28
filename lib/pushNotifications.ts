/**
 * Push notifications helper — Capacitor + FCM
 *
 * Smart permission prompt strategy:
 *   - NEpovolovat při prvním otevření (Apple HIG + Google research říká, že
 *     to vede k 30% acceptance)
 *   - Povolit AŽ POTÉ, co user dostane první lajk nebo match — pak 75% acceptance
 *
 * Pro PWA: Web Push API (volitelné, později)
 * Pro Capacitor native: FCM přes @capacitor/push-notifications
 */

import { supabase } from './supabase'

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable'

async function getCapacitorPlugin() {
  if (typeof window === 'undefined') return null
  const cap = (window as any).Capacitor
  if (!cap?.isNativePlatform?.()) return null
  try {
    const mod = await import('@capacitor/push-notifications')
    return mod.PushNotifications
  } catch {
    return null
  }
}

/**
 * Zjistí, zda už user povolil notifikace.
 */
export async function getPushPermissionState(): Promise<PermissionState> {
  const plugin = await getCapacitorPlugin()
  if (!plugin) return 'unavailable'
  try {
    const { receive } = await plugin.checkPermissions()
    return receive as PermissionState
  } catch {
    return 'unavailable'
  }
}

/**
 * Požádá uživatele o oprávnění a registruje device token.
 * Volat AŽ po smart trigger (po prvním lajku/matchi).
 */
export async function requestPushPermission(): Promise<boolean> {
  const plugin = await getCapacitorPlugin()
  if (!plugin) return false

  try {
    const result = await plugin.requestPermissions()
    if (result.receive !== 'granted') return false

    await plugin.register()

    // Listener pro registration token
    plugin.addListener('registration', async (token: { value: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const platform = (window as any).Capacitor?.getPlatform?.() || 'web'
      await supabase.from('device_tokens').upsert({
        user_id: user.id,
        token: token.value,
        platform,
        updated_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
      }, { onConflict: 'token' })
    })

    plugin.addListener('registrationError', (err: { error: string }) => {
      console.warn('Push registration error:', err.error)
    })

    plugin.addListener('pushNotificationReceived', (notif: { data?: { url?: string } }) => {
      console.log('Push received in foreground:', notif)
    })

    plugin.addListener('pushNotificationActionPerformed', (action: { notification: { data: { url?: string } } }) => {
      const url = action.notification.data?.url
      if (url && typeof window !== 'undefined') {
        window.location.href = url
      }
    })

    return true
  } catch (e) {
    console.error('Push permission request failed:', e)
    return false
  }
}

/**
 * Smart prompt strategy — voláme z různých míst v UI při „aha moments":
 *   - První lajk (od koho komu)
 *   - První match
 *   - Po doplnění profilu (alespoň 80%)
 * Idempotentní: pokud user už buď povolil nebo zamítl, neukáže prompt znova.
 */
export async function maybePromptPushPermission(trigger: 'first_like' | 'first_match' | 'profile_complete'): Promise<void> {
  const state = await getPushPermissionState()
  if (state !== 'prompt') return // už granted nebo denied — nezobrazovat znova

  // Trochu zpoždění, ať to není rušivé hned po akci
  setTimeout(async () => {
    if (typeof window === 'undefined') return
    const wantsToEnable = window.confirm(
      trigger === 'first_match'
        ? 'Máš první shodu! Chceš dostávat upozornění, když ti přijde nová zpráva?'
        : trigger === 'first_like'
        ? 'Někdo Tě právě lajknul. Chceš dostávat upozornění?'
        : 'Tvůj profil je hotový. Chceš dostávat upozornění o nových shodách?'
    )
    if (wantsToEnable) {
      await requestPushPermission()
    }
  }, 800)
}
