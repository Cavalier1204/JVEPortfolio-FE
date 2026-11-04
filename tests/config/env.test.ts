import { describe, it, expect } from "vitest";
import { env } from "../../src/config/env";

describe("env config", () => {
  it("should load configuration values", () => {
    expect(env).toBeDefined();
    expect(env.BUNNY_NET).toBeDefined();
    expect(typeof env.BACKEND_URL).toBe("string");
    expect(typeof env.BUNNY_NET.CDN_URL).toBe("string");
    expect(typeof env.BUNNY_NET.STORAGE_URL).toBe("string");
  });
});
