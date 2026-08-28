import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { GuideFooter } from '../guide-chrome';
import { MunicipalityExplorer } from './municipality-explorer';

const title = 'Min kommun – jämför lokala nyckeltal';
const description = 'Välj kommun och jämför befolkning, gymnasiebehörighet, skuldsättning och anmälda våldsbrott med riket.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/kommun' },
  openGraph: { title, description, url: '/kommun', images: ['/og.png'] },
};

export default function MunicipalityPage() {
  return (
    <main className="guide-page municipality-page" id="page-content" tabIndex={-1}>
      <header className="municipality-hero">
        <Breadcrumbs items={[{ href: '/kommun', label: 'Min kommun' }]} />
        <p className="section-kicker">Lokala resultat · officiella källor</p>
        <h1>Hur ser det ut i din kommun?</h1>
        <p>Välj kommun och få resultatet direkt. Jämförelsen visar skillnader – inte automatiskt kommunens kvalitet eller orsaken bakom utfallet.</p>
      </header>
      <MunicipalityExplorer />
      <section className="municipality-source-note">
        <div><p className="section-kicker">Datakälla</p><h2>Kolada samlar kommunernas jämförbara nyckeltal</h2></div>
        <p>Uppgifterna hämtas från Koladas API version 3 och bygger här på SCB, Skolverket, Kronofogden och Brå. Kolada kan revidera värden utan särskild avisering, så källa, period och begränsning visas för varje mått.</p>
        <a href="https://www.kolada.se/om-oss/api/" target="_blank" rel="noreferrer">Läs om Koladas API ↗</a>
      </section>
      <GuideFooter />
    </main>
  );
}
