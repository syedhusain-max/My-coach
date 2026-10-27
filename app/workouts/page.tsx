import { AppShell } from "@/components/app/AppShell";
import { WorkoutLibrary } from "@/components/app/WorkoutLibrary";
import { requireAuthenticatedUser } from "@/lib/server-auth";

export default function WorkoutsPage() {
  const user = requireAuthenticatedUser();
  return (
    <AppShell user={user}>
      <WorkoutLibrary />
    </AppShell>
  );
}
