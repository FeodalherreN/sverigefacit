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
const safetyTopics = new Set(['Lag & ordning', 'Brott & trygghet', 'Migration', 'Brott och migrationsbakgrund']);
const economyTopics = new Set(['Jobb & ekonomi', 'Privatekonomi']);

const normalize = (value: string) => value
  .toLocaleLowerCase('sv-SE')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

export function FactsBrowser() {
  const [activeFilter, setActiveFilter] = useState<FactFilter>('current');
  const [query, setQuery] = useState('');
  const visibleFacts = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const filteredFacts = activeFilter === 'current'
      ? facts.slice(0, 6)
      : activeFilter === 'welfare'
        ? facts.filter((fact) => welfareTopics.has(fact.topic))
        : activeFilter === 'safety'
          ? facts.filter((fact) => safetyTopics.has(fact.topic))
          : activeFilter === 'economy'
            ? facts.filter((fact) => economyTopics.has(fact.topic))
            : facts;
    if (!normalizedQuery) return filteredFacts;
    return filteredFacts.filter((fact) => normalize(`${fact.question} ${fact.title} ${fact.answer} ${fact.topic} ${fact.sourceOrganization}`).includes(normalizedQuery));
  }, [activeFilter, query]);

  return (
    <section className="facts-browser" aria-labelledby="facts-browser-heading">
      <div className="facts-search">
        <label htmlFor="facts-search-input">Sök bland faktasvaren</label>
        <div><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg><input id="facts-search-input" type="search" value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) setActiveFilter('all'); }} placeholder="Exempel: vård, skola eller pension" /></div>
      </div>
      <div className="facts-filter-bar">
        <div><span>{query ? 'Sökresultat' : 'Välj område'}</span><strong id="facts-browser-heading">{visibleFacts.length} faktasvar med källor</strong></div>
        <div role="group" aria-label="Filtrera faktakort">
          {filters.map((filter) => (
            <button type="button" key={filter.id} className={activeFilter === filter.id ? 'active' : ''} aria-pressed={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)}>{filter.label}</button>
          ))}
        </div>
      </div>
      <div className="facts-grid" aria-live="polite" aria-label="Faktakort">
        {visibleFacts.map((fact) => <FactCard fact={fact} key={fact.slug} />)}
        {!visibleFacts.length && <div className="facts-empty"><strong>Inga faktasvar matchar sökningen.</strong><span>Prova ett bredare ord eller använd den globala sökningen.</span></div>}
      </div>
    </section>
  );
}
