import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../../src/modules/useAuth";
import { AuthProvider } from "../../src/modules/AuthProvider";
import AuthManager from "../../src/services/AuthManager";

vi.mock("../../src/services/AuthManager", () => ({
  default: {
    getMe: vi.fn(),
    signin: vi.fn(),
    logout: vi.fn(),
  },
}));

describe("useAuth & AuthProvider", () => {
  it("useAuth should throw error when used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );
    spy.mockRestore();
  });

  it("AuthProvider should load current user on mount", async () => {
    const mockUser = { id: "u1", username: "admin", role: "admin" };
    vi.mocked(AuthManager.getMe).mockResolvedValueOnce(mockUser);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for user to be populated
    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it("AuthProvider should handle unauthenticated user on mount failure", async () => {
    vi.mocked(AuthManager.getMe).mockRejectedValueOnce(new Error("Unauthorized"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("login should set user and return user", async () => {
    vi.mocked(AuthManager.getMe).mockRejectedValueOnce(new Error("Unauthorized"));
    const mockUser = { id: "u2", username: "newuser", role: "user" };
    vi.mocked(AuthManager.signin).mockResolvedValueOnce(mockUser);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    let loggedIn;
    await act(async () => {
      loggedIn = await result.current.login("newuser", "password");
    });

    expect(loggedIn).toEqual(mockUser);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("logout should clear user", async () => {
    const mockUser = { id: "u1", username: "admin", role: "admin" };
    vi.mocked(AuthManager.getMe).mockResolvedValueOnce(mockUser);
    vi.mocked(AuthManager.logout).mockResolvedValueOnce({ message: "ok" });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
