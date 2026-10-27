import { AppShell } from "@/components/app/AppShell";
import { LiveWorkout } from "@/components/app/LiveWorkout";
import { requireAuthenticatedUser } from "@/lib/server-auth";

export default function LiveWorkoutPage() {
  const user = requireAuthenticatedUser();
  return (
    <AppShell user={user}>
      <LiveWorkout />
    </AppShell>
  );
}
