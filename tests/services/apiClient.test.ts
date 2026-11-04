import { describe, it, expect, vi } from "vitest";
import apiClient from "../../src/services/apiClient";

describe("apiClient", () => {
  it("should have correct baseURL and withCredentials", () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("interceptor should pass through successful responses", () => {
    const responseInterceptor = (apiClient.interceptors.response as any)
      .handlers[0];
    const mockRes = { data: "success" };
    expect(responseInterceptor.fulfilled(mockRes)).toBe(mockRes);
  });

  it("interceptor should log and reject network errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const responseInterceptor = (apiClient.interceptors.response as any)
      .handlers[0];
    const networkError = {
      request: {},
      message: "Network Error",
    };

    await expect(responseInterceptor.rejected(networkError)).rejects.toEqual(
      networkError,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Network or connection error:",
      "Network Error",
    );
    consoleSpy.mockRestore();
  });

  it("interceptor should reject errors without logging if error.response exists", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const responseInterceptor = (apiClient.interceptors.response as any)
      .handlers[0];
    const serverError = {
      request: {},
      response: { status: 500 },
      message: "Server Error",
    };

    await expect(responseInterceptor.rejected(serverError)).rejects.toEqual(
      serverError,
    );
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
