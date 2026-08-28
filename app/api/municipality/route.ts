type KoladaValue = {
  gender: string;
  value: number | null;
  status: string;
  isdeleted: boolean;
};

type KoladaRecord = {
  kpi: string;
  municipality: string;
  period: number;
  values: KoladaValue[];
};

const metricConfig = [
  {
    id: 'N01951',
    label: 'Invånare',
    shortLabel: 'Befolkning',
    unit: 'personer',
    digits: 0,
    source: 'SCB via Kolada',
    comparison: 'change',
    caveat: 'Avser folkbokförda invånare den 31 december.',
  },
  {
    id: 'N15428',
    label: 'Gymnasiebehöriga i årskurs 9',
    shortLabel: 'Skola',
    unit: 'procent',
    digits: 1,
    source: 'SCB och Skolverket via Kolada',
    comparison: 'national',
    caveat: 'Avser elever folkbokförda i kommunen. Elevsammansättning påverkar råa jämförelser.',
  },
  {
    id: 'N00989',
    label: 'Skuldsatta hos Kronofogden',
    shortLabel: 'Hushållsekonomi',
    unit: 'procent av invånare 18+',
    digits: 1,
    source: 'Kronofogden via Kolada',
    comparison: 'national',
    caveat: 'Avser fysiska personer 18 år och äldre med registrerad skuld.',
  },
  {
    id: 'N07403',
    label: 'Anmälda våldsbrott',
    shortLabel: 'Brott och trygghet',
    unit: 'per 100 000 invånare',
    digits: 0,
    source: 'Brå och SCB via Kolada',
    comparison: 'national',
    caveat: 'Anmälda brott är inte samma sak som faktiskt begångna brott. Bortfall i brottsplats kan variera.',
  },
] as const;

const extractTotal = (record: KoladaRecord | undefined) => record?.values.find(
  (value) => value.gender === 'T' && !value.isdeleted && typeof value.value === 'number',
)?.value ?? null;

export async function GET(request: Request) {
  const municipalityId = new URL(request.url).searchParams.get('id') || '';
  if (!/^\d{4}$/.test(municipalityId) || municipalityId === '0000') {
    return Response.json({ error: 'Ogiltig kommunkod.' }, { status: 400 });
  }

  const query = new URLSearchParams({ per_page: '200' });
  [municipalityId, '0000'].forEach((id) => query.append('municipality_id', id));
  metricConfig.forEach((metric) => query.append('kpi_id', metric.id));
  [2024, 2025].forEach((year) => query.append('year', String(year)));

  try {
    const response = await fetch(`https://api.kolada.se/v3/data/?${query.toString()}`, {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Kolada svarade med ${response.status}`);
    const payload = await response.json() as { values?: KoladaRecord[] };
    const records = payload.values || [];

    const metrics = metricConfig.map((metric) => {
      const municipalityRecords = records
        .filter((record) => record.kpi === metric.id && record.municipality === municipalityId)
        .sort((left, right) => right.period - left.period);
      const latestRecord = municipalityRecords.find((record) => extractTotal(record) !== null);
      const latestYear = latestRecord?.period ?? null;
      const previousRecord = municipalityRecords.find((record) => record.period < (latestYear ?? 0) && extractTotal(record) !== null);
      const nationalRecord = records.find(
        (record) => record.kpi === metric.id && record.municipality === '0000' && record.period === latestYear,
      );

      return {
        ...metric,
        value: extractTotal(latestRecord),
        previousValue: extractTotal(previousRecord),
        nationalValue: extractTotal(nationalRecord),
        period: latestYear,
        previousPeriod: previousRecord?.period ?? null,
      };
    });

    return Response.json(
      {
        municipalityId,
        metrics,
        checkedAt: new Date().toISOString(),
        status: 'Koladas senast publicerade värde',
        sourceUrl: 'https://www.kolada.se/om-oss/api/',
      },
      { headers: { 'cache-control': 'public, max-age=1800, s-maxage=21600' } },
    );
  } catch {
    return Response.json(
      { error: 'Kommunstatistiken kunde inte hämtas just nu.' },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    );
  }
}
