import { randomUUID } from "node:crypto";
import {
  getAuthenticatedUser,
  getWorkoutForUser,
  isResponse,
  jsonResponse,
  parseJson,
  unauthorizedResponse,
  workoutWithExercises,
} from "@/lib/api";
import { getDb } from "@/lib/db";
import { findExercise } from "@/lib/exercises";

type RouteContext = { params: { id: string } };

export async function POST(request: Request, { params }: RouteContext) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();

  const workout = getWorkoutForUser(params.id, user.id);
  if (!workout) return jsonResponse({ error: "Workout not found." }, 404);
  if (workout.status !== "planned") {
    return jsonResponse({ error: "Exercises cannot be changed after a workout starts." }, 409);
  }

  const body = await parseJson(request);
  if (isResponse(body)) return body;
  const exerciseId =
    typeof body.exerciseId === "string" ? body.exerciseId : "";
  const exercise = findExercise(exerciseId);
  if (!exercise) {
    return jsonResponse({ error: "Choose a valid exercise." }, 400);
  }

  const db = getDb();
  const duplicate = db
    .prepare(
      `SELECT id FROM workout_exercises WHERE workout_id = ? AND exercise_id = ?`,
    )
    .get(params.id, exerciseId);
  if (duplicate) {
    return jsonResponse({ error: "This exercise is already in the workout." }, 409);
  }

  const position = (
    db
      .prepare(
        `SELECT COALESCE(MAX(position), 0) + 1 AS next
         FROM workout_exercises WHERE workout_id = ?`,
      )
      .get(params.id) as { next: number }
  ).next;
  const exerciseEntryId = randomUUID();
  const insertExercise = db.prepare(
    `INSERT INTO workout_exercises
     (id, workout_id, exercise_id, position, sets_total, reps)
     VALUES (?, ?, ?, ?, 3, 10)`,
  );
  const insertSet = db.prepare(
    `INSERT INTO sets (id, workout_exercise_id, set_number) VALUES (?, ?, ?)`,
  );
  db.transaction(() => {
    insertExercise.run(exerciseEntryId, params.id, exerciseId, position);
    for (let number = 1; number <= 3; number += 1) {
      insertSet.run(randomUUID(), exerciseEntryId, number);
    }
  })();

  return jsonResponse({ workout: workoutWithExercises(params.id) }, 201);
}
