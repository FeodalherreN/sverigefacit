import type { Metadata } from 'next';
import { FollowSverigefacit } from '../follow-sverigefacit';
import { GuideFooter, GuideHeader } from '../guide-chrome';
import { FactCard } from './fact-card';
import { facts } from './facts';

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
        <p className="section-kicker">Valet 2026 · verifierbara svar</p>
        <h1>En fråga.<br />Ett tydligt facit.</h1>
        <p>Varje kort skiljer på vad som hände, vad politiken kan ha påverkat och vad statistiken inte kan bevisa.</p>
      </header>
      <section className="facts-grid" aria-label="Faktakort">
        {facts.map((fact) => <FactCard fact={fact} key={fact.slug} />)}
      </section>
      <FollowSverigefacit context="fakta" />
      <GuideFooter />
    </main>
  );
}
