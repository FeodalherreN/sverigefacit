import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { seriesCatalogMetadata } from '../data/series-core';
import { GuideFooter, GuideHeader } from '../guide-chrome';

const title = 'Källor – SCB, Brå, Eurostat och offentlig statistik';
const description = 'Se myndigheterna och originalkällorna bakom Sverigefacits statistik om brott, migration, ekonomi, pension, energi, miljö och europeiska jämförelser.';

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
  { name: 'SMHI', detail: 'Klimatindikatorer, temperatur, nederbörd och väderobservationer', url: 'https://www.smhi.se/klimat' },
  { name: 'SLU Artdatabanken', detail: 'Rödlistning, arter och biologisk mångfald', url: 'https://www.slu.se/artdatabanken/' },
  { name: 'Havs- och vattenmyndigheten', detail: 'Miljötillstånd i sjöar, vattendrag och hav', url: 'https://www.havochvatten.se/data-kartor-och-rapporter.html' },
  { name: 'Regeringen', detail: 'Propositioner, regeringsförklaringar och offentliga utredningar', url: 'https://www.regeringen.se/rattsliga-dokument/' },
  { name: 'Riksdagen', detail: 'Lagar, beslut, betänkanden och riksdagens dokument', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/' },
  { name: 'Europol', detail: 'Terrorism i EU, medlemsstaternas rapportering och årliga TE-SAT-rapporter', url: 'https://www.europol.europa.eu/publications-events/main-reports/tesat-report' },
  { name: 'Eurostat', detail: 'Harmoniserade landsjämförelser för arbete, priser, ekonomi, energi och klimat', url: 'https://ec.europa.eu/eurostat/' },
  { name: 'Europeiska miljöbyrån', detail: 'Europeiska utsläppsinventeringar, miljödata och metodunderlag', url: 'https://www.eea.europa.eu/en/datahub' },
];

const cataloguedDate = new Intl.DateTimeFormat('sv-SE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(`${seriesCatalogMetadata.cataloguedAt}T12:00:00Z`));

export default function SourcesPage() {
  return (
    <main className="guide-page" id="guide-content" tabIndex={-1}>
      <GuideHeader />
      <article>
        <header className="info-page-hero">
          <Breadcrumbs items={[{ href: '/kallor', label: 'Källor' }]} />
          <h1>Källor och bearbetning</h1>
          <p>Varje diagram länkar till tabellen eller rapporten som siffran kommer från. Här ser du vilka myndigheter och organisationer som används.</p>
        </header>

        <section className="source-directory" aria-label="Källor">
          {sources.map((source, index) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{source.name}</h2>
              <p>{source.detail}</p>
              <i>↗</i>
            </a>
          ))}
        </section>

        <section className="source-principles" aria-labelledby="data-storage-heading">
          <div><h2 id="data-storage-heading">Så lagras siffrorna</h2></div>
          <ul>
            <li><strong>Datastudions {seriesCatalogMetadata.seriesCount} svenska tidsserier är versionsatta.</strong><span>De ligger i en gemensam datakatalog i projektet. Besökaren är därför inte beroende av att ett myndighets-API svarar just då.</span></li>
            <li><strong>Uppdateringar granskas före publicering.</strong><span>Nya värden jämförs med originalkällan, valideras och blir en synlig ändring i versionshistoriken. Katalogen strukturerades senast {cataloguedDate}.</span></li>
            <li><strong>Eurostat är undantaget.</strong><span>Internationella jämförelser försöker hämta harmoniserad data direkt från Eurostat och visar kontrollerade reservvärden om tjänsten inte kan nås.</span></li>
            <li><strong>Öppen och maskinläsbar.</strong><span><a href="/data/series.json">Öppna hela tidsseriekatalogen som JSON ↗</a></span></li>
          </ul>
        </section>

        <section className="source-principles">
          <div><h2>Så arbetar vi med källor</h2></div>
          <ul>
            <li><strong>Vi använder originalet.</strong><span>Myndighetens tabell eller rapport används i första hand. Exakt källa, period, enhet och bearbetning visas vid måttet.</span></li>
            <li><strong>Vi håller isär definitioner.</strong><span>Misstanke är inte dom, invandring är inte asyl och prisnivå är inte inflationstakt.</span></li>
            <li><strong>Vi jämför samma population och period.</strong><span>Historiska kohorter kombineras inte med dagens befolkningsnämnare.</span></li>
            <li><strong>Vi uppdaterar när källan revideras.</strong><span>Officiell statistik kan ändras när myndigheten får bättre underlag eller byter metod.</span></li>
            <li><strong>Fel ska gå att rätta.</strong><span>Hittar du ett sakfel eller en bruten källa kan du <a href="https://github.com/FeodalherreN/sverigefacit/issues/new" target="_blank" rel="noreferrer">rapportera det här ↗</a>. Ange sida, mått, avvikelse och originalkälla.</span></li>
          </ul>
        </section>
      </article>
      <GuideFooter />
    </main>
  );
}
