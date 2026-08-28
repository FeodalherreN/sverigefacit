import immigration from '../../data/series/immigration.json';
import emigration from '../../data/series/emigration.json';
import migrationBalance from '../../data/series/migrationBalance.json';
import fertility from '../../data/series/fertility.json';
import deadlyViolence from '../../data/series/deadlyViolence.json';
import insecurity from '../../data/series/insecurity.json';
import dailySmoking from '../../data/series/dailySmoking.json';
import dailySnus from '../../data/series/dailySnus.json';
import alcoholRisk from '../../data/series/alcoholRisk.json';
import cannabisPastYear from '../../data/series/cannabisPastYear.json';
import antidepressantUse from '../../data/series/antidepressantUse.json';
import cancerMortality from '../../data/series/cancerMortality.json';
import unemployment from '../../data/series/unemployment.json';
import gdpPerCapita from '../../data/series/gdpPerCapita.json';
import policyRate from '../../data/series/policyRate.json';
import inflation from '../../data/series/inflation.json';
import nominalWageGrowth from '../../data/series/nominalWageGrowth.json';
import realWageGrowth from '../../data/series/realWageGrowth.json';
import foodPrices from '../../data/series/foodPrices.json';
import economicStandard from '../../data/series/economicStandard.json';
import realPension from '../../data/series/realPension.json';
import homeCare from '../../data/series/homeCare.json';
import specialHousing from '../../data/series/specialHousing.json';
import debtRatio from '../../data/series/debtRatio.json';
import interestRatio from '../../data/series/interestRatio.json';
import electricity from '../../data/series/electricity.json';
import fuel from '../../data/series/fuel.json';
import emissions from '../../data/series/emissions.json';
import transportEmissions from '../../data/series/transportEmissions.json';
import consumptionEmissions from '../../data/series/consumptionEmissions.json';
import carbonSink from '../../data/series/carbonSink.json';
import protectedNature from '../../data/series/protectedNature.json';
import fossilFreeElectricity from '../../data/series/fossilFreeElectricity.json';
import {
  normalizeSeries,
  recordById,
  seriesCatalogMetadata,
  seriesRelationships,
  seriesGroups,
  type LabSeries,
  type Point,
  type RawSeries,
  type SeriesGroup,
} from './series-core';

const rawSeries = [
  immigration,
  emigration,
  migrationBalance,
  fertility,
  deadlyViolence,
  insecurity,
  dailySmoking,
  dailySnus,
  alcoholRisk,
  cannabisPastYear,
  antidepressantUse,
  cancerMortality,
  unemployment,
  gdpPerCapita,
  policyRate,
  inflation,
  nominalWageGrowth,
  realWageGrowth,
  foodPrices,
  economicStandard,
  realPension,
  homeCare,
  specialHousing,
  debtRatio,
  interestRatio,
  electricity,
  fuel,
  emissions,
  transportEmissions,
  consumptionEmissions,
  carbonSink,
  protectedNature,
  fossilFreeElectricity,
] as unknown as RawSeries[];

const actualOrder = rawSeries.map((series) => series.id);
if (actualOrder.join('\n') !== seriesCatalogMetadata.order.join('\n')) {
  throw new Error('Importerade tidsserier följer inte datakatalogens deklarerade ordning.');
}

export const labSeries = rawSeries.map(normalizeSeries);
export const seriesById = recordById(labSeries);

export const rawSeriesCatalog = {
  schemaVersion: seriesCatalogMetadata.schemaVersion,
  cataloguedAt: seriesCatalogMetadata.cataloguedAt,
  storage: seriesCatalogMetadata.storage,
  updatePolicy: seriesCatalogMetadata.updatePolicy,
  relationships: seriesRelationships,
  series: rawSeries,
};

export {
  seriesCatalogMetadata,
  seriesRelationships,
  seriesGroups,
  type LabSeries,
  type Point,
  type SeriesGroup,
};
