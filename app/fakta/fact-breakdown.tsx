import type { FactEntry } from './facts';

const outcomes = [
  { key: 'completed', label: 'Fullbordade' },
  { key: 'failed', label: 'Misslyckade' },
  { key: 'foiled', label: 'Avvärjda' },
] as const;

export function FactBreakdownChart({ fact }: { fact: FactEntry }) {
  if (!fact.breakdown) return null;
  const maximum = Math.max(...fact.breakdown.items.map((item) => item.total), 1);

  return (
    <section className="fact-breakdown-shell" aria-labelledby="fact-breakdown-heading">
      <div className="fact-chart-heading">
        <div>
          <span>Europols klassificering</span>
          <h2 id="fact-breakdown-heading">{fact.breakdown.title}</h2>
        </div>
        <small>{fact.breakdown.context}</small>
      </div>

      <div className="fact-breakdown-legend" aria-label="Teckenförklaring">
        {outcomes.map((outcome) => <span className={outcome.key} key={outcome.key}><i />{outcome.label}</span>)}
      </div>

      <div className="fact-breakdown-list">
        {fact.breakdown.items.map((item) => (
          <article key={item.label}>
            <div className="fact-breakdown-label"><strong>{item.label}</strong><b>{item.total}</b></div>
            <div className="fact-breakdown-track">
              <div
                className="fact-breakdown-total"
                style={{ width: `${(item.total / maximum) * 100}%` }}
                role="img"
                aria-label={`${item.label}: ${item.total} totalt, ${item.completed} fullbordade, ${item.failed} misslyckade och ${item.foiled} avvärjda`}
              >
                {outcomes.map((outcome) => {
                  const value = item[outcome.key];
                  if (!value || !item.total) return null;
                  return <span className={outcome.key} style={{ width: `${(value / item.total) * 100}%` }} key={outcome.key} />;
                })}
              </div>
            </div>
            <div className="fact-breakdown-counts">
              {outcomes.map((outcome) => <span key={outcome.key}><strong>{item[outcome.key]}</strong> {outcome.label.toLocaleLowerCase('sv-SE')}</span>)}
            </div>
          </article>
        ))}
      </div>

      <p className="fact-breakdown-note"><strong>Så ska grafen läsas:</strong> {fact.breakdown.note}</p>

      <details className="fact-data-table">
        <summary>Visa exakta värden <span>+</span></summary>
        <div className="fact-breakdown-table-wrap">
          <table>
            <thead><tr><th scope="col">Kategori</th><th scope="col">Totalt</th><th scope="col">Fullbordade</th><th scope="col">Misslyckade</th><th scope="col">Avvärjda</th></tr></thead>
            <tbody>
              {fact.breakdown.items.map((item) => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.total}</td><td>{item.completed}</td><td>{item.failed}</td><td>{item.foiled}</td></tr>)}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
