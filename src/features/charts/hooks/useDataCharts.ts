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
    const newData: ChartData = [...Object.entries(formData)].map(
      ([key, value]) => ({
        code: getCodeByCity(key, initialData),
        value: value,
        nom: key,
      })
    );

    setTitle(title as string);
    setLabel(label as string);
    setData(newData);
  };

  return { data, submitDataCharts, label, title };
};
