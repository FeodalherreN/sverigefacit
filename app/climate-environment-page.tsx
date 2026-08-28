import Link from 'next/link';
import { Breadcrumbs } from './breadcrumbs';
import { environmentSeries, type EnvironmentPoint } from './environment-data';
import { GuideFooter, GuideHeader } from './guide-chrome';
import { InternationalReference } from './international-reference';
import { siteConfig } from './site-config';
import { topicPath, type SeoTopic } from './seo-topics';

type ChartLine = {
  label: string;
  color: string;
  points: EnvironmentPoint[];
};

const formatValue = (value: number, digits = 1) =>
  new Intl.NumberFormat('sv-SE', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

function TrendChart({
  lines,
  ariaLabel,
  unit,
}: {
  lines: ChartLine[];
  ariaLabel: string;
  unit: string;
}) {
  const width = 760;
  const height = 330;
  const margin = { top: 28, right: 22, bottom: 38, left: 58 };
  const allPoints = lines.flatMap((line) => line.points);
  const minYear = Math.min(...allPoints.map((point) => point.year));
  const maxYear = Math.max(...allPoints.map((point) => point.year));
  const minValue = Math.min(0, ...allPoints.map((point) => point.value));
  const maxValue = Math.max(...allPoints.map((point) => point.value));
  const range = maxValue - minValue || 1;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (year: number) => margin.left + ((year - minYear) / Math.max(maxYear - minYear, 1)) * plotWidth;
  const y = (value: number) => margin.top + (1 - (value - minValue) / range) * plotHeight;
  const yTicks = Array.from({ length: 5 }, (_, index) => minValue + (range * index) / 4);
  const yearTicks = Array.from(new Set([minYear, Math.round(minYear + (maxYear - minYear) / 2), maxYear]));

  return (
    <div className="environment-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} className="environment-grid-line" />
            <text x={margin.left - 11} y={y(tick) + 4} textAnchor="end" className="environment-axis-label">{formatValue(tick, tick < 20 ? 1 : 0)}</text>
          </g>
        ))}
        {yearTicks.map((year) => (
          <text key={year} x={x(year)} y={height - 11} textAnchor={year === minYear ? 'start' : year === maxYear ? 'end' : 'middle'} className="environment-axis-label">{year}</text>
        ))}
        {lines.map((line) => {
          const points = line.points.map((point) => `${x(point.year)},${y(point.value)}`).join(' ');
          const last = line.points[line.points.length - 1];
          return (
            <g key={line.label}>
              <polyline points={points} fill="none" stroke={line.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <circle cx={x(last.year)} cy={y(last.value)} r="5" fill={line.color} />
            </g>
          );
        })}
        <text x={margin.left} y={16} className="environment-unit-label">{unit}</text>
      </svg>
      <div className="environment-chart-legend" aria-hidden="true">
        {lines.map((line) => <span key={line.label}><i style={{ background: line.color }} />{line.label}</span>)}
      </div>
    </div>
  );
}

const productionMix = [
  { label: 'Vattenkraft', value: 64.2, color: '#3276d8' },
  { label: 'Kärnkraft', value: 48.7, color: '#7857d8' },
  { label: 'Vindkraft', value: 40.4, color: '#4c9a7a' },
  { label: 'Konventionell värmekraft', value: 11.8, color: '#a96c4b' },
  { label: 'Solkraft', value: 4.1, color: '#d3a500' },
];

const sectorEmissions = [
  { label: 'Inrikes transporter', value: 17.0 },
  { label: 'Industri', value: 13.7 },
  { label: 'Jordbruk', value: 6.5 },
  { label: 'El och fjärrvärme', value: 3.8 },
  { label: 'Arbetsmaskiner', value: 3.2 },
  { label: 'Övrigt', value: 2.5 },
];

