import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Fallback environment variables for tests (e.g. CI environments without .env)
process.env.VITE_BACKEND_URL =
  process.env.VITE_BACKEND_URL || "http://localhost:8000";
process.env.VITE_BUNNY_NET_STORAGE_URL =
  process.env.VITE_BUNNY_NET_STORAGE_URL || "https://storage.bunnycdn.com/dummy";
process.env.VITE_BUNNY_NET_CDN_URL =
  process.env.VITE_BUNNY_NET_CDN_URL || "https://dummy.b-cdn.net/";
process.env.VITE_BUNNY_NET_API_KEY =
  process.env.VITE_BUNNY_NET_API_KEY || "dummy";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
if (typeof window.URL.createObjectURL === "undefined") {
  Object.defineProperty(window.URL, "createObjectURL", {
    value: vi.fn((file) => `blob:mock-url/${file.name || "test"}`),
    writable: true,
  });
}

if (typeof window.URL.revokeObjectURL === "undefined") {
  Object.defineProperty(window.URL, "revokeObjectURL", {
    value: vi.fn(),
    writable: true,
  });
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
} as any;
