'use client';

import { useMemo, useState } from 'react';
import { FactCard } from './fact-card';
import { facts } from './facts';

type FactFilter = 'current' | 'welfare' | 'safety' | 'economy' | 'all';

const filters: Array<{ id: FactFilter; label: string }> = [
  { id: 'current', label: 'Aktuellt' },
  { id: 'welfare', label: 'Välfärd' },
  { id: 'safety', label: 'Trygghet & migration' },
  { id: 'economy', label: 'Ekonomi & jobb' },
  { id: 'all', label: `Alla ${facts.length}` },
];

const welfareTopics = new Set(['Sjukvård', 'Skola', 'Pension', 'Äldreomsorg']);
const safetyTopics = new Set(['Lag & ordning', 'Brott & trygghet', 'Migration', 'Migration & brott']);
const economyTopics = new Set(['Jobb & ekonomi', 'Privatekonomi']);

export function FactsBrowser() {
  const [activeFilter, setActiveFilter] = useState<FactFilter>('current');
  const visibleFacts = useMemo(() => {
    if (activeFilter === 'current') return facts.slice(0, 6);
    if (activeFilter === 'welfare') return facts.filter((fact) => welfareTopics.has(fact.topic));
    if (activeFilter === 'safety') return facts.filter((fact) => safetyTopics.has(fact.topic));
    if (activeFilter === 'economy') return facts.filter((fact) => economyTopics.has(fact.topic));
    return facts;
  }, [activeFilter]);

  return (
    <section className="facts-browser" aria-labelledby="facts-browser-heading">
      <div className="facts-filter-bar">
        <div><span>Välj område</span><strong id="facts-browser-heading">{visibleFacts.length} verifierade facit</strong></div>
        <div role="group" aria-label="Filtrera faktakort">
          {filters.map((filter) => (
            <button type="button" key={filter.id} className={activeFilter === filter.id ? 'active' : ''} aria-pressed={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)}>{filter.label}</button>
          ))}
        </div>
      </div>
      <div className="facts-grid" aria-live="polite" aria-label="Faktakort">
        {visibleFacts.map((fact) => <FactCard fact={fact} key={fact.slug} />)}
      </div>
    </section>
  );
}
