'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isDisposableEmail } from '@/lib/disposableEmails'

export default function AuthCallbackPage() {
 const router = useRouter()

 useEffect(() => {
 // Supabase v2 PKCE: onAuthStateChange fires after code exchange completes
 const { data: { subscription } } = supabase.auth.onAuthStateChange(
 async (event, session) => {
 if (event === 'SIGNED_IN' && session?.user) {
 const user = session.user
 const email = user.email || ''

 // Blokuj disposable emaily (boti z temp-mail služeb)
 if (email && isDisposableEmail(email)) {
   await supabase.auth.signOut()
   router.push('/login?error=disposable_email')
   return
 }
 const name = user.user_metadata?.full_name || user.user_metadata?.name || ''

 // Zkontroluj jestli profil v DB existuje
 const { data: profile } = await supabase
 .from('profiles')
 .select('*')
 .eq('email', email)
 .single()

 subscription.unsubscribe()

 if (profile) {
 // Existující uživatel
 localStorage.setItem('cosmatch_user', JSON.stringify(profile))
 router.push('/discover')
 } else {
 // Nový uživatel — předvyplnit registraci
 localStorage.setItem('cosmatch_oauth', JSON.stringify({ name, email }))
 router.push('/register')
 }
 } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
 // ignorovat
 }
 }
 )

 // Fallback: pokud onAuthStateChange nevyprší (timeout 5s), zkus getSession
 const timeout = setTimeout(async () => {
 const { data: { session } } = await supabase.auth.getSession()
 if (session?.user) {
 const email = session.user.email || ''
 const { data: profile } = await supabase
 .from('profiles').select('*').eq('email', email).single()

 subscription.unsubscribe()
 if (profile) {
 localStorage.setItem('cosmatch_user', JSON.stringify(profile))
 router.push('/discover')
 } else {
 const name = session.user.user_metadata?.full_name || ''
 localStorage.setItem('cosmatch_oauth', JSON.stringify({ name, email }))
 router.push('/register')
 }
 } else {
 subscription.unsubscribe()
 router.push('/login?error=oauth')
 }
 }, 5000)

 return () => {
 clearTimeout(timeout)
 subscription.unsubscribe()
 }
 }, [router])

 return (
 <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center"> <div className="text-center"> <div className="text-5xl mb-4 animate-spin" style={{ display: 'inline-block' }}></div> <p className="text-gray-500 text-sm mt-4">Přihlašujeme tě...</p> </div> </div> )
}
