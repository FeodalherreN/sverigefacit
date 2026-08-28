import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { GuideFooter, GuideHeader } from '../guide-chrome';

export const metadata: Metadata = {
  title: 'Integritet och anonym besöksstatistik',
  description: 'Så använder Sverigefacit Vercel Web Analytics och webbläsarens delningsfunktion.',
  alternates: { canonical: '/integritet' },
};

export default function PrivacyPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <article className="privacy-page">
        <Breadcrumbs items={[{ href: '/integritet', label: 'Integritet' }]} />
        <p className="section-kicker">Transparens</p>
        <h1>Integritet och besöksstatistik</h1>
        <p>Sverigefacit använder ingen Google Analytics-tagg och sätter inga egna statistikcookies.</p>
        <section><h2>Vercel Web Analytics</h2><p>Vi använder Vercel Web Analytics för anonym, sammanställd statistik om exempelvis besökta sidor, hänvisande webbplats, land, enhet och webbläsare. Tjänsten använder inte tredjepartscookies och ska inte identifiera en person eller följa samma besökare mellan olika webbplatser eller dagar.</p><p><a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Läs Vercels beskrivning av datainsamlingen ↗</a></p></section>
        <section><h2>Delning</h2><p>När du trycker på Dela används telefonens eller webbläsarens delningsfunktion. Sverigefacit får inte veta vilken person eller app du delar länken med.</p></section>
      </article>
      <GuideFooter />
    </main>
  );
}