const environmentFacts = [
  {
    value: 'nära +2 °C',
    title: 'högre svensk medeltemperatur än i slutet av 1800-talet',
    detail: 'SMHI:s nationella indikator bygger på homogeniserade observationer från omkring 450 tidsserier sedan 1860.',
    source: 'SMHI',
    href: 'https://www.smhi.se/klimat/klimatet-da-och-nu/klimatindikatorer/temperatur',
  },
  {
    value: '15,7 %',
    title: 'av Sveriges totalareal var formellt skyddad 2025',
    detail: 'Överlapp mellan skyddsformer är borträknade. Metoden för totalarealen ändrades 2023.',
    source: 'SCB',
    href: environmentSeries.protectedNature.sourceUrl,
  },
  {
    value: '2 373',
    title: 'arter bedömdes som hotade i Rödlista 2025',
    detail: 'Rödlistad och hotad är inte samma sak. Resultatet påverkas också av vilka artgrupper som kunnat bedömas.',
    source: 'SLU Artdatabanken',
    href: 'https://www.slu.se/artdatabanken/publikationer/rodlistor/rodlista-2025/',
  },
  {
    value: '428 kg',
    title: 'kommunalt avfall per person 2024',
    detail: '47 procent materialåtervanns. En ändrad rapporteringsmetod påverkar jämförelsen med tidigare år.',
    source: 'Naturvårdsverket',
    href: 'https://www.naturvardsverket.se/data-och-statistik/avfall/kommunalt-avfall/',
  },
  {
    value: '53 / 34 %',
    title: 'av sjöar respektive vattendrag hade god eller hög ekologisk status',
    detail: 'Vattenstatus klassas i fleråriga förvaltningscykler och är inte en årlig tidsserie.',
    source: 'Havs- och vattenmyndigheten',
    href: 'https://www.havochvatten.se/download/18.beb19a418366a19e1cac9bc/1664802617668/rapport-2022-17-levande-sjoar-och-vattendrag-fu-23.pdf',
  },
];

