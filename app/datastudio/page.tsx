import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { DataStudio } from '../evidence-lab';
import { GuideFooter } from '../guide-chrome';
import { InternationalReferenceStudio } from '../international-reference-studio';

const title = 'Datastudion – jämför svensk statistik';
const description = 'Bygg och dela diagram av 33 svenska tidsserier eller jämför Sverige med Norden och EU genom harmoniserad statistik från Eurostat.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/datastudio' },
  openGraph: { title, description, url: '/datastudio', images: ['/og.png'] },
};

export default function DataStudioPage() {
  return (
    <main className="guide-page tool-route" id="page-content" tabIndex={-1}>
      <div className="tool-route-breadcrumbs">
        <Breadcrumbs items={[{ href: '/datastudio', label: 'Jämför data' }]} />
      </div>
      <DataStudio />
      <InternationalReferenceStudio />
      <GuideFooter />
    </main>
  );
}
