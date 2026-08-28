import { crimeCountries } from './crime-country-data';
import { crimeRegionOffenses } from './crime-region-data';
import { labSeries } from './data/series-catalog';
import { facts, factPath } from './fakta/facts';
import { seoTopics, topicPath } from './seo-topics';

export type SiteSearchEntry = {
  href: string;
  type: string;
  title: string;
  subtitle: string;
  keywords: string;
  priority: number;
};

const fixedEntries: SiteSearchEntry[] = [
  {
    href: '/valet-2026',
    type: 'Valet 2026',
    title: 'Valet 2026 – valfrågor och praktisk information',
    subtitle: 'Valdag, förtidsröstning, röstberättigade och aktuella sakfrågor',
    keywords: 'val rösta riksdag region kommun valdag förtidsröstning förstagångsväljare',
    priority: 100,
  },
  {
    href: '/politik/valloften',
    type: 'Valet 2026',
    title: 'Vallöften – från formulering till facit',
    subtitle: 'Beslut, genomförande och samhällseffekt hålls isär',
    keywords: 'löfte vallöfte regeringen parti uppfyllt brutet beslut tidöavtalet januariavtalet',
    priority: 82,
  },
  {
    href: '/statistik',
    type: 'Ingång',
    title: 'Utforska alla ämnen',
    subtitle: 'Korta svar, utveckling, jämförelser och originalkällor',
    keywords: 'ämne statistik fakta svar utforska samhälle politik',
    priority: 98,
  },
  {
    href: '/fakta',
    type: 'Ingång',
    title: 'Alla korta faktasvar',
    subtitle: 'Resultatet först, därefter källa och begränsning',
    keywords: 'fakta frågor kort svar aktuellt nyckeltal',
    priority: 88,
  },
  {
    href: '/kommun',
    type: 'Verktyg',
    title: 'Min kommun',
    subtitle: 'Välj kommun och jämför befolkning, skola, skulder och anmälda våldsbrott',
    keywords: 'kommun lokalt region stockholm göteborg malmö kolada skola brott skuld befolkning',
    priority: 96,
  },
  {
    href: '/datastudio#datastudio',
    type: 'Verktyg',
    title: 'Jämför data',
    subtitle: 'Bygg ett diagram av två svenska tidsserier',
    keywords: 'datastudio jämför korrelation pearson spearman diagram tidsserie',
    priority: 92,
  },
  {
    href: '/analys/brott-och-migration#brott-ursprung',
    type: 'Fördjupning',
    title: 'Brottstyp, födelseregion och födelseland',
    subtitle: 'Brås historiska studie om misstänkta 2015–2018',
    keywords: 'brott brottstyp födelseland födelseregion ursprung ursprungsland invandring migration brå misstänkt överrisk',
    priority: 95,
  },
  {
    href: '/om',
    type: 'Om sajten',
    title: 'Om Sverigefacit',
    subtitle: 'Syfte, redaktionellt ansvar och oberoende',
    keywords: 'om avsändare ägare finansiering ansvar oberoende partipolitisk kontakt',
    priority: 70,
  },
  {
    href: '/metod',
    type: 'Om sajten',
    title: 'Metod och tolkning',
    subtitle: 'Så skiljs observerat utfall, samband och orsak åt',
    keywords: 'metod kausalitet orsak samband evidens korrelation definition',
    priority: 68,
  },
  {
    href: '/kallor',
    type: 'Om sajten',
    title: 'Källor och data',
    subtitle: 'Myndigheter, originaltabeller och bearbetning',
    keywords: 'källa myndighet scb brå socialstyrelsen skolverket eurostat data json',
    priority: 66,
  },
  {
    href: '/rattelser',
    type: 'Om sajten',
    title: 'Rättelser och ändringslogg',
    subtitle: 'Så rapporteras, granskas och publiceras rättelser',
    keywords: 'fel rättelse ändring korrigering kontakt rapportera',
    priority: 64,
  },
  {
    href: '/integritet',
    type: 'Om sajten',
    title: 'Integritet och besöksstatistik',
    subtitle: 'Analys, cookies och delningsfunktioner',
    keywords: 'integritet privacy analytics statistik cookies spårning dela',
    priority: 60,
  },
];

const topicSynonyms: Record<string, string> = {
  brottslighet: 'brott trygghet våld mord skjutning anmälda brott kriminalitet',
  'invandring-och-brott': 'brottstyp födelseland födelseregion ursprung migration invandring misstänkt dömd',
  migration: 'invandring utvandring asyl uppehållstillstånd utrikes född integration',
  arbetsloshet: 'jobb arbete sysselsättning arbetsmarknad arbetslös',
  privatekonomi: 'plånbok matpris inflation ränta bolån inkomst köpkraft hushåll',
  pensioner: 'pension pensionär ersättningsgrad garantipension köpkraft',
  aldreomsorg: 'äldre omsorg hemtjänst särskilt boende äldreboende',
  'klimat-och-miljo': 'klimat miljö utsläpp energi el natur transport koldioxid',
};

