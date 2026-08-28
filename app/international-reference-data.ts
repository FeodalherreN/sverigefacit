export type BenchmarkId =
  | 'unemployment'
  | 'hicpInflation'
  | 'gdpPerCapitaPps'
  | 'householdElectricityPps'
  | 'territorialEmissionsPerCapita';

export type BenchmarkGeoId =
  | 'SE'
  | 'DK'
  | 'FI'
  | 'NO'
  | 'IS'
  | 'EU27_2020'
  | 'EU27_MEDIAN'
  | 'NORDIC_MEDIAN';

export type BenchmarkPoint = {
  period: string;
  order: number;
  value: number;
  flag?: 'provisional' | 'estimated';
};

export type BenchmarkSnapshot = {
  geoCode: BenchmarkGeoId;
  label: string;
  value: number;
  kind: 'country' | 'officialAggregate' | 'derivedMedian';
  flag?: 'provisional' | 'estimated';
};

export type InternationalBenchmark = {
  id: BenchmarkId;
  label: string;
  shortLabel: string;
  unit: string;
  valueDigits: number;
  latestCommonPeriod: string;
  periodLabel: string;
  comparability: 'high' | 'qualified';
  definition: string;
  caveat: string;
  differenceFromNational: string;
  source: string;
  datasetCode: string;
  sourceUrl: string;
  apiUrl: string;
  sourceChecked: string;
  sourceUpdated: string;
  periodType: 'year' | 'semester';
  valueTransform?: 'times100';
  availableGeos: BenchmarkGeoId[];
  defaultGeos: BenchmarkGeoId[];
  snapshot: BenchmarkSnapshot[];
};

const eurostatApi = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
const commonNordicGeos = ['SE', 'DK', 'FI', 'NO', 'IS'] as const;
const commonEurostatGeos = [...commonNordicGeos, 'EU27_2020'] as const;
const nordicReferenceGeos = ['DK', 'FI', 'NO', 'IS'] as const;

const withGeos = (base: string, geos: readonly string[]) =>
  `${base}${geos.map((geo) => `&geo=${geo}`).join('')}`;

export const eu27CountryCodes = [
  'BE', 'BG', 'CZ', 'DK', 'DE', 'EE', 'IE', 'EL', 'ES', 'FR', 'HR', 'IT', 'CY', 'LV',
  'LT', 'LU', 'HU', 'MT', 'NL', 'AT', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE',
] as const;

export const benchmarkGeoLabels: Record<BenchmarkGeoId, string> = {
  SE: 'Sverige',
  DK: 'Danmark',
  FI: 'Finland',
  NO: 'Norge',
  IS: 'Island',
  EU27_2020: 'EU-27',
  EU27_MEDIAN: 'EU-27, median',
  NORDIC_MEDIAN: 'Nordisk median',
};

export const benchmarkGeoColors: Record<BenchmarkGeoId, string> = {
  SE: '#1d67f2',
  DK: '#ba4b44',
  FI: '#6579a7',
  NO: '#2f7d68',
  IS: '#9067a9',
  EU27_2020: '#c38a20',
  EU27_MEDIAN: '#c38a20',
  NORDIC_MEDIAN: '#52606d',
};

