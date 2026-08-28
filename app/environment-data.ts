import emissions from '../data/series/emissions.json';
import transportEmissions from '../data/series/transportEmissions.json';
import consumptionEmissions from '../data/series/consumptionEmissions.json';
import carbonSink from '../data/series/carbonSink.json';
import protectedNature from '../data/series/protectedNature.json';
import fossilFreeElectricity from '../data/series/fossilFreeElectricity.json';
import { normalizeSeries, type LabSeries, type Point, type RawSeries } from './data/series-core';

export type EnvironmentPoint = Point;
export type EnvironmentSeries = LabSeries;

export const environmentSeries = {
  emissions: normalizeSeries(emissions as unknown as RawSeries),
  transportEmissions: normalizeSeries(transportEmissions as unknown as RawSeries),
  consumptionEmissions: normalizeSeries(consumptionEmissions as unknown as RawSeries),
  carbonSink: normalizeSeries(carbonSink as unknown as RawSeries),
  protectedNature: normalizeSeries(protectedNature as unknown as RawSeries),
  fossilFreeElectricity: normalizeSeries(fossilFreeElectricity as unknown as RawSeries),
};