const promiseEntries: SiteSearchEntry[] = [
  ['EU:s lägsta arbetslöshet 2020', 'Inte uppfyllt', 'arbetslöshet sysselsättningsmål Löfven Socialdemokraterna'],
  ['10 000 fler polisanställda', 'Bemanningsmåttet uppfyllt', 'polis poliser civilanställda S MP'],
  ['Fast omsorgskontakt i hemtjänsten', 'Beslut helt · genomförande delvis', 'äldreomsorg hemtjänst Januariavtalet'],
  ['Språk- och samhällskunskapskrav', 'Inte infört under mandatperioden', 'medborgarskap språkkrav Januariavtalet'],
  ['Inför anonyma vittnen', 'Lagstiftningslöftet uppfyllt', 'brott vittne Tidöavtalet lag'],
  ['Elstöd senast 1 november 2022', 'Försenat · delvis uppfyllt', 'elpris energi stöd Tidöavtalet M KD SD L'],
].map(([title, subtitle, keywords], index) => ({
  href: `/politik/valloften#vallofte-${index + 1}`,
  type: 'Vallöfte',
  title,
  subtitle,
  keywords: `${title} ${keywords} vallöfte löfte regering`,
  priority: 74,
}));

const politicalEventEntries: SiteSearchEntry[] = [
  ['jobbskatt', '2007 · Första jobbskatteavdraget', 'skatt arbetsinkomst Reinfeldt arbetsutbud'],
  ['jobtarget', '2015 · EU:s lägsta arbetslöshet 2020', 'mål jobb Löfven sysselsättning'],
  ['migrationlaw', '2016 · Tillfälliga migrationslagen', 'migration uppehållstillstånd anhöriginvandring försörjningskrav'],
  ['pandemic', '2020 · Pandemin bryter trenderna', 'covid hälsokris BNP sysselsättning energi omvärld'],
  ['ratejump', '2022 · Ränta och energi vänder upp', 'styrränta elpris energikris Riksbanken'],
  ['reduction', '2024 · Reduktionsplikten sänks', 'bensin diesel bränsle utsläpp Kristersson'],
].map(([id, title, keywords]) => ({
  href: `/#handelse-${id}`,
  type: 'Politisk tidslinje',
  title,
  subtitle: 'Reform, mål eller omvärldshändelse i sitt sammanhang',
  keywords: `${title} ${keywords} tidslinje politik reform`,
  priority: 62,
}));

export function buildSiteSearchIndex(): SiteSearchEntry[] {
  const topicEntries = seoTopics.map((topic) => ({
    href: topicPath(topic.slug),
    type: 'Ämne',
    title: topic.heading,
    subtitle: `${topic.category} · ${topic.metrics[0].value} ${topic.metrics[0].label}`,
    keywords: `${topic.description} ${topic.variableMeasured.join(' ')} ${topicSynonyms[topic.slug] || ''}`,
    priority: 80,
  }));

  const factEntries = facts.map((fact) => ({
    href: factPath(fact.slug),
    type: 'Kort svar',
    title: fact.question,
    subtitle: `${fact.value} · ${fact.valueLabel} · ${fact.sourceOrganization}`,
    keywords: `${fact.title} ${fact.description} ${fact.answer} ${fact.topic} ${fact.definition}`,
    priority: 86,
  }));

  const seriesEntries = labSeries.map((series) => ({
    href: `/datastudio?seriesA=${series.id}#datastudio`,
    type: 'Tidsserie',
    title: series.label,
    subtitle: `${series.group} · ${series.unit} · ${series.source}`,
    keywords: `${series.shortLabel} ${series.group} ${series.unit} ${series.source}`,
    priority: 58,
  }));

  const offenseEntries = crimeRegionOffenses.map((offense) => ({
    href: `/analys/brott-och-migration?vy=region&brott=${encodeURIComponent(offense.id)}&matt=per-1000#brott-ursprung`,
    type: 'Brottstyp',
    title: offense.label,
    subtitle: `${offense.category} · historisk Brå-studie 2015–2018`,
    keywords: `${offense.label} ${offense.category} brott brottstyp födelseregion ursprung misstänkt Brå`,
    priority: 77,
  }));

  const countryEntries = crimeCountries.map((country) => ({
    href: `/analys/brott-och-migration?vy=land&land=${encodeURIComponent(country.name)}#brott-ursprung`,
    type: 'Födelseland',
    title: `${country.name} – alla brott`,
    subtitle: 'Historisk Brå-studie 2015–2018 · misstänkta, inte dömda',
    keywords: `${country.name} födelseland ursprungsland ursprung migration brott misstänkt Brå`,
    priority: 75,
  }));

  return [
    ...fixedEntries,
    ...factEntries,
    ...topicEntries,
    ...promiseEntries,
    ...offenseEntries,
    ...countryEntries,
    ...politicalEventEntries,
    ...seriesEntries,
  ];
}
