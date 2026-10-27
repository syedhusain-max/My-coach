"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Check, Flame, Play, Plus, Timer, Trophy } from "lucide-react";
import type { User } from "@/lib/db";
import type { Exercise } from "@/lib/exercises";

type SetData = { id: string; number: number; completed: boolean };
type WorkoutExercise = {
  id: string;
  exerciseId: string;
  sets: SetData[];
};
type Workout = {
  id: string;
  date: string;
  status: "planned" | "active" | "completed";
  exercises: WorkoutExercise[];
};
type DashboardData = {
  streak: number;
  weeklyChart: Array<{ date: string; day: string; workouts: number; minutes: number }>;
  progressRings: { workouts: number; minutes: number; consistency: number };
  completedWorkouts: number;
  weeklyWorkouts: number;
  weeklyMinutes: number;
};

export function Dashboard({ user }: { user: User }) {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData>();
  const [workout, setWorkout] = useState<Workout>();
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [dashboardResponse, workoutsResponse, exercisesResponse] =
          await Promise.all([
            fetch("/api/dashboard"),
            fetch("/api/workouts"),
            fetch("/api/exercises"),
          ]);
        if ([dashboardResponse, workoutsResponse, exercisesResponse].some((res) => !res.ok)) {
          throw new Error("We couldn’t load your training data. Please refresh.");
        }
        const [dashboardResult, workoutsResult, exerciseResult] =
          await Promise.all([
            dashboardResponse.json() as Promise<DashboardData>,
            workoutsResponse.json() as Promise<{ workouts: Workout[] }>,
            exercisesResponse.json() as Promise<{ exercises: Exercise[] }>,
          ]);
        setDashboard(dashboardResult);
        setWorkout(workoutsResult.workouts.find((item) => item.date === new Date().toISOString().slice(0, 10)));
        setExerciseNames(Object.fromEntries(exerciseResult.exercises.map((exercise) => [exercise.id, exercise.name])));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load your dashboard.");
      }
    }
    void load();
  }, []);

  async function startWorkout() {
    if (!workout || workout.exercises.length === 0) return;
    setStarting(true);
    setError("");
    try {
      const response = await fetch(`/api/workouts/${workout.id}/start`, { method: "POST" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to start your workout.");
      router.push("/workout/live");
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Unable to start your workout.");
      setStarting(false);
    }
  }

  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-700">{dateLabel}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-[2.5rem]">
            Let’s get after it, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Progress is built one good session at a time.
          </p>
        </div>
        <Link
          href="/workouts"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 sm:self-auto"
        >
          <Plus size={17} />
          Build a workout
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <section aria-label="Your training stats" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current streak" value={`${dashboard?.streak ?? "—"} ${dashboard?.streak === 1 ? "day" : "days"}`} icon={<Flame size={19} />} tone="orange" />
        <StatCard label="Sessions this week" value={`${dashboard?.weeklyWorkouts ?? "—"} / 4`} icon={<CalendarDays size={19} />} tone="blue" />
        <StatCard label="Training time" value={`${dashboard ? dashboard.weeklyMinutes : "—"} min`} icon={<Timer size={19} />} tone="violet" />
        <StatCard label="Workouts complete" value={`${dashboard?.completedWorkouts ?? "—"}`} icon={<Trophy size={19} />} tone="green" />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold">Weekly activity</h2>
              <p className="mt-1 text-sm text-slate-500">Your last 7 days of training</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {dashboard?.weeklyWorkouts ?? 0} {(dashboard?.weeklyWorkouts ?? 0) === 1 ? "session" : "sessions"}
            </span>
          </div>
          <div
            className="mt-8 grid min-h-[190px] grid-cols-7 items-end gap-2 sm:gap-4"
            aria-label="Workout minutes by day for the last 7 days"
          >
            {(dashboard?.weeklyChart ?? Array.from({ length: 7 }, (_, index) => ({
              date: `day-${index}`,
              day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
              workouts: 0,
              minutes: 0,
            }))).map((day) => (
              <div key={day.date} className="flex h-full flex-col items-center justify-end gap-3">
                <span className="text-[11px] font-semibold text-slate-500">
                  {day.minutes ? `${day.minutes}m` : ""}
                </span>
                <div className="flex h-32 w-full items-end rounded-lg bg-slate-50">
                  <div
                    role="img"
                    aria-label={`${day.day}: ${day.minutes} training minutes`}
                    className={`w-full rounded-lg transition-all ${day.workouts ? "bg-blue-500" : "bg-slate-200"}`}
                    style={{ height: `${day.minutes ? Math.min(100, Math.max(18, (day.minutes / 60) * 100)) : 8}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-extrabold">Your goals</h2>
          <p className="mt-1 text-sm text-slate-500">A little progress adds up.</p>
          <div className="mt-7 grid grid-cols-3 gap-2">
            <ProgressRing label="Workouts" value={dashboard?.progressRings.workouts ?? 0} />
            <ProgressRing label="Time" value={dashboard?.progressRings.minutes ?? 0} />
            <ProgressRing label="Streak" value={dashboard?.progressRings.consistency ?? 0} />
          </div>
          <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900">
            Your weekly targets update as you finish more workouts.
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Today’s plan</p>
            <h2 className="mt-2 text-xl font-extrabold">
              {workout?.status === "completed" ? "Workout complete. Nice work!" : workout?.exercises.length ? "Your workout is ready" : "Start with a plan"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {workout?.exercises.length
                ? `${workout.exercises.length} exercises · ${workout.exercises.reduce((count, item) => count + item.sets.length, 0)} sets`
                : "Pick a few exercises to build today’s session."}
            </p>
          </div>
          {workout?.status === "completed" ? (
            <span className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-50 px-4 text-sm font-bold text-emerald-800">
              <Check size={17} /> Done for today
            </span>
          ) : workout?.exercises.length ? (
            <button
              type="button"
              disabled={starting}
              onClick={() => void startWorkout()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              <Play size={16} fill="currentColor" />
              {starting ? "Starting…" : "Start workout"}
            </button>
          ) : (
            <Link href="/workouts" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-blue-700">
              Choose exercises <ArrowRight size={16} />
            </Link>
          )}
        </div>
        {workout?.exercises.length ? (
          <ul className="mt-5 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2">
            {workout.exercises.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-semibold">{exerciseNames[item.exerciseId] ?? item.exerciseId}</span>
                <span className="text-xs font-medium text-slate-500">{item.sets.length} × 10</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "orange" | "blue" | "violet" | "green";
}) {
  const tones = {
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>{icon}</span>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
    </div>
  );
}

function ProgressRing({ label, value }: { label: string; value: number }) {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  const circumference = 2 * Math.PI * 31;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[76px] w-[76px]">
        <svg viewBox="0 0 76 76" className="-rotate-90" role="img" aria-label={`${label} progress ${safeValue}%`}>
          <circle cx="38" cy="38" r="31" fill="none" stroke="#e2e8f0" strokeWidth="7" />
          <circle
            cx="38"
            cy="38"
            r="31"
            fill="none"
            stroke="#2563eb"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - safeValue / 100)}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-extrabold">{safeValue}%</span>
      </div>
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </div>
  );
}
