import { defineConfig } from "vitest/config"
import * as path from "node:path"

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      "@acme/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "./src/test/setup.ts")],
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
    css: true,
  },
})
