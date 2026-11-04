import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DropdownMenu from "../../src/components/DropdownMenu";

const mockSchoolYears = {
  "1": [1, 2, 3, 4],
  "2": [5, 6, 7, 8],
};

describe("DropdownMenu", () => {
  it("should toggle open and show school years and portfolio link", () => {
    render(
      <BrowserRouter>
        <DropdownMenu schoolYears={mockSchoolYears} />
      </BrowserRouter>,
    );

    const toggleBtn = screen.getByRole("button", {
      name: "Navigatiemenu openen",
    });
    expect(toggleBtn).toBeInTheDocument();

    // Closed initially
    expect(screen.queryByText("Leerjaar 1")).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Leerjaar 1")).toBeInTheDocument();
    expect(screen.getByText("Leerjaar 2")).toBeInTheDocument();
    expect(screen.getByText("Officieel portfolio")).toBeInTheDocument();

    // Open Year 1 submenu
    fireEvent.click(screen.getByText("Leerjaar 1"));
    expect(screen.getByText("Module 1")).toBeInTheDocument();
    expect(screen.getByText("Module 4")).toBeInTheDocument();

    // Close on Escape
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Leerjaar 1")).not.toBeInTheDocument();
  });

  it("should close menu when clicked outside", () => {
    render(
      <BrowserRouter>
        <div>
          <div data-testid="outside">Outside</div>
          <DropdownMenu schoolYears={mockSchoolYears} />
        </div>
      </BrowserRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Navigatiemenu openen" }),
    );
    expect(screen.getByText("Leerjaar 1")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("Leerjaar 1")).not.toBeInTheDocument();
  });
});
