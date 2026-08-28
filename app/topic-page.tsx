import Link from 'next/link';
import { Breadcrumbs } from './breadcrumbs';
import { CrimeMigrationLevels } from './crime-migration-levels';
import { DataFreshness, getTopicFreshness } from './data-freshness';
import { GuideFooter } from './guide-chrome';
import { InternationalReference } from './international-reference';
import { topicBenchmarkIds } from './international-reference-data';
import { siteConfig } from './site-config';
import { SectionNavigation } from './section-navigation';
import { topicBySlug, topicPath, type SeoTopic } from './seo-topics';
import { TopicTrend } from './topic-trend';

const topicComparisons: Partial<Record<string, [string, string]>> = {
  brottslighet: ['deadlyViolence', 'insecurity'],
  migration: ['immigration', 'emigration'],
  arbetsloshet: ['unemployment', 'gdpPerCapita'],
  privatekonomi: ['economicStandard', 'foodPrices'],
  pensioner: ['realPension', 'economicStandard'],
  aldreomsorg: ['homeCare', 'specialHousing'],
};

export function TopicPage({ topic }: { topic: SeoTopic }) {
  const canonicalUrl = `${siteConfig.url}${topicPath(topic.slug)}`;
  const benchmarkIds = topicBenchmarkIds[topic.slug];
  const freshness = getTopicFreshness(topic.slug);
  const comparison = topicComparisons[topic.slug];
  const primaryAction = topic.slug === 'invandring-och-brott'
    ? { href: '/analys/brott-och-migration#brott-ursprung', label: 'Välj brottstyp eller födelseland' }
    : {
        href: comparison
          ? `/datastudio?seriesA=${comparison[0]}&seriesB=${comparison[1]}&view=timeline#datastudio`
          : '/datastudio',
        label: 'Jämför med ett annat mått',
      };
  const relatedAction = topic.slug === 'brottslighet'
    ? { href: '/statistik/invandring-och-brott', label: 'Brott och migrationsbakgrund' }
    : null;
  const organizations = Array.from(new Map(
    topic.sources.map((source) => [source.organization, source]),
  ).values());
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: topic.seoTitle,
        description: topic.description,
        inLanguage: siteConfig.language,
        dateModified: siteConfig.modified,
        isPartOf: { '@id': `${siteConfig.url}/#website` },
        breadcrumb: { '@id': `${canonicalUrl}#breadcrumbs` },
        mainEntity: { '@id': `${canonicalUrl}#dataset` },
      },
      {
        '@type': 'Dataset',
        '@id': `${canonicalUrl}#dataset`,
        url: canonicalUrl,
        name: topic.heading,
        description: topic.description,
        inLanguage: siteConfig.language,
        isAccessibleForFree: true,
        dateModified: siteConfig.modified,
        temporalCoverage: topic.temporalCoverage,
        spatialCoverage: { '@type': 'Country', name: 'Sverige' },
        variableMeasured: topic.variableMeasured.map((name) => ({
          '@type': 'PropertyValue',
          name,
        })),
        creator: organizations.map((source) => ({
          '@type': 'Organization',
          name: source.organization,
          url: new URL(source.url).origin,
        })),
        isBasedOn: topic.sources.map((source) => source.url),
        includedInDataCatalog: {
          '@type': 'DataCatalog',
          '@id': `${siteConfig.url}/statistik#catalog`,
          name: 'Sverigefacit – svensk statistik',
          url: `${siteConfig.url}/statistik`,
        },
      },
    ],
  };

  return (
    <main className="guide-page" id="page-content" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article>
        <header className="topic-page-hero" id="kort-svar">
          <Breadcrumbs items={[
            { href: '/statistik', label: 'Ämnen' },
            { href: topicPath(topic.slug), label: topic.heading },
          ]} />
          <div className="topic-page-hero-grid">
            <div className="topic-hero-title"><h1>{topic.heading}</h1></div>
            <section className="topic-metrics" aria-label="Nyckeltal">
              {topic.metrics.map((metric) => (
                <div key={metric.value + metric.label}>
                  <span>{metric.period}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.label}</p>
                </div>
              ))}
            </section>
            <div className="topic-hero-detail">
              <p>{topic.lead}</p>
              <DataFreshness period={topic.temporalCoverage.replace('/', '–')} checkedAt={siteConfig.sourceChecked} status={freshness.status} dataType={freshness.dataType} />
              <div className="topic-page-actions">
                <Link href={primaryAction.href}>{primaryAction.label} <span aria-hidden="true">→</span></Link>
                {relatedAction && <Link href={relatedAction.href}>{relatedAction.label}</Link>}
                <Link href="/metod">Så tolkar vi statistiken</Link>
              </div>
              {topic.slug === 'invandring-och-brott' && <CrimeMigrationLevels current="overview" />}
            </div>
          </div>
        </header>

        <SectionNavigation
          label={`På sidan om ${topic.heading}`}
          className="topic-section-navigation"
          items={[
            { href: `${topicPath(topic.slug)}#kort-svar`, label: 'Kort svar', current: true },
            { href: `${topicPath(topic.slug)}#utveckling`, label: 'Utveckling' },
            benchmarkIds
              ? { href: `${topicPath(topic.slug)}#jamfor`, label: 'Jämför' }
              : { href: primaryAction.href, label: 'Jämför' },
            { href: `${topicPath(topic.slug)}#kallor`, label: 'Källor' },
          ]}
        />

        <div id="utveckling" className="topic-anchor-section"><TopicTrend slug={topic.slug} /></div>

        {benchmarkIds && (
          <div id="jamfor" className="topic-anchor-section"><InternationalReference benchmarkIds={benchmarkIds} /></div>
        )}

        <div className="topic-page-layout">
          <div className="topic-main-copy">
            <section aria-labelledby="reading-heading">
              <h2 id="reading-heading">Kort slutsats</h2>
              <div className="topic-logic-grid">
                <article>
                  <span>Utfall</span>
                  <h3>Vad visar statistiken?</h3>
                  <p>{topic.observed}</p>
                </article>
                <article>
                  <span>Politik</span>
                  <h3>Vad kan politiken påverka?</h3>
                  <p>{topic.policy}</p>
                </article>
                <article>
                  <span>Begränsning</span>
                  <h3>Vad avgör serien inte?</h3>
                  <p>{topic.limitation}</p>
                </article>
              </div>
            </section>

            <section className="topic-definition" aria-labelledby="definition-heading">
              <h2 id="definition-heading">Vad mäts?</h2>
              <p>{topic.definition}</p>
            </section>

            <section className="topic-source-section" id="kallor" aria-labelledby="sources-heading">
              <h2 id="sources-heading">Originalkällor</h2>
              <div>
                {topic.sources.map((source, index) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{source.name}</strong><small>{source.organization}</small></div>
                    <i aria-hidden="true">↗</i>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside className="topic-fact-panel">
            <span>Om måttet</span>
            <dl>
              <div><dt>Geografi</dt><dd>Sverige</dd></div>
              <div><dt>Tidsperiod</dt><dd>{topic.temporalCoverage.replace('/', '–')}</dd></div>
              <div><dt>Senast granskat</dt><dd>{siteConfig.sourceChecked}</dd></div>
              <div><dt>Datatyp</dt><dd>{freshness.dataType}</dd></div>
              <div><dt>Status</dt><dd>{freshness.status === 'historical' ? 'Historisk studie' : freshness.status === 'preliminary' ? 'Preliminär' : 'Slutlig'}</dd></div>
              <div><dt>Bearbetning</dt><dd>Ingen prognos</dd></div>
              <div><dt>Originalkällor</dt><dd>{topic.sources.length}</dd></div>
            </dl>
            <p>Definitioner och revisioner följer originalkällan.</p>
            <Link href="/kallor">Alla källor <span aria-hidden="true">→</span></Link>
          </aside>
        </div>

        <section className="related-topics" aria-labelledby="related-heading">
          <div>
            <h2 id="related-heading">Relaterade ämnen</h2>
          </div>
          <nav aria-label="Relaterade statistikområden">
            {topic.related.map((slug) => {
              const related = topicBySlug[slug];
              return related ? (
                <Link href={topicPath(slug)} key={slug}>
                  <span>{related.category}</span>
                  <strong>{related.heading}</strong>
                  <i aria-hidden="true">→</i>
                </Link>
              ) : null;
            })}
          </nav>
        </section>
      </article>

      <GuideFooter />
    </main>
  );
}
