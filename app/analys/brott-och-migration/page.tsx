import type { Metadata } from 'next';
import Link from 'next/link';
import { CrimeMigrationEvidence } from '../../evidence-lab';
import { GuideFooter, GuideHeader } from '../../guide-chrome';

const title = 'Brott, födelseregion och bakgrund – Brås statistik';
const description = 'Utforska 48 brottstyper efter födelseregion samt alla brott efter födelseland, med observerade nivåer, justerade överrisker och tydliga metodbegränsningar.';

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
        <h1>Brott och bakgrund.</h1>
        <p>Välj bland 48 brottstyper och jämför Brås publicerade nivåer och överrisker efter födelseregion. Exakta födelseländer visas separat och endast för alla brott sammantaget.</p>
        <nav className="analysis-levels" aria-label="Fördjupningsnivå">
          <Link href="/fakta/migration-och-brott">01 · Kort svar</Link>
          <Link href="/statistik/invandring-och-brott">02 · Ämnesöversikt</Link>
          <span aria-current="page">03 · Interaktiv analys</span>
        </nav>
      </header>
      <CrimeMigrationEvidence />
      <GuideFooter />
    </main>
  );
}
