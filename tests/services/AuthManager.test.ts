import { describe, it, expect, vi } from "vitest";
import AuthManager from "../../src/services/AuthManager";
import apiClient from "../../src/services/apiClient";

vi.mock("../../src/services/apiClient", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("AuthManager", () => {
  it("signin should call /user/signin and return user data", async () => {
    const mockUser = { id: "1", username: "testuser" };
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockUser });

    const result = await AuthManager.signin("testuser", "pass123");
    expect(apiClient.post).toHaveBeenCalledWith("/user/signin", {
      username: "testuser",
      password: "pass123",
    });
    expect(result).toEqual(mockUser);
  });

  it("logout should call /user/logout and return message", async () => {
    const mockRes = { message: "logged out" };
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockRes });

    const result = await AuthManager.logout();
    expect(apiClient.post).toHaveBeenCalledWith("/user/logout");
    expect(result).toEqual(mockRes);
  });

  it("getMe should call /user/me and return user data", async () => {
    const mockUser = { id: "1", username: "testuser" };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockUser });

    const result = await AuthManager.getMe();
    expect(apiClient.get).toHaveBeenCalledWith("/user/me");
    expect(result).toEqual(mockUser);
  });
});
