import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { useAuth } from "../src/modules/useAuth";

vi.mock("../src/modules/useAuth");
vi.mock("../src/modules/AuthProvider", () => ({
  AuthProvider: ({ children }: any) => children,
}));
vi.mock("../src/services/HealthUtils", () => ({
  default: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render landing page for unauthenticated user on root route", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText("Ontwikkelingsportfolio")).toBeInTheDocument();
    expect(
      screen.getByText("Welkom op mijn ontwikkelingsportfolio!"),
    ).toBeInTheDocument();
  });

  it("should render login page on /login route when not authenticated", () => {
    window.history.pushState({}, "", "/login");
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(<App />);
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should redirect /login to root when authenticated", () => {
    window.history.pushState({}, "", "/login");
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: { isAuthenticated: true, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(<App />);
    expect(
      screen.getByText("Welkom op mijn ontwikkelingsportfolio!"),
    ).toBeInTheDocument();
  });

  it("should redirect /upload to /login when unauthenticated", () => {
    window.history.pushState({}, "", "/upload");
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(<App />);
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should render null during auth loading state", () => {
    window.history.pushState({}, "", "/upload");
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: true },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(<App />);
    expect(screen.queryByText("Portfolio item aanmaken")).not.toBeInTheDocument();
  });

  it("should render CreatePage on /upload when authenticated", () => {
    window.history.pushState({}, "", "/upload");
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: { isAuthenticated: true, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(<App />);
    expect(screen.getByText("Portfolio item aanmaken")).toBeInTheDocument();
  });
});
