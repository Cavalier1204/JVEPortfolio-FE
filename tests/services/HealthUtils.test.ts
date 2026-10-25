import { describe, it, expect, vi } from "vitest";
import checkServerHealth from "../../src/services/HealthUtils";
import apiClient from "../../src/services/apiClient";

vi.mock("../../src/services/apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("HealthUtils", () => {
  it("should call apiClient.get with /health", async () => {
    const mockResponse = { data: { status: "ok" } };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const res = await checkServerHealth();
    expect(apiClient.get).toHaveBeenCalledWith("/health");
    expect(res).toBe(mockResponse);
  });
});
