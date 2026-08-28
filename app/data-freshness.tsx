export type DataStatus = 'preliminary' | 'final' | 'revised' | 'historical' | 'snapshot';

const statusLabels: Record<DataStatus, string> = {
  preliminary: 'Preliminär',
  final: 'Slutlig',
  revised: 'Reviderad',
  historical: 'Historisk studie',
  snapshot: 'Ögonblicksbild',
};

const topicTypes: Record<string, { status: DataStatus; dataType: string }> = {
  brottslighet: { status: 'final', dataType: 'Granskad registerstatistik' },
  migration: { status: 'final', dataType: 'Befolkningsregister' },
  arbetsloshet: { status: 'final', dataType: 'Urvalsundersökning' },
  privatekonomi: { status: 'final', dataType: 'Register och prisindex' },
  pensioner: { status: 'final', dataType: 'Administrativ statistik' },
  aldreomsorg: { status: 'final', dataType: 'Administrativ statistik' },
  'klimat-och-miljo': { status: 'preliminary', dataType: 'Inventering och modeller' },
  'invandring-och-brott': { status: 'historical', dataType: 'Avgränsad registerstudie' },
};

const factTypes: Record<string, { status: DataStatus; dataType: string }> = {
  'vardgarantin-2026': { status: 'preliminary', dataType: 'Administrativ månadsstatistik' },
  'skjutningar-2026': { status: 'preliminary', dataType: 'Operativ händelsestatistik' },
  'migration-och-brott': { status: 'historical', dataType: 'Avgränsad registerstudie' },
  'valet-2026': { status: 'snapshot', dataType: 'Valregister' },
};

export const getTopicFreshness = (slug: string) => topicTypes[slug] || { status: 'final' as const, dataType: 'Myndighetsstatistik' };
export const getFactFreshness = (slug: string) => factTypes[slug] || { status: 'final' as const, dataType: 'Myndighetsstatistik' };
export const dataStatusLabel = (status: DataStatus) => statusLabels[status];

export function DataFreshness({ period, checkedAt, status, dataType }: {
  period: string;
  checkedAt: string;
  status: DataStatus;
  dataType: string;
}) {
  return (
    <dl className="data-freshness" aria-label="Aktualitet och datatyp">
      <div><dt>Data till och med</dt><dd>{period}</dd></div>
      <div><dt>Kontrollerad</dt><dd>{checkedAt}</dd></div>
      <div><dt>Status</dt><dd><span data-status={status}>{statusLabels[status]}</span></dd></div>
      <div><dt>Datatyp</dt><dd>{dataType}</dd></div>
    </dl>
  );
}
