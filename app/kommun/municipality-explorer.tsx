'use client';

import { useEffect, useMemo, useState } from 'react';

type Municipality = { id: string; title: string };

type MunicipalityMetric = {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  digits: number;
  source: string;
  comparison: 'change' | 'national';
  caveat: string;
  value: number | null;
  previousValue: number | null;
  nationalValue: number | null;
  period: number | null;
  previousPeriod: number | null;
};

type MunicipalityPayload = {
  municipalityId: string;
  metrics: MunicipalityMetric[];
  checkedAt: string;
  status: string;
  sourceUrl: string;
};

const formatValue = (value: number | null, digits: number) => value === null
  ? 'Saknas'
  : value.toLocaleString('sv-SE', { minimumFractionDigits: digits, maximumFractionDigits: digits });

const formatDifference = (value: number | null, comparison: number | null, digits: number) => {
  if (value === null || comparison === null) return null;
  const difference = value - comparison;
  const sign = difference > 0 ? '+' : '';
  return `${sign}${difference.toLocaleString('sv-SE', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

export function MunicipalityExplorer() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedId, setSelectedId] = useState('0180');
  const [listError, setListError] = useState('');
  const [response, setResponse] = useState<{
    municipalityId: string;
    data: MunicipalityPayload | null;
    error: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/municipalities', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Kommunlistan kunde inte hämtas.');
        return response.json() as Promise<{ municipalities: Municipality[] }>;
      })
      .then((payload) => setMunicipalities(payload.municipalities))
      .catch((reason: Error) => { if (reason.name !== 'AbortError') setListError(reason.message); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/municipality?id=${selectedId}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Statistiken kunde inte hämtas. Försök igen om en stund.');
        return response.json() as Promise<MunicipalityPayload>;
      })
      .then((payload) => setResponse({ municipalityId: selectedId, data: payload, error: '' }))
      .catch((reason: Error) => {
        if (reason.name !== 'AbortError') {
          setResponse({ municipalityId: selectedId, data: null, error: reason.message });
        }
      });
    return () => controller.abort();
  }, [selectedId]);

  const isCurrentResponse = response?.municipalityId === selectedId;
  const loading = !isCurrentResponse;
  const data = isCurrentResponse ? response.data : null;
  const error = isCurrentResponse ? response.error : '';

  const selectedName = useMemo(
    () => municipalities.find((municipality) => municipality.id === selectedId)?.title || 'Stockholm',
    [municipalities, selectedId],
  );

  return (
    <section className="municipality-explorer" aria-labelledby="municipality-result-heading">
      <div className="municipality-control-panel">
        <label htmlFor="municipality-select">Välj kommun</label>
        <select id="municipality-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {!municipalities.length && <option value="0180">Stockholm</option>}
          {municipalities.map((municipality) => <option value={municipality.id} key={municipality.id}>{municipality.title}</option>)}
        </select>
        <p>Fyra jämförbara nyckeltal från svenska myndigheter. Ingen förenklad kommunranking.</p>
        {listError && <small className="municipality-list-error">Kommunlistan kunde inte laddas, men Stockholm går fortfarande att visa.</small>}
      </div>

      <div className="municipality-result" aria-live="polite" aria-busy={loading}>
        <div className="municipality-result-heading">
          <div><span>Kommunöversikt</span><h2 id="municipality-result-heading">{selectedName}</h2></div>
          {data && <small>Data kontrollerad {new Date(data.checkedAt).toLocaleDateString('sv-SE')}</small>}
        </div>

        {loading && <div className="municipality-message"><strong>Hämtar kommunens siffror…</strong><span>Det brukar bara ta ett ögonblick.</span></div>}
        {!loading && error && <div className="municipality-message error"><strong>Något gick fel</strong><span>{error}</span><a href="https://www.kolada.se/verktyg/jamforaren/" target="_blank" rel="noreferrer">Öppna Koladas jämförelseverktyg ↗</a></div>}

        {!loading && !error && data && (
          <div className="municipality-metric-grid">
            {data.metrics.map((metric) => {
              const referenceValue = metric.comparison === 'national' ? metric.nationalValue : metric.previousValue;
              const difference = formatDifference(metric.value, referenceValue, metric.digits);
              const maximum = Math.max(metric.value || 0, metric.nationalValue || 0, 1);
              const municipalityWidth = `${Math.max(2, ((metric.value || 0) / maximum) * 100)}%`;
              const nationalWidth = `${Math.max(2, ((metric.nationalValue || 0) / maximum) * 100)}%`;
              return (
                <article key={metric.id}>
                  <header><span>{metric.shortLabel}</span><small>{metric.period || 'Period saknas'}</small></header>
                  <h3>{metric.label}</h3>
                  <div className="municipality-value"><strong>{formatValue(metric.value, metric.digits)}</strong><span>{metric.unit}</span></div>
                  {metric.comparison === 'national' ? (
                    <div className="municipality-bars" aria-label={`${selectedName} jämfört med riket`}>
                      <div><span>{selectedName}</span><i style={{ width: municipalityWidth }} /></div>
                      <div><span>Riket · {formatValue(metric.nationalValue, metric.digits)}</span><i style={{ width: nationalWidth }} /></div>
                    </div>
                  ) : (
                    <p className="municipality-difference">{difference ? `${difference} personer sedan ${metric.previousPeriod}` : 'Tidigare jämförelsevärde saknas'}</p>
                  )}
                  <details><summary>Så ska siffran läsas <span>+</span></summary><p>{metric.caveat}</p><small>Källa: {metric.source}</small></details>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
