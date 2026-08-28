import Link from 'next/link';
import { GuideFooter, GuideHeader } from './guide-chrome';
import { siteConfig } from './site-config';
import { topicBySlug, topicPath, type SeoTopic } from './seo-topics';

export function TopicPage({ topic }: { topic: SeoTopic }) {
  const canonicalUrl = `${siteConfig.url}${topicPath(topic.slug)}`;
  const primaryAction = topic.slug === 'invandring-och-brott'
    ? { href: '/analys/brott-och-migration', label: 'Öppna den interaktiva brottsanalysen' }
    : { href: '/datastudio', label: 'Jämför serien i Datastudion' };
  const organizations = Array.from(new Map(
    topic.sources.map((source) => [source.organization, source]),
  ).values());
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Sverigefacit', item: `${siteConfig.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Statistik', item: `${siteConfig.url}/statistik` },
          { '@type': 'ListItem', position: 3, name: topic.heading, item: canonicalUrl },
        ],
      },
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
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <GuideHeader />

      <article>
        <header className="topic-page-hero">
          <nav className="breadcrumbs" aria-label="Brödsmulor">
            <Link href="/">Start</Link><span>/</span>
            <Link href="/statistik">Statistik</Link><span>/</span>
            <strong>{topic.category}</strong>
          </nav>
          <p className="section-kicker">Officiell tidsserie · {topic.category}</p>
          <h1>{topic.heading}</h1>
          <p>{topic.lead}</p>
          <div className="topic-page-actions">
            <Link href={primaryAction.href}>{primaryAction.label} <span>↗</span></Link>
            <Link href="/metod">Så bedöms evidensen</Link>
          </div>
        </header>

        <section className="topic-metrics" aria-label="Nyckeltal">
          {topic.metrics.map((metric, index) => (
            <div key={metric.value + metric.label}>
              <span>{String(index + 1).padStart(2, '0')} · {metric.period}</span>
              <strong>{metric.value}</strong>
              <p>{metric.label}</p>
            </div>
          ))}
        </section>

        <div className="topic-page-layout">
          <div className="topic-main-copy">
            <section aria-labelledby="reading-heading">
              <p className="section-kicker">Satslogiken</p>
              <h2 id="reading-heading">Vad går att säga?</h2>
              <div className="topic-logic-grid">
                <article>
                  <span>01 · Observerat</span>
                  <h3>Det statistiken visar</h3>
                  <p>{topic.observed}</p>
                </article>
                <article>
                  <span>02 · Möjlig policykoppling</span>
                  <h3>Det politiken kan påverka</h3>
                  <p>{topic.policy}</p>
                </article>
                <article>
                  <span>03 · Kausal effekt</span>
                  <h3>Inte belagd av denna tidsserie</h3>
                  <p>{topic.limitation}</p>
                </article>
              </div>
            </section>

            <section className="topic-definition" aria-labelledby="definition-heading">
              <p className="section-kicker">Definition</p>
              <h2 id="definition-heading">Så är måttet avgränsat</h2>
              <p>{topic.definition}</p>
            </section>

            <section className="topic-source-section" aria-labelledby="sources-heading">
              <p className="section-kicker">Originalkällor</p>
              <h2 id="sources-heading">Följ siffrorna till myndigheten</h2>
              <div>
                {topic.sources.map((source, index) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{source.name}</strong><small>{source.organization}</small></div>
                    <i>↗</i>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside className="topic-fact-panel">
            <span>Datapass</span>
            <dl>
              <div><dt>Geografi</dt><dd>Sverige</dd></div>
              <div><dt>Tidsperiod</dt><dd>{topic.temporalCoverage.replace('/', '–')}</dd></div>
              <div><dt>Kontrollerat</dt><dd>{siteConfig.sourceChecked}</dd></div>
              <div><dt>Källtyp</dt><dd>Officiell statistik</dd></div>
              <div><dt>Bearbetning</dt><dd>Återgiven utan prediktiv modell</dd></div>
              <div><dt>Originalkällor</dt><dd>{topic.sources.length}</dd></div>
            </dl>
            <p>Serien återges för begriplig jämförelse. Originalkällans definition och revisionshistorik gäller alltid.</p>
            <Link href="/kallor">Alla källaktörer <span>↗</span></Link>
          </aside>
        </div>

        <section className="related-topics" aria-labelledby="related-heading">
          <div>
            <p className="section-kicker">Relaterad statistik</p>
            <h2 id="related-heading">Fortsätt granska</h2>
          </div>
          <nav aria-label="Relaterade statistikområden">
            {topic.related.map((slug) => {
              const related = topicBySlug[slug];
              return related ? (
                <Link href={topicPath(slug)} key={slug}>
                  <span>{related.category}</span>
                  <strong>{related.heading}</strong>
                  <i>↗</i>
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
