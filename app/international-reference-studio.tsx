'use client';

import { track } from '@vercel/analytics';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  benchmarkGeoColors,
  benchmarkGeoLabels,
  benchmarkIds,
  fetchBenchmarkSeries,
  formatBenchmarkValue,
  internationalBenchmarks,
  periodOrder,
  type BenchmarkGeoId,
  type BenchmarkId,
  type BenchmarkPoint,
  type BenchmarkSeriesResult,
} from './international-reference-data';

type LoadState = {
  status: 'ready' | 'fallback';
  result: BenchmarkSeriesResult;
};

const defaultBenchmark: BenchmarkId = 'unemployment';
const maximumGeographies = 6;

const snapshotResult = (benchmarkId: BenchmarkId): BenchmarkSeriesResult => {
  const benchmark = internationalBenchmarks[benchmarkId];
  return {
    periods: [benchmark.latestCommonPeriod],
    series: Object.fromEntries(benchmark.snapshot.map((item) => [
      item.geoCode,
      [{
        period: benchmark.latestCommonPeriod,
        order: periodOrder(benchmark.latestCommonPeriod),
        value: item.value,
        flag: item.flag,
      }],
    ])) as Partial<Record<BenchmarkGeoId, BenchmarkPoint[]>>,
  };
};

const safeBenchmarkId = (value: string | null): BenchmarkId =>
  value && benchmarkIds.includes(value as BenchmarkId) ? value as BenchmarkId : defaultBenchmark;

const defaultPeriodWindow = (periods: string[], periodType: 'year' | 'semester') => {
  if (!periods.length) return { from: '', to: '' };
  const count = periodType === 'semester' ? 20 : 11;
  return { from: periods[Math.max(0, periods.length - count)], to: periods[periods.length - 1] };
};

function valueAt(points: BenchmarkPoint[] | undefined, period: string) {
  return points?.find((point) => point.period === period);
}

