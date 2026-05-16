import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cosmatch — Kompatibilita podle data narození',
  description: 'Česká datovací app postavená na numerologii a kompatibilitě dat narození. Najdi svou skutečnou shodu — věda, ne náhoda.',
  keywords: 'numerologie, kompatibilita, datum narození, numerologický profil, datování, seznamka',
  openGraph: {
    title: 'Cosmatch — Kompatibilita podle data narození',
    description: 'Najdi svou skutečnou shodu díky numerologii a datům narození.',
    type: 'website',
    siteName: 'Cosmatch',
    locale: 'cs_CZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmatch — Kompatibilita podle data narození',
    description: 'Najdi svou skutečnou shodu díky numerologii a datům narození.',
  },
  manifest: '/manifest.json',
  themeColor: '#ec4899',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cosmatch',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cosmatch" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
