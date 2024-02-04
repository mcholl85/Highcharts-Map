import { ChartData } from "../types/chartData";
import { GeoJson } from "../types/geoJson";

export const createDataFromMap = (geoMap: GeoJson): ChartData =>
  geoMap.features
    .sort((a, b) => a.properties.code.localeCompare(b.properties.code))
    .map(({ properties }) => ({
      code: properties.code,
      value: 0,
      nom: properties.nom,
    }));

export const getCodeByCity = (city: string, data: ChartData): string => {
  const chart = data.find((chart) => chart.nom === city);

  return chart ? chart.code : "";
};

export const getCityByCode = (code: string, data: ChartData): string => {
  const chart = data.find((chart) => chart.code === code);

  return chart ? chart.nom : "";
};
