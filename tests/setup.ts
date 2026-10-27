import { createServer, type Server } from "node:http";
import { rmSync } from "node:fs";
import { afterAll, beforeAll } from "vitest";
import next from "next";

let server: Server;
let application: ReturnType<typeof next>;

beforeAll(async () => {
  const databasePath = process.env.PULSEFIT_DATABASE_PATH;
  if (!databasePath) throw new Error("Test database path was not configured.");
  rmSync(databasePath, { force: true });
  rmSync(`${databasePath}-wal`, { force: true });
  rmSync(`${databasePath}-shm`, { force: true });

  application = next({ dev: true, dir: process.cwd() });
  await application.prepare();
  server = createServer(application.getRequestHandler());
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not determine the test server address.");
  }
  process.env.PULSEFIT_TEST_API_URL = `http://127.0.0.1:${address.port}`;
}, 120_000);

afterAll(async () => {
  if (server?.listening) {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await application?.close();
  const databasePath = process.env.PULSEFIT_DATABASE_PATH;
  if (databasePath) {
    rmSync(databasePath, { force: true });
    rmSync(`${databasePath}-wal`, { force: true });
    rmSync(`${databasePath}-shm`, { force: true });
  }
});
