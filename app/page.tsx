'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  CrimeMigrationEvidence,
  DataStudio,
  ElectionAgenda,
  PromiseTracker,
  WelfarePulse,
} from './evidence-lab';

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
    evidence: 'Måttlig policykoppling',
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
    eyebrow: 'Nationella växthusgasutsläpp',
    latestDisplay: '47,5 Mt',
    latestYear: 2024,
    trend: '+7,4 % från 2023',
    unit: 'Mt CO₂e',
    accent: '#548647',
    source: 'SCB / Naturvårdsverket · Nationella utsläpp',
    sourceShort: 'SCB / NV',
    sourceUrl:
      'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0107/TotaltUtslappN/',
    sourceNote: 'Exklusive LULUCF och internationella transporter. Uppdaterad 16 december 2025.',
    caveat:
      'Inventeringen revideras när underlag och metoder förbättras. Utsläppen anges som territoriella, inte konsumtionsbaserade.',
    fact:
      'De nationella utsläppen ökade från 44,2 till 47,5 miljoner ton koldioxidekvivalenter 2023–2024.',
    linkage:
      'Transportutsläppens uppgång sammanfaller med sänkt reduktionsplikt och har en rimlig, dokumenterad mekanism.',
    uncertain:
      'En exakt reformeffekt kräver ett kontrafaktiskt scenario; tidsserien visar inte hur utsläppen annars hade utvecklats.',
    evidence: 'Måttlig policykoppling',
    evidenceTone: 'medium',
    changeMode: 'percent',
    contextTags: ['Konjunktur', 'Energimix', 'Reduktionsplikt', 'Metodrevision'],
    points: toPoints([
      [2000, 68.1], [2001, 68.9], [2002, 69.5], [2003, 69.8],
      [2004, 69.2], [2005, 66.3], [2006, 65.9], [2007, 64.7],
      [2008, 62.3], [2009, 58.1], [2010, 64.1], [2011, 59.7],
      [2012, 56.8], [2013, 55.2], [2014, 53.5], [2015, 53.3],
      [2016, 53.2], [2017, 52.2], [2018, 51.4], [2019, 50.2],
      [2020, 46.0], [2021, 47.7], [2022, 45.2], [2023, 44.2],
      [2024, 47.5],
    ]),
  },
};

const seriesOrder: SeriesId[] = [
  'crime', 'migration', 'work', 'prosperity',
  'rate', 'fuel', 'electricity', 'emissions',
];

const periods: Period[] = [
  { id: 'reinfeldt', label: 'Reinfeldt', detail: 'M-ledd · 2006–14', start: 2006, end: 2014, color: '#79a9ee' },
  { id: 'lofven', label: 'Löfven', detail: 'S-ledd · 2014–21', start: 2014, end: 2021, color: '#e68580' },
  { id: 'andersson', label: 'Andersson', detail: 'S-ledd · 2021–22', start: 2021, end: 2022, color: '#d96863' },
  { id: 'kristersson', label: 'Kristersson', detail: 'M-ledd · 2022–', start: 2022, end: 2025, color: '#447fd2' },
];

const chartGovernments: Period[] = [
  { id: 'persson', label: 'Persson', detail: 'S', start: 2000, end: 2006, color: '#e6aaa6' },
  ...periods,
];

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
    summary: 'Regeringsförklaringen slog fast att Sverige skulle nå lägst arbetslöshet i EU år 2020.',
    reading: 'Målet kan kontrolleras direkt och uppnåddes inte. Det säger däremot inte ensamt varför.',
    source: 'Regeringsförklaringen 2015',
    sourceUrl: 'https://www.regeringen.se/contentassets/dd95ef69eafa4f6dadcac0c2b7855652/regeringsforklaringen-2015.pdf',
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
  { name: 'Regeringen', detail: 'Reformer · propositioner', url: 'https://www.regeringen.se/rattsliga-dokument/' },
];

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

