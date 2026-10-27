import { rmSync } from "node:fs";
import { resolve } from "node:path";

export default async function globalTeardown() {
  const databasePath = resolve(".data/pulsefit-playwright.sqlite");
  rmSync(databasePath, { force: true });
  rmSync(`${databasePath}-wal`, { force: true });
  rmSync(`${databasePath}-shm`, { force: true });
}
