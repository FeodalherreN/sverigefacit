import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideFooter, GuideHeader } from '../guide-chrome';
import { siteConfig } from '../site-config';
import { seoTopics, topicPath } from '../seo-topics';

const title = 'Svensk statistik om politik och samhälle';
const description = 'Utforska officiell svensk statistik om brott, migration, arbetslöshet, privatekonomi, pension och äldreomsorg.';

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

export default function StatisticsIndexPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <GuideHeader />
      <section className="catalog-hero">
        <p className="section-kicker">Datakatalog</p>
        <h1>Sverige i siffror,<br />område för område.</h1>
        <p>Varje ämnessida har ett definierat mått, senaste verifierade utfall, originalkälla och en tydlig gräns för vad statistiken kan bevisa.</p>
      </section>
      <section className="catalog-grid" aria-label="Statistikområden">
        {seoTopics.map((topic, index) => (
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