export const internationalBenchmarks: Record<BenchmarkId, InternationalBenchmark> = {
  unemployment: {
    id: 'unemployment',
    label: 'Arbetslöshet 15–74 år',
    shortLabel: 'Arbetslöshet',
    unit: 'procent av arbetskraften',
    valueDigits: 1,
    latestCommonPeriod: '2025',
    periodLabel: 'årsgenomsnitt 2025',
    comparability: 'high',
    definition: 'Arbetslöshet enligt EU:s arbetskraftsundersökning, 15–74 år, båda könen. Samma ILO-baserade definition används för alla länder.',
    caveat: 'AKU/LFS är en urvalsundersökning. Små skillnader har statistisk osäkerhet och nivåerna påverkas av arbetskraftsdeltagandet.',
    differenceFromNational: 'Sverigevärdet här kommer från Eurostats harmoniserade serie. Det ska inte ersättas med ett närliggande nationellt mått från en annan tabell.',
    source: 'Eurostat · EU Labour Force Survey',
    datasetCode: 'une_rt_a',
    sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table?lang=en',
    apiUrl: withGeos(`${eurostatApi}/une_rt_a?lang=en&age=Y15-74&sex=T&unit=PC_ACT`, commonEurostatGeos),
    sourceChecked: '28 aug 2026',
    sourceUpdated: '11 juni 2026',
    periodType: 'year',
    availableGeos: [...commonEurostatGeos, 'NORDIC_MEDIAN'],
    defaultGeos: ['SE', 'NORDIC_MEDIAN', 'EU27_2020'],
    snapshot: [
      { geoCode: 'SE', label: 'Sverige', value: 8.8, kind: 'country' },
      { geoCode: 'DK', label: 'Danmark', value: 6.4, kind: 'country' },
      { geoCode: 'FI', label: 'Finland', value: 9.7, kind: 'country' },
      { geoCode: 'NO', label: 'Norge', value: 4.5, kind: 'country' },
      { geoCode: 'IS', label: 'Island', value: 4.5, kind: 'country' },
      { geoCode: 'EU27_2020', label: 'EU-27', value: 6.0, kind: 'officialAggregate' },
      { geoCode: 'NORDIC_MEDIAN', label: 'Nordisk median', value: 5.45, kind: 'derivedMedian' },
    ],
  },
  hicpInflation: {
    id: 'hicpInflation',
    label: 'HIKP-inflation',
    shortLabel: 'HIKP-inflation',
    unit: 'procent per år',
    valueDigits: 1,
    latestCommonPeriod: '2025',
    periodLabel: 'årsgenomsnitt 2025',
    comparability: 'high',
    definition: 'Årlig genomsnittlig förändring i det harmoniserade konsumentprisindexet, HIKP, total konsumtion.',
    caveat: 'HIKP är gjort för landsjämförelser men är inte ett levnadskostnadsindex. Nationella KPI- och KPIF-mått har andra användningar och kan avvika.',
    differenceFromNational: 'Den svenska huvudserien i Datastudion är KPIF. Landsmodulen använder HIKP för samtliga länder och blandar därför inte definitionerna.',
    source: 'Eurostat · Harmonised Index of Consumer Prices',
    datasetCode: 'prc_hicp_ainr',
    sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_ainr/default/table?lang=en',
    apiUrl: withGeos(`${eurostatApi}/prc_hicp_ainr?lang=en&unit=RCH_A_AVG&coicop18=TOTAL`, commonEurostatGeos),
    sourceChecked: '28 aug 2026',
    sourceUpdated: '17 juli 2026',
    periodType: 'year',
    availableGeos: [...commonEurostatGeos, 'NORDIC_MEDIAN'],
    defaultGeos: ['SE', 'NORDIC_MEDIAN', 'EU27_2020'],
    snapshot: [
      { geoCode: 'SE', label: 'Sverige', value: 2.6, kind: 'country' },
      { geoCode: 'DK', label: 'Danmark', value: 1.8, kind: 'country' },
      { geoCode: 'FI', label: 'Finland', value: 1.8, kind: 'country' },
      { geoCode: 'NO', label: 'Norge', value: 2.8, kind: 'country' },
      { geoCode: 'IS', label: 'Island', value: 3.7, kind: 'country' },
      { geoCode: 'EU27_2020', label: 'EU-27', value: 2.5, kind: 'officialAggregate' },
      { geoCode: 'NORDIC_MEDIAN', label: 'Nordisk median', value: 2.3, kind: 'derivedMedian' },
    ],
  },
  gdpPerCapitaPps: {
    id: 'gdpPerCapitaPps',
    label: 'BNP per person i köpkraft',
    shortLabel: 'BNP/person, PPS',
    unit: 'index, EU-27 = 100',
    valueDigits: 1,
    latestCommonPeriod: '2025',
    periodLabel: '2025',
    comparability: 'qualified',
    definition: 'BNP per person i löpande köpkraftsstandard, uttryckt som andel av EU-27:s nivå per person.',
    caveat: 'Köpkraftsjusteringen förbättrar nivåjämförelsen men BNP mäter produktion, inte fördelning, hushållens faktiska konsumtion eller livskvalitet.',
    differenceFromNational: 'Den svenska tidsserien visar real BNP per person i kronor över tid. Landsmodulen visar i stället en köpkraftsjusterad nivå relativt EU-27.',
    source: 'Eurostat · National accounts',
    datasetCode: 'nama_10_pc',
    sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/nama_10_pc/default/table?lang=en',
    apiUrl: withGeos(`${eurostatApi}/nama_10_pc?lang=en&unit=PC_EU27_2020_HAB_MPPS_CP&na_item=B1GQ`, commonEurostatGeos),
    sourceChecked: '28 aug 2026',
    sourceUpdated: '25 aug 2026',
    periodType: 'year',
    availableGeos: [...commonEurostatGeos, 'NORDIC_MEDIAN'],
    defaultGeos: ['SE', 'NORDIC_MEDIAN', 'EU27_2020'],
    snapshot: [
      { geoCode: 'SE', label: 'Sverige', value: 111.6, kind: 'country' },
      { geoCode: 'DK', label: 'Danmark', value: 129.8, kind: 'country' },
      { geoCode: 'FI', label: 'Finland', value: 101.2, kind: 'country' },
      { geoCode: 'NO', label: 'Norge', value: 158.9, kind: 'country' },
      { geoCode: 'IS', label: 'Island', value: 127.7, kind: 'country', flag: 'provisional' },
      { geoCode: 'EU27_2020', label: 'EU-27', value: 100, kind: 'officialAggregate' },
      { geoCode: 'NORDIC_MEDIAN', label: 'Nordisk median', value: 128.75, kind: 'derivedMedian' },
    ],
  },
  householdElectricityPps: {
    id: 'householdElectricityPps',
    label: 'Hushållens elpris i köpkraft',
    shortLabel: 'Elpris, PPS',
    unit: 'PPS per 100 kWh',
    valueDigits: 2,
    latestCommonPeriod: '2025-S2',
    periodLabel: 'andra halvåret 2025',
    comparability: 'qualified',
    definition: 'Slutligt elpris inklusive skatter för hushåll som använder 2 500–4 999 kWh per år, omräknat till köpkraftsstandard.',
    caveat: 'Ett standardiserat förbrukningsband gör priserna jämförbara men fångar inte elområden, avtalsformer eller varje hushålls faktiska förbrukning.',
    differenceFromNational: 'Den svenska huvudserien är ett realt riksgenomsnitt i öre/kWh. Landsmodulen använder Eurostats gemensamma förbrukningsband och PPS.',
    source: 'Eurostat · Household electricity prices',
    datasetCode: 'nrg_pc_204',
    sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204/default/table?lang=en',
    apiUrl: withGeos(`${eurostatApi}/nrg_pc_204?lang=en&siec=E7000&nrg_cons=KWH2500-4999&unit=KWH&tax=I_TAX&currency=PPS`, commonEurostatGeos),
    sourceChecked: '28 aug 2026',
    sourceUpdated: '12 aug 2026',
    periodType: 'semester',
    valueTransform: 'times100',
    availableGeos: ['SE', 'DK', 'FI', 'NO', 'EU27_2020', 'NORDIC_MEDIAN'],
    defaultGeos: ['SE', 'NORDIC_MEDIAN', 'EU27_2020'],
    snapshot: [
      { geoCode: 'SE', label: 'Sverige', value: 22.25, kind: 'country' },
      { geoCode: 'DK', label: 'Danmark', value: 25.34, kind: 'country' },
      { geoCode: 'FI', label: 'Finland', value: 18.77, kind: 'country' },
      { geoCode: 'NO', label: 'Norge', value: 15.64, kind: 'country' },
      { geoCode: 'EU27_2020', label: 'EU-27', value: 29.06, kind: 'officialAggregate' },
      { geoCode: 'NORDIC_MEDIAN', label: 'Nordisk median', value: 18.77, kind: 'derivedMedian' },
    ],
  },
  territorialEmissionsPerCapita: {
    id: 'territorialEmissionsPerCapita',
    label: 'Territoriella utsläpp per person',
    shortLabel: 'Utsläpp/person',
    unit: 'ton CO₂e per person',
    valueDigits: 1,
    latestCommonPeriod: '2024',
    periodLabel: '2024',
    comparability: 'high',
    definition: 'Nationella utsläpp av Kyotogaser exklusive markanvändning, skogsbruk och internationella transporter, per invånare.',
    caveat: 'Måttet beskriver utsläpp inom landets gränser. Utsläpp från importerad konsumtion ingår inte och näringslivets struktur påverkar landskillnaderna.',
    differenceFromNational: 'Sveriges huvuddiagram visar totalen i miljoner ton. Landsmodulen använder samma territoriella princip men dividerar med befolkningen.',
    source: 'Eurostat / EEA · Domestic net greenhouse gas emissions',
    datasetCode: 'sdg_13_10',
    sourceUrl: 'https://ec.europa.eu/eurostat/databrowser/view/sdg_13_10/default/table?lang=en',
    apiUrl: `${eurostatApi}/sdg_13_10?lang=en&src_crf=TOTX4_MEMO&unit=T_HAB`,
    sourceChecked: '28 aug 2026',
    sourceUpdated: '22 april 2026',
    periodType: 'year',
    availableGeos: ['SE', 'DK', 'FI', 'NO', 'IS', 'EU27_MEDIAN', 'NORDIC_MEDIAN'],
    defaultGeos: ['SE', 'NORDIC_MEDIAN', 'EU27_MEDIAN'],
    snapshot: [
      { geoCode: 'SE', label: 'Sverige', value: 4.5, kind: 'country' },
      { geoCode: 'DK', label: 'Danmark', value: 6.2, kind: 'country' },
      { geoCode: 'FI', label: 'Finland', value: 7.0, kind: 'country' },
      { geoCode: 'NO', label: 'Norge', value: 8.0, kind: 'country' },
      { geoCode: 'IS', label: 'Island', value: 12.4, kind: 'country' },
      { geoCode: 'EU27_MEDIAN', label: 'EU-27, median', value: 6.7, kind: 'derivedMedian' },
      { geoCode: 'NORDIC_MEDIAN', label: 'Nordisk median', value: 7.5, kind: 'derivedMedian' },
    ],
  },
};

