import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingPage from "../../src/pages/LandingPage";
import checkServerHealth from "../../src/services/HealthUtils";

vi.mock("../../src/services/HealthUtils", () => ({
  default: vi.fn(),
}));

describe("LandingPage", () => {
  it("should render welcome text and call checkServerHealth on mount", () => {
    render(<LandingPage />);

    expect(
      screen.getByText("Welkom op mijn ontwikkelingsportfolio!"),
    ).toBeInTheDocument();
    expect(checkServerHealth).toHaveBeenCalled();
  });
});
