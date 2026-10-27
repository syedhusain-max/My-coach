import { getDb, type User } from "@/lib/db";
import { getUserFromToken, readSessionToken } from "@/lib/auth";

export function jsonResponse(
  body: unknown,
  status = 200,
  headers?: HeadersInit,
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json; charset=utf-8");
  responseHeaders.set("Cache-Control", "no-store");
  return Response.json(body, { status, headers: responseHeaders });
}

export function getAuthenticatedUser(request: Request): User | undefined {
  return getUserFromToken(readSessionToken(request));
}

export function unauthorizedResponse(): Response {
  return jsonResponse({ error: "Authentication required." }, 401);
}

export async function parseJson(
  request: Request,
): Promise<Record<string, unknown> | Response> {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return jsonResponse({ error: "Request body must be a JSON object." }, 400);
    }
    return body as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getWorkoutForUser(workoutId: string, userId: string) {
  return getDb()
    .prepare(
      `SELECT id, user_id AS userId, workout_date AS date, status,
        started_at AS startedAt, completed_at AS completedAt,
        created_at AS createdAt
       FROM workouts WHERE id = ? AND user_id = ?`,
    )
    .get(workoutId, userId) as
    | {
        id: string;
        userId: string;
        date: string;
        status: "planned" | "active" | "completed";
        startedAt: string | null;
        completedAt: string | null;
        createdAt: string;
      }
    | undefined;
}

export function workoutWithExercises(workoutId: string) {
  const db = getDb();
  const workout = db
    .prepare(
      `SELECT id, workout_date AS date, status,
        started_at AS startedAt, completed_at AS completedAt,
        created_at AS createdAt FROM workouts WHERE id = ?`,
    )
    .get(workoutId);
  if (!workout) return undefined;

  const exercises = db
    .prepare(
      `SELECT workout_exercises.id, exercise_id AS exerciseId,
        position, sets_total AS setsTotal, reps
       FROM workout_exercises WHERE workout_id = ? ORDER BY position`,
    )
    .all(workoutId) as Array<{
    id: string;
    exerciseId: string;
    position: number;
    setsTotal: number;
    reps: number;
  }>;
  const sets = db.prepare(
    `SELECT id, set_number AS number, completed
     FROM sets WHERE workout_exercise_id = ? ORDER BY set_number`,
  );

  return {
    ...workout,
    exercises: exercises.map((exercise) => ({
      ...exercise,
      sets: sets.all(exercise.id).map((set) => ({
        ...(set as { id: string; number: number; completed: number }),
        completed: Boolean((set as { completed: number }).completed),
      })),
    })),
  };
}
