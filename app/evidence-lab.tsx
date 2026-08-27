'use client';

import { useMemo, useState, type CSSProperties } from 'react';

type Point = { year: number; value: number };
type LabSeries = {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  color: string;
  source: string;
  sourceUrl: string;
  caveat: string;
  points: Point[];
};

type WorldEvent = {
  id: string;
  year: number;
  label: string;
  short: string;
  detail: string;
  sourceUrl: string;
};

type CrimeCountry = {
  name: string;
  n: number;
  rawPct: number;
  rawRR: number;
  adjustedPct: number;
  adjustedRR: number;
};

type PromiseStage = 'done' | 'partial' | 'no' | 'unknown';
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

const fromValues = (startYear: number, values: number[]): Point[] =>
  values.map((value, index) => ({ year: startYear + index, value }));

const labSeries: LabSeries[] = [
  {
    id: 'immigration',
    label: 'Registrerade invandringar',
    shortLabel: 'Invandring',
    unit: 'personer',
    color: '#7857d8',
    source: 'SCB · Befolkningsutvecklingen',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101G/BefUtvKon1749/',
    caveat: 'Invandring är folkbokförda varaktiga flyttningar, inte asylansökningar. Återinvandrade svenskfödda ingår.',
    points: fromValues(2000, [58659,60795,64087,63795,62028,65229,95750,99485,101171,102280,98801,96467,103059,115845,126966,134240,163005,144489,132602,115805,82518,90631,102436,94514,116197,89434]),
  },
  {
    id: 'deadlyViolence',
    label: 'Konstaterat dödligt våld',
    shortLabel: 'Dödligt våld',
    unit: 'offer',
    color: '#e54e45',
    source: 'Brå · Konstaterat dödligt våld',
    sourceUrl: 'https://bra.se/statistik/statistik-om-rattsvasendet/konstaterade-fall-av-dodligt-vald',
    caveat: 'Varje fall är ett offer. Serien är manuellt granskad men säger inte vad förändringen orsakades av.',
    points: fromValues(2002, [98,81,102,83,91,111,82,93,91,81,68,87,87,112,106,113,108,111,124,113,116,121,92,84]),
  },
  {
    id: 'unemployment',
    label: 'Arbetslöshet 15–74 år',
    shortLabel: 'Arbetslöshet',
    unit: 'procent',
    color: '#e9912d',
    source: 'SCB · Arbetskraftsundersökningarna',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0401__AM0401A/AKURLBefAr/',
    caveat: 'AKU är en urvalsundersökning. Små årsförändringar har statistisk osäkerhet.',
    points: fromValues(2001, [6,6.1,6.7,7.5,7.9,7.2,6.3,6.3,8.4,8.7,7.9,8.1,8.1,8,7.5,7.1,6.8,6.5,6.9,8.5,8.9,7.5,7.7,8.4,8.8]),
  },
  {
    id: 'gdpPerCapita',
    label: 'Real BNP per person',
    shortLabel: 'BNP/person',
    unit: 'tkr, 2020 års priser',
    color: '#21795d',
    source: 'SCB · Nationalräkenskaperna',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__NR__NR0103__NR0103S/NR0103ENS2010BNPCapA/',
    caveat: 'BNP per person mäter produktion, inte fördelning, livskvalitet eller ett typiskt hushålls inkomst.',
    points: fromValues(2000, [390,394,402,408,423,433,451,462,454,431,452,463,458,459,465,480,484,487,490,497,484,506,508,503,511]),
  },
  {
    id: 'policyRate',
    label: 'Styrränta vid årets slut',
    shortLabel: 'Styrränta',
    unit: 'procent',
    color: '#1d67f2',
    source: 'Riksbanken · SECBREPOEFF',
    sourceUrl: 'https://api.riksbank.se/swea/v1/Observations/SECBREPOEFF/2000-01-01/2025-12-31',
    caveat: 'Riksbanken är självständig. Styrräntan är viktig kontext men inte regeringens direkta beslut.',
    points: fromValues(2000, [4,3.75,3.75,2.75,2,1.5,3,4,2,.25,1.25,1.75,1,.75,0,-.35,-.5,-.5,-.5,-.25,0,0,2.5,4,2.75,1.75]),
  },
  {
    id: 'foodPrices',
    label: 'Prisnivå för livsmedel',
    shortLabel: 'Matpriser',
    unit: 'KPI-index, 1980=100',
    color: '#d36937',
    source: 'SCB · KPI, COICOP 01',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__PR__PR0101__PR0101L/KPICOI80Ar/',
    caveat: 'Detta är prisnivån, inte inflationstakten. Lägre inflation betyder normalt att priserna fortsätter stiga, fast långsammare.',
    points: fromValues(2000, [225.98,232.47,240.02,240.79,239.74,238.09,239.91,244.77,261.69,269.25,273.15,276.65,280.76,286.96,288.02,294.73,297.84,304.22,311.45,320.19,327.02,328.36,365.51,409.87,415.79,433.51]),
  },
  {
    id: 'economicStandard',
    label: 'Median ekonomisk standard',
    shortLabel: 'Ekonomisk standard',
    unit: 'tkr/konsumtionsenhet, 2024 års priser',
    color: '#1f8265',
    source: 'SCB · Hushållens ekonomi',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__HE__HE0110__HE0110F/TabVX1DispInkN/',
    caveat: 'Median disponibel inkomst per konsumtionsenhet, exklusive kapitalvinster. Måttet tar hänsyn till hushållets storlek.',
    points: fromValues(2011, [279.7,287.4,292.3,300.7,310.2,314.2,316,319.3,321.9,323.7,331.2,322.2,319.1,324.9]),
  },
  {
    id: 'realPension',
    label: 'Real allmän pension',
    shortLabel: 'Real pension',
    unit: 'kr/månad, 2023 års priser',
    color: '#8d5b9e',
    source: 'Pensionsmyndigheten',
    sourceUrl: 'https://www.pensionsmyndigheten.se/statistik/publikationer/Fastprisberaknad-pension-2024/',
    caveat: 'Genomsnitt före skatt. Resultatet påverkas av vilka årskullar som kommer in och lämnar pensionärskollektivet.',
    points: fromValues(2003, [13880,14207,14363,14454,14515,14545,15377,14925,14174,14633,15291,15096,15346,15856,16076,16008,16049,16530,16701,16375,15713]),
  },
  {
    id: 'homeCare',
    label: 'Andel 65+ med hemtjänst',
    shortLabel: 'Hemtjänst 65+',
    unit: 'procent',
    color: '#4a7aa8',
    source: 'Socialstyrelsen · Äldreomsorg 2025',
    sourceUrl: 'https://www.socialstyrelsen.se/publikationer/statistik-om-socialtjanstinsatser-till-aldre-2025-2026-4-10218/',
    caveat: 'Mäter nyttjad eller beviljad omsorg, inte behov, väntetid eller kvalitet. Antalet mottagare kan öka samtidigt som andelen sjunker.',
    points: fromValues(2014, [11.33,11.31,11.07,10.83,10.91,10.92,10.47,10.34,10.43,10.40,10.29,10.22]),
  },
  {
    id: 'specialHousing',
    label: 'Andel 65+ i särskilt boende',
    shortLabel: 'Särskilt boende',
    unit: 'procent',
    color: '#6b7e9a',
    source: 'Socialstyrelsen · Äldreomsorg 2025',
    sourceUrl: 'https://www.socialstyrelsen.se/publikationer/statistik-om-socialtjanstinsatser-till-aldre-2025-2026-4-10218/',
    caveat: 'Mäter beviljad insats, inte uppskattat behov eller kvalitet. Befolkningen 65+ har vuxit under perioden.',
    points: fromValues(2014, [5.73,5.68,5.65,5.49,5.51,5.36,5.24,5.04,5.23,5.14,5.13,5.11]),
  },
  {
    id: 'debtRatio',
    label: 'Hushållens skuldkvot',
    shortLabel: 'Skuldkvot',
    unit: 'procent av disponibel inkomst, Q4',
    color: '#4557a9',
    source: 'SCB · Nationalräkenskaperna',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__NR__NR0103__NR0103C/SektorENS2010KvKeyIn/',
    caveat: 'Aggregat för alla hushåll. Det beskriver inte skulden för ett typiskt bolånehushåll.',
    points: fromValues(2000, [111.2,112.2,113.9,121,131.2,139.6,145.6,148.3,151,156.9,162,162.2,161.7,164.6,168.2,174.6,180.5,184.6,186.6,187.4,197.5,198,189.1,179.9,174.4,172.7]),
  },
  {
    id: 'interestRatio',
    label: 'Hushållens räntekvot',
    shortLabel: 'Räntekvot',
    unit: 'procent av disponibel inkomst, Q4',
    color: '#b65c50',
    source: 'SCB · Nationalräkenskaperna',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__NR__NR0103__NR0103C/SektorENS2010KvKeyIn/',
    caveat: 'Bruttoränteutgifter för hushållssektorn som helhet. Ett bolånehushåll kan ligga långt över snittet.',
    points: fromValues(2000, [6.5,6.3,6.4,6,5.6,5.1,5.9,7.2,8.2,4.6,5.2,6.9,6.1,5.5,4.9,4.1,4,3.9,3.7,3.9,4,3.7,5.2,7.5,7,5.5]),
  },
  {
    id: 'electricity',
    label: 'Slutligt elpris, hushållsel',
    shortLabel: 'Elpris',
    unit: 'öre/kWh, 2025 års priser',
    color: '#d7a600',
    source: 'Energimyndigheten',
    sourceUrl: 'https://pxexternal.energimyndigheten.se/pxweb/sv/Energimyndighetens_statistikdatabas/Energimyndighetens_statistikdatabas__Energiindikatorer__12__12.4/EN_IND12-4A_cont.px/',
    caveat: 'Riksgenomsnittet döljer elområden och avtalsformer. Skatt och moms ingår.',
    points: fromValues(2000, [141,143,160,186,183,176,196,211,230,241,249,250,238,238,233,235,244,248,259,270,256,291,374,287,279,295]),
  },
  {
    id: 'fuel',
    label: 'Bensin E5, realt pumppris',
    shortLabel: 'Bensinpris',
    unit: 'kr/liter, 2025 års priser',
    color: '#ca5a2b',
    source: 'Energimyndigheten',
    sourceUrl: 'https://pxexternal.energimyndigheten.se/pxweb/sv/Energimyndighetens_statistikdatabas/Energimyndighetens_statistikdatabas__Energiindikatorer__12__12.7/EN_IND12-7A_Cont.px/',
    caveat: 'Råolja, kronkurs, skatt, reduktionsplikt, raffinaderimarginal och konkurrens påverkar samtidigt.',
    points: fromValues(2000, [15.4,14.9,14.4,14.2,15,16.6,17,16.9,17.6,17,18,19,20,19.4,19.1,17.8,17.4,18.3,19.6,19.7,17.6,19.9,23.1,20.7,18.2,16]),
  },
  {
    id: 'emissions',
    label: 'Nationella växthusgasutsläpp',
    shortLabel: 'Utsläpp',
    unit: 'Mt CO₂e',
    color: '#548647',
    source: 'SCB / Naturvårdsverket',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0107/TotaltUtslappN/',
    caveat: 'Exklusive LULUCF och internationella transporter. Inventeringen revideras när metoder förbättras.',
    points: fromValues(2000, [68.1,68.9,69.5,69.8,69.2,66.3,65.9,64.7,62.3,58.1,64.1,59.7,56.8,55.2,53.5,53.3,53.2,52.2,51.4,50.2,46,47.7,45.2,44.2,47.5]),
  },
];

