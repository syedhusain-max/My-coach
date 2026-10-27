import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";

export default async function globalSetup() {
  const databasePath = resolve(".data/pulsefit-playwright.sqlite");
  mkdirSync(dirname(databasePath), { recursive: true });
  rmSync(databasePath, { force: true });
  rmSync(`${databasePath}-wal`, { force: true });
  rmSync(`${databasePath}-shm`, { force: true });
}
