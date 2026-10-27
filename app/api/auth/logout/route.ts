import { deleteSession, readSessionToken, sessionCookie } from "@/lib/auth";
import { jsonResponse } from "@/lib/api";

export async function POST(request: Request) {
  deleteSession(readSessionToken(request));
  return jsonResponse(
    { success: true },
    200,
    { "Set-Cookie": sessionCookie("", true) },
  );
}
