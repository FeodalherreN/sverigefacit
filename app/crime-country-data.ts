export type CrimeCountry = {
  name: string;
  n: number;
  rawPct: number;
  rawRR: number;
  adjustedPct: number;
  adjustedRR: number;
};

export const crimeCountries: CrimeCountry[] = [
  { name: 'Danmark', n: 39477, rawPct: 3.75, rawRR: 1.18, adjustedPct: 3.44, adjustedRR: 1.08 },
  { name: 'Finland', n: 157238, rawPct: 3.14, rawRR: 0.99, adjustedPct: 3.91, adjustedRR: 1.23 },
  { name: 'Norge', n: 38953, rawPct: 3.64, rawRR: 1.14, adjustedPct: 3.71, adjustedRR: 1.17 },
  { name: 'Island', n: 4611, rawPct: 4.40, rawRR: 1.38, adjustedPct: 3.71, adjustedRR: 1.17 },
  { name: 'Grekland', n: 13963, rawPct: 3.97, rawRR: 1.25, adjustedPct: 3.72, adjustedRR: 1.17 },
  { name: 'Storbritannien/Nordirland', n: 21189, rawPct: 3.53, rawRR: 1.11, adjustedPct: 2.55, adjustedRR: 0.80 },
  { name: 'Tyskland', n: 45995, rawPct: 2.93, rawRR: 0.92, adjustedPct: 3.00, adjustedRR: 0.94 },
  { name: 'Polen', n: 75956, rawPct: 7.57, rawRR: 2.38, adjustedPct: 6.09, adjustedRR: 1.92 },
  { name: 'Rumänien', n: 23269, rawPct: 6.91, rawRR: 2.17, adjustedPct: 5.65, adjustedRR: 1.78 },
  { name: 'Ungern', n: 15380, rawPct: 4.86, rawRR: 1.53, adjustedPct: 4.44, adjustedRR: 1.40 },
  { name: 'Bosnien-Hercegovina', n: 56789, rawPct: 5.88, rawRR: 1.85, adjustedPct: 5.34, adjustedRR: 1.68 },
  { name: 'Jugoslavien (historisk kod)', n: 67770, rawPct: 8.14, rawRR: 2.56, adjustedPct: 7.03, adjustedRR: 2.21 },
  { name: 'Ryssland', n: 17201, rawPct: 8.16, rawRR: 2.57, adjustedPct: 6.24, adjustedRR: 1.96 },
  { name: 'Turkiet', n: 44761, rawPct: 8.55, rawRR: 2.69, adjustedPct: 5.83, adjustedRR: 1.83 },
  { name: 'USA', n: 16519, rawPct: 3.83, rawRR: 1.20, adjustedPct: 2.98, adjustedRR: 0.94 },
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
  { name: 'Kina', n: 23963, rawPct: 3.14, rawRR: 0.99, adjustedPct: 2.39, adjustedRR: 0.75 },
  { name: 'Eritrea', n: 19697, rawPct: 12.85, rawRR: 4.04, adjustedPct: 7.01, adjustedRR: 2.20 },
  { name: 'Etiopien', n: 14902, rawPct: 8.86, rawRR: 2.79, adjustedPct: 5.94, adjustedRR: 1.87 },
  { name: 'Somalia', n: 45218, rawPct: 14.24, rawRR: 4.48, adjustedPct: 7.29, adjustedRR: 2.29 },
];
