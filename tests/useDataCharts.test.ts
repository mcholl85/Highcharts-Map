import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDataCharts } from "../src/features/charts/hooks/useDataCharts";

describe("useDataCharts", () => {
  const geoMap = {
    features: [
      { properties: { code: "93010", nom: "Bondy" } },
      { properties: { code: "93001", nom: "Aubervilliers" } },
    ],
  };

  it("initializes title/label and data from map", () => {
    const { result } = renderHook(() => useDataCharts(geoMap));

    expect(result.current.title).toBe("");
    expect(result.current.label).toBe("");
    expect(result.current.data).toEqual([
      { code: "93001", nom: "Aubervilliers", value: 0, z: 0 },
      { code: "93010", nom: "Bondy", value: 0, z: 0 },
    ]);
  });

  it("updates chart title, label and data on submit", () => {
    const { result } = renderHook(() => useDataCharts(geoMap));

    act(() => {
      result.current.submitDataCharts({
        title: "Population",
        label: "habitants",
        Aubervilliers: 42,
        Bondy: 10,
      });
    });

    expect(result.current.title).toBe("Population");
    expect(result.current.label).toBe("habitants");
    expect(result.current.data).toEqual([
      { code: "93001", nom: "Aubervilliers", value: 42, z: 42 },
      { code: "93010", nom: "Bondy", value: 10, z: 10 },
    ]);
  });

  it("keeps all cities and defaults missing values to zero on partial submit", () => {
    const { result } = renderHook(() => useDataCharts(geoMap));

    act(() => {
      result.current.submitDataCharts({
        Aubervilliers: 7,
      });
    });

    expect(result.current.data).toEqual([
      { code: "93001", nom: "Aubervilliers", value: 7, z: 7 },
      { code: "93010", nom: "Bondy", value: 0, z: 0 },
    ]);
  });
});
