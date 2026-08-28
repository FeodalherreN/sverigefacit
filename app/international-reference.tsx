import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  benchmarkGeoColors,
  formatBenchmarkValue,
  internationalBenchmarks,
  type BenchmarkGeoId,
  type BenchmarkId,
} from './international-reference-data';

function BenchmarkRow({ benchmarkId }: { benchmarkId: BenchmarkId }) {
  const benchmark = internationalBenchmarks[benchmarkId];
  const references = benchmark.defaultGeos.flatMap((geoCode) => {
    const snapshot = benchmark.snapshot.find((item) => item.geoCode === geoCode);
    return snapshot ? [snapshot] : [];
  });
  const values = references.map((item) => item.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = Math.max(maximum - minimum, Math.abs(maximum) * 0.12, 1);
  const lowerBound = minimum - span * 0.12;
  const upperBound = maximum + span * 0.12;
  const position = (value: number) => `${((value - lowerBound) / (upperBound - lowerBound)) * 100}%`;
  const studioGeos = benchmark.defaultGeos.join(',');
  const studioLink = `/datastudio?benchmark=${benchmark.id}&benchmarkGeos=${studioGeos}#internationell-referens`;

  return (
    <details className="international-reference-row">
      <summary>
        <span className="international-reference-title">
          <strong>{benchmark.shortLabel}</strong>
          <small>{benchmark.periodLabel}</small>
        </span>
        <span className="international-reference-summary-values">
          {references.map((item) => (
            <span key={item.geoCode}>
              <small>{item.label}</small>
              <strong>{item.value.toLocaleString('sv-SE', {
                minimumFractionDigits: benchmark.valueDigits,
                maximumFractionDigits: benchmark.valueDigits,
              })}</strong>
            </span>
          ))}
        </span>
        <span className="international-reference-toggle" aria-hidden="true">Visa</span>
      </summary>
      <div className="international-reference-detail">
        <p className="international-reference-definition">{benchmark.definition}</p>
        <div className="international-reference-plot" role="img" aria-label={`${benchmark.label}: Sverige jämfört med nordisk median och europeisk referens, ${benchmark.periodLabel}`}>
          <div className="international-reference-axis" />
          {references.map((item) => (
            <div className="international-reference-dot-row" key={item.geoCode}>
              <span>{item.label}</span>
              <i
                style={{
                  '--reference-position': position(item.value),
                  '--reference-color': benchmarkGeoColors[item.geoCode as BenchmarkGeoId],
                } as CSSProperties}
              />
              <strong>{formatBenchmarkValue(benchmark, item.value)}</strong>
            </div>
          ))}
        </div>
        <div className="international-reference-notes">
          <p><strong>Jämförbarhet: {benchmark.comparability === 'high' ? 'hög' : 'med förbehåll'}.</strong> {benchmark.caveat}</p>
          <p>{benchmark.differenceFromNational}</p>
        </div>
        <div className="international-reference-links">
          <Link href={studioLink}>Jämför fler länder och år i Datastudion <span>→</span></Link>
          <a href={benchmark.sourceUrl} target="_blank" rel="noreferrer">{benchmark.source} · {benchmark.datasetCode} <span>↗</span></a>
        </div>
        <small className="international-reference-meta">Källan uppdaterad {benchmark.sourceUpdated}. Kontrollerad {benchmark.sourceChecked}.</small>
      </div>
    </details>
  );
}

export function InternationalReference({
  benchmarkIds,
  heading = 'Hur ligger Sverige till?',
}: {
  benchmarkIds: BenchmarkId[];
  heading?: string;
}) {
  if (!benchmarkIds.length) return null;

  return (
    <section className="international-reference" aria-labelledby="international-reference-heading">
      <header>
        <div>
          <span>Internationell referens</span>
          <h2 id="international-reference-heading">{heading}</h2>
        </div>
        <p>Samma harmoniserade mått används för Sverige och jämförelseländerna. Det ger perspektiv, inte ett politiskt betyg.</p>
      </header>
      <div className="international-reference-list">
        {benchmarkIds.map((benchmarkId) => <BenchmarkRow benchmarkId={benchmarkId} key={benchmarkId} />)}
      </div>
    </section>
  );
}
