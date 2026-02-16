import React from "react";
import ReactDOM from "react-dom/client";
import Highcharts from "highcharts/highmaps";
import Exporting from "highcharts/modules/exporting";
import OfflineExporting from "highcharts/modules/offline-exporting";
import App from "./App.tsx";
import "./index.css";

Exporting(Highcharts);
OfflineExporting(Highcharts);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
