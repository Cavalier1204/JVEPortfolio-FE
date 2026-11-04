import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    env: {
      VITE_BACKEND_URL: "http://localhost:8000",
      VITE_BUNNY_NET_STORAGE_URL: "https://storage.bunnycdn.com/dummy",
      VITE_BUNNY_NET_CDN_URL: "https://dummy.b-cdn.net/",
      VITE_BUNNY_NET_API_KEY: "dummy",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/types/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
