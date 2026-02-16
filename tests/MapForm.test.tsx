import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MapForm } from "../src/features/charts/components/MapForm";

describe("MapForm", () => {
  const baseData = [
    { code: "93001", nom: "Aubervilliers", value: 0, z: 0 },
    { code: "93010", nom: "Bondy", value: 0, z: 0 },
  ];

  it("submits manual form values with title, label and city keys", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<MapForm data={baseData} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Saisir les données" }));

    await user.type(screen.getByLabelText("Titre du graphique"), "Population");
    await user.type(screen.getByLabelText("Unité de mesure"), "habitants");

    const aubervilliersInput = document.getElementById(
      "mapForm_Aubervilliers"
    ) as HTMLInputElement;
    fireEvent.change(aubervilliersInput, { target: { value: "42" } });

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[0]);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Population",
          label: "habitants",
          Aubervilliers: 42,
          Bondy: expect.any(Number),
        })
      );
    });
  });

  it("highlights zero-value cities and removes highlight when data changes", async () => {
    const user = userEvent.setup();

    const { rerender } = render(<MapForm data={baseData} onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Saisir les données" }));

    const aubervilliersInput = document.getElementById(
      "mapForm_Aubervilliers"
    ) as HTMLInputElement;

    const zeroItem = aubervilliersInput.closest(".city-value-item");
    expect(zeroItem).toHaveClass("city-value-item-zero");

    rerender(
      <MapForm
        data={[
          { code: "93001", nom: "Aubervilliers", value: 12, z: 12 },
          { code: "93010", nom: "Bondy", value: 0, z: 0 },
        ]}
        onSubmit={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(zeroItem).not.toHaveClass("city-value-item-zero");
    });
  });
});
