import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { ChartData } from "../types/chartData";
import { GeoJson } from "../types/geoJson";

type MapChartProps = {
  data: ChartData;
  geoMap: GeoJson;
  title: string;
  label: string;
};

export const MapChart = ({ data, geoMap, title, label }: MapChartProps) => {
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));

  const zoneOptions = {
    chart: {
      map: geoMap,
      height: "600px",
    },

    title: {
      text: title,
    },

    accessibility: {
      typeDescription: "Map of Seine-Saint-Denis.",
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },
    colorAxis: {
      min: min,
      max: max,
      tickPixelInterval: 50,
      minColor: "#FFFFFF",
      maxColor: "#000091",
    },

    legend: {
      title: {
        text: `nombre de ${label}`,
      },
    },

    series: [
      {
        data: data,
        joinBy: "nom",
        name: label,
        dataLabels: {
          enabled: true,
          format: "{point.properties.nom}",
        },
      },
    ],
  };

  return (
    <HighchartsReact
      immutable={false}
      highcharts={Highcharts}
      constructorType={"mapChart"}
      options={zoneOptions}
      allowChartUpdate={true}
    />
  );
};
