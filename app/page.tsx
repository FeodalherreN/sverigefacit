'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FactCard } from './fakta/fact-card';
import { featuredFacts } from './fakta/facts';
import { environmentSeries } from './environment-data';
import { homepageSeriesById as canonicalSeries } from './data/homepage-series';
import { siteConfig, topicLinks } from './site-config';

type Point = { year: number; value: number };
type SeriesId =
  | 'crime'
  | 'migration'
  | 'work'
  | 'prosperity'
  | 'rate'
  | 'fuel'
  | 'electricity'
  | 'emissions';
type EvidenceTone = 'low' | 'medium' | 'context';
type ChangeMode = 'percent' | 'points';

type Series = {
  id: SeriesId;
  number: string;
  label: string;
  eyebrow: string;
  latestDisplay: string;
  latestYear: number;
  trend: string;
  unit: string;
  accent: string;
  source: string;
  sourceShort: string;
  sourceUrl: string;
  sourceNote: string;
  caveat: string;
  fact: string;
  linkage: string;
  uncertain: string;
  evidence: string;
  evidenceTone: EvidenceTone;
  changeMode: ChangeMode;
  contextTags: string[];
  points: Point[];
};

type Period = {
  id: string;
  label: string;
  detail: string;
  start: number;
  end: number;
  color: string;
};

type TimelineKind = 'reform' | 'mål' | 'omvärld' | 'utfall';
type TimelineEvent = {
  id: string;
  year: string;
  kind: TimelineKind;
  government: string;
  title: string;
  summary: string;
  reading: string;
  source: string;
  sourceUrl: string;
};

