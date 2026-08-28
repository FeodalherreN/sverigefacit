'use client';

import { track } from '@vercel/analytics';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { CrimeOriginExplorer } from './analys/brott-och-migration/crime-origin-explorer';
import { labSeries, seriesById, seriesGroups as seriesGroupOrder, seriesRelationships, type LabSeries } from './data/series-catalog';

type AnalysisMode = 'level' | 'change';
type WorldEvent = {
  id: string;
  year: number;
  label: string;
  short: string;
  detail: string;
  sourceUrl: string;
  relevantSeries: string[];
};

type PromiseStage = 'done' | 'partial' | 'no' | 'unknown';
type AgendaStatus = 'available' | 'partial' | 'planned';
type PromiseItem = {
  id: string;
  year: string;
  owner: string;
  title: string;
  verdict: string;
  verdictTone: 'done' | 'partial' | 'no';
  detail: string;
  distinction: string;
  stages: [PromiseStage, PromiseStage, PromiseStage];
  source: string;
  sourceUrl: string;
};

const labMinYear = Math.min(...labSeries.flatMap((item) => item.points.map((point) => point.year)));
const labMaxYear = Math.max(...labSeries.flatMap((item) => item.points.map((point) => point.year)));
const defaultStartYear = Math.max(2000, labMinYear);
const labYears = Array.from({ length: labMaxYear - labMinYear + 1 }, (_, index) => labMinYear + index);

type AnalysisUrlState = {
  leftId: string;
  rightId: string;
  startYear: number;
  endYear: number;
  mode: AnalysisMode;
  lag: number;
  view: 'timeline' | 'scatter';
  showEvents: boolean;
  eventId: string;
};

const buildAnalysisUrl = (origin: string, state: AnalysisUrlState) => {
  const url = new URL('/datastudio', origin);
  url.searchParams.set('seriesA', state.leftId);
  url.searchParams.set('seriesB', state.rightId);
  url.searchParams.set('from', String(state.startYear));
  url.searchParams.set('to', String(state.endYear));
  url.searchParams.set('measure', state.mode);
  url.searchParams.set('lag', String(state.lag));
  url.searchParams.set('view', state.view);
  url.searchParams.set('events', state.showEvents ? '1' : '0');
  if (state.showEvents) url.searchParams.set('event', state.eventId);
  url.hash = 'datastudio';
  return url;
};

const worldEvents: WorldEvent[] = [
  {
    id: 'financial-crisis',
    year: 2008,
    label: 'Finanskrisen',
    short: 'Lehman Brothers föll 15 sep 2008',
    detail: 'Kreditmarknad, export, BNP och arbetslöshet påverkades. Markeringen visar timing, inte att varje förändring orsakades av krisen.',
    sourceUrl: 'https://www.riksbank.se/sv/om-riksbanken/historia/finanskrisen-2007-2010/',
    relevantSeries: ['policyRate', 'unemployment', 'gdpPerCapita', 'economicStandard', 'interestRatio', 'debtRatio', 'emissions'],
  },
  {
    id: 'refugee-crisis',
    year: 2015,
    label: 'Flyktingmottagandet 2015',
    short: 'Svensk mottagningstopp juli–november',
    detail: 'Mottagande, kommunal kapacitet, bostäder, skola och senare integration berördes. Senare utfall kräver kohort- och sammansättningsanalys.',
    sourceUrl: 'https://www.migrationsverket.se/om-migrationsverket/migrationsverket-svarar/2025/2025-10-27-tio-ar-sedan-2015---vad-var-det-som-hande.html',
    relevantSeries: ['immigration', 'emigration', 'migrationBalance', 'unemployment', 'gdpPerCapita'],
  },
  {
    id: 'covid',
    year: 2020,
    label: 'Covid-19',
    short: 'WHO klassade covid som pandemi 11 mars',
    detail: 'Hälsa, vård, arbetade timmar, arbetslöshet och BNP påverkades samtidigt. Relevant slutpunkt varierar mellan måtten.',
    sourceUrl: 'https://www.folkhalsomyndigheten.se/vara-amnesomraden/sjukdomsutbrott/arkiv-for-sjukdomsutbrott/covid-19-pandemin-2019-2023/nar-hande-vad-under-pandemin/',
    relevantSeries: ['unemployment', 'gdpPerCapita', 'economicStandard', 'immigration', 'deadlyViolence', 'emissions', 'insecurity', 'antidepressantUse', 'dailySmoking', 'dailySnus', 'alcoholRisk', 'cannabisPastYear'],
  },
  {
    id: 'ukraine',
    year: 2022,
    label: 'Ukraina & energikris',
    short: 'Fullskalig invasion 24 feb 2022',
    detail: 'El, bränsle, inflation, ränta och hushållens realinkomster påverkades. Prisuppgången började dock före invasionen.',
    sourceUrl: 'https://www.energimyndigheten.se/nyhetsarkiv/2022/sa-paverkar-invasionen-av-ukraina-sveriges-energilage/',
    relevantSeries: ['electricity', 'fuel', 'foodPrices', 'inflation', 'nominalWageGrowth', 'realWageGrowth', 'policyRate', 'interestRatio', 'economicStandard', 'gdpPerCapita'],
  },
  {
    id: 'gaza',
    year: 2023,
    label: 'Israel–Hamas-kriget',
    short: 'Krigsutbrott 7 okt 2023',
    detail: 'Främst relevant för utrikespolitik, säkerhet, bistånd och möjliga hatbrott. Makroeffekten i Sverige gick ännu inte att bedöma.',
    sourceUrl: 'https://www.riksbank.se/sv/press-och-publicerat/tal-och-presentationer/2023/thedeen-vi-har-lardomar-att-dra-av-de-senaste-arens-turbulens/',
    relevantSeries: [],
  },
  {
    id: 'nato',
    year: 2024,
    label: 'Sverige går med i Nato',
    short: 'Medlemskap 7 mars 2024',
    detail: 'Påverkar försvarsutgifter, upphandling och styrkeplanering. Natoansökan var själv en reaktion på Rysslands invasion.',
    sourceUrl: 'https://regeringen.se/regeringens-politik/sverige-i-nato/sveriges-och-natos-historia/',
    relevantSeries: [],
  },
  {
    id: 'reduction-obligation-2024',
    year: 2024,
    label: 'Reduktionsplikten sänks',
    short: 'Nya nivåer började gälla 1 januari 2024',
    detail: 'Naturvårdsverket anger den lägre inblandningen av biodrivmedel som huvudförklaring till att utsläppen från transporter och arbetsmaskiner ökade 2024. Markeringen visar när beslutet började gälla.',
    sourceUrl: 'https://www.naturvardsverket.se/data-och-statistik/klimat/sveriges-utslapp-och-upptag-av-vaxthusgaser/',
    relevantSeries: ['fuel', 'emissions', 'transportEmissions'],
  },
];

