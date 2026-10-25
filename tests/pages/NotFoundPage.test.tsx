import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFoundPage from "../../src/pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("should render not found message and link to home", () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Pagina niet gevonden")).toBeInTheDocument();
    const homeLink = screen.getByRole("link", { name: "Terug naar home" });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
