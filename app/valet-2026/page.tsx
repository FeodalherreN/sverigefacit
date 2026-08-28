import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '../breadcrumbs';
import { FactCard } from '../fakta/fact-card';
import { factBySlug } from '../fakta/facts';
import { FollowSverigefacit } from '../follow-sverigefacit';
import { GuideFooter, GuideHeader } from '../guide-chrome';

const title = 'Valet 2026 – valfrågorna i siffror';
const description = 'Ett mobilanpassat valfacit med officiell statistik om vård, lag och ordning, skola, ekonomi och röstberättigade.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/valet-2026' },
  openGraph: { title, description, url: '/valet-2026', images: ['/og.png'] },
};

const electionTopics = [
  { label: 'Sjukvård', href: '/fakta/vardgarantin-2026' },
  { label: 'Lag & ordning', href: '/fakta/skjutningar-2026' },
  { label: 'Skola', href: '/fakta/gymnasiebehorighet-2025' },
  { label: 'Privatekonomi', href: '/fakta/hushallens-ekonomi-2024' },
  { label: 'Migration', href: '/fakta/invandringen-2025' },
  { label: 'Pension', href: '/fakta/pensionens-ersattningsgrad' },
  { label: 'Äldreomsorg', href: '/fakta/aldreomsorg-2025' },
  { label: 'Klimat & miljö', href: '/statistik/klimat-och-miljo' },
];

const electionHighlights = [
  'vardgarantin-2026',
  'skjutningar-2026',
  'gymnasiebehorighet-2025',
  'hushallens-ekonomi-2024',
  'invandringen-2025',
].map((slug) => factBySlug[slug]);

export default function Election2026Page() {
  const electionFact = factBySlug['valet-2026'];
  const electionSignals = [electionFact.metrics?.[0], electionFact.metrics?.[1], electionFact.metrics?.[3]].filter(Boolean);
  return (
    <main className="guide-page election-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <header className="election-hero">
        <Breadcrumbs items={[{ href: '/valet-2026', label: 'Valet 2026' }]} />
        <div className="election-hero-grid">
          <div className="election-hero-copy">
            <p className="section-kicker">Valdagen · 13 september 2026</p>
            <h1>Valfrågorna i siffror</h1>
            <p>Förtidsröstning 26 augusti–13 september. Här får du korta svar från myndigheternas senaste data och originalkällan bakom varje tal.</p>
            <div className="election-hero-actions"><Link href="/fakta">Se alla faktasvar</Link><a href="https://www.val.se/kommande-val/val-2026---riksdag-region-och-kommun" target="_blank" rel="noreferrer">Praktisk valinformation ↗</a></div>
          </div>
          <aside className="election-hero-signals" aria-label="Valet i korthet">
            {electionSignals.map((metric) => metric ? (
              <Link href="/fakta/valet-2026" key={metric.value + metric.label}>
                <span>{metric.period}</span>
                <strong>{metric.value}</strong>
                <small>{metric.label}</small>
              </Link>
            ) : null)}
          </aside>
        </div>
      </header>

      <nav className="election-topic-chips" aria-label="Valfrågor">
        {electionTopics.map((topic) => <Link href={topic.href} key={topic.label}>{topic.label}</Link>)}
      </nav>

      <section className="election-now" aria-labelledby="election-now-heading">
        <div><p className="section-kicker">Just nu</p><h2 id="election-now-heading">Fem frågor att kunna före valet</h2></div>
        <div className="facts-grid">{electionHighlights.map((fact) => <FactCard fact={fact} key={fact.slug} />)}</div>
      </section>

      <section className="election-data-section">
        <div>
          <p className="section-kicker">Valdata</p>
          <h2>{electionFact.value} får rösta till riksdagen.</h2>
          <p>{electionFact.observed}</p>
          <Link href="/fakta/valet-2026">Se källa och definition <span aria-hidden="true">→</span></Link>
        </div>
        <aside>
          <span>Kommande valresultat</span>
          <strong>Preliminärt ≠ slutligt</strong>
          <p>När resultaten publiceras märks de med tidsstämpel, rapporteringsgrad och status som preliminära eller slutliga.</p>
          <a href="https://www.val.se/valresultat-och-statistik/statistik-och-data/radata-val-2026" target="_blank" rel="noreferrer">Valmyndighetens rådata ↗</a>
        </aside>
      </section>

      <section className="election-method-link">
        <div><p className="section-kicker">Så läser du faciten</p><strong>Utfall, möjlig påverkan och det som inte är bevisat hålls isär.</strong></div>
        <Link href="/metod">Läs metoden <span>→</span></Link>
      </section>
      <FollowSverigefacit context="valet" />
      <GuideFooter />
    </main>
  );
}
