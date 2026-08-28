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

export default function StatisticsIndexPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <GuideHeader />
      <section className="catalog-hero">
        <Breadcrumbs items={[{ href: '/statistik', label: 'Statistik' }]} />
        <h1>Statistik efter område</h1>
        <p>Välj ett ämne för att se mått, period, originalkälla och vad statistiken inte kan avgöra.</p>
      </section>
      <section className="catalog-spotlight" aria-labelledby="crime-origin-shortcut-heading">
        <div>
          <p className="section-kicker">Brott och migrationsbakgrund</p>
          <h2 id="crime-origin-shortcut-heading">Vad går att jämföra?</h2>
          <p>Brå publicerar 48 brottstyper efter födelseregion och alla brott sammantaget för 31 födelseländer.</p>
          <small>Det finns ingen publicerad korsning mellan en enskild brottstyp och exakt födelseland.</small>
        </div>
        <nav aria-label="Genvägar till brottsstatistiken">
          <Link href="/analys/brott-och-migration?vy=region#brott-ursprung">Välj brottstyp × region <span>→</span></Link>
          <Link href="/analys/brott-och-migration?vy=land#brott-ursprung">Välj födelseland <span>→</span></Link>
        </nav>
      </section>
      <section className="catalog-grid" aria-label="Statistikområden">
        {orderedTopics.map((topic, index) => (
          <Link href={topicPath(topic.slug)} key={topic.slug}>
            <span>{String(index + 1).padStart(2, '0')} · {topic.category}</span>
            <h2>{topic.heading}</h2>
            <p>{topic.description}</p>
            <div><strong>{topic.metrics[0].value}</strong><small>{topic.metrics[0].label} · {topic.metrics[0].period}</small></div>
            <i>↗</i>
          </Link>
        ))}
      </section>
      <section className="catalog-method-link">
        <div><p className="section-kicker">Läs rätt</p><h2>Samband är början på en fråga — inte slutet på ett svar.</h2></div>
        <Link href="/metod">Läs hela metoden <span>↗</span></Link>
      </section>
      <GuideFooter />
    </main>
  );
}
