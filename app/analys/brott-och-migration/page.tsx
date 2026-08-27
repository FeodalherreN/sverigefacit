import type { Metadata } from 'next';
import Link from 'next/link';
import { CrimeMigrationEvidence } from '../../evidence-lab';
import { GuideFooter, GuideHeader } from '../../guide-chrome';

const title = 'Brott och migrationsbakgrund – fördjupad analys';
const description = 'Brås historiska registerstudie med observerade andelar, överrisker, standardisering och tydliga metodbegränsningar.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/analys/brott-och-migration' },
  openGraph: { title, description, url: '/analys/brott-och-migration', images: ['/og.png'] },
};

export default function CrimeMigrationPage() {
  return (
    <main className="guide-page tool-route" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <header className="tool-route-hero">
        <p className="section-kicker">Känsligt samband · historisk kohort</p>
        <h1>Brott och migrationsbakgrund.</h1>
        <p>Landvyn redovisar bara de råa och standardiserade andelar samt överrisker som Brå publicerar i tabell B10 och B11. Inget av måtten räknas fram av Sverigefacit.</p>
        <Link href="/fakta/migration-och-brott">Öppna det korta facitkortet <span>↗</span></Link>
      </header>
      <CrimeMigrationEvidence />
      <GuideFooter />
    </main>
  );
}
