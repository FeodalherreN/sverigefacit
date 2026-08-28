'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { FactCard } from './fakta/fact-card';
import { featuredFacts } from './fakta/facts';
import { environmentSeries } from './environment-data';
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

const toPoints = (values: [number, number][]): Point[] =>
  values.map(([year, value]) => ({ year, value }));

const series: Record<SeriesId, Series> = {
  crime: {
    id: 'crime',
    number: '01',
    label: 'Brott & trygghet',
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
    points: toPoints([
      [2002, 98], [2003, 81], [2004, 102], [2005, 83], [2006, 91],
      [2007, 111], [2008, 82], [2009, 93], [2010, 91], [2011, 81],
      [2012, 68], [2013, 87], [2014, 87], [2015, 112], [2016, 106],
      [2017, 113], [2018, 108], [2019, 111], [2020, 124], [2021, 113],
      [2022, 116], [2023, 121], [2024, 92], [2025, 84],
    ]),
  },
  migration: {
    id: 'migration',
    number: '02',
    label: 'Migration',
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
    points: toPoints([
      [2000, 58659], [2001, 60795], [2002, 64087], [2003, 63795],
      [2004, 62028], [2005, 65229], [2006, 95750], [2007, 99485],
      [2008, 101171], [2009, 102280], [2010, 98801], [2011, 96467],
      [2012, 103059], [2013, 115845], [2014, 126966], [2015, 134240],
      [2016, 163005], [2017, 144489], [2018, 132602], [2019, 115805],
      [2020, 82518], [2021, 90631], [2022, 102436], [2023, 94514],
      [2024, 116197], [2025, 89434],
    ]),
  },
  work: {
    id: 'work',
    number: '03',
    label: 'Jobb & arbetslöshet',
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
    points: toPoints([
      [2001, 6.0], [2002, 6.1], [2003, 6.7], [2004, 7.5], [2005, 7.9],
      [2006, 7.2], [2007, 6.3], [2008, 6.3], [2009, 8.4], [2010, 8.7],
      [2011, 7.9], [2012, 8.1], [2013, 8.1], [2014, 8.0], [2015, 7.5],
      [2016, 7.1], [2017, 6.8], [2018, 6.5], [2019, 6.9], [2020, 8.5],
      [2021, 8.9], [2022, 7.5], [2023, 7.7], [2024, 8.4], [2025, 8.8],
    ]),
  },
  prosperity: {
    id: 'prosperity',
    number: '04',
    label: 'Välstånd',
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
    points: toPoints([
      [2000, 390], [2001, 394], [2002, 402], [2003, 408], [2004, 423],
      [2005, 433], [2006, 451], [2007, 462], [2008, 454], [2009, 431],
      [2010, 452], [2011, 463], [2012, 458], [2013, 459], [2014, 465],
      [2015, 480], [2016, 484], [2017, 487], [2018, 490], [2019, 497],
      [2020, 484], [2021, 506], [2022, 508], [2023, 503], [2024, 511],
    ]),
  },
  rate: {
    id: 'rate',
    number: '05',
    label: 'Ekonomi & ränta',
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
    points: toPoints([
      [2000, 4.0], [2001, 3.75], [2002, 3.75], [2003, 2.75],
      [2004, 2.0], [2005, 1.5], [2006, 3.0], [2007, 4.0], [2008, 2.0],
      [2009, 0.25], [2010, 1.25], [2011, 1.75], [2012, 1.0],
      [2013, 0.75], [2014, 0.0], [2015, -0.35], [2016, -0.5],
      [2017, -0.5], [2018, -0.5], [2019, -0.25], [2020, 0.0],
      [2021, 0.0], [2022, 2.5], [2023, 4.0], [2024, 2.75], [2025, 1.75],
    ]),
  },
  fuel: {
    id: 'fuel',
    number: '06',
    label: 'Bränsle',
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
    points: toPoints([
      [2000, 15.4], [2001, 14.9], [2002, 14.4], [2003, 14.2],
      [2004, 15.0], [2005, 16.6], [2006, 17.0], [2007, 16.9],
      [2008, 17.6], [2009, 17.0], [2010, 18.0], [2011, 19.0],
      [2012, 20.0], [2013, 19.4], [2014, 19.1], [2015, 17.8],
      [2016, 17.4], [2017, 18.3], [2018, 19.6], [2019, 19.7],
      [2020, 17.6], [2021, 19.9], [2022, 23.1], [2023, 20.7],
      [2024, 18.2], [2025, 16.0],
    ]),
  },
  electricity: {
    id: 'electricity',
    number: '07',
    label: 'Elpris',
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
    points: toPoints([
      [2000, 141], [2001, 143], [2002, 160], [2003, 186], [2004, 183],
      [2005, 176], [2006, 196], [2007, 211], [2008, 230], [2009, 241],
      [2010, 249], [2011, 250], [2012, 238], [2013, 238], [2014, 233],
      [2015, 235], [2016, 244], [2017, 248], [2018, 259], [2019, 270],
      [2020, 256], [2021, 291], [2022, 374], [2023, 287], [2024, 279],
      [2025, 295],
    ]),
  },
  emissions: {
    id: 'emissions',
    number: '08',
    label: 'Klimat',
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeSeries = series[activeId];
  const selectedEvent =
    timelineEvents.find((event) => event.id === selectedEventId) || timelineEvents[0];
  const filteredEvents = timelineFilter === 'alla'
    ? timelineEvents
    : timelineEvents.filter((event) => event.kind === timelineFilter);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase('sv-SE');
    const entries: { id: string; type: string; title: string; subtitle: string; keywords?: string }[] = [
      ...seriesOrder.map((id) => ({
        id,
        type: 'Tidsserie',
        title: series[id].label,
        subtitle: series[id].eyebrow,
      })),
      {
        id: 'datastudio',
        type: 'Fördjupning',
        title: 'Datastudion',
        subtitle: 'Korrelation · egna serieval · världshändelser',
        keywords: 'alkohol cannabis narkotika otrygghet rökning snus antidepressiva cancer inflation löner utvandring fruktsamhet',
      },
      {
        id: 'terrorism-eu',
        type: 'Fördjupning',
        title: 'Terroristattacker i EU 2025',
        subtitle: 'Europol · jihadistisk · högerextremistisk · vänsterextremistisk och anarkistisk terrorism',
        keywords: 'islamism jihadism terrordåd terrorism tesat te-sat',
      },
      { id: 'brott-migration', type: 'Fördjupning', title: 'Kriminalitet och migrationsbakgrund', subtitle: 'Brå · födelseland · rått och standardiserat samband' },
      { id: 'valfragor', type: 'Fördjupning', title: 'Hushåll och välfärd', subtitle: 'Äldreomsorg · pension · matpriser · räntebörda' },
      { id: 'valloften', type: 'Fördjupning', title: 'Vallöfteslabbet', subtitle: 'Beslut · genomförande · samhällseffekt' },
      ...timelineEvents.map((event) => ({
        id: event.id,
        type: 'Tidslinje',
        title: event.title,
        subtitle: event.year + ' · ' + event.government,
      })),
    ];
    return term
      ? entries.filter((entry) => (entry.title + ' ' + entry.subtitle + ' ' + (entry.keywords || '')).toLocaleLowerCase('sv-SE').includes(term))
      : entries.slice(0, 8);
  }, [searchTerm]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const dialog = searchDialogRef.current;
    if (!dialog) return;

    if (searchOpen) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      window.requestAnimationFrame(() => searchInputRef.current?.focus());
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [searchOpen]);

  const selectSearchResult = (id: string, type: string) => {
    if (type === 'Tidsserie') {
      setActiveId(id as SeriesId);
      window.setTimeout(() => document.getElementById('utfall')?.scrollIntoView({ behavior: 'smooth' }), 30);
    } else if (type === 'Tidslinje') {
      setSelectedEventId(id);
      setTimelineFilter('alla');
      window.setTimeout(() => document.getElementById('tidslinje')?.scrollIntoView({ behavior: 'smooth' }), 30);
    } else {
      const routes: Record<string, string> = {
        datastudio: '/datastudio',
        'terrorism-eu': '/fakta/terrorism-i-eu-2025',
        'brott-migration': '/analys/brott-och-migration',
        valfragor: '/fakta',
        valloften: '/politik/valloften',
      };
      window.location.assign(routes[id] || '/fakta');
    }
    setSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, '\\u003c') }} />
      <a className="skip-link" href="#top">Hoppa till huvudinnehållet</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Sverigefacit, startsida">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span>Sverigefacit</span>
          <em>beta</em>
        </a>
        <nav className="main-nav" aria-label="Huvudmeny">
          <Link href="/valet-2026">Valet 2026</Link>
          <Link href="/fakta">Fakta</Link>
          <Link href="/statistik">Statistik</Link>
          <Link href="/datastudio">Jämför</Link>
          <Link href="/politik/valloften">Vallöften</Link>
        </nav>
        <button ref={searchButtonRef} className="search-button" type="button" onClick={() => setSearchOpen(true)} aria-label="Sök mått och händelser">
          <span>Sök</span><kbd>⌘ K</kbd>
        </button>
      </header>

      <section className="hero" id="top" tabIndex={-1}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Datadriven politik</p>
          <h1>Sverige i siffror.<br />{' '}Vad blev facit?</h1>
          <p className="hero-lead">
            Vi samlar offentlig statistik med originalkällor och förklarar vad siffrorna visar, vad politiken kan ha påverkat och vad som fortfarande är osäkert. Samma metod används oavsett parti.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/valet-2026">Se valfacit 2026 <span>→</span></Link>
            <Link className="text-link" href="/datastudio#datastudio" aria-label="Öppna Datastudion och jämför 33 tidsserier med originalkällor">Öppna Datastudion <span>↗</span></Link>
          </div>
        </div>
        <aside className="hero-side">
          <div className="status-card">
            <span className="status-live">Källor senast granskade</span>
            <strong>{siteConfig.sourceChecked}</strong>
            <p>Myndigheternas tabeller och rapporter. Källa och definition visas vid varje mått.</p>
          </div>
          <div className="hero-meta" role="group" aria-label="Om datan">
            <div><strong>33</strong><span>tidsserier</span></div>
            <div><strong>14</strong><span>källor</span></div>
            <div><strong>1970–25</strong><span>tidsperiod</span></div>
          </div>
        </aside>
      </section>

      <section className="home-facts-section" id="senaste" aria-labelledby="home-facts-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Kort svar · full källa</p>
            <h2 id="home-facts-heading">Senaste facit</h2>
          </div>
          <p>Ett urval aktuella frågor, besvarade med siffran, originalkällan och gränsen för vad underlaget bevisar.</p>
        </div>
        <div className="home-facts-grid">
          {featuredFacts.slice(0, 4).map((fact) => <FactCard fact={fact} compact key={fact.slug} />)}
        </div>
        <Link className="home-facts-more" href="/fakta">Se alla faktasvar <span>→</span></Link>
      </section>

      <section className="explorer-intro-section" aria-labelledby="explorer-overview-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Utvecklingen över tid</p>
            <h2 id="explorer-overview-heading">Hur har Sverige förändrats?</h2>
          </div>
          <p>Välj en fråga. Du får först utfallet, sedan den politiska kontexten och sist gränsen för vad statistiken kan bevisa.</p>
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
          <Link href="/analys/brott-och-migration">Brott & bakgrund <span>→</span></Link>
        </div>

        <details className="topic-disclosure">
          <summary>Fler ämnen och analyser <span>+</span></summary>
          <nav aria-label="Fördjupande statistikområden">
            <Link href="/statistik/brottslighet">Brottslighet <i>↗</i></Link>
            <Link href="/statistik/migration">Migration <i>↗</i></Link>
            <Link href="/statistik/arbetsloshet">Arbetslöshet <i>↗</i></Link>
            <Link href="/statistik/privatekonomi">Privatekonomi <i>↗</i></Link>
            <Link href="/statistik/pensioner">Pensioner <i>↗</i></Link>
            <Link href="/statistik/aldreomsorg">Äldreomsorg <i>↗</i></Link>
            <Link href="/statistik/invandring-och-brott">Invandring & brott <i>↗</i></Link>
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
        <details className="timeline-disclosure">
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
            <Link href="/kallor">Källor & rättelser <span>→</span></Link>
          </div>
        </div>
        <details className="source-disclosure">
          <summary><span>14 myndigheter och organisationer</span><small>Visa listan</small><i>+</i></summary>
          <div>
            {sourceHubs.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>
                <strong>{source.name}</strong><small>{source.detail}</small><i>↗</i>
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
            <Link href="/statistik/invandring-och-brott">Brott & migration</Link>
            <Link href="/statistik/privatekonomi">Hushåll & välfärd</Link>
            <Link href="/statistik/klimat-och-miljo">Klimat & miljö</Link>
            <Link href="/politik/valloften">Vallöften</Link>
            <Link href="/metod">Metod</Link>
            <Link href="/kallor">Källor & rättelser</Link>
          </nav>
        </div>
        <div className="footer-meta">
          <span>Senaste manuella källkontroll {siteConfig.sourceChecked}</span>
          <a href="#top">Till toppen ↑</a>
        </div>
      </footer>

      <dialog
        ref={searchDialogRef}
        className="search-overlay"
        aria-labelledby="search-title"
        onCancel={(event) => {
          event.preventDefault();
          setSearchOpen(false);
        }}
        onClose={() => {
          if (searchOpen) setSearchOpen(false);
          searchButtonRef.current?.focus();
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSearchOpen(false);
        }}
      >
          <section className="search-dialog">
            <h2 className="sr-only" id="search-title">Sök i Sverigefacit</h2>
            <div className="search-input-wrap">
              <span aria-hidden="true">⌕</span>
              <label className="sr-only" htmlFor="site-search">Sök mått, reform eller år</label>
              <input
                ref={searchInputRef}
                id="site-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Sök mått, reform eller år…"
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Stäng sök">Esc</button>
            </div>
            <div className="search-results">
              <p aria-live="polite">{searchTerm ? `${searchResults.length} sökresultat` : 'Populärt just nu'}</p>
              {searchResults.length ? searchResults.map((result) => (
                <button
                  type="button"
                  key={result.type + result.id}
                  onClick={() => selectSearchResult(result.id, result.type)}
                >
                  <span>{result.type}</span>
                  <div><strong>{result.title}</strong><small>{result.subtitle}</small></div>
                  <i>↗</i>
                </button>
              )) : <div className="empty-search">Inga träffar. Prova ett bredare ord.</div>}
            </div>
          </section>
      </dialog>
    </main>
  );
}
