import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../../src/pages/LoginPage";
import { useAuth } from "../../src/modules/useAuth";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../src/modules/useAuth");

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to / if already authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", username: "admin", role: "admin" },
      isLoading: false,
      authState: { isAuthenticated: true, user: null, claims: null, isLoading: false },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("should handle successful login submission", async () => {
    const mockLogin = vi.fn().mockResolvedValue({ id: "1", username: "admin" });
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: mockLogin,
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("usernameInput"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByTestId("loginButton"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "secret123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should display 401 error message when credentials are wrong", async () => {
    const error401 = { response: { status: 401 } };
    const mockLogin = vi.fn().mockRejectedValue(error401);
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: mockLogin,
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("usernameInput"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByTestId("loginButton"));

    await waitFor(() => {
      expect(screen.getByTestId("loginError")).toHaveTextContent(
        "Gebruikersnaam en/of wachtwoord incorrect.",
      );
    });
  });

  it("should display 429 error message when rate limited", async () => {
    const error429 = { response: { status: 429 } };
    const mockLogin = vi.fn().mockRejectedValue(error429);
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: mockLogin,
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("usernameInput"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByTestId("loginButton"));

    await waitFor(() => {
      expect(screen.getByTestId("loginError")).toHaveTextContent(
        "Te veel inlogpogingen, probeer het later opnieuw.",
      );
    });
  });

  it("should display generic error message on network or 500 error", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error("Network fail"));
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      authState: { isAuthenticated: false, user: null, claims: null, isLoading: false },
      login: mockLogin,
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByTestId("usernameInput"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByTestId("loginButton"));

    await waitFor(() => {
      expect(screen.getByTestId("loginError")).toHaveTextContent(
        "Er is iets fout gegaan, probeer het later opnieuw.",
      );
    });
  });
});