export const benchmarkIds = Object.keys(internationalBenchmarks) as BenchmarkId[];

export const topicBenchmarkIds: Partial<Record<string, BenchmarkId[]>> = {
  arbetsloshet: ['unemployment'],
  privatekonomi: ['hicpInflation', 'householdElectricityPps'],
  'klimat-och-miljo': ['territorialEmissionsPerCapita'],
};

export const seriesBenchmarkIds: Partial<Record<string, BenchmarkId>> = {
  unemployment: 'unemployment',
  inflation: 'hicpInflation',
  gdpPerCapita: 'gdpPerCapitaPps',
  electricity: 'householdElectricityPps',
  emissions: 'territorialEmissionsPerCapita',
};

export const formatBenchmarkValue = (benchmark: InternationalBenchmark, value: number) =>
  `${value.toLocaleString('sv-SE', {
    minimumFractionDigits: benchmark.valueDigits,
    maximumFractionDigits: benchmark.valueDigits,
  })} ${benchmark.unit}`;

export const periodOrder = (period: string) => {
  const semester = period.match(/^(\d{4})-S([12])$/);
  if (semester) return Number(semester[1]) + (semester[2] === '2' ? 0.5 : 0);
  return Number(period);
};

export const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

type JsonStatDimension = {
  category?: {
    index?: Record<string, number> | string[];
  };
};

