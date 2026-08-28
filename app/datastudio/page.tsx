import type { Metadata } from 'next';
import { DataStudio } from '../evidence-lab';
import { GuideFooter, GuideHeader } from '../guide-chrome';

const title = 'Datastudion – jämför svensk statistik';
const description = 'Bygg och dela diagram av 33 svenska tidsserier om ekonomi, migration, brott, trygghet, hälsa, välfärd, energi, klimat och miljö.';

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
      <DataStudio />
      <GuideFooter />
    </main>
  );
}
