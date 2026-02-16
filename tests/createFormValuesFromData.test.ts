import { createFormValuesFromData } from "../src/features/charts/utils/createFormValuesFromData";
import { describe, expect, it } from "vitest";

describe("createFormValuesFromData", () => {
  it("maps chart data to a form values object", () => {
    const data = [
      { code: "93001", nom: "Aubervilliers", value: 12, z: 12 },
      { code: "93010", nom: "Bondy", value: 8, z: 8 },
    ];

    expect(createFormValuesFromData(data)).toEqual({
      Aubervilliers: 12,
      Bondy: 8,
    });
  });

  it("returns an empty object for empty input", () => {
    expect(createFormValuesFromData([])).toEqual({});
  });
});
