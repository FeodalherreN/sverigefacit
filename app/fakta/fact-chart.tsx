import type { FactEntry } from './facts';

export function FactChart({ fact }: { fact: FactEntry }) {
  if (!fact.points || fact.points.length < 2) return null;
  const width = 680;
  const height = 250;
  const left = 38;
  const right = 18;
  const top = 25;
  const bottom = 42;
  const values = fact.points.map((point) => point.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = (maximum - minimum || 1) * 0.18;
  const minValue = minimum - padding;
  const maxValue = maximum + padding;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const xFor = (index: number) => left + (index / Math.max(fact.points!.length - 1, 1)) * plotWidth;
  const yFor = (value: number) => top + ((maxValue - value) / Math.max(maxValue - minValue, 1)) * plotHeight;
  const polyline = fact.points.map((point, index) => `${xFor(index)},${yFor(point.value)}`).join(' ');

  return (
    <section className="fact-chart-shell" aria-labelledby="fact-chart-heading">
      <div className="fact-chart-heading">
        <div><span>Senaste utvecklingen</span><h2 id="fact-chart-heading">{fact.question}</h2></div>
        <small>{fact.unit}</small>
      </div>
      <svg className="fact-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${fact.question} från ${fact.points[0].year} till ${fact.points[fact.points.length - 1].year}`}>
        {[0, 1, 2, 3].map((index) => {
          const y = top + (index / 3) * plotHeight;
          return <line key={index} x1={left} x2={width - right} y1={y} y2={y} className="fact-grid-line" />;
        })}
        <polyline points={polyline} className="fact-data-line" style={{ stroke: fact.accent }} />
        {fact.points.map((point, index) => (
          <g key={point.year}>
            <circle cx={xFor(index)} cy={yFor(point.value)} r={index === fact.points!.length - 1 ? 5.5 : 3.5} fill="#fffdfa" stroke={fact.accent} strokeWidth="2.5">
              <title>{`${point.year}: ${point.display}`}</title>
            </circle>
            {(index === 0 || index === fact.points!.length - 1) && <text x={xFor(index)} y={height - 15} textAnchor={index === 0 ? 'start' : 'end'}>{point.year}</text>}
          </g>
        ))}
      </svg>
      <div className="fact-chart-latest"><span>{fact.points[fact.points.length - 1].year}</span><strong>{fact.points[fact.points.length - 1].display}</strong></div>
      <details className="fact-data-table">
        <summary>Visa alla värden <span>+</span></summary>
        <table><thead><tr><th scope="col">År</th><th scope="col">Värde</th></tr></thead><tbody>{fact.points.map((point) => <tr key={point.year}><th scope="row">{point.year}</th><td>{point.display}</td></tr>)}</tbody></table>
      </details>
    </section>
  );
}
