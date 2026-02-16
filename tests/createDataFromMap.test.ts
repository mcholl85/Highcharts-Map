import {
  createDataFromMap,
  getCityByCode,
  getCodeByCity,
} from "../src/features/charts/utils/createDataFromMap";
import type { GeoJson } from "../src/features/charts/types/geoJson";
import { describe, expect, it } from "vitest";

describe("createDataFromMap", () => {
  it("sorts features by code and initializes values to zero", () => {
    const geoMap: GeoJson = {
      features: [
        { properties: { code: "93010", nom: "Bondy" } },
        { properties: { code: "93001", nom: "Aubervilliers" } },
      ],
    };

    const result = createDataFromMap(geoMap);

    expect(result).toEqual([
      { code: "93001", nom: "Aubervilliers", value: 0, z: 0 },
      { code: "93010", nom: "Bondy", value: 0, z: 0 },
    ]);
  });
});

describe("code/city helpers", () => {
  const data = [
    { code: "93001", nom: "Aubervilliers", value: 0, z: 0 },
    { code: "93010", nom: "Bondy", value: 0, z: 0 },
  ];

  it("returns code for a known city", () => {
    expect(getCodeByCity("Bondy", data)).toBe("93010");
  });

  it("returns empty string for an unknown city", () => {
    expect(getCodeByCity("Unknown", data)).toBe("");
  });

  it("returns city for a known code", () => {
    expect(getCityByCode("93001", data)).toBe("Aubervilliers");
  });

  it("returns empty string for an unknown code", () => {
    expect(getCityByCode("99999", data)).toBe("");
  });
});
