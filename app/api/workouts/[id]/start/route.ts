import {
  getAuthenticatedUser,
  getWorkoutForUser,
  jsonResponse,
  unauthorizedResponse,
  workoutWithExercises,
} from "@/lib/api";
import { getDb } from "@/lib/db";

type RouteContext = { params: { id: string } };

export async function POST(request: Request, { params }: RouteContext) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();
  const workout = getWorkoutForUser(params.id, user.id);
  if (!workout) return jsonResponse({ error: "Workout not found." }, 404);
  if (workout.status === "completed") {
    return jsonResponse({ error: "This workout is already complete." }, 409);
  }
  if (!workoutWithExercises(params.id)?.exercises.length) {
    return jsonResponse({ error: "Add at least one exercise before starting." }, 400);
  }

  getDb()
    .prepare(
      `UPDATE workouts SET status = 'active',
       started_at = COALESCE(started_at, ?) WHERE id = ?`,
    )
    .run(new Date().toISOString(), params.id);
  return jsonResponse({ workout: workoutWithExercises(params.id) });
}