const series: Record<SeriesId, Series> = {
  crime: {
    id: 'crime',
    number: '01',
    label: 'Dödligt våld',
    eyebrow: 'Konstaterat dödligt våld',
    latestDisplay: '84 offer',
    latestYear: 2025,
    trend: '−8 offer från 2024',
    unit: 'offer',
    accent: '#e54e45',
    source: 'Brå · Konstaterade fall av dödligt våld',
    sourceShort: 'Brå',
    sourceUrl:
      'https://bra.se/statistik/statistik-om-rattsvasendet/konstaterade-fall-av-dodligt-vald',
    sourceNote: 'Manuellt granskad årsstatistik. Senast publicerad 31 mars 2026.',
    caveat:
      'Serien mäter offer, inte händelser. Campus Risbergska står för tio offer 2025 och är en tydlig uteliggare.',
    fact:
      'Brå konstaterade 84 offer för dödligt våld 2025, åtta färre än 2024.',
    linkage:
      'Lagstiftning, polisens resurser och förebyggande arbete kan påverka utvecklingen, ofta med fördröjning.',
    uncertain:
      'Tidsserien ensam visar inte att nedgången orsakades av en viss regering, straffskärpning eller polisinsats.',
    evidence: 'Låg kausal evidens',
    evidenceTone: 'low',
    changeMode: 'percent',
    contextTags: ['Demografi', 'Polisresurser', 'Vapenmarknad', 'Enskilda händelser'],
    points: canonicalSeries.deadlyViolence.points,
  },
  migration: {
    id: 'migration',
    number: '02',
    label: 'Invandring',
    eyebrow: 'Registrerade invandringar',
    latestDisplay: '89 434',
    latestYear: 2025,
    trend: '−23 % från 2024',
    unit: 'personer',
    accent: '#7857d8',
    source: 'SCB · Befolkningsutvecklingen i riket',
    sourceShort: 'SCB',
    sourceUrl:
      'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101G/BefUtvKon1749/',
    sourceNote: 'Folkbokförda varaktiga flyttningar. Senast uppdaterad 24 februari 2026.',
    caveat:
      'Invandring är inte samma sak som asylansökningar. Återinvandrade svenskfödda ingår och Ukrainas massflyktsdirektiv påverkade 2024.',
    fact:
      '89 434 invandringar registrerades 2025, jämfört med 116 197 året före.',
    linkage:
      'Svensk lagstiftning påverkar vissa migrationsvägar. EU-regler, krig, arbetsmarknad och familjeband påverkar samtidigt.',
    uncertain:
      'Hela förändringen kan inte tillskrivas den sittande regeringen eller en enskild lagändring.',
    evidence: 'Delvis belagd koppling',
    evidenceTone: 'medium',
    changeMode: 'percent',
    contextTags: ['EU-regler', 'Krig', 'Arbetskraft', 'Folkbokföring'],
    points: canonicalSeries.immigration.points,
  },
  work: {
    id: 'work',
    number: '03',
    label: 'Arbetslöshet',
    eyebrow: 'Arbetslöshet 15–74 år',
    latestDisplay: '8,8 %',
    latestYear: 2025,
    trend: '+0,4 p.e. från 2024',
    unit: 'procent',
    accent: '#e9912d',
    source: 'SCB · Arbetskraftsundersökningarna (AKU)',
    sourceShort: 'SCB / AKU',
    sourceUrl:
      'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0401__AM0401A/AKURLBefAr/',
    sourceNote: 'Årsmedeltal, ej säsongsrensat. Senast uppdaterad 23 januari 2026.',
    caveat:
      'AKU är en urvalsundersökning och serien har länkats över metodförändringar. Små årsskillnader har statistisk osäkerhet.',
    fact:
      'Arbetslösheten var 8,8 procent 2025, upp från 8,4 procent året före och nära 2021 års nivå på 8,9 procent.',
    linkage:
      'Skatter, utbildning och arbetsmarknadsåtgärder kan påverka, men också konjunktur, ränta och befolkningssammansättning.',
    uncertain:
      'Skillnader mellan regeringsperioder är inte i sig ett mått på reformernas nettoeffekt.',
    evidence: 'Låg kausal evidens',
    evidenceTone: 'low',
    changeMode: 'points',
    contextTags: ['Konjunktur', 'Ränta', 'Kompetensmatchning', 'Demografi'],
    points: canonicalSeries.unemployment.points,
  },
  prosperity: {
    id: 'prosperity',
    number: '04',
    label: 'BNP per person',
    eyebrow: 'Real BNP per person',
    latestDisplay: '511 tkr',
    latestYear: 2024,
    trend: '+1,6 % från 2023',
    unit: 'tkr per person',
    accent: '#21795d',
    source: 'SCB · Nationalräkenskaperna',
    sourceShort: 'SCB / NR',
    sourceUrl:
      'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__NR__NR0103__NR0103S/NR0103ENS2010BNPCapA/',
    sourceNote: 'Fasta priser, referensår 2020. Senast uppdaterad 29 maj 2026.',
    caveat:
      'BNP per person beskriver produktion, inte fördelning, livskvalitet eller ett typiskt hushålls disponibla inkomst.',
    fact:
      'Real BNP per person var 511 000 kronor 2024, cirka 31 procent högre än år 2000.',
    linkage:
      'Institutioner, skatter och investeringar spelar roll över tid, tillsammans med exportefterfrågan, teknik och globala kriser.',
    uncertain:
      'En regeringsperiod är för kort och påverkad av omvärlden för att utvecklingen ska kunna läsas som ett partibetyg.',
    evidence: 'Låg kausal evidens',
    evidenceTone: 'low',
    changeMode: 'percent',
    contextTags: ['Produktivitet', 'Export', 'Investeringar', 'Globala kriser'],
    points: canonicalSeries.gdpPerCapita.points,
  },
  rate: {
    id: 'rate',
    number: '05',
    label: 'Styrränta',
    eyebrow: 'Styrränta vid årets slut',
    latestDisplay: '1,75 %',
    latestYear: 2025,
    trend: '−1,0 p.e. från 2024',
    unit: 'procent',
    accent: '#1d67f2',
    source: 'Riksbanken · SECBREPOEFF',
    sourceShort: 'Riksbanken',
    sourceUrl:
      'https://api.riksbank.se/swea/v1/Observations/SECBREPOEFF/2000-01-01/2025-12-31',
    sourceNote: 'Sista publicerade bankdagsobservationen varje år.',
    caveat:
      'Detta är årsslut, inte årsgenomsnitt. Reporäntan bytte namn till styrräntan i juni 2022.',
    fact:
      'Styrräntan var 1,75 procent vid utgången av 2025, efter 4,0 procent två år tidigare.',
    linkage:
      'Räntan påverkar hushåll och ekonomi och är viktig politisk kontext.',
    uncertain:
      'Riksbanken är självständig. Styrräntan ska därför inte redovisas som regeringens eget beslut eller direkta resultat.',
    evidence: 'Kontext, ej regeringsutfall',
    evidenceTone: 'context',
    changeMode: 'points',
    contextTags: ['Inflation', 'Riksbanken', 'Kronkurs', 'Efterfrågan'],
    points: canonicalSeries.policyRate.points,
  },
  fuel: {
    id: 'fuel',
    number: '06',
    label: 'Bensinpris',
    eyebrow: 'Bensin E5, realt pumppris',
    latestDisplay: '16,0 kr',
    latestYear: 2025,
    trend: '−12 % från 2024',
    unit: 'kr per liter',
    accent: '#ca5a2b',
    source: 'Energimyndigheten · Energiindikator 12.7',
    sourceShort: 'Energimyndigheten',
    sourceUrl:
      'https://pxexternal.energimyndigheten.se/pxweb/sv/Energimyndighetens_statistikdatabas/Energimyndighetens_statistikdatabas__Energiindikatorer__12__12.7/EN_IND12-7A_Cont.px/',
    sourceNote: '2025 års prisnivå. Uppdaterad 20 maj 2026.',
    caveat:
      'Reala priser påverkas samtidigt av råolja, kronkurs, skatt, reduktionsplikt, marginaler och konkurrens.',
    fact:
      'Det reala bensinpriset var 16,0 kronor per liter 2025, lägst i serien sedan 2004.',
    linkage:
      'Sänkt reduktionsplikt och skatteförändringar har en tydlig mekanism till pumppriset.',
    uncertain:
      'Hela prisfallet kan inte tillskrivas politiken eftersom råoljepris och kronkurs också ändrades.',
    evidence: 'Möjlig påverkan från politiska beslut',
    evidenceTone: 'medium',
    changeMode: 'percent',
    contextTags: ['Råolja', 'Kronkurs', 'Skatt', 'Reduktionsplikt'],
    points: canonicalSeries.fuel.points,
  },
  electricity: {
    id: 'electricity',
    number: '07',
    label: 'Hushållens elpris',
    eyebrow: 'Slutligt elpris, hushållsel',
    latestDisplay: '295 öre',
    latestYear: 2025,
    trend: '+5,7 % från 2024',
    unit: 'öre per kWh',
    accent: '#d7a600',
    source: 'Energimyndigheten · Energiindikator 12.4',
    sourceShort: 'Energimyndigheten',
    sourceUrl:
      'https://pxexternal.energimyndigheten.se/pxweb/sv/Energimyndighetens_statistikdatabas/Energimyndighetens_statistikdatabas__Energiindikatorer__12__12.4/EN_IND12-4A_cont.px/',
    sourceNote: '2025 års prisnivå, skatt och moms inkluderade. Uppdaterad 20 maj 2026.',
    caveat:
      'Riksgenomsnittet döljer elområden och avtalsformer. Typkund och metod ändrades kring 2007.',
    fact:
      'Slutpriset för hushållsel var 295 öre per kWh 2025, jämfört med 374 öre toppåret 2022.',
    linkage:
      'Skatt, nätreglering och elmarknadsdesign är politiskt påverkbara delar av slutpriset.',
    uncertain:
      'Väder, bränslepriser, överföringskapacitet och den europeiska marknaden gör ett samlat regeringsansvar omöjligt att läsa ur serien.',
    evidence: 'Blandad påverkan',
    evidenceTone: 'low',
    changeMode: 'percent',
    contextTags: ['Väder', 'Elområde', 'Nätavgift', 'Europamarknad'],
    points: canonicalSeries.electricity.points,
  },
  emissions: {
    id: 'emissions',
    number: '08',
    label: 'Växthusgasutsläpp',
    eyebrow: 'Territoriella växthusgasutsläpp',
    latestDisplay: '46,7 Mt',
    latestYear: 2025,
    trend: '−2,8 % från 2024',
    unit: 'Mt CO₂e',
    accent: '#548647',
    source: 'Naturvårdsverket · Sveriges utsläpp och upptag',
    sourceShort: 'Naturvårdsverket',
    sourceUrl: environmentSeries.emissions.sourceUrl,
    sourceNote: '2025 är preliminärt. Exklusive LULUCF och internationella transporter. Granskad 17 juni 2026.',
    caveat:
      environmentSeries.emissions.caveat,
    fact:
      'De territoriella utsläppen minskade från reviderade 48,1 till preliminära 46,7 miljoner ton koldioxidekvivalenter 2024–2025.',
    linkage:
      'Naturvårdsverket anger höjd reduktionsplikt, tillsammans med elektrifiering, som viktiga förklaringar till transportminskningen 2025.',
    uncertain:
      'En exakt reformeffekt kräver ett kontrafaktiskt scenario; tidsserien visar inte hur utsläppen annars hade utvecklats.',
    evidence: 'Beslut och utfall kan kopplas, exakt effekt är okänd',
    evidenceTone: 'medium',
    changeMode: 'percent',
    contextTags: ['Konjunktur', 'Energimix', 'Reduktionsplikt', 'Metodrevision'],
    points: environmentSeries.emissions.points,
  },
};

