import { getAuthenticatedUser, jsonResponse, parseJson, isResponse, unauthorizedResponse } from "@/lib/api";
import { getDb } from "@/lib/db";

type RouteContext = { params: { id: string } };

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();

  const set = getDb()
    .prepare(
      `SELECT sets.id, workouts.user_id AS userId, workouts.status
       FROM sets
       JOIN workout_exercises ON workout_exercises.id = sets.workout_exercise_id
       JOIN workouts ON workouts.id = workout_exercises.workout_id
       WHERE sets.id = ?`,
    )
    .get(params.id) as
    | { id: string; userId: string; status: "planned" | "active" | "completed" }
    | undefined;
  if (!set || set.userId !== user.id) {
    return jsonResponse({ error: "Set not found." }, 404);
  }
  if (set.status !== "active") {
    return jsonResponse({ error: "Sets can only be changed during an active workout." }, 409);
  }

  const body = await parseJson(request);
  if (isResponse(body)) return body;
  if (typeof body.completed !== "boolean") {
    return jsonResponse({ error: "completed must be true or false." }, 400);
  }

  getDb()
    .prepare(`UPDATE sets SET completed = ? WHERE id = ?`)
    .run(body.completed ? 1 : 0, params.id);
  return jsonResponse({ set: { id: params.id, completed: body.completed } });
}
