import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../src/components/Navbar";
import { useAuth } from "../../src/modules/useAuth";

vi.mock("../../src/modules/useAuth");

describe("Navbar", () => {
  it("should render title and not render action buttons when unauthenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText("Ontwikkelingsportfolio")).toBeInTheDocument();
    expect(screen.getByText("JVE")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Portfolio item toevoegen"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Uitloggen")).not.toBeInTheDocument();
  });

  it("should render add and logout buttons when authenticated and call logout on click", () => {
    const logoutMock = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: {
        isAuthenticated: true,
        user: { id: "1", username: "admin", role: "admin" },
        claims: { id: "1", username: "admin", role: "admin" },
        isLoading: false,
      },
      login: vi.fn(),
      logout: logoutMock,
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    const addLink = screen.getByLabelText("Portfolio item toevoegen");
    expect(addLink).toHaveAttribute("href", "/upload");

    const logoutBtn = screen.getByLabelText("Uitloggen");
    fireEvent.click(logoutBtn);
    expect(logoutMock).toHaveBeenCalled();
  });
});
