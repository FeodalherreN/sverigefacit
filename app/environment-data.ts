export type EnvironmentPoint = {
  year: number;
  value: number;
};

export type EnvironmentSeries = {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  color: string;
  source: string;
  sourceUrl: string;
  caveat: string;
  points: EnvironmentPoint[];
};

const fromValues = (startYear: number, values: number[]): EnvironmentPoint[] =>
  values.map((value, index) => ({ year: startYear + index, value }));

export const environmentSeries = {
  emissions: {
    id: 'emissions',
    label: 'Territoriella växthusgasutsläpp',
    shortLabel: 'Territoriella utsläpp',
    unit: 'Mt CO₂e',
    color: '#367353',
    source: 'Naturvårdsverket · Sveriges utsläpp och upptag',
    sourceUrl: 'https://www.naturvardsverket.se/data-och-statistik/klimat/sveriges-utslapp-och-upptag-av-vaxthusgaser/',
    caveat: 'Exklusive markanvändning (LULUCF) och internationella transporter. År 2025 är preliminärt och hela inventeringen kan revideras när underlag eller metoder förbättras.',
    points: fromValues(2000, [68.11, 68.88, 69.50, 69.84, 69.19, 66.28, 65.94, 64.78, 62.39, 58.17, 64.17, 59.80, 56.89, 55.27, 53.54, 53.37, 53.34, 52.50, 51.74, 50.56, 46.38, 48.21, 45.78, 44.82, 48.06, 46.73]),
  },
  transportEmissions: {
    id: 'transportEmissions',
    label: 'Utsläpp från inrikes transporter',
    shortLabel: 'Transportutsläpp',
    unit: 'Mt CO₂e',
    color: '#1d67f2',
    source: 'Naturvårdsverket · Inrikes transporter',
    sourceUrl: 'https://www.naturvardsverket.se/data-och-statistik/klimat/vaxthusgaser-utslapp-fran-inrikes-transporter/',
    caveat: 'Omfattar vägtrafik, inrikes sjöfart, järnväg och inrikes flyg. År 2025 är preliminärt. Transportmålet till 2030 räknas däremot utan inrikes flyg.',
    points: fromValues(2000, [20.07, 20.22, 20.67, 20.90, 21.27, 21.55, 21.51, 21.81, 21.35, 20.87, 21.06, 20.71, 19.59, 19.18, 18.78, 18.91, 18.31, 18.00, 17.41, 17.35, 15.99, 16.13, 14.69, 14.65, 17.69, 16.99]),
  },
  consumptionEmissions: {
    id: 'consumptionEmissions',
    label: 'Konsumtionsbaserade utsläpp per person',
    shortLabel: 'Konsumtionsutsläpp',
    unit: 'ton CO₂e per person',
    color: '#9a5c3b',
    source: 'Naturvårdsverket / SCB · Konsumtionsbaserade utsläpp',
    sourceUrl: 'https://www.naturvardsverket.se/data-och-statistik/konsumtion/vaxthusgaser-konsumtionsbaserade-utslapp-per-person/',
    caveat: 'Modellberäknat mått som inkluderar utsläpp i andra länder från svensk konsumtion. Det är mer osäkert än territoriell statistik, särskilt för importerade varor och detaljerade delområden.',
    points: fromValues(2008, [11.92, 9.97, 11.26, 11.75, 10.78, 10.69, 9.94, 9.73, 9.69, 9.35, 9.36, 8.73, 7.77, 8.21, 8.46, 7.62]),
  },
  carbonSink: {
    id: 'carbonSink',
    label: 'Nettoupptag i mark och skog',
    shortLabel: 'Nettoupptag',
    unit: 'Mt CO₂e',
    color: '#66833f',
    source: 'Naturvårdsverket · Markanvändning och skogsbruk',
    sourceUrl: 'https://www.naturvardsverket.se/data-och-statistik/klimat/vaxthusgaser-nettoutslapp-och-nettoupptag-fran-markanvandning/',
    caveat: 'Här visas upptaget som ett positivt tal för läsbarhet. I originalstatistiken redovisas nettoupptag som negativa utsläpp. Senaste slutliga år är 2024.',
    points: fromValues(2000, [61.21, 62.20, 61.97, 60.27, 56.74, 58.07, 63.13, 63.99, 61.93, 61.47, 61.13, 61.49, 59.69, 59.57, 58.21, 55.60, 52.58, 46.67, 40.19, 40.65, 39.84, 39.85, 43.15, 46.05, 54.24]),
  },
  protectedNature: {
    id: 'protectedNature',
    label: 'Formellt skyddad natur',
    shortLabel: 'Skyddad natur',
    unit: 'procent av Sveriges totalareal',
    color: '#7a6b37',
    source: 'SCB · Formellt skyddad natur',
    sourceUrl: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0603__MI0603D/ArealSkydd/',
    caveat: 'Överlapp mellan skyddsformer är borträknade. Från 2023 används ett nytt geografiskt underlag för totalarealen, vilket påverkar jämförbarheten något.',
    points: fromValues(2018, [14.7, 14.8, 14.9, 15.0, 15.0, 15.0, 15.3, 15.7]),
  },
  fossilFreeElectricity: {
    id: 'fossilFreeElectricity',
    label: 'Fossilfri andel av elproduktionen',
    shortLabel: 'Fossilfri el',
    unit: 'procent',
    color: '#d3a500',
    source: 'Energimyndigheten · Energiindikator 6.1',
    sourceUrl: 'https://pxexternal.energimyndigheten.se/pxweb/sv/Energimyndighetens_statistikdatabas/Energimyndighetens_statistikdatabas__Energiindikatorer__6__6.1/EN_IND6-1A.px/',
    caveat: 'Fossilfri omfattar här bland annat vattenkraft, vindkraft, solkraft och kärnkraft. Serien är en energiindikator beräknad från energibalanser och är inte märkt som officiell statistik.',
    points: fromValues(2000, [95.9, 95.9, 94.6, 93.0, 95.3, 96.4, 95.8, 96.2, 96.5, 95.6, 94.0, 95.6, 97.0, 96.8, 97.6, 97.7, 97.3, 97.7, 97.6, 98.1, 98.5, 98.2, 98.3, 98.5, 98.6]),
  },
} satisfies Record<string, EnvironmentSeries>;
