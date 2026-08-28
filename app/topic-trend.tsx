import Link from 'next/link';
import { seriesById, type LabSeries } from './data/series-catalog';

type TopicTrendConfig = {
  ids: string[];
  title: string;
  summary: string;
  compareWith: string;
};

const topicTrendConfigs: Partial<Record<string, TopicTrendConfig>> = {
  brottslighet: {
    ids: ['deadlyViolence'],
    title: 'Dödligt våld 2002–2025',
    summary: '84 offer registrerades 2025, åtta färre än året före.',
    compareWith: 'insecurity',
  },
  migration: {
    ids: ['immigration'],
    title: 'Invandring 2000–2025',
    summary: '89 434 invandringar registrerades 2025, 23 procent färre än 2024.',
    compareWith: 'emigration',
  },
  arbetsloshet: {
    ids: ['unemployment'],
    title: 'Arbetslöshet 2001–2025',
    summary: 'Arbetslösheten steg från 8,4 till 8,8 procent mellan 2024 och 2025.',
    compareWith: 'gdpPerCapita',
  },
  privatekonomi: {
    ids: ['economicStandard'],
    title: 'Ekonomisk standard 2011–2024',
    summary: 'Medianen återhämtades 2024 men låg fortfarande under nivån 2021.',
    compareWith: 'foodPrices',
  },
  pensioner: {
    ids: ['realPension'],
    title: 'Allmän pension i fasta priser 2003–2023',
    summary: 'Den reala genomsnittspensionen var lägre 2023 än under 2021 och 2022.',
    compareWith: 'economicStandard',
  },
  aldreomsorg: {
    ids: ['homeCare', 'specialHousing'],
    title: 'Hemtjänst och särskilt boende 2014–2025',
    summary: 'Andelen personer 65+ med respektive insats har minskat i båda serierna.',
    compareWith: 'specialHousing',
  },
};

function formatValue(value: number, unit: string) {
  const digits = Number.isInteger(value) ? 0 : 2;
  const display = value.toLocaleString('sv-SE', { maximumFractionDigits: digits });
  if (unit === 'personer' || unit === 'offer') return `${display} ${unit}`;
  if (unit === 'procent') return `${display} %`;
  if (unit.startsWith('tkr/')) return `${display} tkr`;
  if (unit.startsWith('kr/')) return `${display} kr`;
  return `${display} ${unit}`;
}

function TrendChart({ series }: { series: LabSeries[] }) {
  const width = 1120;
  const height = 330;
  const padding = { top: 32, right: 34, bottom: 46, left: 68 };
  const allPoints = series.flatMap((item) => item.points);
  const years = allPoints.map((point) => point.year);
  const values = allPoints.map((point) => point.value);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const spread = rawMax - rawMin || Math.abs(rawMax) || 1;
  const minValue = Math.max(0, rawMin - spread * 0.12);
  const maxValue = rawMax + spread * 0.12;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const x = (year: number) => padding.left + ((year - minYear) / Math.max(maxYear - minYear, 1)) * plotWidth;
  const y = (value: number) => padding.top + ((maxValue - value) / Math.max(maxValue - minValue, 1)) * plotHeight;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => maxValue - (maxValue - minValue) * ratio);

  return (
    <svg
      className="topic-trend-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${series.map((item) => item.label).join(' och ')} från ${minYear} till ${maxYear}`}
    >
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} />
          <text x={padding.left - 12} y={y(tick) + 4} textAnchor="end">{tick.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}</text>
        </g>
      ))}
      {series.map((item) => {
        const points = item.points.map((point) => `${x(point.year)},${y(point.value)}`).join(' ');
        const latest = item.points[item.points.length - 1];
        return (
          <g key={item.id}>
            <polyline points={points} fill="none" stroke={item.color} />
            {item.points.map((point) => (
              <circle key={point.year} cx={x(point.year)} cy={y(point.value)} r={point.year === latest.year ? 5 : 2.8} fill="#fffdfa" stroke={item.color}>
                <title>{`${item.shortLabel} ${point.year}: ${formatValue(point.value, item.unit)}`}</title>
              </circle>
            ))}
          </g>
        );
      })}
      <text x={padding.left} y={height - 13}>{minYear}</text>
      <text x={width - padding.right} y={height - 13} textAnchor="end">{maxYear}</text>
    </svg>
  );
}

export function TopicTrend({ slug }: { slug: string }) {
  const config = topicTrendConfigs[slug];
  if (!config) return null;
  const series = config.ids.map((id) => seriesById[id]).filter(Boolean);
  if (!series.length) return null;
  const years = Array.from(new Set(series.flatMap((item) => item.points.map((point) => point.year)))).sort((a, b) => a - b);
  const comparisonId = config.compareWith === series[0].id && series[1] ? series[1].id : config.compareWith;
  const compareHref = `/datastudio?seriesA=${series[0].id}&seriesB=${comparisonId}&view=timeline#datastudio`;

  return (
    <section className="topic-trend" aria-labelledby={`topic-trend-${slug}`}>
      <div className="topic-trend-heading">
        <div>
          <p className="section-kicker">Utvecklingen över tid</p>
          <h2 id={`topic-trend-${slug}`}>{config.title}</h2>
        </div>
        <p>{config.summary}</p>
      </div>
      <div className="topic-trend-visual">
        <div className="topic-trend-chart-scroll" tabIndex={0} role="region" aria-label="Rullbart diagram">
          <TrendChart series={series} />
        </div>
        <div className="topic-trend-legend" aria-label="Senaste värden">
          {series.map((item) => {
            const latest = item.points[item.points.length - 1];
            return (
              <div key={item.id}>
                <span style={{ background: item.color }} aria-hidden="true" />
                <p>{item.shortLabel}</p>
                <strong>{formatValue(latest.value, item.unit)}</strong>
                <small>{latest.year}</small>
              </div>
            );
          })}
        </div>
      </div>
      <div className="topic-trend-actions">
        <details>
          <summary>Visa alla värden</summary>
          <div>
            <table>
              <thead><tr><th scope="col">År</th>{series.map((item) => <th scope="col" key={item.id}>{item.shortLabel}</th>)}</tr></thead>
              <tbody>
                {years.map((year) => (
                  <tr key={year}>
                    <th scope="row">{year}</th>
                    {series.map((item) => {
                      const point = item.points.find((candidate) => candidate.year === year);
                      return <td key={item.id}>{point ? formatValue(point.value, item.unit) : '–'}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <Link href={compareHref}>Jämför med ett annat mått <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
