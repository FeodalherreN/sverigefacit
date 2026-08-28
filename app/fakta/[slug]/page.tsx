import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { Breadcrumbs } from '../../breadcrumbs';
import { CrimeMigrationLevels } from '../../crime-migration-levels';
import { EmbedButton } from '../../embed-button';
import { GuideFooter, GuideHeader } from '../../guide-chrome';
import { ShareButton } from '../../share-button';
import { siteConfig } from '../../site-config';
import { FactBreakdownChart } from '../fact-breakdown';
import { FactCard } from '../fact-card';
import { FactChart } from '../fact-chart';
import { factBySlug, factPath, facts } from '../facts';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return facts.map((fact) => ({ slug: fact.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fact = factBySlug[slug];
  if (!fact) return {};
  return {
    title: fact.title,
    description: fact.answer,
    alternates: { canonical: factPath(fact.slug) },
    openGraph: {
      type: 'article',
      url: factPath(fact.slug),
      title: fact.question,
      description: `${fact.answer} ${fact.limitation}`,
      images: [],
    },
    twitter: {
      card: 'summary',
      title: fact.question,
      description: fact.answer,
      images: [],
    },
  };
}

export default async function FactDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const fact = factBySlug[slug];
  if (!fact) notFound();
  const canonicalUrl = `${siteConfig.url}${factPath(fact.slug)}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: fact.title,
        description: fact.description,
        inLanguage: siteConfig.language,
        dateModified: siteConfig.modified,
        isPartOf: { '@id': `${siteConfig.url}/#website` },
        breadcrumb: { '@id': `${canonicalUrl}#breadcrumbs` },
        mainEntity: { '@id': `${canonicalUrl}#dataset` },
      },
      {
        '@type': 'Dataset',
        '@id': `${canonicalUrl}#dataset`,
        name: fact.title,
        description: fact.description,
        url: canonicalUrl,
        inLanguage: siteConfig.language,
        isAccessibleForFree: true,
        dateModified: siteConfig.modified,
        temporalCoverage: fact.period,
        spatialCoverage: fact.geography
          ? { '@type': fact.geography.schemaType, name: fact.geography.schemaName }
          : { '@type': 'Country', name: 'Sverige' },
        creator: { '@type': 'Organization', name: fact.sourceOrganization },
        isBasedOn: fact.sourceUrl,
        variableMeasured: fact.valueLabel,
        ...((fact.points || fact.breakdown) ? {
          distribution: [{
            '@type': 'DataDownload',
            contentUrl: `${canonicalUrl}/data.csv`,
            encodingFormat: 'text/csv',
          }],
        } : {}),
      },
    ],
  };
  const related = fact.related.map((relatedSlug) => factBySlug[relatedSlug]).filter(Boolean);

  return (
    <main className="guide-page fact-detail-page" id="guide-content" tabIndex={-1} style={{ '--fact-accent': fact.accent } as CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <GuideHeader />
      <article>
        <header className="fact-detail-hero">
          <Breadcrumbs items={[
            { href: '/fakta', label: 'Fakta' },
            { href: factPath(fact.slug), label: fact.question },
          ]} />
          <p className="section-kicker">{fact.topic} · {fact.geography ? `${fact.geography.label} · ` : ''}{fact.period}</p>
          <h1>{fact.question}</h1>
          <p className="fact-answer">{fact.answer}</p>
          {fact.slug === 'migration-och-brott' && <CrimeMigrationLevels current="fact" />}
          <div className="fact-primary-number"><strong>{fact.value}</strong><span>{fact.valueLabel}</span></div>
          <div className="fact-primary-actions">
            <ShareButton title={fact.question} text={`${fact.answer} Källa: ${fact.sourceOrganization} · Sverigefacit`} itemId={fact.slug} url={canonicalUrl} />
            <EmbedButton embedUrl={`${siteConfig.url}/embed/fakta/${fact.slug}`} title={fact.question} itemId={fact.slug} />
            {(fact.points || fact.breakdown) && <a href={`${factPath(fact.slug)}/data.csv`} download>Ladda ned data · CSV ↓</a>}
            <a href={fact.sourceUrl} target="_blank" rel="noreferrer">Öppna originalkällan ↗</a>
          </div>
          <div className="fact-proof-limit"><strong>Detta bevisar inte</strong><p>{fact.limitation}</p></div>
        </header>

        {fact.metrics && (
          <section className="fact-metric-grid" aria-label="Nyckeltal">
            {fact.metrics.map((metric) => <div key={`${metric.value}-${metric.label}`}><span>{metric.period}</span><strong>{metric.value}</strong><p>{metric.label}</p></div>)}
          </section>
        )}

        <FactChart fact={fact} />
        <FactBreakdownChart fact={fact} />

        <section className="fact-logic-section" aria-labelledby="fact-logic-heading">
          <div><h2 id="fact-logic-heading">Tolkning</h2></div>
          <div className="fact-logic-grid">
            <article><span>Utfall</span><h3>Vad visar statistiken?</h3><p>{fact.observed}</p></article>
            <article><span>Politik</span><h3>Vad kan politiken påverka?</h3><p>{fact.policy}</p></article>
          </div>
        </section>

        <section className="fact-passport">
          <div><p className="section-kicker">Om måttet</p><h2>Källa och definition</h2><p>{fact.definition}</p></div>
          <dl>
            <div><dt>Geografi</dt><dd>{fact.geography?.label || 'Sverige'}</dd></div>
            <div><dt>Källa</dt><dd>{fact.sourceOrganization}</dd></div>
            <div><dt>Underlag</dt><dd><a href={fact.sourceUrl} target="_blank" rel="noreferrer">{fact.sourceName} ↗</a></dd></div>
            <div><dt>Period</dt><dd>{fact.period}</dd></div>
            <div><dt>Enhet</dt><dd>{fact.unit}</dd></div>
            <div><dt>Tolkning</dt><dd>{fact.evidence}</dd></div>
            <div><dt>Senast granskat</dt><dd>{fact.sourceChecked}</dd></div>
          </dl>
        </section>

        <section className="fact-related" aria-labelledby="related-facts-heading">
          <div><h2 id="related-facts-heading">Relaterade faktasvar</h2></div>
          <div>{related.map((item) => <FactCard fact={item} compact key={item.slug} />)}</div>
        </section>
      </article>
      <GuideFooter />
    </main>
  );
}
