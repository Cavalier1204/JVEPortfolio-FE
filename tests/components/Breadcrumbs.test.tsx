import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Breadcrumbs from "../../src/components/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("should render links for non-last items with 'to' and plain text for the last item", () => {
    render(
      <BrowserRouter>
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Module 1", to: "/module/1/1" },
            { label: "Current Page" },
          ]}
        />
      </BrowserRouter>,
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");

    const moduleLink = screen.getByRole("link", { name: "Module 1" });
    expect(moduleLink).toHaveAttribute("href", "/module/1/1");

    const currentPage = screen.getByText("Current Page");
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });
});
