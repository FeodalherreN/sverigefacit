import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { FollowSverigefacit } from '../follow-sverigefacit';
import { GuideFooter, GuideHeader } from '../guide-chrome';
import { FactsBrowser } from './facts-browser';

const title = 'Fakta inför valet 2026';
const description = 'Korta, källbelagda svar om vård, skola, brott, migration, ekonomi, pension och äldreomsorg.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/fakta' },
  openGraph: { title, description, url: '/fakta', images: ['/og.png'] },
};

export default function FactsIndexPage() {
  return (
    <main className="guide-page facts-index" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <header className="facts-index-hero">
        <Breadcrumbs items={[{ href: '/fakta', label: 'Fakta' }]} />
        <h1>Korta svar med källor</h1>
        <p>Öppna en fråga för att se utfallet, originalkällan och vad statistiken inte kan avgöra.</p>
      </header>
      <FactsBrowser />
      <FollowSverigefacit context="fakta" />
      <GuideFooter />
    </main>
  );
}
