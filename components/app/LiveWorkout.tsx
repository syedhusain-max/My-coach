"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Clock3, Dumbbell, Pause, Play, Trophy } from "lucide-react";

type SetData = { id: string; number: number; completed: boolean };
type WorkoutExercise = {
  id: string;
  exerciseId: string;
  reps: number;
  sets: SetData[];
};
type Workout = {
  id: string;
  date: string;
  status: "planned" | "active" | "completed";
  exercises: WorkoutExercise[];
};

export function LiveWorkout() {
  const [workout, setWorkout] = useState<Workout>();
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busySet, setBusySet] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [resting, setResting] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    async function load() {
      const [workoutResponse, exerciseResponse] = await Promise.all([
        fetch("/api/workouts"),
        fetch("/api/exercises"),
      ]);
      if (!workoutResponse.ok || !exerciseResponse.ok) {
        throw new Error("Unable to load your active workout.");
      }
      const [workoutResult, exerciseResult] = await Promise.all([
        workoutResponse.json() as Promise<{ workouts: Workout[] }>,
        exerciseResponse.json() as Promise<{
          exercises: Array<{ id: string; name: string }>;
        }>,
      ]);
      const today = workoutResult.workouts.find(
        (item) => item.date === new Date().toISOString().slice(0, 10),
      );
      setWorkout(today);
      setExerciseNames(
        Object.fromEntries(exerciseResult.exercises.map((item) => [item.id, item.name])),
      );
      if (today?.status === "completed") setComplete(true);
    }
    void load()
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load your active workout.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!resting || seconds <= 0) {
      if (seconds <= 0) setResting(false);
      return;
    }
    const interval = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [resting, seconds]);

  async function toggleSet(set: SetData) {
    if (!workout || busySet || set.completed) return;
    setBusySet(set.id);
    setError("");
    try {
      const response = await fetch(`/api/sets/${set.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !set.completed }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to update this set.");
      setWorkout({
        ...workout,
        exercises: workout.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((item) =>
            item.id === set.id ? { ...item, completed: !set.completed } : item,
          ),
        })),
      });
      if (!set.completed) {
        setSeconds(60);
        setResting(true);
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update this set.");
    } finally {
      setBusySet("");
    }
  }

  async function finishWorkout() {
    if (!workout) return;
    setError("");
    try {
      const response = await fetch(`/api/workouts/${workout.id}/complete`, {
        method: "POST",
      });
      const result = (await response.json()) as { workout?: Workout; error?: string };
      if (!response.ok || !result.workout) {
        throw new Error(result.error ?? "Unable to finish this workout.");
      }
      setWorkout(result.workout);
      setResting(false);
      setComplete(true);
    } catch (finishError) {
      setError(finishError instanceof Error ? finishError.message : "Unable to finish this workout.");
    }
  }

  const totalSets = workout?.exercises.reduce((total, exercise) => total + exercise.sets.length, 0) ?? 0;
  const completedSets = workout?.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
    0,
  ) ?? 0;
  const progress = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm font-medium text-slate-500">Loading your workout…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950">
        <ArrowLeft size={16} /> Dashboard
      </Link>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      {complete ? (
        <section className="relative mt-6 overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center text-white sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }, (_, index) => (
              <i
                key={index}
                className="confetti-piece absolute top-[-12px] h-3 w-2 rounded-sm"
                style={{
                  left: `${(index * 37) % 100}%`,
                  backgroundColor: ["#60a5fa", "#fbbf24", "#34d399", "#f472b6"][index % 4],
                  animationDelay: `${(index % 8) * 0.12}s`,
                }}
              />
            ))}
          </div>
          <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <Trophy size={30} />
          </span>
          <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">That’s a wrap</p>
          <h1 className="relative mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">You showed up. That’s a win.</h1>
          <p role="status" className="relative mt-3 text-sm text-slate-300">Workout complete! Your progress has been saved.</p>
          <Link href="/dashboard" className="relative mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 text-sm font-bold text-white hover:bg-blue-400">
            Back to dashboard <Check size={17} />
          </Link>
        </section>
      ) : !workout || workout.exercises.length === 0 ? (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
          <Dumbbell className="mx-auto text-blue-600" size={34} />
          <h1 className="mt-5 text-2xl font-extrabold">No workout ready yet</h1>
          <p className="mt-2 text-sm text-slate-500">Choose exercises from your library to build today’s plan.</p>
          <Link href="/workouts" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">
            Open workout library
          </Link>
        </section>
      ) : (
        <>
          <div className="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white sm:p-9">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Live workout</p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Stay in your flow.</h1>
                <p className="mt-2 text-sm text-slate-300">{workout.exercises.length} exercises · {totalSets} sets</p>
              </div>
              <div className="min-w-[160px] rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-slate-400">Rest timer</p>
                <p aria-live="polite" className="mt-1 font-mono text-3xl font-bold tabular-nums">
                  {`${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`}
                </p>
                <button
                  type="button"
                  onClick={() => setResting((current) => !current)}
                  aria-label={resting ? "Pause rest timer" : "Start rest timer"}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white"
                >
                  {resting ? <Pause size={13} /> : <Play size={13} />}
                  {resting ? "Pause timer" : "Start timer"}
                </button>
              </div>
            </div>
            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-300">
                <span>Session progress</span><span>{completedSets} / {totalSets} sets</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-white/15"
                role="progressbar"
                aria-label="Workout completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {workout.exercises.map((exercise, index) => (
              <section key={exercise.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 font-extrabold text-blue-700">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 className="font-extrabold">{exerciseNames[exercise.exerciseId] ?? exercise.exerciseId}</h2>
                    <p className="mt-1 text-xs text-slate-500">{exercise.sets.length} sets · {exercise.reps} reps</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {exercise.sets.map((set) => (
                    <button
                      key={set.id}
                      type="button"
                      aria-pressed={set.completed}
                      aria-label={`${set.completed ? "Untick" : "Tick"} set ${set.number} for ${exerciseNames[exercise.exerciseId] ?? "exercise"}`}
                      disabled={busySet === set.id}
                      onClick={() => void toggleSet(set)}
                      className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-4 sm:text-sm ${
                        set.completed
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-700"
                      }`}
                    >
                      {set.completed ? <Check size={15} /> : <Clock3 size={14} />}
                      Set {set.number}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void finishWorkout()}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Finish workout <Trophy size={17} />
          </button>
        </>
      )}
    </div>
  );
}