const electionAgenda: { rank: number; label: string; value: number; status: AgendaStatus; href?: string }[] = [
  { rank: 1, label: 'Sjukvård', value: 58, status: 'planned' },
  { rank: 2, label: 'Lag & ordning', value: 48, status: 'partial', href: '/statistik/brottslighet' },
  { rank: 3, label: 'Skola', value: 42, status: 'planned' },
  { rank: 4, label: 'Försvar', value: 34, status: 'planned' },
  { rank: 5, label: 'Klimat', value: 31, status: 'available', href: '/statistik/klimat-och-miljo' },
  { rank: 6, label: 'Äldreomsorg', value: 30, status: 'available', href: '/statistik/aldreomsorg' },
  { rank: 7, label: 'Invandring', value: 28, status: 'available', href: '/statistik/migration' },
  { rank: 8, label: 'Energi', value: 27, status: 'available', href: '/statistik/klimat-och-miljo' },
  { rank: 9, label: 'Landets ekonomi', value: 27, status: 'partial', href: '/statistik/privatekonomi' },
  { rank: 10, label: 'Utrikespolitik', value: 23, status: 'planned' },
];

const crimeGroups = [
  { label: 'Inrikesfödd, två inrikesfödda föräldrar', short: 'Två inrikesfödda föräldrar', n: 5821794, rawPct: 3.18, adjustedPct: 3.18, rawRR: 1, adjustedRR: 1 },
  { label: 'Inrikesfödd, en inrikes- och en utrikesfödd förälder', short: 'En inrikes- och en utrikesfödd förälder', n: 501211, rawPct: 5.93, adjustedPct: 4.25, rawRR: 1.86, adjustedRR: 1.34 },
  { label: 'Inrikesfödd, två utrikesfödda föräldrar', short: 'Två utrikesfödda föräldrar', n: 261695, rawPct: 10.22, adjustedPct: 5.33, rawRR: 3.21, adjustedRR: 1.68 },
  { label: 'Utrikesfödd', short: 'Utrikesfödd', n: 1481663, rawPct: 7.99, adjustedPct: 5.61, rawRR: 2.51, adjustedRR: 1.77 },
];

const promiseItems: PromiseItem[] = [
  {
    id: 'unemployment-goal',
    year: '2014–20',
    owner: 'Socialdemokraterna / regeringen',
    title: 'EU:s lägsta arbetslöshet 2020',
    verdict: 'Inte uppfyllt',
    verdictTone: 'no',
    detail: 'Eurostats jämförbara årsdata visar 8,5 procent i Sverige och 2,6 procent i Tjeckien 2020.',
    distinction: 'Målet kan bedömas bokstavligt. Covid påverkar ansvarsfrågan, men ändrar inte måluppfyllelsen.',
    stages: ['partial', 'partial', 'no'],
    source: 'S valmanifest 2014',
    sourceUrl: 'https://www.socialdemokraterna.se/download/18.12ce554f16be946d04640800/1568881613666/valmanifest-2014.pdf',
  },
  {
    id: 'police-employees',
    year: '2016–24',
    owner: 'S/MP-regeringen',
    title: '10 000 fler polisanställda',
    verdict: 'Uppfyllt enligt bemanningsmåttet',
    verdictTone: 'done',
    detail: 'Antalet anställda ökade med 11 426. Av dem var 3 942 poliser och 7 484 civilanställda.',
    distinction: 'Ett uppfyllt resursmål betyder inte automatiskt bättre uppklaring eller mindre brottslighet.',
    stages: ['done', 'done', 'unknown'],
    source: 'Brås slututvärdering 2026',
    sourceUrl: 'https://bra.se/rapporter/arkiv/2026-03-25-utvardering-av-satsningen-pa-10-000-fler-polisanstallda',
  },
  {
    id: 'care-contact',
    year: '2019–22',
    owner: 'Januariavtalet',
    title: 'Fast omsorgskontakt i hemtjänsten',
    verdict: 'Beslut helt · genomförande delvis',
    verdictTone: 'partial',
    detail: 'Lagen trädde i kraft den 1 juli 2022. Socialstyrelsens uppföljning visar ojämn implementering.',
    distinction: 'Beslut, praktiskt genomförande och faktisk effekt måste kodas som tre skilda steg.',
    stages: ['done', 'partial', 'unknown'],
    source: 'Socialstyrelsens uppföljning',
    sourceUrl: 'https://www.socialstyrelsen.se/globalassets/sharepoint-dokument/artikelkatalog/ovrigt/2025-2-9459.pdf',
  },
  {
    id: 'citizenship-test',
    year: '2019–22',
    owner: 'Januariavtalet',
    title: 'Språk- och samhällskunskapskrav',
    verdict: 'Inte genomfört under mandatperioden',
    verdictTone: 'no',
    detail: 'En statlig utredning presenterades, men kravet infördes inte före mandatperiodens slut.',
    distinction: 'Att utreda är inte samma sak som att införa — om löftet uttryckligen gällde ett införande.',
    stages: ['partial', 'no', 'unknown'],
    source: 'SOU 2021:2',
    sourceUrl: 'https://www.regeringen.se/rattsliga-dokument/statens-offentliga-utredningar/2021/01/sou-20212/',
  },
  {
    id: 'anonymous-witnesses',
    year: '2022–25',
    owner: 'Tidöavtalet',
    title: 'Inför anonyma vittnen',
    verdict: 'Politiskt outputlöfte uppfyllt',
    verdictTone: 'done',
    detail: 'Lagen trädde i kraft den 1 januari 2025.',
    distinction: 'Effekten på tystnadskultur, vittnesvilja och uppklaring är ännu inte visad.',
    stages: ['done', 'done', 'unknown'],
    source: 'SFS 2024:1180',
    sourceUrl: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-20241180-om-anonyma-vittnen-i-brottmal_sfs-2024-1180/',
  },
  {
    id: 'electricity-support',
    year: '2022–23',
    owner: 'M/KD/SD/L',
    title: 'Elstöd senast 1 november 2022',
    verdict: 'Försenat · delvis uppfyllt',
    verdictTone: 'partial',
    detail: 'Utbetalningarna började den 20 februari 2023.',
    distinction: 'När ett löfte har en uttrycklig tidsfrist är senare leverans inte reservationslöst helt uppfylld.',
    stages: ['done', 'partial', 'unknown'],
    source: 'Riksdagens granskning',
    sourceUrl: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/granskningsbetankande_ha01ku20/html/',
  },
];

const formatNumber = (value: number, digits = 1) =>
  value.toLocaleString('sv-SE', { maximumFractionDigits: digits, minimumFractionDigits: digits });

const MIN_CORRELATION_POINTS = 10;

