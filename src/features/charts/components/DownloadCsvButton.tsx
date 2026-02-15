import { Button } from "antd";
import { ChartData } from "../types/chartData";

type DownloadCsvButtonProps = {
  data: ChartData;
};

export const DownloadCsvButton = ({ data }: DownloadCsvButtonProps) => {
  const generateCsvContent = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "code,ville,value\n";
    data.forEach((item) => {
      csvContent += `${item.code},${item.nom},\n`;
    });

    return encodeURI(csvContent);
  };

  return (
    <a
      href={generateCsvContent()}
      download="data.csv"
      style={{ textDecoration: "none" }}
    >
      <Button type="primary">Télécharger Modèle CSV</Button>
    </a>
  );
};