type JsonStatResponse = {
  id?: string[];
  size?: number[];
  dimension?: Record<string, JsonStatDimension>;
  value?: Record<string, number> | Array<number | null>;
  status?: Record<string, string> | Array<string | null>;
};

export type BenchmarkSeriesResult = {
  periods: string[];
  series: Partial<Record<BenchmarkGeoId, BenchmarkPoint[]>>;
};

const categoryEntries = (dimension?: JsonStatDimension) => {
  const index = dimension?.category?.index;
  if (!index) return [] as Array<[string, number]>;
  if (Array.isArray(index)) return index.map((code, position) => [code, position] as [string, number]);
  return Object.entries(index).sort((left, right) => left[1] - right[1]);
};

const sparseValue = <T,>(values: Record<string, T> | Array<T | null> | undefined, index: number) => {
  if (!values) return undefined;
  const value = Array.isArray(values) ? values[index] : values[String(index)];
  return value === null ? undefined : value;
};

const sourceFlag = (status?: string): BenchmarkPoint['flag'] => {
  if (!status) return undefined;
  if (status.includes('p')) return 'provisional';
  if (status.includes('e')) return 'estimated';
  return undefined;
};

export async function fetchBenchmarkSeries(
  benchmarkId: BenchmarkId,
  signal?: AbortSignal,
): Promise<BenchmarkSeriesResult> {
  const benchmark = internationalBenchmarks[benchmarkId];
  const response = await fetch(benchmark.apiUrl, { signal });
  if (!response.ok) throw new Error(`Eurostat svarade med ${response.status}`);

  const payload = await response.json() as JsonStatResponse;
  const dimensions = payload.id ?? [];
  const sizes = payload.size ?? [];
  const geoDimension = dimensions.indexOf('geo');
  const timeDimension = dimensions.indexOf('time');
  if (geoDimension < 0 || timeDimension < 0 || dimensions.length !== sizes.length) {
    throw new Error('Eurostats svar saknar geografi eller tidsperiod.');
  }

  const geos = categoryEntries(payload.dimension?.geo);
  const periods = categoryEntries(payload.dimension?.time);
  const strides = sizes.map((_, dimensionIndex) =>
    sizes.slice(dimensionIndex + 1).reduce((product, size) => product * size, 1));
  const rawByGeo = new Map<string, BenchmarkPoint[]>();

  for (const [geoCode, geoPosition] of geos) {
    const points: BenchmarkPoint[] = [];
    for (const [period, timePosition] of periods) {
      const flatIndex = geoPosition * strides[geoDimension] + timePosition * strides[timeDimension];
      const sourceValue = sparseValue(payload.value, flatIndex);
      if (typeof sourceValue !== 'number') continue;
      points.push({
        period,
        order: periodOrder(period),
        value: benchmark.valueTransform === 'times100' ? sourceValue * 100 : sourceValue,
        flag: sourceFlag(sparseValue(payload.status, flatIndex)),
      });
    }
    if (points.length) rawByGeo.set(geoCode, points);
  }

  const output: Partial<Record<BenchmarkGeoId, BenchmarkPoint[]>> = {};
  const realGeos = benchmark.availableGeos.filter(
    (geo): geo is Exclude<BenchmarkGeoId, 'NORDIC_MEDIAN' | 'EU27_MEDIAN'> =>
      geo !== 'NORDIC_MEDIAN' && geo !== 'EU27_MEDIAN',
  );
  for (const geo of realGeos) {
    const points = rawByGeo.get(geo);
    if (points) output[geo] = points;
  }

  const allPeriods = Array.from(new Set(periods.map(([period]) => period)))
    .sort((left, right) => periodOrder(left) - periodOrder(right));
  const deriveMedian = (geographyCodes: readonly string[], minimumCoverage: number) =>
    allPeriods.flatMap((period) => {
      const values = geographyCodes.flatMap((geo) => {
        const point = rawByGeo.get(geo)?.find((candidate) => candidate.period === period);
        return point ? [point.value] : [];
      });
      const value = values.length >= minimumCoverage ? median(values) : null;
      return value === null ? [] : [{ period, order: periodOrder(period), value }];
    });

  const nordicMedian = deriveMedian(nordicReferenceGeos, 3);
  if (nordicMedian.length) output.NORDIC_MEDIAN = nordicMedian;

  if (benchmarkId === 'territorialEmissionsPerCapita') {
    const euMedian = deriveMedian(eu27CountryCodes, eu27CountryCodes.length);
    if (euMedian.length) output.EU27_MEDIAN = euMedian;
  }

  const returnedPeriods = Array.from(new Set(
    Object.values(output).flatMap((points) => points?.map((point) => point.period) ?? []),
  )).sort((left, right) => periodOrder(left) - periodOrder(right));

  if (!returnedPeriods.length) throw new Error('Eurostat returnerade inga värden för urvalet.');
  return { periods: returnedPeriods, series: output };
}
