import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cosmatch — The universe knows your match',
  description: 'Dating app based on personology and birthday compatibility.',
  openGraph: { title: 'Cosmatch', description: 'The universe knows your match', type: 'website' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
