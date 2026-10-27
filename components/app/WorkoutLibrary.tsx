"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Dumbbell, Plus } from "lucide-react";
import { EXERCISES, MUSCLE_GROUPS, type Exercise, type MuscleGroup } from "@/lib/exercises";

type Workout = {
  id: string;
  date: string;
  status: "planned" | "active" | "completed";
  exercises: Array<{ id: string; exerciseId: string }>;
};

export function WorkoutLibrary() {
  const [muscle, setMuscle] = useState<MuscleGroup>("All");
  const [workout, setWorkout] = useState<Workout>();
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/workouts");
      if (!response.ok) throw new Error("Unable to load your workout.");
      const result = (await response.json()) as { workouts: Workout[] };
      const today = result.workouts.find((item) => item.date === new Date().toISOString().slice(0, 10));
      if (today) {
        setWorkout(today);
        setAdded(new Set(today.exercises.map((item) => item.exerciseId)));
      }
    }
    void load().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : "Unable to load your workout.");
    });
  }, []);

  const exercises = useMemo(
    () =>
      muscle === "All"
        ? EXERCISES
        : EXERCISES.filter((exercise) => exercise.muscle === muscle),
    [muscle],
  );

  async function addExercise(exercise: Exercise) {
    setBusyId(exercise.id);
    setError("");
    try {
      let currentWorkout = workout;
      if (!currentWorkout) {
        const createResponse = await fetch("/api/workouts", { method: "POST" });
        const createResult = (await createResponse.json()) as { workout?: Workout; error?: string };
        if (!createResponse.ok || !createResult.workout) {
          throw new Error(createResult.error ?? "Unable to create today’s workout.");
        }
        currentWorkout = createResult.workout;
        setWorkout(currentWorkout);
      }
      const response = await fetch(`/api/workouts/${currentWorkout.id}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id }),
      });
      const result = (await response.json()) as { workout?: Workout; error?: string };
      if (!response.ok || !result.workout) {
        throw new Error(result.error ?? "Unable to add this exercise.");
      }
      setWorkout(result.workout);
      setAdded(new Set(result.workout.exercises.map((item) => item.exerciseId)));
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Unable to add this exercise.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-700">Make it yours</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-[2.5rem]">Workout library</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Choose movements that fit your day. Add your favorites to today’s workout.
          </p>
        </div>
        <Link href="/dashboard" className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
          View today’s workout <ArrowRight size={16} />
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filter exercises by muscle group">
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            aria-pressed={muscle === group}
            onClick={() => setMuscle(group)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              muscle === group
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
        {muscle !== "All" ? ` for ${muscle.toLowerCase()}` : ""}
      </p>
      <section aria-label="Exercises" className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {exercises.map((exercise) => {
          const isAdded = added.has(exercise.id);
          const locked = workout?.status === "active" || workout?.status === "completed";
          return (
            <article key={exercise.id} className="flex min-h-[202px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <Dumbbell size={21} />
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                  {exercise.muscle}
                </span>
              </div>
              <h2 className="mt-5 text-base font-extrabold">{exercise.name}</h2>
              <p className="mt-1 text-xs text-slate-500">
                {exercise.equipment} · {exercise.difficulty} · {exercise.minutes} min
              </p>
              <button
                type="button"
                aria-label={`${isAdded ? "Added" : "Add"} ${exercise.name} ${isAdded ? "to today’s workout" : "to today’s workout"}`}
                disabled={isAdded || locked || busyId !== ""}
                onClick={() => void addExercise(exercise)}
                className={`mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed ${
                  isAdded
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-slate-950 text-white hover:bg-blue-700 disabled:bg-slate-300"
                }`}
              >
                {isAdded ? <Check size={16} /> : <Plus size={16} />}
                {isAdded ? "Added to today’s workout" : busyId === exercise.id ? "Adding…" : "Add to today’s workout"}
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
