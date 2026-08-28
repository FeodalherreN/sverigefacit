import { readFile, readdir } from 'node:fs/promises';

const directory = new URL('../data/series/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('catalog.json', directory), 'utf8'));
const catalog = {
  ...manifest,
  series: await Promise.all((manifest.order ?? []).map(async (id) =>
    JSON.parse(await readFile(new URL(`${id}.json`, directory), 'utf8')))),
};
const groups = new Set([
  'Ekonomi & arbete',
  'Privatekonomi',
  'Migration & befolkning',
  'Brott & trygghet',
  'Hälsa & levnadsvanor',
  'Välfärd & utbildning',
  'Energi & klimat',
]);

const fail = (message) => {
  throw new Error(`Datavalidering misslyckades: ${message}`);
};

if (catalog.schemaVersion !== 1) fail('okänd schemaversion');
if (catalog.storage !== 'versioned-snapshot') fail('ogiltig lagringsform');
if (!/^\d{4}-\d{2}-\d{2}$/.test(catalog.cataloguedAt ?? '')) fail('ogiltigt katalogdatum');
if (!catalog.updatePolicy?.trim()) fail('uppdateringspolicy saknas');
if (!Array.isArray(catalog.order) || !catalog.order.length || new Set(catalog.order).size !== catalog.order.length) fail('serieordningen är tom eller innehåller dubbletter');
if (!Array.isArray(catalog.relationships)) fail('sambandsmetadata saknas');
if (!Array.isArray(catalog.series) || !catalog.series.length) fail('tidsserier saknas');

const files = (await readdir(directory)).filter((file) => file.endsWith('.json') && file !== 'catalog.json').sort();
const expectedFiles = catalog.order.map((id) => `${id}.json`).sort();
if (files.join('\n') !== expectedFiles.join('\n')) fail('serie-filerna och katalogens ordning överensstämmer inte');

const ids = new Set();
let observationCount = 0;
for (const series of catalog.series) {
  if (!series.id || ids.has(series.id)) fail(`tomt eller duplicerat serie-id: ${series.id}`);
  ids.add(series.id);
  if (!groups.has(series.group)) fail(`okänd ämnesgrupp för ${series.id}`);
  if (!series.label?.trim() || !series.shortLabel?.trim() || !series.unit?.trim()) fail(`ofullständig metadata för ${series.id}`);
  if (!/^#[0-9a-f]{6}$/i.test(series.color ?? '')) fail(`ogiltig färg för ${series.id}`);
  if (!series.caveat?.trim()) fail(`metodbegränsning saknas för ${series.id}`);
  if (!series.source?.organization?.trim() || !series.source?.label?.trim() || !series.source?.datasetId?.trim()) {
    fail(`källmetadata saknas för ${series.id}`);
  }
  for (const source of [series.source.url, series.source.secondary?.url].filter(Boolean)) {
    try {
      if (new URL(source).protocol !== 'https:') fail(`källan för ${series.id} använder inte HTTPS`);
    } catch {
      fail(`ogiltig källänk för ${series.id}`);
    }
  }
  if (!Array.isArray(series.points) || series.points.length < 2) fail(`för få observationer för ${series.id}`);
  let previousYear = -Infinity;
  for (const point of series.points) {
    if (!Number.isInteger(point.year) || point.year <= previousYear) fail(`år måste vara unika och stigande för ${series.id}`);
    if (!Number.isFinite(point.value)) fail(`icke-numeriskt värde i ${series.id} för ${point.year}`);
    previousYear = point.year;
    observationCount += 1;
  }
}

if (catalog.order.join('\n') !== catalog.series.map((series) => series.id).join('\n')) {
  fail('serierna följer inte katalogens deklarerade ordning');
}

for (const relationship of catalog.relationships) {
  if (relationship.kind !== 'mathematical-overlap' || relationship.ids?.length !== 2 || !relationship.warning?.trim()) {
    fail('ogiltig sambandsmetadata');
  }
  if (relationship.ids[0] === relationship.ids[1] || relationship.ids.some((id) => !ids.has(id))) {
    fail('sambandsmetadata pekar på okända eller identiska serier');
  }
}

console.log(`Datakatalogen är giltig: ${ids.size} serier och ${observationCount} observationer.`);
