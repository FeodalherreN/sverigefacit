'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { crimeBirthRegions, crimeRegionOffenses, crimeRegionSourceUrl } from '../../crime-region-data';
import { ShareButton } from '../../share-button';
import { siteConfig } from '../../site-config';

type OriginView = 'region' | 'country';
type RegionMeasure = 'rate' | 'risk';
type CrimeCountry = {
  name: string;
  n: number;
  rawPct: number;
  rawRR: number;
  adjustedPct: number;
  adjustedRR: number;
};

const crimeCountries: CrimeCountry[] = [
  { name: 'Danmark', n: 39477, rawPct: 3.75, rawRR: 1.18, adjustedPct: 3.44, adjustedRR: 1.08 },
  { name: 'Finland', n: 157238, rawPct: 3.14, rawRR: .99, adjustedPct: 3.91, adjustedRR: 1.23 },
  { name: 'Norge', n: 38953, rawPct: 3.64, rawRR: 1.14, adjustedPct: 3.71, adjustedRR: 1.17 },
  { name: 'Island', n: 4611, rawPct: 4.40, rawRR: 1.38, adjustedPct: 3.71, adjustedRR: 1.17 },
  { name: 'Grekland', n: 13963, rawPct: 3.97, rawRR: 1.25, adjustedPct: 3.72, adjustedRR: 1.17 },
  { name: 'Storbritannien/Nordirland', n: 21189, rawPct: 3.53, rawRR: 1.11, adjustedPct: 2.55, adjustedRR: .80 },
  { name: 'Tyskland', n: 45995, rawPct: 2.93, rawRR: .92, adjustedPct: 3.00, adjustedRR: .94 },
  { name: 'Polen', n: 75956, rawPct: 7.57, rawRR: 2.38, adjustedPct: 6.09, adjustedRR: 1.92 },
  { name: 'Rumänien', n: 23269, rawPct: 6.91, rawRR: 2.17, adjustedPct: 5.65, adjustedRR: 1.78 },
  { name: 'Ungern', n: 15380, rawPct: 4.86, rawRR: 1.53, adjustedPct: 4.44, adjustedRR: 1.40 },
  { name: 'Bosnien-Hercegovina', n: 56789, rawPct: 5.88, rawRR: 1.85, adjustedPct: 5.34, adjustedRR: 1.68 },
  { name: 'Jugoslavien (historisk kod)', n: 67770, rawPct: 8.14, rawRR: 2.56, adjustedPct: 7.03, adjustedRR: 2.21 },
  { name: 'Ryssland', n: 17201, rawPct: 8.16, rawRR: 2.57, adjustedPct: 6.24, adjustedRR: 1.96 },
  { name: 'Turkiet', n: 44761, rawPct: 8.55, rawRR: 2.69, adjustedPct: 5.83, adjustedRR: 1.83 },
  { name: 'USA', n: 16519, rawPct: 3.83, rawRR: 1.20, adjustedPct: 2.98, adjustedRR: .94 },
  { name: 'Chile', n: 27863, rawPct: 8.91, rawRR: 2.80, adjustedPct: 6.95, adjustedRR: 2.19 },
  { name: 'Colombia', n: 10454, rawPct: 11.23, rawRR: 3.53, adjustedPct: 6.33, adjustedRR: 1.99 },
  { name: 'Irak', n: 120185, rawPct: 12.49, rawRR: 3.93, adjustedPct: 7.70, adjustedRR: 2.42 },
  { name: 'Iran', n: 66303, rawPct: 9.65, rawRR: 3.03, adjustedPct: 7.96, adjustedRR: 2.50 },
  { name: 'Libanon', n: 25002, rawPct: 12.20, rawRR: 3.84, adjustedPct: 7.22, adjustedRR: 2.27 },
  { name: 'Syrien', n: 54767, rawPct: 12.22, rawRR: 3.84, adjustedPct: 7.61, adjustedRR: 2.39 },
  { name: 'Afghanistan', n: 25422, rawPct: 16.34, rawRR: 5.14, adjustedPct: 8.45, adjustedRR: 2.66 },
  { name: 'Indien', n: 20055, rawPct: 4.47, rawRR: 1.41, adjustedPct: 4.08, adjustedRR: 1.28 },
  { name: 'Pakistan', n: 10345, rawPct: 7.11, rawRR: 2.24, adjustedPct: 4.83, adjustedRR: 1.52 },
  { name: 'Filippinerna', n: 10966, rawPct: 5.14, rawRR: 1.62, adjustedPct: 4.28, adjustedRR: 1.35 },
  { name: 'Thailand', n: 34091, rawPct: 5.74, rawRR: 1.81, adjustedPct: 3.92, adjustedRR: 1.23 },
  { name: 'Vietnam', n: 12512, rawPct: 7.23, rawRR: 2.27, adjustedPct: 4.18, adjustedRR: 1.31 },
  { name: 'Kina', n: 23963, rawPct: 3.14, rawRR: .99, adjustedPct: 2.39, adjustedRR: .75 },
  { name: 'Eritrea', n: 19697, rawPct: 12.85, rawRR: 4.04, adjustedPct: 7.01, adjustedRR: 2.20 },
  { name: 'Etiopien', n: 14902, rawPct: 8.86, rawRR: 2.79, adjustedPct: 5.94, adjustedRR: 1.87 },
  { name: 'Somalia', n: 45218, rawPct: 14.24, rawRR: 4.48, adjustedPct: 7.29, adjustedRR: 2.29 },
];

