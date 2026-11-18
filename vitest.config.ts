import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import "dotenv/config";
if (process.env.RUN_DB_TESTS === "1" && process.env.TEST_DATABASE_URL)
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./tests/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
