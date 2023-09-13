import { ChartData } from "../types/chartData";
import { GeoJson } from "../types/geoJson";

export const createDataFromMap = (geoMap: GeoJson): ChartData =>
  geoMap.features
    .sort((a, b) => a.properties.code.localeCompare(b.properties.code))
    .map(({ properties }) => ({ z: 0, value: 0, nom: properties.nom }));
