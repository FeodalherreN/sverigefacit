import deadlyViolence from '../../data/series/deadlyViolence.json';
import immigration from '../../data/series/immigration.json';
import unemployment from '../../data/series/unemployment.json';
import economicStandard from '../../data/series/economicStandard.json';
import homeCare from '../../data/series/homeCare.json';
import { normalizeSeries, recordById, type RawSeries } from './series-core';

const rawFactSeries = [
  deadlyViolence,
  immigration,
  unemployment,
  economicStandard,
  homeCare,
] as unknown as RawSeries[];

export const factSeriesById = recordById(rawFactSeries.map(normalizeSeries));
