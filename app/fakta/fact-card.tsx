import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { FactEntry } from './facts';
import { factPath } from './facts';
import { dataStatusLabel, getFactFreshness } from '../data-freshness';

export function FactCard({ fact, compact = false }: { fact: FactEntry; compact?: boolean }) {
  const freshness = getFactFreshness(fact.slug);
  return (
    <Link
      className={`fact-card${compact ? ' fact-card-compact' : ''}`}
      href={factPath(fact.slug)}
      style={{ '--fact-accent': fact.accent } as CSSProperties}
    >
      <span>{fact.topic} · {fact.period} · {dataStatusLabel(freshness.status)}</span>
      <h3>{fact.question}</h3>
      <div><strong>{fact.value}</strong><small>{fact.valueLabel}</small></div>
      <p>{fact.answer}</p>
      <footer><span>{fact.sourceOrganization}</span><i>Öppna facit →</i></footer>
    </Link>
  );
}
