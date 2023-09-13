import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { ChartData } from "../types/chartData";
import { GeoJson } from "../types/geoJson";

type BubbleMapChartProps = {
  data: ChartData;
  geoMap: GeoJson;
  title: string;
  label: string;
};

export const BubbleMapChart = ({
  data,
  geoMap,
  title,
  label,
}: BubbleMapChartProps) => {
  const bubbleOptions = {
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

    legend: {
      enabled: false,
    },

    series: [
      {
        name: "Département Seine-Saint-Denis",
        enableMouseTracking: false,
      },
      {
        type: "mapbubble",
        data: data,
        joinBy: "nom",
        minSize: 4,
        maxSize: "12%",
        name: label,
        dataLabels: {
          enabled: true,
          format: "{point.properties.nom}",
        },
        tooltip: {
          pointFormat: `{point.properties.nom}: {point.z} ${label}`,
        },
      },
    ],
  };

  return (
    <HighchartsReact
      immutable={false}
      highcharts={Highcharts}
      constructorType={"mapChart"}
      options={bubbleOptions}
      allowChartUpdate={true}
    />
  );
};