const seriesById = Object.fromEntries(labSeries.map((item) => [item.id, item])) as Record<string, LabSeries>;

const worldEvents: WorldEvent[] = [
  {
    id: 'financial-crisis',
    year: 2008,
    label: 'Finanskrisen',
    short: 'Lehman Brothers föll 15 sep 2008',
    detail: 'Kreditmarknad, export, BNP och arbetslöshet påverkades. Markeringen visar timing, inte att varje förändring orsakades av krisen.',
    sourceUrl: 'https://www.riksbank.se/sv/om-riksbanken/historia/finanskrisen-2007-2010/',
  },
  {
    id: 'refugee-crisis',
    year: 2015,
    label: 'Flyktingmottagandet 2015',
    short: 'Svensk mottagningstopp juli–november',
    detail: 'Mottagande, kommunal kapacitet, bostäder, skola och senare integration berördes. Senare utfall kräver kohort- och sammansättningsanalys.',
    sourceUrl: 'https://www.migrationsverket.se/om-migrationsverket/migrationsverket-svarar/2025/2025-10-27-tio-ar-sedan-2015---vad-var-det-som-hande.html',
  },
  {
    id: 'covid',
    year: 2020,
    label: 'Covid-19',
    short: 'WHO klassade covid som pandemi 11 mars',
    detail: 'Hälsa, vård, arbetade timmar, arbetslöshet och BNP påverkades samtidigt. Relevant slutpunkt varierar mellan måtten.',
    sourceUrl: 'https://www.folkhalsomyndigheten.se/vara-amnesomraden/sjukdomsutbrott/arkiv-for-sjukdomsutbrott/covid-19-pandemin-2019-2023/nar-hande-vad-under-pandemin/',
  },
  {
    id: 'ukraine',
    year: 2022,
    label: 'Ukraina & energikris',
    short: 'Fullskalig invasion 24 feb 2022',
    detail: 'El, bränsle, inflation, ränta och hushållens realinkomster påverkades. Prisuppgången började dock före invasionen.',
    sourceUrl: 'https://www.energimyndigheten.se/nyhetsarkiv/2022/sa-paverkar-invasionen-av-ukraina-sveriges-energilage/',
  },
  {
    id: 'gaza',
    year: 2023,
    label: 'Israel–Hamas-kriget',
    short: 'Krigsutbrott 7 okt 2023',
    detail: 'Främst relevant för utrikespolitik, säkerhet, bistånd och möjliga hatbrott. Makroeffekten i Sverige gick ännu inte att bedöma.',
    sourceUrl: 'https://www.riksbank.se/sv/press-och-publicerat/tal-och-presentationer/2023/thedeen-vi-har-lardomar-att-dra-av-de-senaste-arens-turbulens/',
  },
  {
    id: 'nato',
    year: 2024,
    label: 'Sverige går med i Nato',
    short: 'Medlemskap 7 mars 2024',
    detail: 'Påverkar försvarsutgifter, upphandling och styrkeplanering. Natoansökan var själv en reaktion på Rysslands invasion.',
    sourceUrl: 'https://regeringen.se/regeringens-politik/sverige-i-nato/sveriges-och-natos-historia/',
  },
];

