import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideFooter, GuideHeader } from '../guide-chrome';

const title = 'Källor – SCB, Brå, Europol och offentlig statistik';
const description = 'Se myndigheterna och originalkällorna bakom Sverigefacits statistik om brott, migration, ekonomi, pension, energi och svensk EU-kontext.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/kallor' },
  openGraph: { title, description, url: '/kallor', images: ['/og.png'] },
};

const sources = [
  { name: 'SCB', detail: 'Befolkning, arbetsmarknad, hushållsekonomi, BNP och utsläpp', url: 'https://www.scb.se/' },
  { name: 'Brå', detail: 'Brottsstatistik, registerstudier, utsatthet och rättsväsende', url: 'https://bra.se/statistik' },
  { name: 'Riksbanken', detail: 'Styrränta, penningpolitik och ekonomisk kontext', url: 'https://www.riksbank.se/sv/statistik/' },
  { name: 'Migrationsverket', detail: 'Asyl, tillstånd och historiska mottagningsdata', url: 'https://www.migrationsverket.se/Om-Migrationsverket/Statistik.html' },
  { name: 'Energimyndigheten', detail: 'Elpris, bränslepris och svensk energistatistik', url: 'https://www.energimyndigheten.se/statistik/' },
  { name: 'Socialstyrelsen', detail: 'Hemtjänst, särskilt boende och äldreomsorg', url: 'https://www.socialstyrelsen.se/statistik-och-data/statistik/' },
  { name: 'Pensionsmyndigheten', detail: 'Allmän pension och fastprisberäknad utveckling', url: 'https://www.pensionsmyndigheten.se/statistik/' },
  { name: 'Naturvårdsverket', detail: 'Nationella växthusgasutsläpp och klimatdata', url: 'https://www.naturvardsverket.se/data-och-statistik/' },
  { name: 'Regeringen', detail: 'Propositioner, regeringsförklaringar och offentliga utredningar', url: 'https://www.regeringen.se/rattsliga-dokument/' },
  { name: 'Riksdagen', detail: 'Lagar, beslut, betänkanden och riksdagens dokument', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/' },
  { name: 'Europol', detail: 'Terrorism i EU, medlemsstaternas rapportering och årliga TE-SAT-rapporter', url: 'https://www.europol.europa.eu/publications-events/main-reports/tesat-report' },
];

export default function SourcesPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <article>
        <header className="info-page-hero">
          <nav className="breadcrumbs" aria-label="Brödsmulor"><Link href="/">Start</Link><span>/</span><strong>Källor</strong></nav>
          <p className="section-kicker">Spårbart hela vägen</p>
          <h1>Från myndighet<br />{' '}till begriplig graf.</h1>
          <p>Sverigefacit prioriterar officiella tidsserier, publicerade tabeller och rättsliga dokument från Sverige och relevant EU-kontext. Varje analys länkar tillbaka till det underlag som bär siffran.</p>
        </header>

        <section className="source-directory" aria-label="Källaktörer">
          {sources.map((source, index) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{source.name}</h2>
              <p>{source.detail}</p>
              <i>↗</i>
            </a>
          ))}
        </section>

        <section className="source-principles">
          <div><p className="section-kicker">Källprinciper</p><h2>Ingen dold sammanvägning.</h2></div>
          <ul>
            <li><strong>Katalog är inte datapass.</strong><span>Listan ovan visar källaktörer. Exakt tabell, rapport, enhet, period och bearbetning redovisas vid varje enskilt mått. Sverigefacit visar daterade utdrag, inte live-data.</span></li>
            <li><strong>Original före återberättande.</strong><span>Myndighetens tabell eller rapport används före en sekundär artikel.</span></li>
            <li><strong>Definition före rubrik.</strong><span>Misstanke, dom, invandring, asyl och ekonomisk standard hålls isär.</span></li>
            <li><strong>Period före jämförelse.</strong><span>Historiska kohorter kombineras inte med dagens befolkningsnämnare.</span></li>
            <li><strong>Revideringar får synas.</strong><span>Officiell statistik kan ändras när metoder eller underlag förbättras.</span></li>
            <li><strong>Fel ska gå att rätta.</strong><span>Hittar du ett sakfel eller en bruten källa kan du <a href="https://github.com/FeodalherreN/sverigefacit/issues/new" target="_blank" rel="noreferrer">rapportera ett data- eller källfel ↗</a>. Ange sida, mått, avvikelse och originalkälla.</span></li>
          </ul>
        </section>
      </article>
      <GuideFooter />
    </main>
  );
}
