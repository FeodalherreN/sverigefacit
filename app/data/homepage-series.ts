import deadlyViolence from '../../data/series/deadlyViolence.json';
import immigration from '../../data/series/immigration.json';
import unemployment from '../../data/series/unemployment.json';
import gdpPerCapita from '../../data/series/gdpPerCapita.json';
import policyRate from '../../data/series/policyRate.json';
import fuel from '../../data/series/fuel.json';
import electricity from '../../data/series/electricity.json';
import emissions from '../../data/series/emissions.json';
import { normalizeSeries, recordById, type RawSeries } from './series-core';

const rawHomepageSeries = [
  deadlyViolence,
  immigration,
  unemployment,
  gdpPerCapita,
  policyRate,
  fuel,
  electricity,
  emissions,
] as unknown as RawSeries[];

export const homepageSeriesById = recordById(rawHomepageSeries.map(normalizeSeries));