export function ClimateEnvironmentPage({ topic }: { topic: SeoTopic }) {
  const canonicalUrl = `${siteConfig.url}${topicPath(topic.slug)}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        name: topic.heading,
        description: topic.description,
        url: canonicalUrl,
        inLanguage: siteConfig.language,
        temporalCoverage: topic.temporalCoverage,
        spatialCoverage: { '@type': 'Country', name: 'Sverige' },
        variableMeasured: topic.variableMeasured.map((name) => ({ '@type': 'PropertyValue', name })),
        isBasedOn: topic.sources.map((source) => source.url),
      },
    ],
  };

  return (
    <main className="guide-page environment-page" id="guide-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <GuideHeader />

      <article>
        <header className="environment-hero">
          <Breadcrumbs items={[
            { href: '/statistik', label: 'Statistik' },
            { href: topicPath(topic.slug), label: topic.heading },
          ]} />
          <div className="environment-hero-grid">
            <div>
              <p className="environment-eyebrow">Klimat och miljö</p>
              <h1>Hur går det för Sverige?</h1>
              <p>Här hålls utsläpp inom Sverige, utsläpp från vår konsumtion, energisystemet och naturens tillstånd isär. Du får först det korta svaret och kan sedan kontrollera varje serie.</p>
              <div className="environment-actions">
                <Link href="/datastudio?seriesA=emissions&seriesB=transportEmissions&from=2000&to=2025&measure=level&lag=0&view=timeline&events=1&event=reduction-obligation-2024#datastudio">Jämför utsläpp över tid <span aria-hidden="true">→</span></Link>
                <a href="#miljo-i-korthet">Läs sammanfattningen</a>
              </div>
            </div>
            <dl className="environment-headline-stats">
              <div><dt>2025 · preliminärt</dt><dd>46,7 Mt</dd><span>territoriella utsläpp</span></div>
              <div><dt>Förändring 2024–2025</dt><dd>−2,8 %</dd><span>men 2024 låg ovanligt högt</span></div>
              <div><dt>Transportmålet 2030</dt><dd>Nås inte</dd><span>med nuvarande utveckling</span></div>
            </dl>
          </div>
        </header>

        <section className="environment-summary" id="miljo-i-korthet" aria-labelledby="environment-summary-heading">
          <div>
            <h2 id="environment-summary-heading">Det korta svaret</h2>
            <p>Sveriges territoriella utsläpp har minskat tydligt sedan 2000. De steg kraftigt 2024 efter sänkt reduktionsplikt och föll igen 2025 när inblandningen av biodrivmedel höjdes. Trots nedgången bedömer Naturvårdsverket att transportmålet till 2030 inte nås med dagens utveckling.</p>
          </div>
          <aside>
            <strong>Vad går att slå fast?</strong>
            <p>Utfallet och tidpunkterna är observerade. Naturvårdsverket pekar ut reduktionsplikten, elektrifiering och trafik som viktiga förklaringar för transporterna. En ensam tidsserie kan däremot inte fördela hela effekten mellan varje beslut och omvärldsfaktor.</p>
          </aside>
        </section>

        <section className="environment-section" aria-labelledby="emissions-heading">
          <div className="environment-section-heading">
            <span>Utsläpp</span>
            <h2 id="emissions-heading">Nedåt över tid, men inte i en rak linje</h2>
            <p>Totalt utsläpp och inrikes transporter visas i samma enhet. Den stora uppgången 2024 syns i båda serierna.</p>
          </div>
          <TrendChart
            ariaLabel="Territoriella växthusgasutsläpp och utsläpp från inrikes transporter i Sverige 2000 till 2025"
            unit="Miljoner ton koldioxidekvivalenter"
            lines={[
              { label: 'Territoriella utsläpp', color: environmentSeries.emissions.color, points: environmentSeries.emissions.points },
              { label: 'Inrikes transporter', color: environmentSeries.transportEmissions.color, points: environmentSeries.transportEmissions.points },
            ]}
          />
          <div className="environment-data-note">
            <span>2025 är preliminärt</span>
            <p>2024 års total har reviderats från 47,5 till 48,1 miljoner ton. Sverigefacit använder Naturvårdsverkets senaste sammanhängande inventering, eftersom även äldre år kan räknas om när metoden förbättras.</p>
            <a href={environmentSeries.emissions.sourceUrl} target="_blank" rel="noreferrer">Öppna originalserien ↗</a>
          </div>
        </section>

        <InternationalReference
          benchmarkIds={['territorialEmissionsPerCapita']}
          heading="Sveriges utsläpp i europeisk kontext"
        />

        <section className="environment-split-section" aria-labelledby="sectors-heading">
          <div>
            <span className="environment-label">Preliminärt 2025</span>
            <h2 id="sectors-heading">Var utsläppen uppstår</h2>
            <p>Transporter och industri stod tillsammans för ungefär två tredjedelar av de territoriella utsläppen.</p>
            <div className="environment-sector-bar" aria-label="Utsläpp per sektor 2025">
              {sectorEmissions.map((sector) => <i key={sector.label} style={{ flexGrow: sector.value }} title={`${sector.label}: ${formatValue(sector.value)} Mt`} />)}
            </div>
            <dl className="environment-sector-list">
              {sectorEmissions.map((sector) => <div key={sector.label}><dt>{sector.label}</dt><dd>{formatValue(sector.value)} Mt</dd></div>)}
            </dl>
          </div>
          <aside className="environment-policy-note">
            <span>Politiskt beslut med synlig mekanism</span>
            <h3>Reduktionsplikten ändrade kurvan</h3>
            <p>Naturvårdsverket anger den sänkta reduktionsplikten som huvudförklaring till transportökningen 2024 och den höjda nivån från juli 2025 som huvudförklaring till minskningen året därpå. Elektrifiering och trafikvolym spelade också roll.</p>
            <div className="environment-goal-progress"><i /></div>
            <strong>19 % minskning sedan 2010</strong>
            <small>Målet är minst 70 procent till 2030, utan inrikes flyg. Ytterligare 10,6 Mt behöver minska.</small>
            <Link href="/datastudio?seriesA=fuel&seriesB=transportEmissions&from=2000&to=2025&measure=level&lag=0&view=timeline&events=1&event=reduction-obligation-2024#datastudio">Jämför bensinpris och transportutsläpp <span aria-hidden="true">→</span></Link>
          </aside>
        </section>

        <section className="environment-section environment-consumption" aria-labelledby="consumption-heading">
          <div className="environment-section-heading">
            <span>Två olika frågor</span>
            <h2 id="consumption-heading">Utsläpp här eller från det vi konsumerar?</h2>
            <p>Territoriell statistik följer utsläpp inom Sveriges gränser. Konsumtionsmåttet räknar även utsläpp utomlands från varor och tjänster som används här.</p>
          </div>
          <div className="environment-comparison-copy">
            <div><strong>46,7 Mt</strong><span>inom Sveriges gränser 2025</span><p>Exklusive markanvändning och internationella transporter.</p></div>
            <div><strong>7,6 ton/person</strong><span>från svensk konsumtion 2023</span><p>Modellskattning som även omfattar utsläpp utomlands från importerade varor och tjänster.</p></div>
          </div>
          <TrendChart
            ariaLabel="Konsumtionsbaserade växthusgasutsläpp per person i Sverige 2008 till 2023"
            unit="Ton koldioxidekvivalenter per person"
            lines={[{ label: 'Konsumtionsbaserade utsläpp', color: environmentSeries.consumptionEmissions.color, points: environmentSeries.consumptionEmissions.points }]}
          />
          <p className="environment-footnote">Konsumtionsserien är modellberäknad och mer osäker än den territoriella inventeringen. Därför visas den separat, inte som en direkt jämförelse av nivåerna.</p>
        </section>

        <section className="environment-split-section environment-energy-land" aria-label="Elproduktion och nettoupptag">
          <div>
            <span className="environment-label">Elsystemet 2024</span>
            <h2>98,6 procent fossilfri elproduktion</h2>
            <p>Det gäller elproduktionen, inte hela Sveriges energianvändning. Kärnkraft räknas som fossilfri.</p>
            <div className="environment-production-mix">
              {productionMix.map((item) => (
                <div key={item.label}>
                  <span><strong>{item.label}</strong><small>{formatValue(item.value)} TWh</small></span>
                  <i><b style={{ width: `${(item.value / 64.2) * 100}%`, background: item.color }} /></i>
                </div>
              ))}
            </div>
            <div className="environment-source-links">
              <a className="environment-source-link" href={environmentSeries.fossilFreeElectricity.sourceUrl} target="_blank" rel="noreferrer">Energiindikatorn ↗</a>
              <a className="environment-source-link" href="https://www.energimyndigheten.se/nyhetsarkiv/2025/slutgiltig-statistik-for-el-och-fjarrvarme-2024/" target="_blank" rel="noreferrer">Produktionsmixen ↗</a>
            </div>
          </div>
          <div>
            <span className="environment-label">Skog och mark</span>
            <h2>Nettoupptaget återhämtades 2024</h2>
            <p>Skog och mark tog netto upp 54,2 miljoner ton koldioxidekvivalenter. Upptaget hade fallit kraftigt mellan 2010 och 2020.</p>
            <TrendChart
              ariaLabel="Nettoupptag av växthusgaser i mark och skog 2000 till 2024"
              unit="Miljoner ton koldioxidekvivalenter"
              lines={[{ label: 'Nettoupptag', color: environmentSeries.carbonSink.color, points: environmentSeries.carbonSink.points }]}
            />
            <p className="environment-footnote">Originalkällan redovisar nettoupptag med minustecken. Här är tecknet vänt för att ett större upptag ska visas uppåt. Något preliminärt värde för 2025 finns inte.</p>
          </div>
        </section>

        <section className="environment-nature" aria-labelledby="nature-heading">
          <div className="environment-section-heading">
            <span>Natur och resurser</span>
            <h2 id="nature-heading">Miljö är mer än klimat</h2>
            <p>De här måtten har olika tidsperioder och ska inte pressas in i ett enda miljöbetyg.</p>
          </div>
          <div className="environment-fact-list">
            {environmentFacts.map((fact) => (
              <article key={fact.title}>
                <strong>{fact.value}</strong>
                <div><h3>{fact.title}</h3><p>{fact.detail}</p></div>
                <a href={fact.href} target="_blank" rel="noreferrer">{fact.source} ↗</a>
              </article>
            ))}
          </div>
        </section>

        <section className="environment-method" aria-labelledby="environment-method-heading">
          <h2 id="environment-method-heading">Så läser vi miljöpolitiken</h2>
          <div>
            <p><strong>Utfallet:</strong> Serien visar vad som hände för ett definierat mått.</p>
            <p><strong>Politiska beslut:</strong> Skatter, reduktionsplikt, EU-regler, skyddsbeslut och investeringar kan ha tydliga mekanismer och dokumenterad timing.</p>
            <p><strong>Gränsen:</strong> Väder, konjunktur, energipriser, teknik och beteenden ändras samtidigt. En kurva ensam räcker därför inte för att beräkna en reforms hela effekt.</p>
          </div>
          <Link href="/metod">Läs hur vi skiljer samband från orsak <span>→</span></Link>
        </section>

        <section className="environment-sources" aria-labelledby="environment-sources-heading">
          <h2 id="environment-sources-heading">Källor och egna jämförelser</h2>
          <div>
            {topic.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><strong>{source.name}</strong><span>{source.organization} ↗</span></a>)}
          </div>
          <Link href="/datastudio?seriesA=consumptionEmissions&seriesB=emissions&from=2008&to=2023&measure=change&lag=0&view=timeline&events=0#datastudio">Jämför territoriella och konsumtionsbaserade utsläpp <span aria-hidden="true">→</span></Link>
        </section>
      </article>

      <GuideFooter />
    </main>
  );
}
