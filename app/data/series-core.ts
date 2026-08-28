import catalogManifestJson from '../../data/series/catalog.json';

export type Point = { year: number; value: number };

export const seriesGroups = [
  'Ekonomi & arbete',
  'Privatekonomi',
  'Migration & befolkning',
  'Brott & trygghet',
  'Hälsa & levnadsvanor',
  'Välfärd & utbildning',
  'Energi & klimat',
] as const;

export type SeriesGroup = (typeof seriesGroups)[number];

export type SeriesSource = {
  label: string;
  organization: string;
  dataset: string | null;
  datasetId: string;
  url: string;
  secondary: { label: string; url: string } | null;
};

export type RawSeries = {
  id: string;
  group: SeriesGroup;
  label: string;
  shortLabel: string;
  unit: string;
  color: string;
  caveat: string;
  source: SeriesSource;
  points: Point[];
};

export type SeriesProvenance = {
  storage: 'versioned-snapshot';
  cataloguedAt: string;
  firstYear: number;
  latestYear: number;
  observationCount: number;
  datasetId: string;
};

export type SeriesRelationship = {
  ids: [string, string];
  kind: 'mathematical-overlap';
  warning: string;
};

export type LabSeries = {
  id: string;
  group: SeriesGroup;
  label: string;
  shortLabel: string;
  unit: string;
  color: string;
  source: string;
  sourceUrl: string;
  secondarySource?: string;
  secondarySourceUrl?: string;
  caveat: string;
  points: Point[];
  provenance: SeriesProvenance;
};

type CatalogManifest = {
  schemaVersion: number;
  cataloguedAt: string;
  storage: string;
  updatePolicy: string;
  relationships: SeriesRelationship[];
  order: string[];
};

const manifest = catalogManifestJson as CatalogManifest;

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const assertManifest = () => {
  if (manifest.schemaVersion !== 1) throw new Error('Datakatalogen har en okänd schemaversion.');
  if (manifest.storage !== 'versioned-snapshot') throw new Error('Datakatalogens lagringsform är ogiltig.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.cataloguedAt)) throw new Error('Datakatalogen saknar giltigt katalogdatum.');
  if (!manifest.updatePolicy.trim()) throw new Error('Datakatalogen saknar uppdateringspolicy.');
  if (!Array.isArray(manifest.order) || !manifest.order.length || new Set(manifest.order).size !== manifest.order.length) {
    throw new Error('Datakatalogens serieordning är tom eller innehåller dubbletter.');
  }
  if (!Array.isArray(manifest.relationships)) throw new Error('Datakatalogens sambandsmetadata saknas.');
  for (const relationship of manifest.relationships) {
    if (relationship.kind !== 'mathematical-overlap' || relationship.ids.length !== 2 || !relationship.warning.trim()) {
      throw new Error('Datakatalogen innehåller ogiltig sambandsmetadata.');
    }
    if (relationship.ids[0] === relationship.ids[1] || relationship.ids.some((id) => !manifest.order.includes(id))) {
      throw new Error('Datakatalogens sambandsmetadata pekar på okända eller identiska serier.');
    }
  }
};

export const assertRawSeries = (series: RawSeries) => {
  if (!series.id || !manifest.order.includes(series.id)) throw new Error(`Okänt eller tomt serie-id: ${series.id}`);
  if (!seriesGroups.includes(series.group)) throw new Error(`Okänd ämnesgrupp för ${series.id}.`);
  if (!series.label.trim() || !series.shortLabel.trim() || !series.unit.trim()) throw new Error(`Ofullständig metadata för ${series.id}.`);
  if (!/^#[0-9a-f]{6}$/i.test(series.color)) throw new Error(`Ogiltig färg för ${series.id}.`);
  if (!series.caveat.trim()) throw new Error(`Metodbegränsning saknas för ${series.id}.`);
  if (!series.source.organization.trim() || !series.source.label.trim() || !series.source.datasetId.trim()) {
    throw new Error(`Källmetadata saknas för ${series.id}.`);
  }
  if (!isHttpsUrl(series.source.url)) throw new Error(`Originalkällan för ${series.id} måste vara en giltig HTTPS-länk.`);
  if (series.source.secondary && !isHttpsUrl(series.source.secondary.url)) {
    throw new Error(`Sekundärkällan för ${series.id} måste vara en giltig HTTPS-länk.`);
  }
  if (!Array.isArray(series.points) || series.points.length < 2) throw new Error(`För få observationer för ${series.id}.`);

  let previousYear = -Infinity;
  for (const point of series.points) {
    if (!Number.isInteger(point.year) || point.year <= previousYear) throw new Error(`Åren för ${series.id} måste vara unika och stigande.`);
    if (!Number.isFinite(point.value)) throw new Error(`Icke-numeriskt värde i ${series.id} för ${point.year}.`);
    previousYear = point.year;
  }
};

assertManifest();

export const seriesCatalogMetadata = {
  schemaVersion: manifest.schemaVersion,
  cataloguedAt: manifest.cataloguedAt,
  storage: manifest.storage as 'versioned-snapshot',
  updatePolicy: manifest.updatePolicy,
  relationships: manifest.relationships,
  seriesCount: manifest.order.length,
  order: manifest.order,
};

export const seriesRelationships = manifest.relationships;

export const normalizeSeries = (series: RawSeries): LabSeries => {
  assertRawSeries(series);
  const first = series.points[0];
  const latest = series.points.at(-1)!;
  return {
    id: series.id,
    group: series.group,
    label: series.label,
    shortLabel: series.shortLabel,
    unit: series.unit,
    color: series.color,
    source: series.source.label,
    sourceUrl: series.source.url,
    secondarySource: series.source.secondary?.label,
    secondarySourceUrl: series.source.secondary?.url,
    caveat: series.caveat,
    points: series.points,
    provenance: {
      storage: 'versioned-snapshot',
      cataloguedAt: manifest.cataloguedAt,
      firstYear: first.year,
      latestYear: latest.year,
      observationCount: series.points.length,
      datasetId: series.source.datasetId,
    },
  };
};

export const recordById = <T extends LabSeries>(series: T[]) => Object.fromEntries(
  series.map((item) => [item.id, item]),
) as Record<string, T>;
