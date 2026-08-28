import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '../breadcrumbs';
import { GuideFooter, GuideHeader } from '../guide-chrome';
import { siteConfig } from '../site-config';
import { seoTopics, topicPath } from '../seo-topics';

const title = 'Svensk statistik om politik och samhälle';
const description = 'Utforska svensk statistik om brott, migration, arbetslöshet, privatekonomi, pension, äldreomsorg, klimat och miljö.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/statistik' },
  openGraph: { title, description, url: '/statistik', images: ['/og.png'] },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  '@id': `${siteConfig.url}/statistik#catalog`,
  url: `${siteConfig.url}/statistik`,
  name: 'Sverigefacit – svensk statistik',
  description,
  inLanguage: siteConfig.language,
  dateModified: siteConfig.modified,
  dataset: seoTopics.map((topic) => ({
    '@type': 'Dataset',
    '@id': `${siteConfig.url}${topicPath(topic.slug)}#dataset`,
    url: `${siteConfig.url}${topicPath(topic.slug)}`,
    name: topic.heading,
    description: topic.description,
  })),
};

const topicOrder = [
  'brottslighet',
  'invandring-och-brott',
  'migration',
  'arbetsloshet',
  'privatekonomi',
  'pensioner',
  'aldreomsorg',
  'klimat-och-miljo',
];

const orderedTopics = [...seoTopics].sort(
  (left, right) => {
    const leftIndex = topicOrder.indexOf(left.slug);
    const rightIndex = topicOrder.indexOf(right.slug);
    return (leftIndex === -1 ? topicOrder.length : leftIndex)
      - (rightIndex === -1 ? topicOrder.length : rightIndex);
  },
);

const topicCardCopy: Record<string, string> = {
  brottslighet: 'Konstaterade offer för dödligt våld 2002–2025.',
  'invandring-och-brott': '48 brottstyper efter region; alla brott efter 31 födelseländer.',
  migration: 'Registrerade invandringar 2000–2025.',
  arbetsloshet: 'Arbetslöshet 2001–2025 enligt SCB.',
  privatekonomi: 'Köpkraft, matpriser och hushållens räntebörda.',
  pensioner: 'Allmän pension per månad i fasta priser.',
  aldreomsorg: 'Hemtjänst och särskilt boende bland personer 65+.',
  'klimat-och-miljo': 'Utsläpp, elproduktion, kolsänka och skyddad natur.',
};

export default function StatisticsIndexPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <GuideHeader />
      <section className="catalog-hero">
        <Breadcrumbs items={[{ href: '/statistik', label: 'Statistik' }]} />
        <h1>Statistikområden</h1>
        <p>Välj ett ämne för nyckeltal, utveckling, källa och begränsning.</p>
      </section>
      <section className="catalog-spotlight" aria-labelledby="crime-origin-shortcut-heading">
        <div>
          <p className="section-kicker">Brott och migrationsbakgrund</p>
          <h2 id="crime-origin-shortcut-heading">Brottstyp, region eller land?</h2>
          <p>Brå publicerar 48 brottstyper efter födelseregion och alla brott sammantaget för 31 födelseländer.</p>
          <small>Det finns ingen publicerad korsning mellan en enskild brottstyp och exakt födelseland.</small>
        </div>
        <nav aria-label="Genvägar till brottsstatistiken">
          <Link href="/analys/brott-och-migration?vy=region#brott-ursprung">Jämför brottstyper efter region <span aria-hidden="true">→</span></Link>
          <Link href="/analys/brott-och-migration?vy=land#brott-ursprung">Jämför födelseländer – alla brott <span aria-hidden="true">→</span></Link>
        </nav>
      </section>
      <section className="catalog-grid" aria-label="Statistikområden">
        {orderedTopics.map((topic, index) => (
          <Link href={topicPath(topic.slug)} key={topic.slug}>
            <span>{String(index + 1).padStart(2, '0')} · {topic.category}</span>
            <h2>{topic.heading}</h2>
            <p>{topicCardCopy[topic.slug] || topic.description}</p>
            <div><strong>{topic.metrics[0].value}</strong><small>{topic.metrics[0].label} · {topic.metrics[0].period}</small></div>
            <i aria-hidden="true">→</i>
          </Link>
        ))}
      </section>
      <section className="catalog-method-link">
        <div><p className="section-kicker">Läs rätt</p><h2>Samband är inte samma sak som orsak.</h2></div>
        <Link href="/metod">Läs metoden <span aria-hidden="true">→</span></Link>
      </section>
      <GuideFooter />
    </main>
  );
}
