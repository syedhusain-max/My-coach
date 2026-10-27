import { createSession, sessionCookie, verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";
import { isResponse, jsonResponse, parseJson } from "@/lib/api";

export async function POST(request: Request) {
  const body = await parseJson(request);
  if (isResponse(body)) return body;

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return jsonResponse({ error: "Email or password is incorrect." }, 401);
  }

  const token = createSession(user.id);
  return jsonResponse(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    },
    200,
    { "Set-Cookie": sessionCookie(token) },
  );
}
