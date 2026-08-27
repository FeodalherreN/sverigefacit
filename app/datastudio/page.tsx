import type { Metadata } from 'next';
import { DataStudio } from '../evidence-lab';
import { GuideFooter, GuideHeader } from '../guide-chrome';

const title = 'Datastudion – jämför svensk statistik';
const description = 'Jämför svenska tidsserier, årsvisa förändringar och tidsförskjutningar. Samvariation visas utan att kallas kausal effekt.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/datastudio' },
  openGraph: { title, description, url: '/datastudio', images: ['/og.png'] },
};

export default function DataStudioPage() {
  return (
    <main className="guide-page tool-route" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <header className="tool-route-hero">
        <p className="section-kicker">Eget urval · explorativ analys</p>
        <h1>Jämför data.<br />Behåll tvivlet.</h1>
        <p>Årsdifferens är förvalt för att minska risken att två gemensamma trender ser ut som ett meningsfullt samband.</p>
      </header>
      <DataStudio />
      <GuideFooter />
    </main>
  );
}