const electionAgenda = [
  { rank: 1, label: 'Sjukvård', value: 58, href: '#valfragor' },
  { rank: 2, label: 'Lag & ordning', value: 48, href: '#brott-migration' },
  { rank: 3, label: 'Skola', value: 42, href: '#valfragor' },
  { rank: 4, label: 'Försvar', value: 34, href: '#datastudio' },
  { rank: 5, label: 'Klimat', value: 31, href: '#datastudio' },
  { rank: 6, label: 'Äldreomsorg', value: 30, href: '#valfragor' },
  { rank: 7, label: 'Invandring', value: 28, href: '#brott-migration' },
  { rank: 8, label: 'Energi', value: 27, href: '#datastudio' },
  { rank: 9, label: 'Landets ekonomi', value: 27, href: '#valfragor' },
  { rank: 10, label: 'Utrikespolitik', value: 23, href: '#datastudio' },
];

const crimeGroups = [
  { label: 'Sverigefödd, två svenskfödda föräldrar', short: 'Referensgrupp', n: 5821794, rawPct: 3.18, adjustedPct: 3.18, rawRR: 1, adjustedRR: 1 },
  { label: 'Sverigefödd, en utrikesfödd förälder', short: 'En utrikesfödd förälder', n: 501211, rawPct: 5.93, adjustedPct: 4.25, rawRR: 1.86, adjustedRR: 1.34 },
  { label: 'Sverigefödd, två utrikesfödda föräldrar', short: 'Två utrikesfödda föräldrar', n: 261695, rawPct: 10.22, adjustedPct: 5.33, rawRR: 3.21, adjustedRR: 1.68 },
  { label: 'Utrikesfödd', short: 'Utrikesfödd', n: 1481663, rawPct: 7.99, adjustedPct: 5.61, rawRR: 2.51, adjustedRR: 1.76 },
];

