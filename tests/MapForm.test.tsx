import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Papa from "papaparse";
import { message } from "antd";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapForm } from "../src/features/charts/components/MapForm";

vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn(),
  },
}));

describe("MapForm", () => {
  const baseData = [
    { code: "93001", nom: "Aubervilliers", value: 0, z: 0 },
    { code: "93010", nom: "Bondy", value: 0, z: 0 },
  ];

  it("submits values after CSV import with optional ville field", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const parseMock = vi.mocked(Papa.parse);
    parseMock.mockImplementation((_, config) => {
      config?.complete?.({
        data: [{ code: "93001", value: "42" }],
      } as never);
      return undefined as never;
    });

    render(<MapForm data={baseData} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Saisir les données" }));

    await user.type(screen.getByLabelText("Titre du graphique"), "Population");
    await user.type(screen.getByLabelText("Unité de mesure"), "habitants");

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["code,value\n93001,42"], "data.csv", {
      type: "text/csv",
    });

    await user.upload(fileInput, file);

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[0]);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Population",
          label: "habitants",
          Aubervilliers: 42,
        })
      );
    });
  });

  it("shows an error when CSV contains unknown code", async () => {
    const user = userEvent.setup();
    const parseMock = vi.mocked(Papa.parse);
    const errorSpy = vi.spyOn(message, "error").mockImplementation(vi.fn());

    parseMock.mockImplementation((_, config) => {
      config?.complete?.({
        data: [{ code: "99999", value: "11" }],
      } as never);
      return undefined as never;
    });

    render(<MapForm data={baseData} onSubmit={vi.fn()} />);
    await user.click(
      screen.getAllByRole("button", { name: "Saisir les données" })[0]
    );

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["code,value\n99999,11"], "data.csv", {
      type: "text/csv",
    });
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("99999")
      );
    });
  });
});
  afterEach(() => {
    vi.clearAllMocks();
  });
