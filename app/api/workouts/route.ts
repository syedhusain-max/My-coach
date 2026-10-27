import { randomUUID } from "node:crypto";
import {
  getAuthenticatedUser,
  getToday,
  jsonResponse,
  unauthorizedResponse,
  workoutWithExercises,
} from "@/lib/api";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();

  const rows = getDb()
    .prepare(
      `SELECT id FROM workouts WHERE user_id = ?
       ORDER BY workout_date DESC, created_at DESC`,
    )
    .all(user.id) as Array<{ id: string }>;
  return jsonResponse({
    workouts: rows.map((row) => workoutWithExercises(row.id)),
  });
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();

  const db = getDb();
  const today = getToday();
  const id = randomUUID();
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT OR IGNORE INTO workouts
       (id, user_id, workout_date, status, created_at) VALUES (?, ?, ?, 'planned', ?)`,
    )
    .run(id, user.id, today, now);
  const workout = db
    .prepare(`SELECT id FROM workouts WHERE user_id = ? AND workout_date = ?`)
    .get(user.id, today) as { id: string };
  return jsonResponse(
    { workout: workoutWithExercises(workout.id) },
    result.changes ? 201 : 200,
  );
}
