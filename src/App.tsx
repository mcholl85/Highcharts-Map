import { useState } from "react";
import geomap from "../src/constants/maps/seine-saint-denis.json";
import { MapChart } from "./features/charts/components/MapChart";
import { MapForm } from "./features/charts/components/MapForm";
import { useDataCharts } from "./features/charts/hooks/useDataCharts";
import { Radio, Row } from "antd";
import { BubbleMapChart } from "./features/charts/components/BubbleMapChart";

function App() {
  const { data, label, title, submitDataCharts } = useDataCharts(geomap);
  const [isBubbleMap, setIsBubbleMap] = useState(false);

  return (
    <>
      <MapForm onSubmit={submitDataCharts} data={data} />
      <br />
      <Row justify={"end"}>
        <Radio.Group>
          <Radio.Button value="Zone" onClick={() => setIsBubbleMap(false)}>
            Zone
          </Radio.Button>
          <Radio.Button value="Bulle" onClick={() => setIsBubbleMap(true)}>
            Bulle
          </Radio.Button>
        </Radio.Group>
      </Row>
      {isBubbleMap ? (
        <BubbleMapChart
          data={data}
          geoMap={geomap}
          title={title}
          label={label}
        />
      ) : (
        <MapChart data={data} geoMap={geomap} title={title} label={label} />
      )}
    </>
  );
}

export default App;