const seriesOrder: SeriesId[] = [
  'crime', 'migration', 'work', 'prosperity',
  'rate', 'fuel', 'electricity', 'emissions',
];

const periods: Period[] = [
  { id: 'persson', label: 'Persson', detail: 'S-ledd · 2000–06', start: 2000, end: 2006, color: '#e6aaa6' },
  { id: 'reinfeldt', label: 'Reinfeldt', detail: 'M-ledd · 2007–14', start: 2007, end: 2014, color: '#79a9ee' },
  { id: 'lofven', label: 'Löfven', detail: 'S-ledd · 2015–21', start: 2015, end: 2021, color: '#e68580' },
  { id: 'andersson', label: 'Andersson', detail: 'S-ledd · 2022', start: 2022, end: 2022, color: '#d96863' },
  { id: 'kristersson', label: 'Kristersson', detail: 'M-ledd · 2023–', start: 2023, end: 2025, color: '#447fd2' },
];

const chartGovernments: Period[] = periods;

const timelineEvents: TimelineEvent[] = [
  {
    id: 'jobbskatt',
    year: '2007',
    kind: 'reform',
    government: 'Reinfeldt · M-ledd',
    title: 'Första jobbskatteavdraget',
    summary: 'Skattereduktionen för arbetsinkomster infördes med uttalat syfte att öka arbetsutbud och sysselsättning.',
    reading: 'Mekanismen är tydlig, men finanskrisen 2008–09 gör ett enkelt före–efter-facit missvisande.',
    source: 'Budgetpropositionen 2007',
    sourceUrl: 'https://www.regeringen.se/rattsliga-dokument/proposition/2006/10/prop.-2006071/',
  },
  {
    id: 'jobtarget',
    year: '2015',
    kind: 'mål',
    government: 'Löfven · S/MP',
    title: 'EU:s lägsta arbetslöshet 2020',
    summary: 'Regeringen slog 2015 fast att Sverige skulle ha EU:s lägsta arbetslöshet 2020 och att målet skulle nås genom fler sysselsatta och fler arbetade timmar.',
    reading: 'Målet kan kontrolleras direkt och uppnåddes inte. Det säger däremot inte ensamt varför.',
    source: 'Regeringens sysselsättningsmål 2015',
    sourceUrl: 'https://www.regeringen.se/regeringsuppdrag/2015/06/uppdrag-till-trafikverket-att-stalla-krav-pa-sysselsattning-i-upphandlingar/',
  },
  {
    id: 'migrationlaw',
    year: '2016',
    kind: 'reform',
    government: 'Löfven · S/MP',
    title: 'Tillfälliga migrationslagen',
    summary: 'Tidsbegränsade tillstånd, begränsad anhöriginvandring och skärpt försörjningskrav infördes.',
    reading: 'Lagen har en direkt mekanism, men EU:s gränspolitik och förändrade flyktvägar måste ingå i effektbedömningen.',
    source: 'Prop. 2015/16:174',
    sourceUrl: 'https://www.regeringen.se/rattsliga-dokument/proposition/2016/04/prop.-201516174',
  },
  {
    id: 'pandemic',
    year: '2020',
    kind: 'omvärld',
    government: 'Löfven · S/MP',
    title: 'Pandemin bryter trenderna',
    summary: 'Sysselsättning, BNP och energianvändning påverkades samtidigt av en global hälsokris.',
    reading: 'En regering styr krishanteringen men skapade inte chocken. Jämförelser behöver skilja på chock och respons.',
    source: 'SCB · AKU 2020',
    sourceUrl: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/arbetsmarknad/utbud-av-arbetskraft/arbetskraftsundersokningarna-aku/pong/statistiknyhet/arbetskraftsundersokningarna-aku-arsmedeltal-2020/',
  },
  {
    id: 'ratejump',
    year: '2022',
    kind: 'omvärld',
    government: 'Andersson / Kristersson',
    title: 'Ränta och energi vänder upp',
    summary: 'Styrräntan steg till 2,5 procent vid årets slut samtidigt som hushållens reala elpris nådde seriens topp.',
    reading: 'Riksbanken är självständig och den europeiska energikrisen var central kontext för regeringsskiftet.',
    source: 'Riksbanken · ränteserie',
    sourceUrl: 'https://www.riksbank.se/sv/statistik/rantor-och-valutakurser/hamta-rantor-och-valutakurser-via-api/serier-for-apiet/',
  },
  {
    id: 'reduction',
    year: '2024',
    kind: 'reform',
    government: 'Kristersson · M/KD/L + SD',
    title: 'Reduktionsplikten sänks',
    summary: 'Kravet sänktes till sex procent för bensin och diesel från den 1 januari 2024.',
    reading: 'Lägre pumppris är en rimlig effekt. Samtidigt ökade transportutsläppen, men exakt storlek kräver kontrafaktisk analys.',
    source: 'Regeringens proposition',
    sourceUrl: 'https://www.regeringen.se/pressmeddelanden/2023/10/regeringen-gar-vidare-med-forslag-om-sankt-reduktionsplikt/',
  },
];

