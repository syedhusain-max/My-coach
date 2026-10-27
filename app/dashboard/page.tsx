import { AppShell } from "@/components/app/AppShell";
import { Dashboard } from "@/components/app/Dashboard";
import { requireAuthenticatedUser } from "@/lib/server-auth";

export default function DashboardPage() {
  const user = requireAuthenticatedUser();
  return (
    <AppShell user={user}>
      <Dashboard user={user} />
    </AppShell>
  );
}
