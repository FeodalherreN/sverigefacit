import type { Metadata } from 'next';
import { Breadcrumbs } from '../../breadcrumbs';
import { CrimeMigrationLevels } from '../../crime-migration-levels';
import { CrimeMigrationEvidence } from '../../evidence-lab';
import { GuideFooter } from '../../guide-chrome';

const title = 'Brott och migrationsbakgrund – Brås statistik';
const description = 'Utforska 48 brottstyper efter födelseregion samt alla brott efter födelseland, med observerade nivåer, justerade överrisker och tydliga metodbegränsningar.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/analys/brott-och-migration' },
  openGraph: { title, description, url: '/analys/brott-och-migration', images: ['/og.png'] },
};

export default function CrimeMigrationPage() {
  return (
    <main className="guide-page tool-route" id="page-content" tabIndex={-1}>
      <header className="tool-route-hero">
        <Breadcrumbs items={[
          { href: '/statistik', label: 'Ämnen' },
          { href: '/statistik/invandring-och-brott', label: 'Brott och migrationsbakgrund' },
          { href: '/analys/brott-och-migration', label: 'Utforska data' },
        ]} />
        <p className="section-kicker">Interaktiv analys · Brås historiska registerstudie</p>
        <h1>Brott och migrationsbakgrund</h1>
        <p>Välj bland 48 brottstyper och jämför födelseregioner, eller välj ett av 31 födelseländer för alla brott sammantaget. Brå publicerar inte enskild brottstyp korsad med exakt födelseland.</p>
        <CrimeMigrationLevels current="explore" />
      </header>
      <CrimeMigrationEvidence />
      <GuideFooter />
    </main>
  );
}
