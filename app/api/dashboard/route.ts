import { getDashboardData } from "@/lib/dashboard";
import { getAuthenticatedUser, getToday, jsonResponse, unauthorizedResponse } from "@/lib/api";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorizedResponse();
  return jsonResponse(getDashboardData(user, getToday()));
}
