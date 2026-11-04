import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ModulePage from "../../src/pages/ModulePage";

describe("ModulePage", () => {
  it("should render module subjects when year and module are valid", () => {
    render(
      <MemoryRouter initialEntries={["/module/1/1"]}>
        <Routes>
          <Route path="/module/:year/:module" element={<ModulePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Werkpraktijk" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kennis en Vaardigheden" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Positionering" })).toBeInTheDocument();
  });

  it("should render not found message when year or module is invalid", () => {
    render(
      <MemoryRouter initialEntries={["/module/99/99"]}>
        <Routes>
          <Route path="/module/:year/:module" element={<ModulePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Module niet gevonden.")).toBeInTheDocument();
  });
});
