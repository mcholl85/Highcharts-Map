import { ChartData } from "../types/chartData";
import { FormValues } from "../types/fomValues";

export const createFormValuesFromData = (data: ChartData): FormValues =>
  data.reduce((acc, curr) => {
    acc[curr.nom] = curr.value;
    return acc;
  }, {} as FormValues);
