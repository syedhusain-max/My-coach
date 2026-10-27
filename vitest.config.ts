import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

process.env.PULSEFIT_DATABASE_PATH = resolve(
  tmpdir(),
  `pulsefit-vitest-${process.pid}.sqlite`,
);

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(process.cwd()),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 120_000,
    fileParallelism: false,
    include: ["tests/**/*.test.ts"],
  },
});
