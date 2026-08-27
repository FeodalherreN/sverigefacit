import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './evidence-lab.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Sverigefacit — data bakom politiken',
    template: '%s · Sverigefacit',
  },
  description:
    'Offentlig svensk statistik, politisk kontext och tydliga evidensnivåer — utan att blanda ihop samvariation med bevisad orsak.',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    title: 'Sverigefacit — data bakom politiken',
    description:
      'Se vad som hände, vad som rimligen kan kopplas till politiken och vad som inte går att bevisa kausalt.',
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
    title: 'Sverigefacit — data bakom politiken',
    description: 'Offentlig data. Politisk kontext. Tydliga evidensnivåer.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