const sourceHubs = [
  { name: 'SCB', detail: 'Ekonomi · befolkning · arbete', url: 'https://www.scb.se/' },
  { name: 'Brå', detail: 'Brott · rättsväsende', url: 'https://bra.se/statistik' },
  { name: 'Riksbanken', detail: 'Ränta · penningpolitik', url: 'https://www.riksbank.se/sv/statistik/' },
  { name: 'Migrationsverket', detail: 'Asyl · tillstånd', url: 'https://www.migrationsverket.se/Om-Migrationsverket/Statistik.html' },
  { name: 'Folkhälsomyndigheten', detail: 'Folkhälsa · hälsodata', url: 'https://www.folkhalsomyndigheten.se/statistik-och-data/' },
  { name: 'Skolverket', detail: 'Skola · resultat · öppna data', url: 'https://www.skolverket.se/om-skolverket/oppna-data' },
  { name: 'Polismyndigheten', detail: 'Skjutningar · sprängningar', url: 'https://polisen.se/om-polisen/polisens-arbete/sprangningar-och-skjutningar/' },
  { name: 'Valmyndigheten', detail: 'Val · rådata · resultat', url: 'https://www.val.se/valresultat-och-statistik/statistik-och-data/radata-val-2026' },
  { name: 'Medlingsinstitutet', detail: 'Lön · reallön', url: 'https://www.mi.se/lonestatistik/' },
  { name: 'Energimyndigheten', detail: 'Energi · bränsle · el', url: 'https://www.energimyndigheten.se/statistik/' },
  { name: 'Socialstyrelsen', detail: 'Äldreomsorg · socialtjänst', url: 'https://www.socialstyrelsen.se/statistik-och-data/statistik/' },
  { name: 'Pensionsmyndigheten', detail: 'Pension · real utveckling', url: 'https://www.pensionsmyndigheten.se/statistik/' },
  { name: 'Naturvårdsverket', detail: 'Klimat · utsläpp', url: 'https://www.naturvardsverket.se/data-och-statistik/' },
  { name: 'SMHI', detail: 'Klimat · väder · indikatorer', url: 'https://www.smhi.se/klimat' },
  { name: 'SLU Artdatabanken', detail: 'Arter · biologisk mångfald', url: 'https://www.slu.se/artdatabanken/' },
  { name: 'Havs- och vattenmyndigheten', detail: 'Sjöar · vattendrag · hav', url: 'https://www.havochvatten.se/data-kartor-och-rapporter.html' },
  { name: 'Regeringen', detail: 'Reformer · propositioner', url: 'https://www.regeringen.se/rattsliga-dokument/' },
  { name: 'Riksdagen', detail: 'Lagar · beslut · dokument', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/' },
  { name: 'Europol', detail: 'Terrorism i EU · TE-SAT', url: 'https://www.europol.europa.eu/publications-events/main-reports/tesat-report' },
  { name: 'Eurostat', detail: 'Harmoniserad EU-statistik', url: 'https://ec.europa.eu/eurostat/' },
  { name: 'Europeiska miljöbyrån', detail: 'Utsläpp · europeisk miljödata', url: 'https://www.eea.europa.eu/en/datahub' },
  { name: 'Kolada / RKA', detail: 'Kommun · region · jämförelser', url: 'https://www.kolada.se/om-oss/api/' },
];

const seriesTopicPaths: Record<SeriesId, string> = {
  crime: '/statistik/brottslighet',
  migration: '/statistik/migration',
  work: '/statistik/arbetsloshet',
  prosperity: '/statistik/privatekonomi',
  rate: '/statistik/privatekonomi',
  fuel: '/statistik/klimat-och-miljo',
  electricity: '/statistik/klimat-och-miljo',
  emissions: '/statistik/klimat-och-miljo',
};

const numberFormatter = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 });

function formatMetric(item: Series, value: number) {
  if (item.id === 'work') return numberFormatter.format(value) + ' %';
  if (item.id === 'rate') return numberFormatter.format(value) + ' %';
  if (item.id === 'fuel') return value.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' kr/l';
  if (item.id === 'electricity') return numberFormatter.format(value) + ' öre/kWh';
  if (item.id === 'prosperity') return numberFormatter.format(value) + ' tkr/person';
  if (item.id === 'migration') return Math.round(value).toLocaleString('sv-SE') + ' personer';
  if (item.id === 'emissions') return value.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' Mt CO₂e';
  return numberFormatter.format(value) + ' offer';
}

function formatAxis(item: Series, value: number) {
  if (item.id === 'migration') return Math.round(value / 1000) + 'k';
  if (item.id === 'prosperity') return Math.round(value) + 'k';
  if (item.id === 'work' || item.id === 'rate') return numberFormatter.format(value) + '%';
  return numberFormatter.format(value);
}