const sortedCrimeCountries = [...crimeCountries].sort((left, right) =>
  left.name.localeCompare(right.name, 'sv-SE'),
);

const offenseGroups = Array.from(new Set(crimeRegionOffenses.map((offense) => offense.category))).map((category) => ({
  category,
  offenses: crimeRegionOffenses.filter((offense) => offense.category === category),
}));

const svNumber = (value: number, decimals = 2) => value.toLocaleString('sv-SE', {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
});

export function CrimeOriginExplorer() {
  const [view, setView] = useState<OriginView>('region');
  const [measure, setMeasure] = useState<RegionMeasure>('rate');
  const [offenseId, setOffenseId] = useState('brott-totalt');
  const [countryName, setCountryName] = useState('Finland');
  const [urlReady, setUrlReady] = useState(false);

  const selectedOffense = crimeRegionOffenses.find((offense) => offense.id === offenseId) || crimeRegionOffenses[0];
  const selectedCountry = crimeCountries.find((country) => country.name === countryName) || crimeCountries[0];
  const maximum = useMemo(() => {
    const values = measure === 'rate'
      ? selectedOffense.perThousand
      : [...selectedOffense.rawRisk, ...selectedOffense.adjustedRisk, 1];
    return Math.max(...values) * 1.08;
  }, [measure, selectedOffense]);
  const referencePosition = Math.min((1 / maximum) * 100, 100);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get('vy');
    const requestedOffense = params.get('brott');
    const requestedCountry = params.get('land');

    /* eslint-disable react-hooks/set-state-in-effect */
    if (requestedView === 'land') setView('country');
    if (params.get('matt') === 'overrisk') setMeasure('risk');
    if (requestedOffense && crimeRegionOffenses.some((offense) => offense.id === requestedOffense)) setOffenseId(requestedOffense);
    if (requestedCountry && crimeCountries.some((country) => country.name === requestedCountry)) setCountryName(requestedCountry);
    setUrlReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    url.searchParams.set('vy', view === 'region' ? 'region' : 'land');
    if (view === 'region') {
      url.searchParams.set('brott', selectedOffense.id);
      url.searchParams.set('matt', measure === 'rate' ? 'per-1000' : 'overrisk');
      url.searchParams.delete('land');
    } else {
      url.searchParams.set('land', selectedCountry.name);
      url.searchParams.delete('brott');
      url.searchParams.delete('matt');
    }
    url.hash = 'brott-ursprung';
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [urlReady, view, measure, selectedOffense.id, selectedCountry.name]);

  const shareUrl = new URL('/analys/brott-och-migration', siteConfig.url);
  shareUrl.searchParams.set('vy', view === 'region' ? 'region' : 'land');
  if (view === 'region') {
    shareUrl.searchParams.set('brott', selectedOffense.id);
    shareUrl.searchParams.set('matt', measure === 'rate' ? 'per-1000' : 'overrisk');
  } else {
    shareUrl.searchParams.set('land', selectedCountry.name);
  }
  shareUrl.hash = 'brott-ursprung';

  return (
    <section className="origin-explorer" id="brott-ursprung" aria-labelledby="origin-explorer-title">
      <header className="origin-explorer-intro">
        <div>
          <span>48 brottstyper · 31 födelseländer</span>
          <h3 id="origin-explorer-title">Välj brottstyp eller födelseland.</h3>
        </div>
        <p><strong>Exakt brottstyp × födelseland finns inte i Brås publicerade tabeller.</strong> Regionvyn visar brottstyper efter födelseregion. Landvyn visar alla brott sammantaget. Födelseregion och födelseland är inte nationalitet.</p>
      </header>

      <div className="origin-key-results" aria-label="Registerstudiens huvudresultat">
        <div><span>Utrikesfödda</span><strong>8,0 %</strong><small>registrerade som misstänkta</small></div>
        <div><span>Referensgruppen</span><strong>3,2 %</strong><small>registrerade som misstänkta</small></div>
        <div><span>Relativ skillnad</span><strong>2,51×</strong><small>före standardisering</small></div>
        <div><span>Efter standardisering</span><strong>1,77×</strong><small>ålder, kön, inkomst m.m.</small></div>
      </div>

      <div className="origin-view-switch" role="group" aria-label="Välj datavy">
        <button type="button" className={view === 'region' ? 'active' : ''} aria-pressed={view === 'region'} onClick={() => setView('region')}>
          Brottstyp efter födelseregion
          <small>48 brottstyper</small>
        </button>
        <button type="button" className={view === 'country' ? 'active' : ''} aria-pressed={view === 'country'} onClick={() => setView('country')}>
          Alla brott efter födelseland
          <small>31 födelseländer</small>
        </button>
      </div>

      {view === 'region' ? (
        <div className="region-explorer-panel">
          <div className="region-controls">
            <label className="region-offense-control" htmlFor="region-offense">
              <span>Välj brottstyp</span>
              <select id="region-offense" value={selectedOffense.id} onChange={(event) => setOffenseId(event.target.value)}>
                {offenseGroups.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.offenses.map((offense) => <option value={offense.id} key={offense.id}>{offense.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>

            <fieldset className="region-measure-control" aria-describedby="region-measure-help">
              <legend>Välj mått</legend>
              <div>
                <button type="button" className={measure === 'rate' ? 'active' : ''} aria-pressed={measure === 'rate'} onClick={() => setMeasure('rate')}>Per 1 000</button>
                <button type="button" className={measure === 'risk' ? 'active' : ''} aria-pressed={measure === 'risk'} onClick={() => setMeasure('risk')}>Relativ skillnad</button>
              </div>
            </fieldset>

            <div className="origin-share">
              <ShareButton
                key={shareUrl.toString()}
                title={`${selectedOffense.label} efter födelseregion`}
                text={view === 'region'
                  ? `Brås registrerade brottsmisstankar 2015–2018: ${selectedOffense.label}, ${measure === 'rate' ? 'personer per 1 000' : 'rå och justerad överrisk'}.`
                  : `Brås registrerade brottsmisstankar 2015–2018: ${selectedCountry.name}, alla brott sammantaget.`}
                itemId={`crime-origin-${view}-${view === 'region' ? selectedOffense.id : selectedCountry.name}`}
                url={shareUrl.toString()}
              />
            </div>
          </div>

          <p className="region-measure-help" id="region-measure-help">
            {measure === 'rate'
              ? 'Observerat antal personer per 1 000 i gruppen som registrerades som misstänkta minst en gång under fyraårsperioden.'
              : 'Blå stapel är rå överrisk. Röd markör är Brås överrisk efter standardisering för ålder, kön, disponibel inkomst och utbildning.'}
          </p>

          <div className="region-selection-summary" aria-live="polite">
            <span>{measure === 'rate' ? 'Observerad nivå' : 'Rå och standardiserad överrisk'}</span>
            <strong>{selectedOffense.label}</strong>
            <small>Folk­bokförda 15+ den 31 december 2014 · misstankar om brott begångna 2015–2018</small>
          </div>

          {measure === 'risk' && (
            <div className="region-risk-legend" aria-hidden="true">
              <span><i className="raw-dot" /> Rå överrisk</span>
              <span><i className="adjusted-dot" /> Standardiserad överrisk</span>
              <span><i className="reference-dot" /> Referens 1,00×</span>
            </div>
          )}

          <div className="region-bars" role="list" aria-label={`${selectedOffense.label} efter födelseregion`}>
            {crimeBirthRegions.map((region, index) => {
              const rate = selectedOffense.perThousand[index];
              const rawRisk = selectedOffense.rawRisk[index];
              const adjustedRisk = selectedOffense.adjustedRisk[index];
              const rawValue = measure === 'rate' ? rate : rawRisk;
              const rawWidth = Math.min((rawValue / maximum) * 100, 100);
              const adjustedPosition = Math.min((adjustedRisk / maximum) * 100, 100);
              const style = {
                '--region-raw-width': `${rawWidth}%`,
                '--region-adjusted-position': `${adjustedPosition}%`,
                '--region-reference-position': `${referencePosition}%`,
              } as CSSProperties;

              return (
                <div className={`region-row${region.reference ? ' is-reference' : ''}`} role="listitem" key={region.id} style={style}>
                  <div className="region-row-heading">
                    <div>
                      <strong>{region.label}</strong>
                      <span>N {region.n.toLocaleString('sv-SE')}</span>
                    </div>
                    {measure === 'rate' ? (
                      <b>{svNumber(rate)} <small>per 1 000</small></b>
                    ) : (
                      <b>{svNumber(rawRisk)}× <small>rå</small><em>{svNumber(adjustedRisk)}× standardiserad</em></b>
                    )}
                  </div>
                  <div className="region-track" aria-hidden="true">
                    {measure === 'risk' && <i className="region-reference-line" />}
                    <i className="region-raw-bar" />
                    {measure === 'risk' && <i className="region-adjusted-marker" />}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedOffense.perThousand[0] < 1 && (
            <p className="rare-offense-note"><strong>Ovanligt utfall.</strong> Små nivåer ger känsligare relativa mått. Brå publicerar inga konfidensintervall i tabellen, så rangskillnader bör tolkas försiktigt.</p>
          )}

          <div className="origin-caveat">
            <strong>Viktigt: misstanke är inte dom</strong>
            <p>Registrerad misstanke är inte samma sak som begånget brott eller fällande dom. Skillnaderna påverkas också av anmälan, upptäckt, polisens kontroller och möjligheten att identifiera en misstänkt.</p>
          </div>

          <details className="origin-method">
            <summary>Så läser du statistiken <span>+</span></summary>
            <div>
              <p><strong>Population:</strong> Personer som var minst 15 år och folkbokförda den 31 december 2014. Senare invandrade och icke folkbokförda ingår inte i denna jämförelse.</p>
              <p><strong>Per 1 000:</strong> Kumulativ andel personer med minst en registrerad misstanke under 2015–2018, inte en årstakt och inte antal brott.</p>
              <p><strong>Överrisk:</strong> Jämförelse med inrikesfödda som har två inrikesfödda föräldrar. B43 är ett standardiserat jämförelsemått, inte en justerad frekvens och inte en kausal effekt.</p>
              <p><strong>Brottstyper:</strong> Samma person kan förekomma under flera brottstyper. För spanings- och ingripandebrott, exempelvis narkotika- och trafikbrott, spelar myndigheternas aktivitet särskilt stor roll.</p>
              <a href={crimeRegionSourceUrl} target="_blank" rel="noreferrer">Brå tabell B41–B43 ↗</a>
            </div>
          </details>
        </div>
      ) : (
        <div className="country-view-panel">
          <div className="country-intro">
            <span>Födelseland · alla brott sammantaget</span>
            <h3>31 födelseländer i Brås underlag</h3>
            <p>Brå särredovisar större födelseländer i 2014 års befolkning. B10 och B11 publicerar råa och standardiserade andelar respektive överrisker. Det finns ingen offentlig korsning mellan exakt land och enskild brottstyp.</p>
          </div>
          <div className="country-control">
            <label htmlFor="crime-country">
              <span>Välj födelseland</span>
              <select id="crime-country" value={countryName} onChange={(event) => setCountryName(event.target.value)}>
                {sortedCrimeCountries.map((country) => <option value={country.name} key={country.name}>{country.name}</option>)}
              </select>
            </label>
            <div className="country-result" aria-live="polite">
              <div><span>Personer i underlaget</span><strong>{selectedCountry.n.toLocaleString('sv-SE')}</strong></div>
              <div><span>Registrerade som misstänkta</span><strong>{svNumber(selectedCountry.rawPct)} % · {svNumber(selectedCountry.rawRR)}×</strong></div>
              <div><span>Efter standardisering</span><strong>{svNumber(selectedCountry.adjustedPct)} % · {svNumber(selectedCountry.adjustedRR)}×</strong></div>
            </div>
          </div>
          <div className="country-warning">
            <strong>Historisk avgränsning</strong>
            <p>Folk­bokförda 2014, registrerade misstankar 2015–2018 och alla brott sammantaget. Födelseland är inte medborgarskap eller etnicitet. Resultaten gäller grupper och säger inget om en enskild person.</p>
            <a href={crimeRegionSourceUrl} target="_blank" rel="noreferrer">Brå tabell B10–B11 ↗</a>
          </div>
          <div className="origin-share country-share">
            <ShareButton
              key={shareUrl.toString()}
              title={`${selectedCountry.name}: registrerade brottsmisstankar`}
              text={`Brås historiska registerstudie 2015–2018: ${selectedCountry.name}, alla brott sammantaget. Födelseland är inte nationalitet.`}
              itemId={`crime-origin-country-${selectedCountry.name}`}
              url={shareUrl.toString()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