function MiniSparkline({ item }: { item: Series }) {
  const width = 120;
  const height = 38;
  const values = item.points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  const points = item.points
    .map((point, index) => {
      const x = (index / (item.points.length - 1)) * width;
      const y = height - 3 - ((point.value - min) / spread) * (height - 8);
      return x + ',' + y;
    })
    .join(' ');

  return (
    <svg className="mini-sparkline" viewBox={'0 0 ' + width + ' ' + height} aria-hidden="true">
      <polyline points={points} fill="none" stroke={item.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DataChart({ item }: { item: Series }) {
  const [selected, setSelected] = useState<Point>(item.points[item.points.length - 1]);
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

  return (
    <div className="data-chart-shell">
      <div className="government-key" aria-label="Regeringsperioder i grafen">
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
          role="img"
          aria-label={item.eyebrow + ' från ' + minYear + ' till ' + maxYear}
        >
          <defs>
            <linearGradient id={'fill-' + item.id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={item.accent} stopOpacity=".25" />
              <stop offset="100%" stopColor={item.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          {chartGovernments.map((government) => {
            const startYear = Math.max(government.start, minYear);
            const endYear = Math.min(government.end, maxYear);
            if (startYear >= endYear) return null;
            const bandX = xFor(startYear);
            const bandWidth = xFor(endYear) - bandX;
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
              className="chart-point-hit"
              role="button"
              tabIndex={0}
              aria-label={point.year + ': ' + formatMetric(item, point.value)}
              onMouseEnter={() => setSelected(point)}
              onFocus={() => setSelected(point)}
              onClick={() => setSelected(point)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(point);
                }
              }}
            >
              <circle cx={xFor(point.year)} cy={yFor(point.value)} r="10" fill="transparent" />
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
            left: (selectedX / width) * 100 + '%',
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
  );
}

function getPeriodResult(item: Series, period: Period) {
  const available = item.points.filter((point) => point.year >= period.start && point.year <= period.end);
  if (available.length < 2) return null;
  const first = available[0];
  const last = available[available.length - 1];
  const rawChange = item.changeMode === 'points'
    ? last.value - first.value
    : ((last.value - first.value) / Math.abs(first.value)) * 100;
  const digits = Math.abs(rawChange) < 10 ? 1 : 0;
  const sign = rawChange > 0 ? '+' : '';
  const unit = item.changeMode === 'points' ? ' p.e.' : ' %';
  return {
    first,
    last,
    change: sign + rawChange.toLocaleString('sv-SE', { maximumFractionDigits: digits, minimumFractionDigits: digits }) + unit,
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
                <strong>{entry.result ? entry.result.change : 'Saknar data'}</strong>
                <span>
                  {entry.result
                    ? formatMetric(item, entry.result.first.value) + ' → ' + formatMetric(item, entry.result.last.value)
                    : 'Perioden täcks inte av serien'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeId, setActiveId] = useState<SeriesId>('work');
  const [periodA, setPeriodA] = useState('reinfeldt');
  const [periodB, setPeriodB] = useState('lofven');
  const [timelineFilter, setTimelineFilter] = useState<'alla' | TimelineKind>('alla');
  const [selectedEventId, setSelectedEventId] = useState('migrationlaw');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeSeries = series[activeId];
  const selectedEvent =
    timelineEvents.find((event) => event.id === selectedEventId) || timelineEvents[0];
  const filteredEvents = timelineFilter === 'alla'
    ? timelineEvents
    : timelineEvents.filter((event) => event.kind === timelineFilter);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase('sv-SE');
    const entries = [
      ...seriesOrder.map((id) => ({
        id,
        type: 'Tidsserie',
        title: series[id].label,
        subtitle: series[id].eyebrow,
      })),
      { id: 'datastudio', type: 'Fördjupning', title: 'Datastudion', subtitle: 'Korrelation · egna serieval · världshändelser' },
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
      ? entries.filter((entry) => (entry.title + ' ' + entry.subtitle).toLocaleLowerCase('sv-SE').includes(term))
      : entries.slice(0, 8);
  }, [searchTerm]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const selectSearchResult = (id: string, type: string) => {
    if (type === 'Tidsserie') {
      setActiveId(id as SeriesId);
      window.setTimeout(() => document.getElementById('utfall')?.scrollIntoView({ behavior: 'smooth' }), 30);
    } else if (type === 'Tidslinje') {
      setSelectedEventId(id);
      setTimelineFilter('alla');
      window.setTimeout(() => document.getElementById('tidslinje')?.scrollIntoView({ behavior: 'smooth' }), 30);
    } else {
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 30);
    }
    setSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Sverigefacit, startsida">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span>Sverigefacit</span>
          <em>beta</em>
        </a>
        <nav className="main-nav" aria-label="Huvudmeny">
          <a href="#utfall">Utforska</a>
          <a href="#datastudio">Datastudio</a>
          <a href="#facit">Facit</a>
          <a href="#tidslinje">Tidslinje</a>
          <a href="#metod">Metod</a>
        </nav>
        <button className="search-button" type="button" onClick={() => setSearchOpen(true)} aria-label="Sök i all data">
          <span>Sök i all data</span><kbd>⌘ K</kbd>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Offentlig data. Politisk kontext.</p>
          <h1>Vad hände<br />med Sverige?</h1>
          <p className="hero-lead">
            Följ utvecklingen bakom debatten. Jämför regeringsperioder — utan att blanda ihop samvariation med bevisad orsak.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#utfall">Utforska utfallet <span>↓</span></a>
            <a className="text-link" href="#metod">Så fungerar facit <span>↗</span></a>
          </div>
        </div>
        <aside className="hero-side">
          <div className="status-card">
            <span className="status-live"><i /> Källor kontrollerade</span>
            <strong>27 aug 2026</strong>
            <p>Officiella API:er och publicerade tabeller. Varje mått har metodnot och direktlänk.</p>
          </div>
          <div className="hero-meta" aria-label="Om datan">
            <div><strong>15</strong><span>tidsserier</span></div>
            <div><strong>9</strong><span>källaktörer</span></div>
            <div><strong>2000–25</strong><span>tidsperiod</span></div>
          </div>
        </aside>
      </section>

      <ElectionAgenda />

      <section className="topic-section" aria-labelledby="topic-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Börja i sakfrågan</p>
            <h2 id="topic-heading">Vad vill du granska?</h2>
          </div>
          <p>Välj en serie för att öppna data, regeringsperioder och evidensbedömning.</p>
        </div>
        <div className="topic-grid">
          {seriesOrder.map((id) => {
            const item = series[id];
            const active = activeId === id;
            return (
              <button
                className="topic-card"
                type="button"
                key={id}
                aria-pressed={active}
                data-active={active}
                style={{ '--series': item.accent } as CSSProperties}
                onClick={() => {
                  setActiveId(id);
                  window.setTimeout(() => document.getElementById('utfall')?.scrollIntoView({ behavior: 'smooth' }), 30);
                }}
              >
                <span className="topic-number">{item.number}</span>
                <span className="topic-label">{item.label}</span>
                <strong>{item.latestDisplay}</strong>
                <span className="topic-trend">{item.trend}</span>
                <MiniSparkline item={item} />
                <span className="topic-source">{item.latestYear} · {item.sourceShort}</span>
                <i className="topic-arrow">↗</i>
              </button>
            );
          })}
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

        <div className="series-tabs" role="tablist" aria-label="Välj tidsserie">
          {seriesOrder.map((id) => (
            <button
              type="button"
              role="tab"
              key={id}
              aria-selected={activeId === id}
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
          </div>

          <aside className="evidence-panel" aria-label="Evidensbedömning">
            <div className={'evidence-level tone-' + activeSeries.evidenceTone}>
              <span>Evidensnivå</span>
              <strong>{activeSeries.evidence}</strong>
            </div>
            <h3>Det här kan vi säga</h3>
            <ol className="logic-chain">
              <li className="observed">
                <span>01</span>
                <div><strong>Observerat</strong><p>{activeSeries.fact}</p></div>
              </li>
              <li className="linked">
                <span>02</span>
                <div><strong>Rimlig koppling</strong><p>{activeSeries.linkage}</p></div>
              </li>
              <li className="unproven">
                <span>03</span>
                <div><strong>Inte bevisat</strong><p>{activeSeries.uncertain}</p></div>
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

        <Comparison
          item={activeSeries}
          periodA={periodA}
          periodB={periodB}
          setPeriodA={setPeriodA}
          setPeriodB={setPeriodB}
        />
      </section>

      <DataStudio />

      <CrimeMigrationEvidence />

      <WelfarePulse />

      <section className="promise-section" id="facit">
        <div className="promise-intro">
          <p className="section-kicker">Påstående → utfall</p>
          <h2>Ett löfte.<br />Ett facit.<br /><em>Två olika frågor.</em></h2>
          <p>Om ett mål nåddes går ofta att kontrollera. Varför utfallet blev som det blev kräver en helt annan evidensnivå.</p>
        </div>
        <article className="promise-card">
          <div className="promise-quote">
            <span className="promise-label">Regeringsmål · 2015</span>
            <blockquote>“Sysselsättningen och antalet arbetade timmar ska öka så att Sverige år 2020 når EU:s lägsta arbetslöshet.”</blockquote>
            <a href="https://www.regeringen.se/contentassets/dd95ef69eafa4f6dadcac0c2b7855652/regeringsforklaringen-2015.pdf" target="_blank" rel="noreferrer">
              Regeringsförklaringen 2015 ↗
            </a>
          </div>
          <div className="promise-result">
            <span className="verdict"><i /> Facit: ej uppfyllt</span>
            <div className="result-number"><strong>8,5 %</strong><span>Sveriges EU-harmoniserade arbetslöshet 2020</span></div>
            <p>Eurostats jämförbara årsdata visar 8,5 procent för Sverige och 2,6 procent för Tjeckien. Målet kan därför bedömas. Däremot bevisar utfallet inte vilken enskild politik som orsakade avvikelsen.</p>
            <div className="result-sources">
              <a href="https://www.scb.se/hitta-statistik/statistik-efter-amne/arbetsmarknad/utbud-av-arbetskraft/arbetskraftsundersokningarna-aku/pong/statistiknyhet/arbetskraftsundersokningarna-aku-arsmedeltal-2020/" target="_blank" rel="noreferrer">SCB ↗</a>
              <a href="https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table?lang=en" target="_blank" rel="noreferrer">Eurostat ↗</a>
            </div>
          </div>
          <footer>
            <span>Hög säkerhet: måluppfyllelse</span>
            <span>Låg säkerhet: ensam orsak</span>
          </footer>
        </article>
      </section>

      <PromiseTracker />

      <section className="timeline-section" id="tidslinje">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Politisk tidslinje</p>
            <h2>Beslut, mål och omvärld</h2>
          </div>
          <p>Reformer placeras på samma axel som större chocker — så att tidssamband blir synliga utan att kallas bevis.</p>
        </div>
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
      </section>

      <section className="method-section" id="metod">
        <div className="method-heading">
          <p className="section-kicker">Metoden</p>
          <h2>Satslogik före slutsats.</h2>
          <p>Varje facit bryts ned i tre nivåer. Styrkan bestäms inte av hur övertygande berättelsen låter, utan av vilket underlag som faktiskt finns.</p>
        </div>
        <div className="method-grid">
          <article>
            <span className="method-number">01</span>
            <i className="method-signal signal-high"><b /><b /><b /></i>
            <h3>Observerat utfall</h3>
            <p>En verifierbar förändring i officiell statistik, med enhet, tidsperiod och metodnot.</p>
            <strong>Hög säkerhet</strong>
          </article>
          <article>
            <span className="method-number">02</span>
            <i className="method-signal signal-medium"><b /><b /><b /></i>
            <h3>Rimlig policykoppling</h3>
            <p>Beslutet föregår utfallet, mekanismen är trovärdig och alternativa förklaringar vägs in.</p>
            <strong>Måttlig säkerhet</strong>
          </article>
          <article>
            <span className="method-number">03</span>
            <i className="method-signal signal-low"><b /><b /><b /></i>
            <h3>Inte kausalt belagt</h3>
            <p>Kurvorna rör sig samtidigt, men kontrafaktiskt underlag eller robust effektstudie saknas.</p>
            <strong>Låg säkerhet</strong>
          </article>
        </div>
        <div className="causal-checklist">
          <span>För att höja evidensnivån krävs</span>
          <div>
            <i>Rätt tidsordning</i>
            <i>Tydlig mekanism</i>
            <i>Rimlig storlek</i>
            <i>Kontrollgrupp</i>
            <i>Robusthetsanalys</i>
          </div>
        </div>
      </section>

      <section className="sources-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Spårbart hela vägen</p>
            <h2>Från myndighet till graf</h2>
          </div>
          <p>Ingen dold sammanvägning. Följ varje siffra tillbaka till ansvarig källa och läs avgränsningen.</p>
        </div>
        <div className="source-grid">
          {sourceHubs.map((source, index) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{source.name}</strong>
              <small>{source.detail}</small>
              <i>↗</i>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <div><strong>Sverigefacit</strong><small>Data bakom politiken</small></div>
        </div>
        <p>En neutral pilot för att göra offentlig statistik, politiska beslut och evidensnivåer begripliga tillsammans.</p>
        <div className="footer-meta">
          <span>Källor verifierade 27 aug 2026</span>
          <a href="#top">Till toppen ↑</a>
        </div>
      </footer>

      {searchOpen && (
        <div className="search-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSearchOpen(false);
        }}>
          <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Sök i Sverigefacit">
            <div className="search-input-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                autoFocus
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Sök mått, reform eller år…"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>Esc</button>
            </div>
            <div className="search-results">
              <p>{searchTerm ? 'Sökresultat' : 'Populärt just nu'}</p>
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
        </div>
      )}
    </main>
  );
}