function DataChart({ item }: { item: Series }) {
  const [selected, setSelected] = useState<Point>(item.points[item.points.length - 1]);
  const pointRefs = useRef<Map<number, SVGGElement>>(new Map());
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const width = 920;
  const height = 350;
  const left = 56;
  const right = 20;
  const top = 44;
  const bottom = 48;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const years = item.points.map((point) => point.year);
  const values = item.points.map((point) => point.value);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = (rawMax - rawMin || 1) * 0.13;
  const minValue = rawMin - padding;
  const maxValue = rawMax + padding;
  const xFor = (year: number) => left + ((year - minYear) / (maxYear - minYear)) * plotWidth;
  const yFor = (value: number) => top + ((maxValue - value) / (maxValue - minValue)) * plotHeight;
  const linePoints = item.points.map((point) => xFor(point.year) + ',' + yFor(point.value)).join(' ');
  const areaPoints = left + ',' + (height - bottom) + ' ' + linePoints + ' ' + (width - right) + ',' + (height - bottom);
  const yTicks = Array.from({ length: 5 }, (_, index) => minValue + ((maxValue - minValue) * index) / 4);
  const selectedX = xFor(selected.year);
  const selectedY = yFor(selected.value);
  const yearStep = plotWidth / Math.max(maxYear - minYear, 1);
  const selectedIndex = item.points.findIndex((point) => point.year === selected.year);

  useEffect(() => {
    const scroller = chartScrollRef.current;
    if (!scroller || !window.matchMedia('(max-width: 700px)').matches) return;
    const frame = window.requestAnimationFrame(() => {
      scroller.scrollLeft = scroller.scrollWidth - scroller.clientWidth;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [item.id]);

  const selectAdjacentPoint = (offset: number) => {
    const next = item.points[Math.max(0, Math.min(item.points.length - 1, selectedIndex + offset))];
    if (next) {
      setSelected(next);
      window.requestAnimationFrame(() => pointRefs.current.get(next.year)?.focus());
    }
  };

  return (
    <div className="data-chart-shell" role="region" aria-label={'Diagram och datatabell för ' + item.eyebrow}>
      <p className="chart-scroll-hint" aria-hidden="true">Senaste år visas · svep bakåt för äldre år</p>
      <div ref={chartScrollRef} className="data-chart-scroll" tabIndex={0} role="region" aria-label={'Rullbart diagram för ' + item.eyebrow}>
        <div className="government-key" role="group" aria-label="Regering som styrde flest dagar under kalenderåret">
          {chartGovernments.map((government) => (
            <span key={government.id}>
              <i style={{ background: government.color }} />
              {government.label}
            </span>
          ))}
        </div>
        <div className="data-chart-stage">
        <svg
          className="data-chart"
          viewBox={'0 0 ' + width + ' ' + height}
          role="group"
          aria-labelledby={'chart-title-' + item.id + ' chart-description-' + item.id}
        >
          <title id={'chart-title-' + item.id}>{`${item.eyebrow} från ${minYear} till ${maxYear}`}</title>
          <desc id={'chart-description-' + item.id}>Välj datapunkt med tabbtangenten och byt år med vänster eller höger pil. Tabellen efter diagrammet innehåller samtliga värden.</desc>
          <defs>
            <linearGradient id={'fill-' + item.id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={item.accent} stopOpacity=".25" />
              <stop offset="100%" stopColor={item.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          {chartGovernments.map((government) => {
            const startYear = Math.max(government.start, minYear);
            const endYear = Math.min(government.end, maxYear);
            if (startYear > endYear) return null;
            const bandX = Math.max(left, xFor(startYear) - yearStep / 2);
            const bandRight = Math.min(width - right, xFor(endYear) + yearStep / 2);
            const bandWidth = Math.max(0, bandRight - bandX);
            return (
              <g key={government.id}>
                <rect x={bandX} y={top} width={bandWidth} height={plotHeight} fill={government.color} opacity=".07" />
                <line x1={bandX} x2={bandX} y1={top} y2={height - bottom} className="government-line" />
              </g>
            );
          })}
          {yTicks.map((tick) => {
            const tickY = yFor(tick);
            return (
              <g key={tick}>
                <line x1={left} x2={width - right} y1={tickY} y2={tickY} className="grid-line" />
                <text x={left - 11} y={tickY + 4} textAnchor="end" className="axis-label">{formatAxis(item, tick)}</text>
              </g>
            );
          })}
          <polygon points={areaPoints} fill={'url(#fill-' + item.id + ')'} />
          <polyline points={linePoints} className="data-line" style={{ stroke: item.accent }} />
          <line x1={selectedX} x2={selectedX} y1={top} y2={height - bottom} className="selected-line" />
          {item.points.map((point) => (
            <g
              key={point.year}
              ref={(node) => {
                if (node) pointRefs.current.set(point.year, node);
                else pointRefs.current.delete(point.year);
              }}
              className="chart-point-hit"
              role="button"
              tabIndex={selected.year === point.year ? 0 : -1}
              aria-pressed={selected.year === point.year}
              aria-label={point.year + ': ' + formatMetric(item, point.value)}
              onMouseEnter={() => setSelected(point)}
              onFocus={() => setSelected(point)}
              onClick={() => setSelected(point)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                  event.preventDefault();
                  selectAdjacentPoint(event.key === 'ArrowLeft' ? -1 : 1);
                } else if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(point);
                }
              }}
            >
              <circle cx={xFor(point.year)} cy={yFor(point.value)} r="12" fill="transparent" />
              <circle
                cx={xFor(point.year)}
                cy={yFor(point.value)}
                r={selected.year === point.year ? 5.5 : 3}
                fill="#fffdfa"
                stroke={item.accent}
                strokeWidth={selected.year === point.year ? 3 : 2}
              />
            </g>
          ))}
          {[minYear, 2005, 2010, 2015, 2020, maxYear]
            .filter((year, index, all) => year >= minYear && year <= maxYear && all.indexOf(year) === index)
            .map((year) => (
              <text key={year} x={xFor(year)} y={height - 18} textAnchor="middle" className="axis-label">{year}</text>
            ))}
        </svg>
        <div
          className="chart-tooltip"
          style={{
            left: `clamp(70px, ${(selectedX / width) * 100}%, calc(100% - 70px))`,
            top: (selectedY / height) * 100 + '%',
            borderColor: item.accent,
          }}
          aria-live="polite"
        >
          <span>{selected.year}</span>
          <strong>{formatMetric(item, selected.value)}</strong>
        </div>
        </div>
      </div>
      <label className="chart-year-control">
        <span>Välj år i grafen</span>
        <select
          value={selected.year}
          onChange={(event) => {
            const next = item.points.find((point) => point.year === Number(event.target.value));
            if (next) setSelected(next);
          }}
        >
          {item.points.map((point) => <option key={point.year} value={point.year}>{point.year} · {formatMetric(item, point.value)}</option>)}
        </select>
      </label>
      <details className="chart-data-table">
        <summary>Visa data som tabell <span>+</span></summary>
        <div tabIndex={0} role="region" aria-label={'Datatabell för ' + item.eyebrow}>
          <table>
            <thead><tr><th scope="col">År</th><th scope="col">Värde</th></tr></thead>
            <tbody>{item.points.map((point) => <tr key={point.year}><th scope="row">{point.year}</th><td>{formatMetric(item, point.value)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function getPeriodResult(item: Series, period: Period) {
  const available = item.points.filter((point) => point.year >= period.start && point.year <= period.end);
  if (!available.length) return null;
  const first = available[0];
  const last = available[available.length - 1];
  if (available.length < 2) return { first, last, change: null, annualChange: null, observations: 1 };
  const rawChange = item.changeMode === 'points'
    ? last.value - first.value
    : ((last.value - first.value) / Math.abs(first.value)) * 100;
  const digits = Math.abs(rawChange) < 10 ? 1 : 0;
  const sign = rawChange > 0 ? '+' : '';
  const unit = item.changeMode === 'points' ? ' p.e.' : ' %';
  const elapsedYears = Math.max(last.year - first.year, 1);
  const annualRaw = item.changeMode === 'points'
    ? rawChange / elapsedYears
    : (Math.pow(last.value / first.value, 1 / elapsedYears) - 1) * 100;
  const annualDigits = Math.abs(annualRaw) < 10 ? 1 : 0;
  const annualSign = annualRaw > 0 ? '+' : '';
  return {
    first,
    last,
    change: sign + rawChange.toLocaleString('sv-SE', { maximumFractionDigits: digits, minimumFractionDigits: digits }) + unit,
    annualChange: annualSign + annualRaw.toLocaleString('sv-SE', { maximumFractionDigits: annualDigits, minimumFractionDigits: annualDigits }) + unit + '/år',
    observations: available.length,
  };
}

function Comparison({
  item,
  periodA,
  periodB,
  setPeriodA,
  setPeriodB,
}: {
  item: Series;
  periodA: string;
  periodB: string;
  setPeriodA: (value: string) => void;
  setPeriodB: (value: string) => void;
}) {
  const firstPeriod = periods.find((period) => period.id === periodA) || periods[0];
  const secondPeriod = periods.find((period) => period.id === periodB) || periods[1];
  const firstResult = getPeriodResult(item, firstPeriod);
  const secondResult = getPeriodResult(item, secondPeriod);

  return (
    <div className="comparison">
      <div className="comparison-heading">
        <div>
          <p className="section-kicker">Jämför perioder</p>
          <h3>Samma mått, olika mandatperioder</h3>
        </div>
        <span className="correlation-pill">Visar samvariation — inte orsak</span>
      </div>
      <div className="comparison-grid">
        {[
          { period: firstPeriod, result: firstResult, value: periodA, setter: setPeriodA, label: 'Period A' },
          { period: secondPeriod, result: secondResult, value: periodB, setter: setPeriodB, label: 'Period B' },
        ].map((entry) => (
          <div className="period-card" key={entry.label}>
            <label>
              <span>{entry.label}</span>
              <select value={entry.value} onChange={(event) => entry.setter(event.target.value)}>
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>{period.label} · {period.start}–{period.end}</option>
                ))}
              </select>
            </label>
            <div className="period-result">
              <i style={{ background: entry.period.color }} />
              <div>
                <strong>{entry.result?.annualChange || (entry.result ? formatMetric(item, entry.result.first.value) : 'Saknar data')}</strong>
                <span>
                  {entry.result?.change
                    ? 'Totalt ' + entry.result.change + ' · ' + formatMetric(item, entry.result.first.value) + ' → ' + formatMetric(item, entry.result.last.value)
                    : entry.result
                      ? 'Endast ett kalenderår · inget förändringsmått'
                    : 'Perioden täcks inte av serien'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="comparison-note">Övergångsår tilldelas regeringen som styrde flest dagar under kalenderåret. Jämförelsen är beskrivande och visar inte regeringens kausala effekt.</p>
    </div>
  );
}

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${siteConfig.url}/#webpage`,
  url: `${siteConfig.url}/`,
  name: siteConfig.title,
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  dateModified: siteConfig.modified,
  isPartOf: { '@id': `${siteConfig.url}/#website` },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}/og.png`,
    width: 1200,
    height: 630,
  },
  about: [
    'Svensk politik',
    'Datadriven politik',
    'Offentlig svensk statistik',
    'Brottslighet och migration',
    'Arbetsmarknad och privatekonomi',
    'Folkhälsa och levnadsvanor',
    'Pension och äldreomsorg',
    'Politiska vallöften',
  ].map((name) => ({ '@type': 'Thing', name })),
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: topicLinks.map((topic, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: topic.name,
      url: `${siteConfig.url}${topic.href}`,
    })),
  },
};

export default function Home() {
  const [activeId, setActiveId] = useState<SeriesId>('work');
  const [periodA, setPeriodA] = useState('reinfeldt');
  const [periodB, setPeriodB] = useState('lofven');
  const [timelineFilter, setTimelineFilter] = useState<'alla' | TimelineKind>('alla');
  const [selectedEventId, setSelectedEventId] = useState('migrationlaw');
  const timelineDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const revealLinkedEvent = () => {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (!targetId.startsWith('handelse-')) return;
      const eventId = targetId.replace('handelse-', '');
      if (!timelineEvents.some((event) => event.id === eventId)) return;
      if (timelineDetailsRef.current) timelineDetailsRef.current.open = true;
      window.requestAnimationFrame(() => {
        setTimelineFilter('alla');
        setSelectedEventId(eventId);
        window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ block: 'center' }));
      });
    };

    revealLinkedEvent();
    window.addEventListener('hashchange', revealLinkedEvent);
    return () => window.removeEventListener('hashchange', revealLinkedEvent);
  }, []);

  const activeSeries = series[activeId];
  const selectedEvent =
    timelineEvents.find((event) => event.id === selectedEventId) || timelineEvents[0];
  const filteredEvents = timelineFilter === 'alla'
    ? timelineEvents
    : timelineEvents.filter((event) => event.kind === timelineFilter);

  return (
    <main id="page-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, '\\u003c') }} />

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Datadriven politik</p>
          <h1>Hitta svaret.<br />{' '}Se källan.</h1>
          <p className="hero-lead">
            Börja med en fråga eller ett ämne. Du får resultatet direkt, kan följa utvecklingen och alltid öppna myndighetens originalkälla.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/statistik">Utforska ämnen <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/kommun">Se min kommun <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/valet-2026">Valet 2026 <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <aside className="hero-side">
          <Link className="status-card" href={`/fakta/${featuredFacts[0].slug}`}>
            <span className="status-live">Aktuellt · {featuredFacts[0].topic}</span>
            <strong>{featuredFacts[0].value}</strong>
            <p>{featuredFacts[0].valueLabel}. Källa: {featuredFacts[0].sourceOrganization}.</p>
            <i>Läs svaret <span aria-hidden="true">→</span></i>
          </Link>
          <div className="hero-meta" role="group" aria-label="Om datan">
            <div><strong>33</strong><span>tidsserier</span></div>
            <div><strong>{sourceHubs.length}</strong><span>källor</span></div>
            <div><strong>{siteConfig.sourceChecked}</strong><span>senast granskat</span></div>
          </div>
        </aside>
      </section>

      <section className="home-route-section" aria-labelledby="home-route-heading">
        <div><p className="section-kicker">Fyra enkla vägar</p><h2 id="home-route-heading">Vad vill du göra?</h2></div>
        <nav aria-label="Välj ingång">
          <Link href="/statistik"><span>01 · Ämnen</span><strong>Få ett kort svar och se utvecklingen</strong><i aria-hidden="true">→</i></Link>
          <Link href="/kommun"><span>02 · Lokalt</span><strong>Jämför din kommun med riket</strong><i aria-hidden="true">→</i></Link>
          <Link href="/analys/brott-och-migration#brott-ursprung"><span>03 · Direkt till data</span><strong>Brottstyp och födelseland</strong><i aria-hidden="true">→</i></Link>
          <Link href="/datastudio#datastudio"><span>04 · Verktyg</span><strong>Jämför två tidsserier</strong><i aria-hidden="true">→</i></Link>
        </nav>
      </section>

      <section className="home-facts-section" id="senaste" aria-labelledby="home-facts-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Kort svar · originalkälla</p>
            <h2 id="home-facts-heading">Aktuella siffror</h2>
          </div>
          <p>Fyra aktuella utfall med källa och den viktigaste begränsningen.</p>
        </div>
        <div className="home-facts-grid">
          {featuredFacts.slice(0, 4).map((fact) => <FactCard fact={fact} compact key={fact.slug} />)}
        </div>
        <Link className="home-facts-more" href="/fakta">Se alla faktasvar <span aria-hidden="true">→</span></Link>
      </section>

      <section className="explorer-intro-section" aria-labelledby="explorer-overview-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Utvecklingen över tid</p>
            <h2 id="explorer-overview-heading">Följ åtta nyckelmått över tid</h2>
          </div>
          <p>Välj ett mått för att se utveckling, källa och den viktigaste begränsningen.</p>
        </div>
      </section>

      <section
        className="explorer-section"
        id="utfall"
        style={{ '--accent': activeSeries.accent } as CSSProperties}
      >
        <div className="explorer-heading">
          <div>
            <p className="section-kicker">Interaktivt utfall</p>
            <h2>{activeSeries.label}</h2>
            <p>{activeSeries.eyebrow} · {activeSeries.unit}</p>
          </div>
          <div className="active-metric">
            <span>Senaste helår · {activeSeries.latestYear}</span>
            <strong>{activeSeries.latestDisplay}</strong>
            <small>{activeSeries.trend}</small>
          </div>
        </div>

        <div className="series-tabs" role="group" aria-label="Välj tidsserie">
          {seriesOrder.map((id) => (
            <button
              type="button"
              key={id}
              aria-pressed={activeId === id}
              className={activeId === id ? 'active' : ''}
              onClick={() => setActiveId(id)}
            >
              {series[id].label}
            </button>
          ))}
        </div>

        <div className="explorer-grid">
          <div className="chart-panel">
            <DataChart key={activeId} item={activeSeries} />
            <div className="chart-source">
              <span><i /> Officiell tidsserie</span>
              <a href={activeSeries.sourceUrl} target="_blank" rel="noreferrer">{activeSeries.source} ↗</a>
            </div>
            <p className="source-note">{activeSeries.sourceNote}</p>
            <p className="source-note government-period-note">Regeringsfärgen visar den regering som styrde flest dagar under kalenderåret. Den är politisk kontext, inte en effektbedömning.</p>
            <details className="data-passport">
              <summary>Källa och definition <span>+</span></summary>
              <dl>
                <div><dt>Exakt källa</dt><dd><a href={activeSeries.sourceUrl} target="_blank" rel="noreferrer">{activeSeries.source} ↗</a></dd></div>
                <div><dt>Täckning</dt><dd>{activeSeries.points[0].year}–{activeSeries.points[activeSeries.points.length - 1].year} · {activeSeries.unit}</dd></div>
                <div><dt>Bearbetning</dt><dd>Årsobservationer visas utan utjämning eller prediktiv modell.</dd></div>
                <div><dt>Källkontroll</dt><dd>{siteConfig.sourceChecked}. {activeSeries.sourceNote}</dd></div>
                <div><dt>Begränsning</dt><dd>{activeSeries.caveat}</dd></div>
              </dl>
            </details>
          </div>

          <aside className="evidence-panel" aria-label="Evidensbedömning">
            <div className={'evidence-level tone-' + activeSeries.evidenceTone}>
              <span>Tolkning</span>
              <strong>{activeSeries.evidence}</strong>
            </div>
            <h3>Det här kan vi säga</h3>
            <ol className="logic-chain">
              <li className="observed">
                <span>01</span>
                <div><strong>Vad visar statistiken?</strong><p>{activeSeries.fact}</p></div>
              </li>
              <li className="linked">
                <span>02</span>
                <div><strong>Vad kan politiken påverka?</strong><p>{activeSeries.linkage}</p></div>
              </li>
              <li className="unproven">
                <span>03</span>
                <div><strong>Vad avgör serien inte?</strong><p>{activeSeries.uncertain}</p></div>
              </li>
            </ol>
            <div className="context-box">
              <span>Andra faktorer att kontrollera</span>
              <div>{activeSeries.contextTags.map((tag) => <i key={tag}>{tag}</i>)}</div>
            </div>
            <details>
              <summary>Metodnot för serien <span>+</span></summary>
              <p>{activeSeries.caveat}</p>
            </details>
          </aside>
        </div>

        <details className="comparison-disclosure">
          <summary><span>Jämför mandatperioder</span><small>Avancerad vy</small><i>+</i></summary>
          <Comparison
            item={activeSeries}
            periodA={periodA}
            periodB={periodB}
            setPeriodA={setPeriodA}
            setPeriodB={setPeriodB}
          />
        </details>

        <div className="explorer-actions" aria-label="Fördjupa den valda statistiken">
          <Link href={seriesTopicPaths[activeId]}>Läs om {activeSeries.label.toLowerCase()} <span>→</span></Link>
          <Link href="/datastudio#datastudio">Jämför två serier i Datastudion <span>→</span></Link>
          <Link href="/analys/brott-och-migration#brott-ursprung">Brott och migrationsbakgrund <span>→</span></Link>
        </div>

        <details className="topic-disclosure">
          <summary>Fler ämnen och analyser <span>+</span></summary>
          <nav aria-label="Fördjupande statistikområden">
            <Link href="/statistik/brottslighet">Dödligt våld <i aria-hidden="true">→</i></Link>
            <Link href="/statistik/migration">Invandring <i aria-hidden="true">→</i></Link>
            <Link href="/statistik/arbetsloshet">Arbetslöshet <i aria-hidden="true">→</i></Link>
            <Link href="/statistik/privatekonomi">Privatekonomi <i aria-hidden="true">→</i></Link>
            <Link href="/statistik/pensioner">Allmän pension <i aria-hidden="true">→</i></Link>
            <Link href="/statistik/aldreomsorg">Hemtjänst och särskilt boende <i aria-hidden="true">→</i></Link>
            <Link href="/statistik/invandring-och-brott">Brott och migrationsbakgrund <i aria-hidden="true">→</i></Link>
          </nav>
        </details>
      </section>

      <section className="promise-section" id="facit">
        <div className="promise-intro">
          <p className="section-kicker">Påstående → utfall</p>
          <h2>Ett löfte.<br />{' '}Ett facit.<br />{' '}<em>Två olika frågor.</em></h2>
          <p>Om ett mål nåddes går ofta att kontrollera. Varför utfallet blev som det blev kräver en helt annan evidensnivå.</p>
          <Link className="promise-more" href="/politik/valloften">Se alla granskade löften <span>→</span></Link>
        </div>
        <article className="promise-card">
          <div className="promise-quote">
            <span className="promise-label">Regeringsmål · 2015</span>
            <blockquote>“Regeringens mål är att Sverige ska ha EU:s lägsta arbetslöshet 2020. Detta ska uppnås genom fler sysselsatta och fler arbetade timmar.”</blockquote>
            <a href="https://www.regeringen.se/regeringsuppdrag/2015/06/uppdrag-till-trafikverket-att-stalla-krav-pa-sysselsattning-i-upphandlingar/" target="_blank" rel="noreferrer">
              Regeringens sysselsättningsmål 2015 ↗
            </a>
          </div>
          <div className="promise-result">
            <span className="verdict"><i /> Facit: ej uppfyllt</span>
            <div className="result-number"><strong>8,5 %</strong><span>Sveriges EU-harmoniserade arbetslöshet 2020</span></div>
            <p>Eurostats harmoniserade årsdata visar 8,5 procent för Sverige och 2,6 procent för Tjeckien. SCB:s då publicerade nationella AKU-årsmedel var 8,3 procent; serierna ska därför inte blandas. Målet kan bedömas, men utfallet bevisar inte vilken enskild politik som orsakade avvikelsen.</p>
            <div className="result-sources">
              <a href="https://www.scb.se/hitta-statistik/statistik-efter-amne/arbetsmarknad/utbud-av-arbetskraft/arbetskraftsundersokningarna-aku/pong/statistiknyhet/arbetskraftsundersokningarna-aku-arsmedeltal-2020/" target="_blank" rel="noreferrer">SCB · nationell serie ↗</a>
              <a href="https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table?lang=en" target="_blank" rel="noreferrer">Eurostat · harmoniserad serie ↗</a>
            </div>
          </div>
          <footer>
            <span>Hög säkerhet: måluppfyllelse</span>
            <span>Låg säkerhet: ensam orsak</span>
          </footer>
        </article>
      </section>

      <section className="timeline-section" id="tidslinje">
        <details ref={timelineDetailsRef} className="timeline-disclosure">
          <summary>
            <div className="section-heading">
              <div>
                <p className="section-kicker">Politisk tidslinje</p>
                <h2>Vad mer påverkade?</h2>
              </div>
              <p>Se reformer, löften och större världshändelser på samma tidsaxel — som kontext, inte automatiska orsaker.</p>
            </div>
            <span className="timeline-open-label">Öppna tidslinjen <i>+</i></span>
            <span className="timeline-preview" aria-hidden="true"><i>2007 · Jobbskatteavdrag</i><i>2020 · Pandemi</i><i>2022 · Energi och ränta</i></span>
          </summary>
          <div className="timeline-content">
            <div className="timeline-filters" role="group" aria-label="Filtrera tidslinjen">
              {([
                ['alla', 'Alla'],
                ['reform', 'Reformer'],
                ['mål', 'Mål & löften'],
                ['omvärld', 'Omvärld'],
              ] as const).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={timelineFilter === value ? 'active' : ''}
                  aria-pressed={timelineFilter === value}
                  onClick={() => {
                    setTimelineFilter(value);
                    const firstMatch = value === 'alla' ? timelineEvents[0] : timelineEvents.find((event) => event.kind === value);
                    if (firstMatch) setSelectedEventId(firstMatch.id);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="timeline-layout">
              <div className="timeline-list">
                {filteredEvents.map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    id={`handelse-${event.id}`}
                    className={selectedEvent.id === event.id ? 'active' : ''}
                    onClick={() => setSelectedEventId(event.id)}
                    aria-pressed={selectedEvent.id === event.id}
                  >
                    <span className={'event-kind kind-' + event.kind}>{event.kind}</span>
                    <strong>{event.year}</strong>
                    <span>{event.title}</span>
                  </button>
                ))}
              </div>
              <article className="timeline-detail" aria-live="polite">
                <div className="timeline-detail-top">
                  <span>{selectedEvent.year}</span>
                  <i>{selectedEvent.kind}</i>
                </div>
                <p className="government-label">{selectedEvent.government}</p>
                <h3>{selectedEvent.title}</h3>
                <p className="timeline-summary">{selectedEvent.summary}</p>
                <div className="reading-box">
                  <span>Så läser vi sambandet</span>
                  <p>{selectedEvent.reading}</p>
                </div>
                <a href={selectedEvent.sourceUrl} target="_blank" rel="noreferrer">{selectedEvent.source} ↗</a>
              </article>
            </div>
          </div>
        </details>
      </section>

      <section className="trust-section" id="metod" aria-labelledby="trust-heading">
        <div className="trust-intro">
          <p className="section-kicker">Metod</p>
          <h2 id="trust-heading">Så drar vi slutsatser</h2>
          <p>Vi visar vad statistiken beskriver, vad som bara samvarierar och vad som kräver en effektstudie. Samma krav på källor och metod gäller oavsett parti.</p>
          <div className="trust-actions">
            <Link href="/metod">Läs metoden <span>→</span></Link>
            <Link href="/kallor">Källor <span>→</span></Link>
            <Link href="/rattelser">Rättelser <span>→</span></Link>
          </div>
        </div>
        <details className="source-disclosure">
          <summary><span>{sourceHubs.length} myndigheter och organisationer</span><small>Visa listan</small><i>+</i></summary>
          <div>
            {sourceHubs.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>
                <strong>{source.name}</strong><small>{source.detail}</small><i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>
        </details>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <div><strong>Sverigefacit</strong><small>Datadriven politik · utan partifärg</small></div>
        </div>
        <div className="footer-summary">
          <p>Målet är ett partipolitiskt obundet underlag där offentlig statistik, politiska beslut och metodgränser går att kontrollera.</p>
          <nav aria-label="Genvägar till statistikområden">
            <Link href="/statistik/invandring-och-brott">Brott och migrationsbakgrund</Link>
            <Link href="/statistik/privatekonomi">Hushåll & välfärd</Link>
            <Link href="/statistik/klimat-och-miljo">Klimat & miljö</Link>
            <Link href="/politik/valloften">Vallöften</Link>
            <Link href="/kommun">Min kommun</Link>
            <Link href="/om">Om Sverigefacit</Link>
            <Link href="/metod">Metod</Link>
            <Link href="/kallor">Källor</Link>
            <Link href="/rattelser">Rättelser</Link>
          </nav>
        </div>
        <div className="footer-meta">
          <span>Senaste manuella källkontroll {siteConfig.sourceChecked}</span>
          <a href="#top">Till toppen ↑</a>
        </div>
      </footer>

    </main>
  );
}