const valueLabel = (item: LabSeries, value: number, mode: AnalysisMode = 'level') => {
  const unit = mode === 'change' && item.unit.startsWith('procent')
    ? 'procentenheter/år'
    : mode === 'change' && item.unit.startsWith('KPI-index')
      ? 'indexpunkter/år'
      : mode === 'change'
        ? item.unit + '/år'
        : item.unit;
  if (item.unit === 'personer' || item.unit === 'offer' || item.unit.startsWith('kr/')) {
    return Math.round(value).toLocaleString('sv-SE') + ' ' + unit;
  }
  return formatNumber(value, Math.abs(value) < 10 ? 2 : 1) + ' ' + unit;
};

const commonPairs = (
  left: LabSeries,
  right: LabSeries,
  start: number,
  end: number,
  mode: AnalysisMode,
  lag: number,
) => {
  const rightByYear = new Map(right.points.map((point) => [point.year, point.value]));
  const levelPairs = left.points
    .filter((point) => {
      const rightYear = point.year + lag;
      return point.year >= start && point.year <= end && rightYear >= start && rightYear <= end && rightByYear.has(rightYear);
    })
    .map((point) => {
      const rightYear = point.year + lag;
      return { year: point.year, rightYear, x: point.value, y: rightByYear.get(rightYear) as number };
    });
  if (mode === 'level') return levelPairs;
  return levelPairs.slice(1).flatMap((pair, index) => {
    const previous = levelPairs[index];
    const yearGap = pair.year - previous.year;
    return yearGap > 0 ? [{
      year: pair.year,
      rightYear: pair.rightYear,
      x: (pair.x - previous.x) / yearGap,
      y: (pair.y - previous.y) / yearGap,
    }] : [];
  });
};

const pearson = (values: { x: number; y: number }[]): number | null => {
  if (values.length < 2) return null;
  const meanX = values.reduce((sum, value) => sum + value.x, 0) / values.length;
  const meanY = values.reduce((sum, value) => sum + value.y, 0) / values.length;
  const covariance = values.reduce((sum, value) => sum + (value.x - meanX) * (value.y - meanY), 0);
  const varianceX = values.reduce((sum, value) => sum + Math.pow(value.x - meanX, 2), 0);
  const varianceY = values.reduce((sum, value) => sum + Math.pow(value.y - meanY, 2), 0);
  const denominator = Math.sqrt(varianceX * varianceY);
  return denominator > Number.EPSILON ? covariance / denominator : null;
};

const ranks = (values: number[]) => {
  const sorted = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const result = Array(values.length).fill(0) as number[];
  let index = 0;
  while (index < sorted.length) {
    let end = index;
    while (end + 1 < sorted.length && sorted[end + 1].value === sorted[index].value) end += 1;
    const averageRank = (index + end + 2) / 2;
    for (let cursor = index; cursor <= end; cursor += 1) result[sorted[cursor].index] = averageRank;
    index = end + 1;
  }
  return result;
};

const spearman = (values: { x: number; y: number }[]): number | null => {
  if (values.length < 2) return null;
  const xRanks = ranks(values.map((value) => value.x));
  const yRanks = ranks(values.map((value) => value.y));
  return pearson(xRanks.map((x, index) => ({ x, y: yRanks[index] })));
};

const formatCorrelation = (value: number | null) =>
  value === null ? '—' : formatNumber(Math.abs(value) < .005 ? 0 : value, 2);

const strengthLabel = (value: number) => {
  const absolute = Math.abs(value);
  if (absolute < .05) return 'Inget tydligt linjärt samband';
  return value > 0 ? 'Positivt linjärt samband' : 'Negativt linjärt samband';
};

