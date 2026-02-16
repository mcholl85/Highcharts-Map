import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BubbleMapChart } from "../src/features/charts/components/BubbleMapChart";
import { MapChart } from "../src/features/charts/components/MapChart";

const { highchartsReactMock } = vi.hoisted(() => ({
  highchartsReactMock: vi.fn(() => null),
}));

vi.mock("highcharts-react-official", () => ({
  default: highchartsReactMock,
}));

describe("Map chart options", () => {
  const geoMap = {
    features: [{ properties: { code: "93001", nom: "Aubervilliers" } }],
  };

  beforeEach(() => {
    highchartsReactMock.mockClear();
  });

  it("uses white maxColor when all values are zero", () => {
    render(
      <MapChart
        data={[{ code: "93001", nom: "Aubervilliers", value: 0, z: 0 }]}
        geoMap={geoMap}
        title="Titre"
        label="unite"
      />
    );

    const props = highchartsReactMock.mock.calls[0][0];
    expect(props.constructorType).toBe("mapChart");
    expect(props.options.colorAxis.min).toBe(0);
    expect(props.options.colorAxis.max).toBe(0);
    expect(props.options.colorAxis.maxColor).toBe("#FFFFFF");
    expect(props.options.legend.title.text).toBe("nombre de unite");
  });

  it("uses default blue maxColor when some values are non-zero", () => {
    render(
      <MapChart
        data={[{ code: "93001", nom: "Aubervilliers", value: 5, z: 5 }]}
        geoMap={geoMap}
        title="Titre"
        label="unite"
      />
    );

    const props = highchartsReactMock.mock.calls[0][0];
    expect(props.options.colorAxis.maxColor).toBe("#000091");
  });

  it("configures bubble chart series and legend", () => {
    render(
      <BubbleMapChart
        data={[{ code: "93001", nom: "Aubervilliers", value: 5, z: 5 }]}
        geoMap={geoMap}
        title="Bulles"
        label="unite"
      />
    );

    const props = highchartsReactMock.mock.calls[0][0];
    expect(props.constructorType).toBe("mapChart");
    expect(props.options.legend.enabled).toBe(false);
    expect(props.options.series[1].type).toBe("mapbubble");
    expect(props.options.series[1].joinBy).toBe("nom");
    expect(props.options.series[1].name).toBe("unite");
  });
});