function InternationalLineChart({
  benchmarkId,
  geographies,
  periods,
  series,
}: {
  benchmarkId: BenchmarkId;
  geographies: BenchmarkGeoId[];
  periods: string[];
  series: BenchmarkSeriesResult['series'];
}) {
  const benchmark = internationalBenchmarks[benchmarkId];
  const width = 760;
  const height = 350;
  const padding = { left: 62, right: 22, top: 30, bottom: 50 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const points = geographies.flatMap((geo) => series[geo]?.filter((point) => periods.includes(point.period)) ?? []);
  if (!points.length) return <p className="international-studio-empty">Inga värden finns för det valda urvalet.</p>;

  const values = points.map((point) => point.value);
  const rawMinimum = Math.min(...values);
  const rawMaximum = Math.max(...values);
  const margin = Math.max((rawMaximum - rawMinimum) * 0.12, Math.abs(rawMaximum) * 0.04, .1);
  const minimum = Math.max(0, rawMinimum - margin);
  const maximum = rawMaximum + margin;
  const yFor = (value: number) => padding.top + ((maximum - value) / Math.max(maximum - minimum, Number.EPSILON)) * plotHeight;
  const xFor = (period: string) => padding.left + (periods.indexOf(period) / Math.max(periods.length - 1, 1)) * plotWidth;
  const xTickIndexes = Array.from(new Set([0, Math.floor((periods.length - 1) / 3), Math.floor((periods.length - 1) * 2 / 3), periods.length - 1]));
  const yTicks = Array.from({ length: 5 }, (_, index) => minimum + ((maximum - minimum) / 4) * index);

  return (
    <div className="international-chart" role="region" aria-label={`Diagram över ${benchmark.label}`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${benchmark.label} för ${geographies.map((geo) => benchmarkGeoLabels[geo]).join(', ')}`}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={yFor(tick)} y2={yFor(tick)} className="international-chart-grid" />
            <text x={padding.left - 10} y={yFor(tick) + 4} textAnchor="end">{tick.toLocaleString('sv-SE', { maximumFractionDigits: benchmark.valueDigits })}</text>
          </g>
        ))}
        {xTickIndexes.map((index) => (
          <text key={periods[index]} x={xFor(periods[index])} y={height - 18} textAnchor={index === 0 ? 'start' : index === periods.length - 1 ? 'end' : 'middle'}>{periods[index]}</text>
        ))}
        {geographies.map((geo) => {
          const visible = series[geo]?.filter((point) => periods.includes(point.period)) ?? [];
          const polyline = visible.map((point) => `${xFor(point.period)},${yFor(point.value)}`).join(' ');
          return (
            <g key={geo}>
              {visible.length > 1 && <polyline points={polyline} fill="none" stroke={benchmarkGeoColors[geo]} className={geo === 'SE' ? 'is-sweden' : ''} />}
              {visible.map((point) => (
                <circle key={point.period} cx={xFor(point.period)} cy={yFor(point.value)} r={geo === 'SE' ? 4.2 : 3.1} fill={benchmarkGeoColors[geo]}>
                  <title>{benchmarkGeoLabels[geo]} · {point.period}: {formatBenchmarkValue(benchmark, point.value)}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function InternationalReferenceStudio() {
  const [open, setOpen] = useState(false);
  const [benchmarkId, setBenchmarkId] = useState<BenchmarkId>(defaultBenchmark);
  const [geographies, setGeographies] = useState<BenchmarkGeoId[]>(internationalBenchmarks[defaultBenchmark].defaultGeos);
  const [fromPeriod, setFromPeriod] = useState('');
  const [toPeriod, setToPeriod] = useState('');
  const [loads, setLoads] = useState<Partial<Record<BenchmarkId, LoadState>>>({});
  const [urlReady, setUrlReady] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'done' | 'failed'>('idle');
  const requestedPeriod = useRef<{ benchmarkId: BenchmarkId; from: string | null; to: string | null } | null>(null);
  const benchmark = internationalBenchmarks[benchmarkId];
  const load = loads[benchmarkId];
  const result = load?.result;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedBenchmark = safeBenchmarkId(params.get('benchmark'));
    const hasBenchmark = params.has('benchmark');
    const requestedGeos = (params.get('benchmarkGeos') ?? '')
      .split(',')
      .filter((geo): geo is BenchmarkGeoId => internationalBenchmarks[requestedBenchmark].availableGeos.includes(geo as BenchmarkGeoId))
      .slice(0, maximumGeographies);
    requestedPeriod.current = {
      benchmarkId: requestedBenchmark,
      from: params.get('benchmarkFrom'),
      to: params.get('benchmarkTo'),
    };
    // URL-parametrarna finns först i webbläsaren och uppdateringarna batchas av React.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBenchmarkId(requestedBenchmark);
    setGeographies(requestedGeos.length ? requestedGeos : internationalBenchmarks[requestedBenchmark].defaultGeos);
    setOpen(hasBenchmark || window.location.hash === '#internationell-referens');
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!open || load) return;
    const controller = new AbortController();
    fetchBenchmarkSeries(benchmarkId, controller.signal)
      .then((nextResult) => setLoads((current) => ({
        ...current,
        [benchmarkId]: { status: 'ready', result: nextResult },
      })))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoads((current) => ({
          ...current,
          [benchmarkId]: { status: 'fallback', result: snapshotResult(benchmarkId) },
        }));
      });
    return () => controller.abort();
  }, [benchmarkId, load, open]);

  useEffect(() => {
    if (!result?.periods.length) return;
    const periods = result.periods;
    const requested = requestedPeriod.current?.benchmarkId === benchmarkId ? requestedPeriod.current : null;
    const defaults = defaultPeriodWindow(periods, benchmark.periodType);
    const nextFrom = requested?.from && periods.includes(requested.from) ? requested.from : defaults.from;
    const nextTo = requested?.to && periods.includes(requested.to) ? requested.to : defaults.to;
    requestedPeriod.current = null;
    // Tidsintervallet bestäms när den harmoniserade serien har hämtats.
    setFromPeriod(periodOrder(nextFrom) <= periodOrder(nextTo) ? nextFrom : nextTo);
    setToPeriod(periodOrder(nextFrom) <= periodOrder(nextTo) ? nextTo : nextFrom);
  }, [benchmark.periodType, benchmarkId, result]);

  const visiblePeriods = useMemo(() => {
    if (!result) return [];
    const start = fromPeriod || result.periods[0];
    const end = toPeriod || result.periods[result.periods.length - 1];
    return result.periods.filter((period) => periodOrder(period) >= periodOrder(start) && periodOrder(period) <= periodOrder(end));
  }, [fromPeriod, result, toPeriod]);

  useEffect(() => {
    if (!urlReady || !open || !fromPeriod || !toPeriod) return;
    const params = new URLSearchParams();
    params.set('benchmark', benchmarkId);
    params.set('benchmarkGeos', geographies.join(','));
    params.set('benchmarkFrom', fromPeriod);
    params.set('benchmarkTo', toPeriod);
    window.history.replaceState(null, '', `/datastudio?${params.toString()}#internationell-referens`);
  }, [benchmarkId, fromPeriod, geographies, open, toPeriod, urlReady]);

  const selectBenchmark = (nextId: BenchmarkId) => {
    const next = internationalBenchmarks[nextId];
    setBenchmarkId(nextId);
    setGeographies(next.defaultGeos);
    setFromPeriod('');
    setToPeriod('');
    requestedPeriod.current = null;
    setShareStatus('idle');
  };

  const toggleGeography = (geo: BenchmarkGeoId) => {
    setShareStatus('idle');
    setGeographies((current) => {
      if (current.includes(geo)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== geo);
      }
      if (current.length >= maximumGeographies) return current;
      return [...current, geo];
    });
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('utm_source', 'delning');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'internationell_referens');
    let shareMethod: 'native' | 'copy_link' = 'copy_link';
    try {
      if (navigator.share) {
        shareMethod = 'native';
        await navigator.share({
          title: `${benchmark.label} – Sverige i internationell jämförelse`,
          text: `Jämför Sverige med Norden och EU med harmoniserad statistik från Eurostat.`,
          url: url.toString(),
        });
      } else {
        await navigator.clipboard.writeText(url.toString());
      }
      setShareStatus('done');
      track('share', { method: shareMethod, content_type: 'international_benchmark' });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareStatus('failed');
    }
  };

  const latestPeriod = visiblePeriods[visiblePeriods.length - 1];

  return (
    <section className="international-studio" id="internationell-referens" aria-labelledby="international-studio-heading">
      <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary>
          <span>Internationell referens</span>
          <div>
            <h2 id="international-studio-heading">Sätt Sverige i perspektiv</h2>
            <p>Jämför samma mått mellan länder utan att blanda nationella definitioner.</p>
          </div>
          <i aria-hidden="true">Öppna</i>
        </summary>
        <div className="international-studio-body">
          <div className="international-studio-intro">
            <p>Det här är ett separat verktyg från korrelationsstudion ovan. Alla värden i en vy kommer från samma harmoniserade Eurostat-serie.</p>
            <span>Ingen ranking · ingen orsakstolkning</span>
          </div>

          <div className="international-studio-controls">
            <label>
              <span>Mått</span>
              <select value={benchmarkId} onChange={(event) => selectBenchmark(event.target.value as BenchmarkId)}>
                {benchmarkIds.map((id) => <option value={id} key={id}>{internationalBenchmarks[id].label}</option>)}
              </select>
            </label>
            <div className="international-geo-control">
              <span>Länder och referenser <small>{geographies.length}/{maximumGeographies}</small></span>
              <div role="group" aria-label="Välj länder och referenser">
                {benchmark.availableGeos.map((geo) => (
                  <button
                    type="button"
                    key={geo}
                    className={geographies.includes(geo) ? 'active' : ''}
                    aria-pressed={geographies.includes(geo)}
                    disabled={!geographies.includes(geo) && geographies.length >= maximumGeographies}
                    onClick={() => toggleGeography(geo)}
                  >
                    <i style={{ background: benchmarkGeoColors[geo] }} />{benchmarkGeoLabels[geo]}
                  </button>
                ))}
              </div>
            </div>
            <div className="international-period-controls">
              <label><span>Från</span><select value={fromPeriod} disabled={!result} onChange={(event) => setFromPeriod(event.target.value)}>{result?.periods.filter((period) => !toPeriod || periodOrder(period) <= periodOrder(toPeriod)).map((period) => <option key={period}>{period}</option>)}</select></label>
              <label><span>Till</span><select value={toPeriod} disabled={!result} onChange={(event) => setToPeriod(event.target.value)}>{result?.periods.filter((period) => !fromPeriod || periodOrder(period) >= periodOrder(fromPeriod)).map((period) => <option key={period}>{period}</option>)}</select></label>
            </div>
          </div>

          {open && !load && <p className="international-studio-status" role="status">Hämtar den senaste serien från Eurostat…</p>}
          {load?.status === 'fallback' && <p className="international-studio-status is-warning" role="status">Eurostat kunde inte nås just nu. Senast kontrollerade jämförelsevärden visas.</p>}

          {result && (
            <>
              <div className="international-studio-legend" aria-label="Valda länder">
                {geographies.map((geo) => <span key={geo}><i style={{ background: benchmarkGeoColors[geo] }} />{benchmarkGeoLabels[geo]}</span>)}
              </div>
              <InternationalLineChart benchmarkId={benchmarkId} geographies={geographies} periods={visiblePeriods} series={result.series} />
              {latestPeriod && (
                <div className="international-latest-values" aria-label={`Värden ${latestPeriod}`}>
                  <strong>{latestPeriod}</strong>
                  {geographies.map((geo) => {
                    const point = valueAt(result.series[geo], latestPeriod);
                    return point ? <span key={geo}><small>{benchmarkGeoLabels[geo]}</small><b>{formatBenchmarkValue(benchmark, point.value)}{point.flag === 'provisional' ? ' (prel.)' : point.flag === 'estimated' ? ' (skattat)' : ''}</b></span> : null;
                  })}
                </div>
              )}
              <details className="international-exact-table">
                <summary>Visa exakta värden</summary>
                <div>
                  <table>
                    <thead><tr><th>Period</th>{geographies.map((geo) => <th key={geo}>{benchmarkGeoLabels[geo]}</th>)}</tr></thead>
                    <tbody>
                      {[...visiblePeriods].reverse().map((period) => (
                        <tr key={period}>
                          <th>{period}</th>
                          {geographies.map((geo) => {
                            const point = valueAt(result.series[geo], period);
                            return <td key={geo}>{point ? point.value.toLocaleString('sv-SE', { minimumFractionDigits: benchmark.valueDigits, maximumFractionDigits: benchmark.valueDigits }) : '–'}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}

          <div className="international-studio-method">
            <div><span>Definition</span><p>{benchmark.definition}</p></div>
            <div><span>Att tänka på</span><p>{benchmark.caveat}</p><p>{benchmark.differenceFromNational}</p></div>
          </div>
          <footer className="international-studio-footer">
            <div><a href={benchmark.sourceUrl} target="_blank" rel="noreferrer">{benchmark.source} · {benchmark.datasetCode} ↗</a><small>Uppdaterad {benchmark.sourceUpdated} · kontrollerad {benchmark.sourceChecked}</small></div>
            <button type="button" onClick={share}>{shareStatus === 'done' ? 'Länk klar ✓' : shareStatus === 'failed' ? 'Kunde inte dela' : 'Dela jämförelsen'}</button>
          </footer>
        </div>
      </details>
    </section>
  );
}
