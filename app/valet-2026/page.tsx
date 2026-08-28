import type { Metadata } from 'next';
import Link from 'next/link';
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
  return (
    <main className="guide-page election-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <header className="election-hero">
        <p className="section-kicker">Valdagen · 13 september 2026</p>
        <h1>Valfrågorna.<br />I verifierbara siffror.</h1>
        <p>Förtidsröstningen pågår. Här får du korta svar från myndigheternas senaste data och kan öppna hela underlaget bakom varje tal.</p>
        <div><Link href="/fakta">Se alla facit</Link><a href="https://www.val.se/kommande-val/val-2026---riksdag-region-och-kommun" target="_blank" rel="noreferrer">Praktisk valinformation ↗</a></div>
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
          <Link href="/fakta/valet-2026">Öppna datapasset <span>↗</span></Link>
        </div>
        <aside>
          <span>Kommande valresultat</span>
          <strong>Preliminärt ≠ slutligt</strong>
          <p>På valnatten kommer preliminära resultat. Sverigefacit kommer alltid märka tidsstämpel, rapporteringsgrad och om resultatet är preliminärt eller slutligt.</p>
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
