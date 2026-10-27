import { EXERCISES, MUSCLE_GROUPS } from "@/lib/exercises";
import { getAuthenticatedUser, jsonResponse, unauthorizedResponse } from "@/lib/api";

export async function GET(request: Request) {
  if (!getAuthenticatedUser(request)) return unauthorizedResponse();
  const muscle = new URL(request.url).searchParams.get("muscle");
  if (!muscle || muscle.toLowerCase() === "all") {
    return jsonResponse({ exercises: EXERCISES });
  }

  const group = MUSCLE_GROUPS.find(
    (item) => item.toLowerCase() === muscle.toLowerCase(),
  );
  if (!group || group === "All") {
    return jsonResponse({ error: "Unknown muscle group." }, 400);
  }
  return jsonResponse({
    exercises: EXERCISES.filter(
      (exercise) => exercise.muscle.toLowerCase() === group.toLowerCase(),
    ),
  });
}