function LabMiniChart({ item }: { item: LabSeries }) {
  const width = 150;
  const height = 45;
  const values = item.points.map((point) => point.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const spread = maximum - minimum || 1;
  const points = item.points.map((point, index) => {
    const x = (index / Math.max(item.points.length - 1, 1)) * width;
    const y = height - 3 - ((point.value - minimum) / spread) * (height - 7);
    return x + ',' + y;
  }).join(' ');
  return (
    <svg className="lab-mini-chart" viewBox={'0 0 ' + width + ' ' + height} aria-hidden="true">
      <polyline points={points} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ElectionAgenda() {
  return (
    <section className="agenda-section" aria-labelledby="agenda-heading">
      <div className="agenda-intro">
        <p className="section-kicker">Väljarnas agenda 2026</p>
        <h2 id="agenda-heading">Det här vill väljarna ha svar på.</h2>
        <p>Andel som angav frågan som en av de viktigaste. Flera svar var möjliga, så staplarna ska inte summera till 100.</p>
        <a href="https://www.svt.se/nyheter/inrikes/lag-och-ordning-och-forsvar-allt-viktigare-for-valjarna" target="_blank" rel="noreferrer">SVT/Verian · januari 2026 ↗</a>
      </div>
      <div className="agenda-list">
        {electionAgenda.map((item) => {
          const statusLabel = item.status === 'available' ? 'Data finns' : item.status === 'partial' ? 'Delvis täckt' : 'Planerad';
          const content = (
            <>
            <span>{String(item.rank).padStart(2, '0')}</span>
            <strong>{item.label}<small data-status={item.status}>{statusLabel}</small></strong>
            <div><i style={{ width: item.value + '%' }} /></div>
            <b>{item.value} %</b>
            </>
          );
          return item.href ? (
            <a className="agenda-row" href={item.href} key={item.label}>{content}</a>
          ) : (
            <div className="agenda-row is-planned" key={item.label} aria-label={`${item.label}, ${item.value} procent, statistik planerad`}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

export function DataStudio() {
  const [leftId, setLeftId] = useState('policyRate');
  const [rightId, setRightId] = useState('interestRatio');
  const [startYear, setStartYear] = useState(defaultStartYear);
  const [endYear, setEndYear] = useState(labMaxYear);
  const [mode, setMode] = useState<AnalysisMode>('change');
  const [lag, setLag] = useState(0);
  const [view, setView] = useState<'timeline' | 'scatter'>('timeline');
  const [showEvents, setShowEvents] = useState(false);
  const [activeEventId, setActiveEventId] = useState('covid');
  const [urlReady, setUrlReady] = useState(false);
  const [copiedSignature, setCopiedSignature] = useState('');
  const [copyFailedSignature, setCopyFailedSignature] = useState('');

  const left = seriesById[leftId];
  const right = seriesById[rightId];
  const hasPair = (firstId: string, secondId: string) =>
    (leftId === firstId && rightId === secondId) || (leftId === secondId && rightId === firstId);
  const definitionWarning = seriesRelationships.find(({ ids }) =>
    (leftId === ids[0] && rightId === ids[1]) || (leftId === ids[1] && rightId === ids[0]))?.warning ?? null;
  const pairs = useMemo(
    () => commonPairs(left, right, startYear, endYear, mode, lag),
    [left, right, startYear, endYear, mode, lag],
  );
  const pearsonValue = pearson(pairs);
  const spearmanValue = spearman(pairs);
  const hasEnoughData = pairs.length >= MIN_CORRELATION_POINTS;
  const canEstimate = hasEnoughData && pearsonValue !== null && spearmanValue !== null;
  const correlationStatus = !hasEnoughData
    ? `Minst ${MIN_CORRELATION_POINTS} observationspar krävs`
    : pearsonValue === null
      ? 'Kan inte beräknas – minst en serie saknar variation'
      : `${strengthLabel(pearsonValue)} i valt urval`;
  const width = 900;
  const height = 350;
  const padLeft = 52;
  const padRight = 24;
  const padTop = 45;
  const padBottom = 43;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const minYear = pairs.length ? pairs[0].year : startYear;
  const maxYear = pairs.length ? pairs[pairs.length - 1].year : endYear;
  const eventsEligible = lag === 0 && view === 'timeline';
  const hasObservationGaps = mode === 'change' && [left, right].some((item) =>
    item.points.some((point, index) => index > 0
      && item.points[index - 1].year >= startYear
      && point.year <= endYear
      && point.year - item.points[index - 1].year > 1),
  );
  const chartEvents = worldEvents.filter((event) =>
    event.year >= minYear
    && event.year <= maxYear
    && (event.relevantSeries.includes(leftId) || event.relevantSeries.includes(rightId)),
  );
  const activeEvent = chartEvents.find((event) => event.id === activeEventId) || chartEvents[0] || worldEvents[0];
  const analysisSignature = [leftId, rightId, startYear, endYear, mode, lag, view, showEvents ? 1 : 0, showEvents ? activeEvent.id : ''].join('|');
  const linkCopied = copiedSignature === analysisSignature;
  const copyFailed = copyFailedSignature === analysisSignature;
  const xForYear = (year: number) => padLeft + ((year - minYear) / Math.max(maxYear - minYear, 1)) * plotWidth;
  const leftValues = pairs.map((pair) => pair.x);
  const rightValues = pairs.map((pair) => pair.y);
  const leftMin = leftValues.length ? Math.min(...leftValues) : 0;
  const leftMax = leftValues.length ? Math.max(...leftValues) : 1;
  const rightMin = rightValues.length ? Math.min(...rightValues) : 0;
  const rightMax = rightValues.length ? Math.max(...rightValues) : 1;
  const normalize = (value: number, minimum: number, maximum: number) =>
    ((value - minimum) / Math.max(maximum - minimum, Number.EPSILON)) * 100;
  const yForNormalized = (value: number) => padTop + ((100 - value) / 100) * plotHeight;
  const leftLine = pairs.map((pair) => xForYear(pair.year) + ',' + yForNormalized(normalize(pair.x, leftMin, leftMax))).join(' ');
  const rightLine = pairs.map((pair) => xForYear(pair.year) + ',' + yForNormalized(normalize(pair.y, rightMin, rightMax))).join(' ');

  const scatterX = (value: number) => padLeft + normalize(value, leftMin, leftMax) / 100 * plotWidth;
  const scatterY = (value: number) => padTop + (100 - normalize(value, rightMin, rightMax)) / 100 * plotHeight;
  const meanX = pairs.length ? leftValues.reduce((sum, value) => sum + value, 0) / pairs.length : 0;
  const meanY = pairs.length ? rightValues.reduce((sum, value) => sum + value, 0) / pairs.length : 0;
  const varianceX = pairs.reduce((sum, pair) => sum + Math.pow(pair.x - meanX, 2), 0);
  const covariance = pairs.reduce((sum, pair) => sum + (pair.x - meanX) * (pair.y - meanY), 0);
  const slope = varianceX ? covariance / varianceX : 0;
  const intercept = meanY - slope * meanX;
  const regressionStart = intercept + slope * leftMin;
  const regressionEnd = intercept + slope * leftMax;
  const clampToRightRange = (value: number) => Math.max(rightMin, Math.min(rightMax, value));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLeft = params.get('seriesA');
    const nextLeft = requestedLeft && seriesById[requestedLeft] ? requestedLeft : 'policyRate';
    const requestedRight = params.get('seriesB');
    const nextRight = requestedRight && seriesById[requestedRight] && requestedRight !== nextLeft
      ? requestedRight
      : nextLeft === 'interestRatio' ? 'policyRate' : 'interestRatio';
    const readYear = (name: string, fallback: number) => {
      const raw = params.get(name);
      const parsed = raw === null ? fallback : Number(raw);
      return Number.isInteger(parsed) ? Math.min(labMaxYear, Math.max(labMinYear, parsed)) : fallback;
    };
    const requestedFrom = readYear('from', defaultStartYear);
    const requestedTo = readYear('to', labMaxYear);
    const requestedLag = Number(params.get('lag'));
    const nextLag = Number.isInteger(requestedLag) ? Math.min(5, Math.max(-5, requestedLag)) : 0;
    const nextView = params.get('view') === 'scatter' ? 'scatter' : 'timeline';

    // URL-parametrarna kan endast läsas efter montering; uppdateringarna batchas av React.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeftId(nextLeft);
    setRightId(nextRight);
    setStartYear(Math.min(requestedFrom, requestedTo));
    setEndYear(Math.max(requestedFrom, requestedTo));
    setMode(params.get('measure') === 'level' ? 'level' : 'change');
    setLag(nextLag);
    setView(nextView);
    setShowEvents(params.get('events') === '1' && nextLag === 0 && nextView === 'timeline');
    const requestedEvent = params.get('event');
    if (requestedEvent && worldEvents.some((item) => item.id === requestedEvent)) setActiveEventId(requestedEvent);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const currentUrl = new URL(window.location.href);
    const hasAnalysisParams = currentUrl.searchParams.has('seriesA');
    const isDefaultView = leftId === 'policyRate' && rightId === 'interestRatio' && startYear === defaultStartYear && endYear === labMaxYear && mode === 'change' && lag === 0 && view === 'timeline' && !showEvents;
    if (!hasAnalysisParams && isDefaultView) return;
    const url = buildAnalysisUrl(window.location.origin, { leftId, rightId, startYear, endYear, mode, lag, view, showEvents, eventId: activeEvent.id });
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [urlReady, leftId, rightId, startYear, endYear, mode, lag, view, showEvents, activeEvent.id]);

  const shareAnalysis = async () => {
    const url = buildAnalysisUrl(window.location.origin, { leftId, rightId, startYear, endYear, mode, lag, view, showEvents, eventId: activeEvent.id });
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    const shareUrl = new URL(url);
    shareUrl.searchParams.set('utm_source', 'delning');
    shareUrl.searchParams.set('utm_medium', 'referral');
    shareUrl.searchParams.set('utm_campaign', 'valet_2026');
    shareUrl.searchParams.set('utm_content', `${leftId}-${rightId}`);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${left.shortLabel} jämfört med ${right.shortLabel}`,
          text: `Sverigefacit: ${mode === 'change' ? 'årlig förändring' : 'nivåer'}, ${pairs.length} observationspar. Samvariation är inte bevisad effekt.`,
          url: shareUrl.toString(),
        });
        setCopiedSignature(analysisSignature);
        setCopyFailedSignature('');
        track('share', { method: 'native', content_type: 'data_analysis' });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      setCopiedSignature(analysisSignature);
      setCopyFailedSignature('');
      track('share', { method: 'copy_link', content_type: 'data_analysis' });
    } catch {
      setCopiedSignature('');
      setCopyFailedSignature(analysisSignature);
    }
  };

  const presets = [
    { label: 'Inflation ↔ reallön', left: 'inflation', right: 'realWageGrowth', mode: 'level' as AnalysisMode },
    { label: 'Styrränta ↔ räntebörda', left: 'policyRate', right: 'interestRatio', mode: 'change' as AnalysisMode },
    { label: 'Otrygghet ↔ dödligt våld', left: 'insecurity', right: 'deadlyViolence', mode: 'change' as AnalysisMode },
    { label: 'Bensinpris ↔ transportutsläpp', left: 'fuel', right: 'transportEmissions', mode: 'change' as AnalysisMode },
    { label: 'Territoriella ↔ konsumtionsutsläpp', left: 'emissions', right: 'consumptionEmissions', mode: 'change' as AnalysisMode },
  ];
  const renderSeriesOptions = (disabledId: string) => seriesGroupOrder.map((group) => (
    <optgroup label={group} key={group}>
      {labSeries
        .filter((item) => item.group === group)
        .map((item) => <option key={item.id} value={item.id} disabled={item.id === disabledId}>{item.label}</option>)}
    </optgroup>
  ));

  return (
    <section className="lab-section" id="datastudio">
      <div className="lab-heading lab-heading-compact">
        <div>
          <h1>Jämför två tidsserier</h1>
        </div>
        <p>{labSeries.length} tidsserier med originalkälla i sju ämnesgrupper. Välj mått, period och visning. Diagrammet visar samband i valda år, inte orsak.</p>
      </div>

      <div className="lab-presets" role="group" aria-label="Färdiga jämförelser">
        {presets.map((preset) => (
          <button
            type="button"
            key={preset.label}
            className={leftId === preset.left && rightId === preset.right && mode === preset.mode && startYear === defaultStartYear && endYear === labMaxYear && lag === 0 && view === 'timeline' && !showEvents ? 'active' : ''}
            aria-pressed={leftId === preset.left && rightId === preset.right && mode === preset.mode && startYear === defaultStartYear && endYear === labMaxYear && lag === 0 && view === 'timeline' && !showEvents}
            onClick={() => {
              setLeftId(preset.left);
              setRightId(preset.right);
              setStartYear(defaultStartYear);
              setEndYear(labMaxYear);
              setMode(preset.mode);
              setLag(0);
              setView('timeline');
              setShowEvents(false);
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {definitionWarning && (
        <div className="lab-specific-warning"><strong>Matematiskt kopplade mått:</strong> {definitionWarning}</div>
      )}

      {hasPair('immigration', 'deadlyViolence') && (
        <div className="lab-specific-warning"><strong>Viktigt om denna jämförelse:</strong> Invandringsserien avser alla registrerade inflyttningar och våldsserien allt konstaterat dödligt våld. Den innehåller ingen uppgift om gärningspersoners bakgrund och kan inte mäta en effekt av invandring.</div>
      )}

      <div className="lab-controls">
        <label>
          <span>Serie A</span>
          <select value={leftId} onChange={(event) => setLeftId(event.target.value)}>
            {renderSeriesOptions(rightId)}
          </select>
          <i style={{ background: left.color }} />
        </label>
        <span className="lab-versus">×</span>
        <label>
          <span>Serie B</span>
          <select value={rightId} onChange={(event) => setRightId(event.target.value)}>
            {renderSeriesOptions(leftId)}
          </select>
          <i style={{ background: right.color }} />
        </label>
      </div>

      <details className="lab-advanced-controls">
        <summary><span>Fler inställningar</span><small>Period · visning · tidsförskjutning</small><i>+</i></summary>
        <div className="year-controls">
          <label><span>Från</span><select value={startYear} onChange={(event) => setStartYear(Math.min(Number(event.target.value), endYear))}>{labYears.map((year) => <option key={year}>{year}</option>)}</select></label>
          <label><span>Till</span><select value={endYear} onChange={(event) => setEndYear(Math.max(Number(event.target.value), startYear))}>{labYears.map((year) => <option key={year}>{year}</option>)}</select></label>
          <label><span>Visning</span><select value={mode} onChange={(event) => setMode(event.target.value as AnalysisMode)}><option value="level">Nivåer</option><option value="change">Årlig förändring</option></select></label>
          <label><span>Tidsförskjutning</span><select value={lag} onChange={(event) => {
            const nextLag = Number(event.target.value);
            setLag(nextLag);
            if (nextLag !== 0) setShowEvents(false);
          }}>{Array.from({ length: 11 }, (_, index) => index - 5).map((value) => <option value={value} key={value}>{value === 0 ? 'Samma år' : `B ${Math.abs(value)} år ${value > 0 ? 'efter' : 'före'} A`}</option>)}</select></label>
        </div>
      </details>

      <div className="lab-workspace">
        <div className="lab-chart-panel">
          <div className="lab-chart-toolbar">
            <div role="group" aria-label="Välj diagramtyp">
              <button type="button" className={view === 'timeline' ? 'active' : ''} aria-pressed={view === 'timeline'} onClick={() => setView('timeline')}>Utveckling</button>
              <button type="button" className={view === 'scatter' ? 'active' : ''} aria-pressed={view === 'scatter'} onClick={() => {
                setView('scatter');
                setShowEvents(false);
              }}>Punktdiagram</button>
            </div>
            <div className="lab-toolbar-actions">
              <label className="event-toggle">
                <input type="checkbox" checked={showEvents} disabled={!eventsEligible} onChange={(event) => setShowEvents(event.target.checked)} />
                <span /> {eventsEligible ? 'Visa relevanta händelser' : 'Händelser kräver samma år och tidslinje'}
              </label>
              <button type="button" className="lab-share-button" onClick={shareAnalysis} aria-live="polite">{linkCopied ? 'Klart ✓' : copyFailed ? 'Kunde inte dela – försök igen' : 'Dela diagram'}</button>
            </div>
          </div>

          <p className="chart-scroll-hint" aria-hidden="true">Diagrammet börjar med äldsta år · svep för senare år →</p>
          <div className="lab-chart-scroll" tabIndex={0} role="region" aria-label={`Diagram: ${left.label} jämfört med ${right.label}`}>
            <div className="lab-chart-stage">
              {pairs.length >= 2 ? (
                <svg className="lab-chart" viewBox={'0 0 ' + width + ' ' + height} role="img" aria-label={left.label + ' jämfört med ' + right.label}>
                  {[0, 25, 50, 75, 100].map((tick) => (
                    <g key={tick}>
                      <line x1={padLeft} x2={width - padRight} y1={yForNormalized(tick)} y2={yForNormalized(tick)} className="lab-grid-line" />
                      {view === 'timeline' && <text x={padLeft - 10} y={yForNormalized(tick) + 4} textAnchor="end" className="lab-axis-label">{tick}</text>}
                    </g>
                  ))}
                  {view === 'timeline' ? (
                    <>
                      {showEvents && eventsEligible && chartEvents.map((event, index) => {
                        const eventX = xForYear(event.year);
                        return (
                          <g key={event.id}>
                            <line x1={eventX} x2={eventX} y1={padTop} y2={height - padBottom} className="world-event-line" />
                            <circle cx={eventX} cy={padTop - 16} r="10" className="world-event-dot" />
                            <text x={eventX} y={padTop - 12.5} textAnchor="middle" className="world-event-number">{index + 1}</text>
                          </g>
                        );
                      })}
                      <polyline points={leftLine} fill="none" stroke={left.color} className="lab-series-line" />
                      <polyline points={rightLine} fill="none" stroke={right.color} className="lab-series-line second" />
                      {pairs.map((pair) => (
                        <g key={pair.year}>
                          <circle cx={xForYear(pair.year)} cy={yForNormalized(normalize(pair.x, leftMin, leftMax))} r="3.3" fill="#fff" stroke={left.color} strokeWidth="2"><title>{`${pair.year}: ${valueLabel(left, pair.x, mode)}`}</title></circle>
                          <circle cx={xForYear(pair.year)} cy={yForNormalized(normalize(pair.y, rightMin, rightMax))} r="3.3" fill="#fff" stroke={right.color} strokeWidth="2"><title>{`${pair.rightYear}: ${valueLabel(right, pair.y, mode)}`}</title></circle>
                        </g>
                      ))}
                      {[minYear, Math.round((minYear + maxYear) / 2), maxYear].map((year) => <text key={year} x={xForYear(year)} y={height - 17} textAnchor="middle" className="lab-axis-label">{year}</text>)}
                    </>
                  ) : (
                    <>
                      {canEstimate && <line x1={scatterX(leftMin)} y1={scatterY(clampToRightRange(regressionStart))} x2={scatterX(leftMax)} y2={scatterY(clampToRightRange(regressionEnd))} className="regression-line" />}
                      {pairs.map((pair) => (
                        <circle key={pair.year} cx={scatterX(pair.x)} cy={scatterY(pair.y)} r="5" fill={left.color} opacity=".7" stroke="#fff" strokeWidth="1.5">
                          <title>{`${pair.year}: ${valueLabel(left, pair.x, mode)} · ${pair.rightYear}: ${valueLabel(right, pair.y, mode)}`}</title>
                        </circle>
                      ))}
                      <text x={padLeft} y={height - 15} className="lab-axis-label">{left.shortLabel} →</text>
                      <text x={15} y={padTop} className="lab-axis-label">{right.shortLabel}</text>
                    </>
                  )}
                </svg>
              ) : (
                <div className="lab-no-overlap">Serierna har färre än två observationspar i intervallet. Välj en bredare period eller kortare tidsförskjutning.</div>
              )}
            </div>
          </div>

          <div className="lab-legend">
            <span><i style={{ background: left.color }} /> {left.shortLabel}</span>
            <span><i style={{ background: right.color }} /> {right.shortLabel}</span>
            {view === 'timeline' && <small>Varje serie normaliseras separat till 0–100 inom vald period. Linjernas höjd och avstånd kan inte jämföras i originalenheter.</small>}
          </div>

          <details className="lab-data-table">
            <summary>Visa observationsparen som tabell <span>+</span></summary>
            <div tabIndex={0} role="region" aria-label="Datatabell för vald jämförelse">
              <table>
                <thead><tr><th scope="col">År A</th><th scope="col">{left.shortLabel}</th><th scope="col">År B</th><th scope="col">{right.shortLabel}</th></tr></thead>
                <tbody>{pairs.map((pair) => <tr key={`${pair.year}-${pair.rightYear}`}><th scope="row">{pair.year}</th><td>{valueLabel(left, pair.x, mode)}</td><td>{pair.rightYear}</td><td>{valueLabel(right, pair.y, mode)}</td></tr>)}</tbody>
              </table>
            </div>
          </details>

          {showEvents && eventsEligible && chartEvents.length > 0 && (
            <div className="world-event-row">
              {chartEvents.map((event, index) => (
                <button type="button" key={event.id} className={activeEvent.id === event.id ? 'active' : ''} aria-pressed={activeEvent.id === event.id} onClick={() => setActiveEventId(event.id)}>
                  <span>{index + 1}</span>{event.year} · {event.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="lab-result-panel">
          <span className="lab-result-kicker">Samband i valda år · {mode === 'level' ? 'nivåer' : 'årlig förändring'}</span>
          <div className="correlation-number">
            <strong>{canEstimate ? formatCorrelation(pearsonValue) : '—'}</strong>
            <span>Pearson r</span>
          </div>
          <p className="correlation-strength">{correlationStatus}</p>
          {hasEnoughData && pairs.length < 15 && <p className="correlation-sample-warning">Få observationspar — koefficienten är känslig för enskilda år.</p>}
          {hasObservationGaps && <p className="correlation-sample-warning">Minst en serie saknar vissa år. Båda seriernas förändring räknas då per år över samma gemensamma observationsintervall; mellanår fylls inte i.</p>}
          <div className="correlation-meta">
            <div><span>Spearman ρ</span><strong>{canEstimate ? formatCorrelation(spearmanValue) : '—'}</strong></div>
            <div><span>Observationspar</span><strong>{pairs.length}</strong></div>
            <div><span>Intervall</span><strong>{pairs.length ? pairs[0].year + '–' + pairs[pairs.length - 1].year : '—'}</strong></div>
            <div><span>Förskjutning</span><strong>{lag === 0 ? 'Samma år' : `B ${Math.abs(lag)} år ${lag > 0 ? 'efter' : 'före'}`}</strong></div>
          </div>
          <div className="correlation-warning">
            <strong>Samvariation — inte effekt.</strong>
          </div>
          <details className="correlation-explanation">
            <summary>Så tolkar du resultatet <span>+</span></summary>
            <p>Pearson mäter linjäritet. Spearman mäter om rangordningen rör sig åt samma håll. Inget av måtten kontrollerar tredje faktorer.</p>
            <p>r gäller bara de valda åren. Gemensam trend, en tredje faktor, omvänd riktning eller periodval kan ge ett högt värde. Årlig förändring minskar trendrisken men bevisar inte orsak. Vid glapp jämförs samma observationsintervall utan att mellanår fylls i. Använd resultatet som en fråga att undersöka vidare, inte som ett bevis.</p>
          </details>
          {showEvents && eventsEligible && chartEvents.length > 0 && (
            <div className="event-reading">
              <span>Vald händelse · {activeEvent.year}</span>
              <strong>{activeEvent.label}</strong>
              <p>{activeEvent.detail}</p>
              <a href={activeEvent.sourceUrl} target="_blank" rel="noreferrer">Källa ↗</a>
            </div>
          )}
        </aside>
      </div>

      <footer className="lab-sources">
        <a href={left.sourceUrl} target="_blank" rel="noreferrer"><i style={{ background: left.color }} />{left.source} ↗</a>
        {left.secondarySource && left.secondarySourceUrl && <a href={left.secondarySourceUrl} target="_blank" rel="noreferrer"><i style={{ background: left.color }} />{left.secondarySource} ↗</a>}
        <a href={right.sourceUrl} target="_blank" rel="noreferrer"><i style={{ background: right.color }} />{right.source} ↗</a>
        {right.secondarySource && right.secondarySourceUrl && <a href={right.secondarySourceUrl} target="_blank" rel="noreferrer"><i style={{ background: right.color }} />{right.secondarySource} ↗</a>}
        <details>
          <summary>Källornas begränsningar <span>+</span></summary>
          <p><strong>Serie A:</strong> {left.caveat} <strong>Serie B:</strong> {right.caveat}</p>
          <p><strong>Versionsatt underlag:</strong> Serie A omfattar {left.provenance.firstYear}–{left.provenance.latestYear} ({left.provenance.observationCount} observationer). Serie B omfattar {right.provenance.firstYear}–{right.provenance.latestYear} ({right.provenance.observationCount} observationer). Värdena ligger i Sverigefacits granskbara datakatalog och ändras först efter en kontrollerad uppdatering.</p>
          <a href="/data/series.json" target="_blank" rel="noreferrer">Öppna hela datakatalogen som JSON ↗</a>
        </details>
      </footer>
    </section>
  );
}

export function CrimeMigrationEvidence() {
  const [mode, setMode] = useState<'absolute' | 'risk'>('absolute');
  const maximum = mode === 'absolute' ? 11 : 3.5;

  return (
    <section className="crime-evidence-section" id="brott-migration">
      <div className="crime-evidence-heading">
        <div>
          <p className="section-kicker">Registrerad misstanke i Brås historiska kohort</p>
          <h2>Vad visar registerstudien?</h2>
        </div>
        <p>Brås registerstudie visar gruppskillnader i registrerad misstanke. När Brå standardiserar för ålder, kön, inkomst, utbildning och kommuntyp minskar skillnaden — men studien kan inte visa varför den finns.</p>
      </div>

      <CrimeOriginExplorer />

      <div className="crime-study-note">
        <span>Historisk kohort</span>
        <strong>8 066 363 folkbokförda personer, 15+ år</strong>
        <p>Population: folkbokförda den 31 december 2014 · utfall: minst skäligen misstänkt för minst ett brott begånget 2015–2018.</p>
      </div>

      <div className="crime-evidence-grid">
        <article className="crime-risk-card">
          <div className="crime-card-toolbar">
            <div>
              <span>Observerad andel och standardiserat jämförelsemått</span>
              <h3>{mode === 'absolute' ? 'Andel registrerad som misstänkt minst en gång 2015–2018' : 'Överrisk att registreras som misstänkt'}</h3>
            </div>
            <div role="group" aria-label="Välj mått">
              <button type="button" className={mode === 'absolute' ? 'active' : ''} aria-pressed={mode === 'absolute'} onClick={() => setMode('absolute')}>Absolut andel</button>
              <button type="button" className={mode === 'risk' ? 'active' : ''} aria-pressed={mode === 'risk'} onClick={() => setMode('risk')}>Överrisk</button>
            </div>
          </div>
          <div className="risk-legend">
            <span><i className="raw-dot" /> Observerat utfall</span>
            <span><i className="adjusted-dot" /> Standardiserat</span>
          </div>
          <div className="risk-bars">
            {crimeGroups.map((group) => {
              const raw = mode === 'absolute' ? group.rawPct : group.rawRR;
              const adjusted = mode === 'absolute' ? group.adjustedPct : group.adjustedRR;
              return (
                <div className="risk-row" key={group.label}>
                  <div className="risk-row-label">
                    <strong>{group.short}</strong>
                    <span>N {group.n.toLocaleString('sv-SE')}</span>
                  </div>
                  <div className="risk-track">
                    <i className="risk-raw-bar" style={{ width: Math.min((raw / maximum) * 100, 100) + '%' }} />
                    <i className="risk-adjusted-marker" style={{ left: Math.min((adjusted / maximum) * 100, 100) + '%' }} />
                  </div>
                  <div className="risk-values">
                    <strong>{formatNumber(raw, 2)}{mode === 'absolute' ? ' %' : '×'}</strong>
                    <span>{formatNumber(adjusted, 2)}{mode === 'absolute' ? ' %' : '×'} standardiserat</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="standardization-note">Brås publicerade jämförelsemått är standardiserade för ålder, kön, disponibel inkomst, utbildning och kommuntyp. Den standardiserade andelen är inte den observerade andelen och inte en kausal effekt. Överriskerna bygger på oavrundade underlag och kan därför avvika 0,01 från kvoten av visade procenttal.</p>
        </article>

        <aside className="crime-reading-card">
          <span className="evidence-chip">Officiellt registerutfall</span>
          <h3>Vad visar tabellen?</h3>
          <p>I den historiska kohorten registrerades 8,0 procent av utrikesfödda som minst skäligen misstänkta, jämfört med 3,2 procent i referensgruppen.</p>
          <div className="crime-big-shift">
            <div><span>Rå relativ skillnad</span><strong>2,51×</strong></div>
            <b>→</b>
            <div><span>Efter standardisering</span><strong>1,77×</strong></div>
          </div>
          <p>Associationen minskar men försvinner inte. Det kvarvarande sambandet är inte en skattning av en “migrationseffekt”.</p>
          <ul>
            <li><i /> Misstänkt är inte dömd.</li>
            <li><i /> Registrerad misstanke påverkas av anmälan, upptäckt och utredning.</li>
            <li><i /> Födelseland är inte etnicitet, religion eller kultur.</li>
            <li><i /> Gruppgenomsnitt säger inget om en enskild person.</li>
          </ul>
          <a href="https://bra.se/rapporter/arkiv/2021-08-25-misstankta-for-brott-bland-personer-med-inrikes-respektive-utrikes-bakgrund" target="_blank" rel="noreferrer">Brå 2021:9 ↗</a>
        </aside>
      </div>

      <div className="victimization-note">
        <div>
          <span>Kompletterande statistik</span>
          <h3>Brå har också studerat utsatthet för brott</h3>
        </div>
        <p>Brås NTU-analys 2017–2023 visar också högre självrapporterad utsatthet för bland annat misshandel och hot bland flera grupper med utländsk bakgrund. Definitionen är bredare än i registerstudien, så nivåerna kan inte slås ihop direkt.</p>
        <a href="https://bra.se/rapporter/arkiv/2024-05-21-utsatthet-for-brott-bland-personer-med-utlandsk-bakgrund" target="_blank" rel="noreferrer">Brå 2/2024 ↗</a>
      </div>
    </section>
  );
}

const welfareCards = [
  {
    id: 'economicStandard',
    kicker: 'Hushållens köpkraft',
    value: '324,9 tkr',
    trend: '+1,8 % under 2024 · fortfarande −1,9 % mot 2021',
    note: 'Median disponibel inkomst per konsumtionsenhet, realt.',
  },
  {
    id: 'foodPrices',
    kicker: 'Matpriser',
    value: '+32 %',
    trend: 'prisnivå 2021–2025 · +4,3 % bara under 2025',
    note: 'Prisnivå, inte inflationstakt.',
  },
  {
    id: 'realPension',
    kicker: 'Allmän pension',
    value: '15 713 kr',
    trend: 'realt per månad 2023 · cirka −4 % på ett år',
    note: 'Genomsnitt före skatt, 2023 års priser.',
  },
  {
    id: 'homeCare',
    kicker: 'Hemtjänst 65+',
    value: '10,22 %',
    trend: 'från 11,33 % år 2014 · antalet mottagare ökade ändå',
    note: 'Tydligt exempel på nämnareffekt.',
  },
  {
    id: 'specialHousing',
    kicker: 'Särskilt boende 65+',
    value: '5,11 %',
    trend: 'från 5,73 % år 2014 · antalet boende ökade 4,6 %',
    note: 'Andel är inte samma sak som kapacitet eller behov.',
  },
  {
    id: 'interestRatio',
    kicker: 'Hushållens räntebörda',
    value: '5,5 %',
    trend: 'Q4 2025 · topp 7,5 % år 2023',
    note: 'Aggregat för alla hushåll, inte ett typiskt bolån.',
  },
];

export function WelfarePulse() {
  return (
    <section className="welfare-section" id="valfragor">
      <div className="welfare-heading">
        <div>
          <p className="section-kicker">Nya valfrågor · hushåll & välfärd</p>
          <h2>En siffra räcker sällan.</h2>
        </div>
        <p>Här visas nivå, förändring och rätt nämnare tillsammans. Vårdköer lämnas tills vidare utanför eftersom uppföljningsmodellen ändrades 2021 och rapporteringen fortfarande har brott.</p>
      </div>
      <div className="welfare-grid">
        {welfareCards.map((card, index) => {
          const item = seriesById[card.id];
          return (
            <article key={card.id} style={{ '--card-color': item.color } as CSSProperties}>
              <span className="welfare-index">{String(index + 1).padStart(2, '0')}</span>
              <p>{card.kicker}</p>
              <strong>{card.value}</strong>
              <small>{card.trend}</small>
              <LabMiniChart item={item} />
              <footer>
                <span>{card.note}</span>
                <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.source} ↗</a>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PromiseTracker() {
  const [selectedId, setSelectedId] = useState(promiseItems[0].id);
  const selected = promiseItems.find((item) => item.id === selectedId) || promiseItems[0];
  const stageLabels = ['Beslut', 'Genomförande', 'Samhällseffekt'];

  return (
    <section className="promise-tracker-section" id="valloften">
      <div className="tracker-heading">
        <div>
          <p className="section-kicker">Vallöfteslabbet</p>
          <h2>Räkna rätt innan<br />{' '}vi räknar procent.</h2>
        </div>
        <div className="historic-benchmark">
          <span>Historisk forskningsjämförelse</span>
          <strong>78 % <i>218 av 279</i></strong>
          <p>helt uppfyllda löften i Alliansens gemensamma valmanifest 2010. Det är inte ett aktuellt regeringsbetyg.</p>
          <a href="https://academic.oup.com/pa/article/73/3/477/5368143" target="_blank" rel="noreferrer">Lindvall m.fl. ↗</a>
        </div>
      </div>

      <div className="tracker-method">
        <span>Rätt kedja</span>
        <div><b>Löfte</b><i>→</i><b>Beslut</b><i>→</i><b>Genomförande</b><i>→</i><b>Effekt</b></div>
        <p>Manifest, regeringsavtal och regeringsmål måste få separata nämnare. “Påbörjat” räknas inte automatiskt som uppfyllt.</p>
      </div>

      <div className="tracker-layout">
        <div className="tracker-list">
          {promiseItems.map((item) => (
            <button type="button" key={item.id} className={selected.id === item.id ? 'active' : ''} aria-pressed={selected.id === item.id} onClick={() => setSelectedId(item.id)}>
              <span>{item.year}</span>
              <div><strong>{item.title}</strong><small>{item.owner}</small></div>
              <i className={'verdict-dot verdict-' + item.verdictTone} />
            </button>
          ))}
        </div>
        <article className="tracker-detail" aria-live="polite">
          <div className="tracker-detail-top">
            <span>{selected.owner} · {selected.year}</span>
            <strong className={'verdict-label verdict-' + selected.verdictTone}>{selected.verdict}</strong>
          </div>
          <h3>{selected.title}</h3>
          <p>{selected.detail}</p>
          <div className="promise-pipeline">
            {selected.stages.map((stage, index) => (
              <div key={stageLabels[index]}>
                <i className={'stage-' + stage} />
                <span>{stageLabels[index]}</span>
                <small>{stage === 'done' ? 'Helt' : stage === 'partial' ? 'Delvis' : stage === 'no' ? 'Nej' : 'Ej belagt'}</small>
              </div>
            ))}
          </div>
          <div className="tracker-distinction">
            <span>Avgörande distinktion</span>
            <p>{selected.distinction}</p>
          </div>
          <a href={selected.sourceUrl} target="_blank" rel="noreferrer">{selected.source} ↗</a>
        </article>
      </div>

      <footer className="tracker-footer">
        <strong>Varför ingen total procentsiffra ännu?</strong>
        <p>Piloturvalet blandar olika dokument och mandatperioder. En rättvis procentsats kräver ett komplett, förregistrerat urval där bara bedömbara löften med passerad tidsfrist ingår. Därför visar vi status per löfte tills nämnaren är komplett.</p>
        <a href="https://comparativepledges.net/" target="_blank" rel="noreferrer">Comparative Party Pledges Project ↗</a>
      </footer>
    </section>
  );
}