const crimeCountries: CrimeCountry[] = [
  { name: 'Danmark', n: 39477, rawPct: 3.75, rawRR: 1.18, adjustedPct: 3.44, adjustedRR: 1.08 },
  { name: 'Finland', n: 157238, rawPct: 3.14, rawRR: .99, adjustedPct: 3.91, adjustedRR: 1.23 },
  { name: 'Norge', n: 38953, rawPct: 3.64, rawRR: 1.14, adjustedPct: 3.71, adjustedRR: 1.17 },
  { name: 'Island', n: 4611, rawPct: 4.40, rawRR: 1.38, adjustedPct: 3.71, adjustedRR: 1.17 },
  { name: 'Grekland', n: 13963, rawPct: 3.97, rawRR: 1.25, adjustedPct: 3.72, adjustedRR: 1.17 },
  { name: 'Storbritannien/Nordirland', n: 21189, rawPct: 3.53, rawRR: 1.11, adjustedPct: 2.55, adjustedRR: .80 },
  { name: 'Tyskland', n: 45995, rawPct: 2.93, rawRR: .92, adjustedPct: 3.00, adjustedRR: .94 },
  { name: 'Polen', n: 75956, rawPct: 7.57, rawRR: 2.38, adjustedPct: 6.09, adjustedRR: 1.92 },
  { name: 'Rumänien', n: 23269, rawPct: 6.91, rawRR: 2.17, adjustedPct: 5.65, adjustedRR: 1.78 },
  { name: 'Ungern', n: 15380, rawPct: 4.86, rawRR: 1.53, adjustedPct: 4.44, adjustedRR: 1.40 },
  { name: 'Bosnien-Hercegovina', n: 56789, rawPct: 5.88, rawRR: 1.85, adjustedPct: 5.34, adjustedRR: 1.68 },
  { name: 'Jugoslavien (historisk kod)', n: 67770, rawPct: 8.14, rawRR: 2.56, adjustedPct: 7.03, adjustedRR: 2.21 },
  { name: 'Ryssland', n: 17201, rawPct: 8.16, rawRR: 2.57, adjustedPct: 6.24, adjustedRR: 1.96 },
  { name: 'Turkiet', n: 44761, rawPct: 8.55, rawRR: 2.69, adjustedPct: 5.83, adjustedRR: 1.83 },
  { name: 'USA', n: 16519, rawPct: 3.83, rawRR: 1.20, adjustedPct: 2.98, adjustedRR: .94 },
  { name: 'Chile', n: 27863, rawPct: 8.91, rawRR: 2.80, adjustedPct: 6.95, adjustedRR: 2.19 },
  { name: 'Colombia', n: 10454, rawPct: 11.23, rawRR: 3.53, adjustedPct: 6.33, adjustedRR: 1.99 },
  { name: 'Irak', n: 120185, rawPct: 12.49, rawRR: 3.93, adjustedPct: 7.70, adjustedRR: 2.42 },
  { name: 'Iran', n: 66303, rawPct: 9.65, rawRR: 3.03, adjustedPct: 7.96, adjustedRR: 2.50 },
  { name: 'Libanon', n: 25002, rawPct: 12.20, rawRR: 3.84, adjustedPct: 7.22, adjustedRR: 2.27 },
  { name: 'Syrien', n: 54767, rawPct: 12.22, rawRR: 3.84, adjustedPct: 7.61, adjustedRR: 2.39 },
  { name: 'Afghanistan', n: 25422, rawPct: 16.34, rawRR: 5.14, adjustedPct: 8.45, adjustedRR: 2.66 },
  { name: 'Indien', n: 20055, rawPct: 4.47, rawRR: 1.41, adjustedPct: 4.08, adjustedRR: 1.28 },
  { name: 'Pakistan', n: 10345, rawPct: 7.11, rawRR: 2.24, adjustedPct: 4.83, adjustedRR: 1.52 },
  { name: 'Filippinerna', n: 10966, rawPct: 5.14, rawRR: 1.62, adjustedPct: 4.28, adjustedRR: 1.35 },
  { name: 'Thailand', n: 34091, rawPct: 5.74, rawRR: 1.81, adjustedPct: 3.92, adjustedRR: 1.23 },
  { name: 'Vietnam', n: 12512, rawPct: 7.23, rawRR: 2.27, adjustedPct: 4.18, adjustedRR: 1.31 },
  { name: 'Kina', n: 23963, rawPct: 3.14, rawRR: .99, adjustedPct: 2.39, adjustedRR: .75 },
  { name: 'Eritrea', n: 19697, rawPct: 12.85, rawRR: 4.04, adjustedPct: 7.01, adjustedRR: 2.20 },
  { name: 'Etiopien', n: 14902, rawPct: 8.86, rawRR: 2.79, adjustedPct: 5.94, adjustedRR: 1.87 },
  { name: 'Somalia', n: 45218, rawPct: 14.24, rawRR: 4.48, adjustedPct: 7.29, adjustedRR: 2.29 },
];

