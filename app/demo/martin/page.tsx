import type { Metadata } from 'next'
import DemoProfileDetail from '@/components/DemoProfileDetail'
import { getDemoProfileById } from '@/lib/demoProfiles'

const PROFILE_ID = 'martin'
const profile = getDemoProfileById(PROFILE_ID)!

export const metadata: Metadata = {
  title: `${profile.name}, ${profile.age} — Demo profil Cosmatch`,
  description: `Ukázka kompatibility podle data narození. ${profile.name}, ${profile.matchCategory}, ${profile.score} % shoda. Demo profil — reálné profily v Cosmatch nikdy nebudou vymyšlené.`,
  robots: { index: false, follow: true },
}

export default function MartinDemoPage() {
  return <DemoProfileDetail profile={profile} />
}
