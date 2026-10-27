import { createSession, hashPassword, newUserId, sessionCookie } from "@/lib/auth";
import { getDb, getUserByEmail } from "@/lib/db";
import { isResponse, jsonResponse, parseJson } from "@/lib/api";

export async function POST(request: Request) {
  const body = await parseJson(request);
  if (isResponse(body)) return body;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || name.length > 80) {
    return jsonResponse({ error: "Enter your name (up to 80 characters)." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return jsonResponse(
      { error: "Password must use at least 8 characters with a lowercase letter, uppercase letter, and number." },
      400,
    );
  }
  if (getUserByEmail(email)) {
    return jsonResponse({ error: "An account with this email already exists." }, 409);
  }

  const id = newUserId();
  const createdAt = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO users (id, email, name, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(id, email, name, hashPassword(password), createdAt);
  const token = createSession(id);

  return jsonResponse(
    { user: { id, email, name, createdAt } },
    201,
    { "Set-Cookie": sessionCookie(token) },
  );
}
