import { getAuthenticatedUser, getWorkoutForUser, jsonResponse, unauthorizedResponse, workoutWithExercises } from "@/lib/api";

type RouteContext = { params: { id: string } };

export async function GET(request: Request, { params }: RouteContext) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();
  const workout = getWorkoutForUser(params.id, user.id);
  if (!workout) return jsonResponse({ error: "Workout not found." }, 404);
  return jsonResponse({ workout: workoutWithExercises(params.id) });
}
