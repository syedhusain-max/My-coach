import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

let connection: Database.Database | undefined;

export function getDb(): Database.Database {
  if (connection) return connection;

  const filename = resolve(
    process.env.PULSEFIT_DATABASE_PATH ?? ".data/pulsefit.sqlite",
  );
  mkdirSync(dirname(filename), { recursive: true });
  connection = new Database(filename);
  connection.pragma("foreign_keys = ON");
  connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workout_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('planned', 'active', 'completed')),
      started_at TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, workout_date)
    );
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
      exercise_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      sets_total INTEGER NOT NULL DEFAULT 3,
      reps INTEGER NOT NULL DEFAULT 10,
      UNIQUE(workout_id, exercise_id)
    );
    CREATE TABLE IF NOT EXISTS sets (
      id TEXT PRIMARY KEY,
      workout_exercise_id TEXT NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
      set_number INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(workout_exercise_id, set_number)
    );
  `);
  return connection;
}

export function closeDb(): void {
  connection?.close();
  connection = undefined;
}

export function getUserById(id: string): User | undefined {
  return getDb()
    .prepare(
      `SELECT id, email, name, created_at AS createdAt FROM users WHERE id = ?`,
    )
    .get(id) as User | undefined;
}

export function getUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
  return getDb()
    .prepare(
      `SELECT id, email, name, password_hash AS passwordHash,
        created_at AS createdAt FROM users WHERE email = ?`,
    )
    .get(email) as (User & { passwordHash: string }) | undefined;
}

export function getUserFromTokenHash(tokenHash: string): User | undefined {
  return getDb()
    .prepare(
      `SELECT users.id, users.email, users.name, users.created_at AS createdAt
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > ?`,
    )
    .get(tokenHash, new Date().toISOString()) as User | undefined;
}
