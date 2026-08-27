import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AnalyticsConsent } from './analytics-consent';
import { MobileBottomNav } from './mobile-bottom-nav';
import { siteConfig } from './site-config';
import './globals.css';
import './evidence-lab.css';
import './seo-pages.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'svensk statistik',
    'brottslighet statistik',
    'migration Sverige',
    'arbetslöshet Sverige',
    'pension statistik',
    'äldreomsorg statistik',
    'privatekonomi Sverige',
    'politiska vallöften',
    'regeringar Sverige',
    'SCB statistik',
    'Brå statistik',
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Samhälle och politik',
  alternates: {
    canonical: '/',
    languages: { 'sv-SE': '/' },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: 'Sverigefacit – Sverige i siffror',
    description: siteConfig.description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Sverigefacit — Offentlig data. Politisk kontext.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sverigefacit – Sverige i siffror',
    description: siteConfig.description,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4f2eb',
  colorScheme: 'light',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  url: `${siteConfig.url}/`,
  name: siteConfig.name,
  alternateName: 'Sverigefacit – data bakom politiken',
  description: siteConfig.description,
  inLanguage: siteConfig.language,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        <link rel="alternate" type="application/rss+xml" title="Sverigefacit – nya facit" href={`${siteConfig.url}/feed.xml`} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        {children}
        <MobileBottomNav />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
