import { useState } from "react";
import geomap from "../src/constants/maps/seine-saint-denis.json";
import { MapChart } from "./features/charts/components/MapChart";
import { MapForm } from "./features/charts/components/MapForm";
import { useDataCharts } from "./features/charts/hooks/useDataCharts";
import { Button, Radio, Space, Upload, message } from "antd";
import { BubbleMapChart } from "./features/charts/components/BubbleMapChart";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import { FormValues } from "./features/charts/types/fomValues";
import { RcFile } from "antd/es/upload";
import { getCityByCode } from "./features/charts/utils/createDataFromMap";
import { DownloadCsvButton } from "./features/charts/components/DownloadCsvButton";

interface CsvData {
  code?: string;
  ville?: string;
  value?: string;
}

function App() {
  const { data, label, title, submitDataCharts } = useDataCharts(geomap);
  const [isBubbleMap, setIsBubbleMap] = useState(false);
  const chartTitle = title || "Carte des valeurs par commune";
  const chartLabel = label || "indicateur";
  const currentYear = new Date().getFullYear();

  const handleCsvUpload = (file: RcFile) => {
    Papa.parse(file, {
      complete: (result: Papa.ParseResult<CsvData>) => {
        const { values, unknownCodes } = transformCsvToFormValues(result.data);
        submitDataCharts({ ...values, title, label } as FormValues);

        if (unknownCodes.length > 0) {
          message.error(
            `Code(s) inconnu(s) dans le CSV: ${unknownCodes.join(", ")}`
          );
        } else {
          message.success("Import CSV applique.");
        }
      },
      header: true,
      skipEmptyLines: true,
    });

    return false;
  };

  const transformCsvToFormValues = (csvData: CsvData[]) => {
    const transformedData: FormValues = {};
    const unknownCodes = new Set<string>();

    csvData.forEach((row) => {
      const code = row.code?.trim();
      const value = Number.parseInt(row.value ?? "", 10);

      if (!code || Number.isNaN(value)) {
        return;
      }

      const city = getCityByCode(code, data);
      if (!city) {
        unknownCodes.add(code);
        return;
      }

      transformedData[city] = value;
    });

    return { values: transformedData, unknownCodes: [...unknownCodes] };
  };

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <p className="topbar-kicker">Dashboard data</p>
          <h1>Studio de Cartographie des Donnees</h1>
        </div>
        <nav className="topbar-nav" aria-label="Navigation principale">
          <a href="#map-view">Carte</a>
          <a href="#aide">Aide CSV</a>
        </nav>
        <p className="topbar-meta">Seine-Saint-Denis</p>
      </header>

      <main className="dashboard-main">
        <aside className="control-panel" id="controls">
          <div className="panel-section">
            <h2>Parametres</h2>
            <p>Importe ou saisis des donnees, puis applique le rendu souhaite.</p>
          </div>
          <div className="panel-section">
            <MapForm onSubmit={submitDataCharts} data={data} />
          </div>
          <div className="panel-section">
            <h3>Import / Export CSV</h3>
            <Space wrap>
              <Upload
                beforeUpload={handleCsvUpload}
                accept=".csv"
                maxCount={1}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Uploader un CSV</Button>
              </Upload>
              <DownloadCsvButton data={data} />
            </Space>
          </div>
          <div className="panel-section">
            <h3>Mode de visualisation</h3>
            <Radio.Group
              className="mode-toggle"
              value={isBubbleMap ? "bubble" : "zone"}
              onChange={(event) => setIsBubbleMap(event.target.value === "bubble")}
            >
              <Radio.Button value="zone">Zone</Radio.Button>
              <Radio.Button value="bubble">Bulle</Radio.Button>
            </Radio.Group>
          </div>
          <div className="panel-section panel-note" id="aide">
            <h3>Format CSV</h3>
            <p>
              Colonnes attendues: <strong>code</strong>,{" "}
              <strong>ville</strong> (optionnelle), <strong>value</strong>.
            </p>
          </div>
        </aside>

        <section className="map-panel" id="map-view">
          <div className="map-panel-header">
            <div>
              <h2>{chartTitle}</h2>
              <p>Unite: {chartLabel}</p>
            </div>
            <div className="map-actions">
              <span className="map-status">
                {isBubbleMap ? "Mode bulle" : "Mode zone"}
              </span>
            </div>
          </div>
          <div className="map-frame">
            {isBubbleMap ? (
              <BubbleMapChart
                data={data}
                geoMap={geomap}
                title={chartTitle}
                label={chartLabel}
              />
            ) : (
              <MapChart
                data={data}
                geoMap={geomap}
                title={chartTitle}
                label={chartLabel}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="footerbar">
        <p>Studio de Cartographie des Donnees</p>
        <p>{currentYear} - Outil de visualisation territoriale</p>
      </footer>
    </div>
  );
}

export default App;