const sortedCrimeCountries = [...crimeCountries].sort((left, right) =>
  left.name.localeCompare(right.name, 'sv-SE'),
);

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

const valueLabel = (item: LabSeries, value: number) => {
  if (item.unit === 'personer' || item.unit === 'offer' || item.unit.startsWith('kr/')) {
    return Math.round(value).toLocaleString('sv-SE') + ' ' + item.unit;
  }
  return formatNumber(value, Math.abs(value) < 10 ? 2 : 1) + ' ' + item.unit;
};

const commonPairs = (left: LabSeries, right: LabSeries, start: number, end: number) => {
  const rightByYear = new Map(right.points.map((point) => [point.year, point.value]));
  return left.points
    .filter((point) => point.year >= start && point.year <= end && rightByYear.has(point.year))
    .map((point) => ({ year: point.year, x: point.value, y: rightByYear.get(point.year) as number }));
};

const pearson = (values: { x: number; y: number }[]) => {
  if (values.length < 3) return 0;
  const meanX = values.reduce((sum, value) => sum + value.x, 0) / values.length;
  const meanY = values.reduce((sum, value) => sum + value.y, 0) / values.length;
  const covariance = values.reduce((sum, value) => sum + (value.x - meanX) * (value.y - meanY), 0);
  const varianceX = values.reduce((sum, value) => sum + Math.pow(value.x - meanX, 2), 0);
  const varianceY = values.reduce((sum, value) => sum + Math.pow(value.y - meanY, 2), 0);
  const denominator = Math.sqrt(varianceX * varianceY);
  return denominator ? covariance / denominator : 0;
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

const spearman = (values: { x: number; y: number }[]) => {
  const xRanks = ranks(values.map((value) => value.x));
  const yRanks = ranks(values.map((value) => value.y));
  return pearson(xRanks.map((x, index) => ({ x, y: yRanks[index] })));
};

const strengthLabel = (value: number) => {
  const absolute = Math.abs(value);
  const direction = value >= 0 ? 'positivt' : 'negativt';
  if (absolute < .2) return 'Mycket svagt ' + direction;
  if (absolute < .4) return 'Svagt ' + direction;
  if (absolute < .6) return 'Måttligt ' + direction;
  if (absolute < .8) return 'Starkt ' + direction;
  return 'Mycket starkt ' + direction;
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
        {electionAgenda.map((item) => (
          <a href={item.href} key={item.label}>
            <span>{String(item.rank).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
            <div><i style={{ width: item.value + '%' }} /></div>
            <b>{item.value} %</b>
          </a>
        ))}
      </div>
    </section>
  );
}

export function DataStudio() {
  const [leftId, setLeftId] = useState('immigration');
  const [rightId, setRightId] = useState('deadlyViolence');
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2025);
  const [view, setView] = useState<'timeline' | 'scatter'>('timeline');
  const [showEvents, setShowEvents] = useState(true);
  const [activeEventId, setActiveEventId] = useState('covid');

  const left = seriesById[leftId];
  const right = seriesById[rightId];
  const pairs = useMemo(
    () => commonPairs(left, right, startYear, endYear),
    [left, right, startYear, endYear],
  );
  const pearsonValue = pearson(pairs);
  const spearmanValue = spearman(pairs);
  const availableEvents = worldEvents.filter((event) => event.year >= startYear && event.year <= endYear);
  const activeEvent = availableEvents.find((event) => event.id === activeEventId) || availableEvents[0] || worldEvents[0];

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
  const xForYear = (year: number) => padLeft + ((year - minYear) / Math.max(maxYear - minYear, 1)) * plotWidth;
  const leftValues = pairs.map((pair) => pair.x);
  const rightValues = pairs.map((pair) => pair.y);
  const leftMin = leftValues.length ? Math.min(...leftValues) : 0;
  const leftMax = leftValues.length ? Math.max(...leftValues) : 1;
  const rightMin = rightValues.length ? Math.min(...rightValues) : 0;
  const rightMax = rightValues.length ? Math.max(...rightValues) : 1;
  const normalize = (value: number, minimum: number, maximum: number) =>
    ((value - minimum) / Math.max(maximum - minimum, 1)) * 100;
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

  const presets = [
    { label: 'Invandring ↔ dödligt våld', left: 'immigration', right: 'deadlyViolence' },
    { label: 'Matpris ↔ köpkraft', left: 'foodPrices', right: 'economicStandard' },
    { label: 'Styrränta ↔ räntebörda', left: 'policyRate', right: 'interestRatio' },
    { label: 'Arbetslöshet ↔ BNP/person', left: 'unemployment', right: 'gdpPerCapita' },
    { label: 'Hemtjänst ↔ särskilt boende', left: 'homeCare', right: 'specialHousing' },
  ];

  return (
    <section className="lab-section" id="datastudio">
      <div className="lab-heading">
        <div>
          <p className="section-kicker">Datastudion</p>
          <h2>Testa ett samband.<br /><em>Behåll tvivlet.</em></h2>
        </div>
        <p>Välj två årsserier. Vi matchar bara år som finns i båda, visar två korrelationsmått och lägger omvärldshändelser som kontext — aldrig som automatisk förklaring.</p>
      </div>

      <div className="lab-presets" aria-label="Färdiga jämförelser">
        {presets.map((preset) => (
          <button
            type="button"
            key={preset.label}
            className={leftId === preset.left && rightId === preset.right ? 'active' : ''}
            onClick={() => {
              setLeftId(preset.left);
              setRightId(preset.right);
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="lab-controls">
        <label>
          <span>Serie A</span>
          <select value={leftId} onChange={(event) => setLeftId(event.target.value)}>
            {labSeries.map((item) => <option key={item.id} value={item.id} disabled={item.id === rightId}>{item.label}</option>)}
          </select>
          <i style={{ background: left.color }} />
        </label>
        <span className="lab-versus">×</span>
        <label>
          <span>Serie B</span>
          <select value={rightId} onChange={(event) => setRightId(event.target.value)}>
            {labSeries.map((item) => <option key={item.id} value={item.id} disabled={item.id === leftId}>{item.label}</option>)}
          </select>
          <i style={{ background: right.color }} />
        </label>
        <div className="year-controls">
          <label><span>Från</span><select value={startYear} onChange={(event) => setStartYear(Math.min(Number(event.target.value), endYear))}>{Array.from({ length: 26 }, (_, index) => 2000 + index).map((year) => <option key={year}>{year}</option>)}</select></label>
          <label><span>Till</span><select value={endYear} onChange={(event) => setEndYear(Math.max(Number(event.target.value), startYear))}>{Array.from({ length: 26 }, (_, index) => 2000 + index).map((year) => <option key={year}>{year}</option>)}</select></label>
        </div>
      </div>

      <div className="lab-workspace">
        <div className="lab-chart-panel">
          <div className="lab-chart-toolbar">
            <div role="group" aria-label="Välj diagramtyp">
              <button type="button" className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>Utveckling</button>
              <button type="button" className={view === 'scatter' ? 'active' : ''} onClick={() => setView('scatter')}>Punktdiagram</button>
            </div>
            <label className="event-toggle">
              <input type="checkbox" checked={showEvents} onChange={(event) => setShowEvents(event.target.checked)} />
              <span /> Visa världshändelser
            </label>
          </div>

          <div className="lab-chart-scroll">
            <div className="lab-chart-stage">
              {pairs.length >= 3 ? (
                <svg className="lab-chart" viewBox={'0 0 ' + width + ' ' + height} role="img" aria-label={left.label + ' jämfört med ' + right.label}>
                  {[0, 25, 50, 75, 100].map((tick) => (
                    <g key={tick}>
                      <line x1={padLeft} x2={width - padRight} y1={yForNormalized(tick)} y2={yForNormalized(tick)} className="lab-grid-line" />
                      {view === 'timeline' && <text x={padLeft - 10} y={yForNormalized(tick) + 4} textAnchor="end" className="lab-axis-label">{tick}</text>}
                    </g>
                  ))}
                  {view === 'timeline' ? (
                    <>
                      {showEvents && availableEvents.map((event, index) => {
                        if (event.year < minYear || event.year > maxYear) return null;
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
                          <circle cx={xForYear(pair.year)} cy={yForNormalized(normalize(pair.x, leftMin, leftMax))} r="3.3" fill="#fff" stroke={left.color} strokeWidth="2"><title>{`${pair.year}: ${valueLabel(left, pair.x)}`}</title></circle>
                          <circle cx={xForYear(pair.year)} cy={yForNormalized(normalize(pair.y, rightMin, rightMax))} r="3.3" fill="#fff" stroke={right.color} strokeWidth="2"><title>{`${pair.year}: ${valueLabel(right, pair.y)}`}</title></circle>
                        </g>
                      ))}
                      {[minYear, Math.round((minYear + maxYear) / 2), maxYear].map((year) => <text key={year} x={xForYear(year)} y={height - 17} textAnchor="middle" className="lab-axis-label">{year}</text>)}
                    </>
                  ) : (
                    <>
                      <line x1={scatterX(leftMin)} y1={scatterY(clampToRightRange(regressionStart))} x2={scatterX(leftMax)} y2={scatterY(clampToRightRange(regressionEnd))} className="regression-line" />
                      {pairs.map((pair) => (
                        <circle key={pair.year} cx={scatterX(pair.x)} cy={scatterY(pair.y)} r="5" fill={left.color} opacity=".7" stroke="#fff" strokeWidth="1.5">
                          <title>{`${pair.year}: ${valueLabel(left, pair.x)} · ${valueLabel(right, pair.y)}`}</title>
                        </circle>
                      ))}
                      <text x={padLeft} y={height - 15} className="lab-axis-label">{left.shortLabel} →</text>
                      <text x={15} y={padTop} className="lab-axis-label">{right.shortLabel}</text>
                    </>
                  )}
                </svg>
              ) : (
                <div className="lab-no-overlap">Serierna har färre än tre gemensamma år i intervallet. Välj en bredare period.</div>
              )}
            </div>
          </div>

          <div className="lab-legend">
            <span><i style={{ background: left.color }} /> {left.shortLabel}</span>
            <span><i style={{ background: right.color }} /> {right.shortLabel}</span>
            {view === 'timeline' && <small>Normaliserad skala 0–100 inom vald period</small>}
          </div>

          {showEvents && availableEvents.length > 0 && (
            <div className="world-event-row">
              {availableEvents.map((event, index) => (
                <button type="button" key={event.id} className={activeEvent.id === event.id ? 'active' : ''} onClick={() => setActiveEventId(event.id)}>
                  <span>{index + 1}</span>{event.year} · {event.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="lab-result-panel">
          <span className="lab-result-kicker">Korrelation i vald period</span>
          <div className="correlation-number">
            <strong>{pairs.length >= 3 ? formatNumber(pearsonValue, 2) : '—'}</strong>
            <span>Pearson r</span>
          </div>
          <p className="correlation-strength">{pairs.length >= 3 ? strengthLabel(pearsonValue) + ' samband' : 'För få gemensamma år'}</p>
          <div className="correlation-meta">
            <div><span>Spearman ρ</span><strong>{pairs.length >= 3 ? formatNumber(spearmanValue, 2) : '—'}</strong></div>
            <div><span>Gemensamma år</span><strong>{pairs.length}</strong></div>
            <div><span>Intervall</span><strong>{pairs.length ? pairs[0].year + '–' + pairs[pairs.length - 1].year : '—'}</strong></div>
          </div>
          <p className="correlation-help">Pearson mäter linjäritet. Spearman mäter om rangordningen rör sig åt samma håll. Inget av måtten kontrollerar tredje faktorer.</p>
          <div className="correlation-warning">
            <strong>Korrelation är inte orsak.</strong>
            <p>Gemensam trend, omvänd kausalitet, tredje faktorer och val av period kan skapa eller dölja samband.</p>
          </div>
          {showEvents && availableEvents.length > 0 && (
            <div className="event-reading">
              <span>Vald omvärldshändelse · {activeEvent.year}</span>
              <strong>{activeEvent.label}</strong>
              <p>{activeEvent.detail}</p>
              <a href={activeEvent.sourceUrl} target="_blank" rel="noreferrer">Källa ↗</a>
            </div>
          )}
        </aside>
      </div>

      <footer className="lab-sources">
        <a href={left.sourceUrl} target="_blank" rel="noreferrer"><i style={{ background: left.color }} />{left.source} ↗</a>
        <a href={right.sourceUrl} target="_blank" rel="noreferrer"><i style={{ background: right.color }} />{right.source} ↗</a>
        <p><strong>Serie A:</strong> {left.caveat} <strong>Serie B:</strong> {right.caveat}</p>
      </footer>
    </section>
  );
}

export function CrimeMigrationEvidence() {
  const [mode, setMode] = useState<'absolute' | 'risk'>('absolute');
  const [countryName, setCountryName] = useState('Finland');
  const selectedCountry = crimeCountries.find((country) => country.name === countryName) || crimeCountries[0];
  const maximum = mode === 'absolute' ? 11 : 3.5;

  return (
    <section className="crime-evidence-section" id="brott-migration">
      <div className="crime-evidence-heading">
        <div>
          <p className="section-kicker">Fördjupning · känsligt samband</p>
          <h2>Kriminalitet och migrationsbakgrund.</h2>
        </div>
        <p>Brås registerstudie visar gruppskillnader i registrerad misstanke. Skillnaderna minskar tydligt när gruppernas ålder, kön och socioekonomi likställs statistiskt — men studien kan inte visa varför skillnaden finns.</p>
      </div>

      <div className="crime-study-note">
        <span>Historisk kohort</span>
        <strong>8 066 363 folkbokförda personer, 15+ år</strong>
        <p>Population fryst 31 dec 2014 · utfall: minst skäligen misstänkt för minst ett brott begånget 2015–2018.</p>
      </div>

      <div className="crime-evidence-grid">
        <article className="crime-risk-card">
          <div className="crime-card-toolbar">
            <div>
              <span>Rått utfall kontra standardiserat samband</span>
              <h3>{mode === 'absolute' ? 'Andel registrerad som misstänkt' : 'Relativ risk mot referensgruppen'}</h3>
            </div>
            <div role="group" aria-label="Välj mått">
              <button type="button" className={mode === 'absolute' ? 'active' : ''} onClick={() => setMode('absolute')}>Absolut andel</button>
              <button type="button" className={mode === 'risk' ? 'active' : ''} onClick={() => setMode('risk')}>Relativ risk</button>
            </div>
          </div>
          <div className="risk-legend">
            <span><i className="raw-dot" /> Rått utfall</span>
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
                    <span>{formatNumber(adjusted, 2)}{mode === 'absolute' ? ' %' : '×'} justerat</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="standardization-note">Standardiserat för ålder, kön, låg disponibel inkomst, utbildningsnivå och kommuntyp. Det är statistisk omviktning — inte ett kausalt experiment.</p>
        </article>

        <aside className="crime-reading-card">
          <span className="evidence-chip">Officiellt registerutfall</span>
          <h3>Vad är ett korrekt facit?</h3>
          <p>I den historiska kohorten registrerades 8,0 procent av utrikesfödda som minst skäligen misstänkta, jämfört med 3,2 procent i referensgruppen.</p>
          <div className="crime-big-shift">
            <div><span>Rå relativ skillnad</span><strong>2,51×</strong></div>
            <b>→</b>
            <div><span>Efter standardisering</span><strong>1,76×</strong></div>
          </div>
          <p>Associationen minskar men försvinner inte. Det kvarvarande sambandet är inte en skattning av en “migrationseffekt”.</p>
          <ul>
            <li><i /> Misstänkt är inte dömd.</li>
            <li><i /> Födelseland är inte etnicitet, religion eller kultur.</li>
            <li><i /> Gruppgenomsnitt säger inget om en enskild person.</li>
          </ul>
          <a href="https://bra.se/rapporter/arkiv/2021-08-25-misstankta-for-brott-bland-personer-med-inrikes-respektive-utrikes-bakgrund" target="_blank" rel="noreferrer">Brå 2021:9 ↗</a>
        </aside>
      </div>

      <div className="country-explorer">
        <div className="country-intro">
          <span>Fördjupning · födelseland</span>
          <h3>Inte en nutida landranking.</h3>
          <p>Brå särredovisar endast utrikesfödda från större födelseländer i 2014 års befolkning. Välj alfabetiskt och se både rått och standardiserat resultat. Landanalysen standardiserar för ålder, kön, inkomst och utbildning; kommuntyp ingår inte.</p>
        </div>
        <div className="country-control">
          <label>
            <span>Välj födelseland</span>
            <select value={countryName} onChange={(event) => setCountryName(event.target.value)}>
              {sortedCrimeCountries.map((country) => <option key={country.name}>{country.name}</option>)}
            </select>
          </label>
          <div className="country-result" aria-live="polite">
            <div><span>Personer i kohorten</span><strong>{selectedCountry.n.toLocaleString('sv-SE')}</strong></div>
            <div><span>Rå andel / RR</span><strong>{formatNumber(selectedCountry.rawPct, 2)} % · {formatNumber(selectedCountry.rawRR, 2)}×</strong></div>
            <div><span>Standardiserad andel / RR</span><strong>{formatNumber(selectedCountry.adjustedPct, 2)} % · {formatNumber(selectedCountry.adjustedRR, 2)}×</strong></div>
          </div>
        </div>
        <div className="country-warning">
          <strong>Historisk avgränsning</strong>
          <p>Folk­bokförda 2014, misstankar 2015–2018, alla brott sammantaget. Land × brottstyp finns inte i officiellt underlag. Brå planerar uppdatering för 2019–2024 först i slutet av 2026.</p>
          <a href="https://bra.se/download/18.366598ab19270941a1c3955/1729256818286/2021_Tabellbilaga%201%20delstudie%201.pdf" target="_blank" rel="noreferrer">Tabellbilaga ↗</a>
        </div>
      </div>

      <div className="victimization-note">
        <div>
          <span>En viktig motbild</span>
          <h3>Utsatthet måste visas bredvid misstanke.</h3>
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
          <h2>Räkna rätt innan<br />vi räknar procent.</h2>
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
            <button type="button" key={item.id} className={selected.id === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)}>
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
