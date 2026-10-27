import { getDb } from "@/lib/db";
import { getAuthenticatedUser, jsonResponse, unauthorizedResponse } from "@/lib/api";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();

  const db = getDb();
  const members = (db.prepare(`SELECT COUNT(*) AS count FROM users`).get() as { count: number }).count;
  const workoutsCompleted = (
    db
      .prepare(
        `SELECT COUNT(*) AS count FROM workouts
         WHERE user_id = ? AND status = 'completed'`,
      )
      .get(user.id) as { count: number }
  ).count;

  return jsonResponse({ members, workoutsCompleted, classesThisWeek: 0 });
}
