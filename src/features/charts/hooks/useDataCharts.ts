import { useState } from "react";
import { GeoJson } from "../types/geoJson";
import { createDataFromMap, getCodeByCity } from "../utils/createDataFromMap";
import { FormValues } from "../types/fomValues";
import { ChartData } from "../types/chartData";

export const useDataCharts = (geoMap: GeoJson) => {
  const initialData: ChartData = createDataFromMap(geoMap);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [data, setData] = useState(initialData);

  const submitDataCharts = (formValues: FormValues) => {
    const { title, label, ...formData } = formValues;
    const valueByCity = new Map<string, number>();

    Object.entries(formData).forEach(([city, value]) => {
      if (typeof value === "number" && !Number.isNaN(value)) {
        valueByCity.set(city, value);
      }
    });

    const newData: ChartData = initialData.map((chart) => {
      const nextValue = valueByCity.get(chart.nom) ?? 0;
      return {
        code: getCodeByCity(chart.nom, initialData),
        z: nextValue,
        value: nextValue,
        nom: chart.nom,
      };
    });

    setTitle(typeof title === "string" ? title : "");
    setLabel(typeof label === "string" ? label : "");
    setData(newData);
  };

  return { data, submitDataCharts, label, title };
};
