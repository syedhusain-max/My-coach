import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromToken, SESSION_COOKIE } from "@/lib/auth";

export function requireAuthenticatedUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const user = getUserFromToken(token);
  if (!user) redirect("/login");
  return user;
}
