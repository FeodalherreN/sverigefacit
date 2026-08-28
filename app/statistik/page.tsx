import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '../breadcrumbs';
import { GuideFooter } from '../guide-chrome';
import { FactCard } from '../fakta/fact-card';
import { factBySlug } from '../fakta/facts';
import { siteConfig } from '../site-config';
import { seoTopics, topicPath } from '../seo-topics';

const title = 'Ämnen – svensk statistik om politik och samhälle';
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
  'arbetsloshet',
  'privatekonomi',
  'brottslighet',
  'invandring-och-brott',
  'migration',
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

const quickFacts = [
  'vardgarantin-2026',
  'gymnasiebehorighet-2025',
  'skjutningar-2026',
  'hushallens-ekonomi-2024',
].map((slug) => factBySlug[slug]);

export default function StatisticsIndexPage() {
  return (
    <main className="guide-page" id="page-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <section className="catalog-hero">
        <Breadcrumbs items={[{ href: '/statistik', label: 'Ämnen' }]} />
        <h1>Vad vill du veta?</h1>
        <p>Välj ett ämne. Varje sida börjar med ett kort svar och fortsätter med utveckling, jämförelse och originalkällor.</p>
      </section>
      <nav className="catalog-question-shortcuts" aria-label="Vanliga frågor">
        <Link href="/fakta/vardgarantin-2026"><span>Vård</span><strong>Hur många får vård i tid?</strong><i aria-hidden="true">→</i></Link>
        <Link href="/analys/brott-och-migration#brott-ursprung"><span>Brott</span><strong>Brottstyp och födelseland?</strong><i aria-hidden="true">→</i></Link>
        <Link href="/statistik/privatekonomi"><span>Plånbok</span><strong>Har hushållen fått det bättre?</strong><i aria-hidden="true">→</i></Link>
        <Link href="/kommun"><span>Lokalt</span><strong>Hur ser det ut i min kommun?</strong><i aria-hidden="true">→</i></Link>
      </nav>
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
      <section className="catalog-spotlight" aria-labelledby="crime-origin-shortcut-heading">
        <div>
          <p className="section-kicker">Avgränsad Brå-studie · 2015–2018</p>
          <h2 id="crime-origin-shortcut-heading">Brottstyp, region eller land?</h2>
          <p>Brå redovisar brottstyper efter bred födelseregion och alla brott sammantaget efter födelseland.</p>
          <small>Det finns ingen aktuell löpande serie som korsar en enskild brottstyp med exakt födelseland.</small>
        </div>
        <nav aria-label="Genvägar till brottsstatistiken">
          <Link href="/analys/brott-och-migration?vy=region#brott-ursprung">Brottstyper efter region <span aria-hidden="true">→</span></Link>
          <Link href="/analys/brott-och-migration?vy=land#brott-ursprung">Födelseländer – alla brott <span aria-hidden="true">→</span></Link>
        </nav>
      </section>
      <section className="catalog-quick-facts" aria-labelledby="quick-facts-heading">
        <div className="section-heading"><div><p className="section-kicker">Resultatet direkt</p><h2 id="quick-facts-heading">Vanliga frågor just nu</h2></div><Link href="/fakta">Alla korta svar →</Link></div>
        <div className="facts-grid">{quickFacts.map((fact) => <FactCard fact={fact} compact key={fact.slug} />)}</div>
      </section>
      <section className="catalog-method-link">
        <div><p className="section-kicker">Läs rätt</p><h2>Samband är inte samma sak som orsak.</h2></div>
        <Link href="/metod">Läs metoden <span aria-hidden="true">→</span></Link>
      </section>
      <GuideFooter />
    </main>
  );
}
