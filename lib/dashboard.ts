import { getDb, type User } from "@/lib/db";

export type WorkoutDateSummary = {
  workout_date: string;
  status: string;
  exercise_count: number;
};

export function calculateStreak(
  completedDates: string[],
  today: string,
): number {
  const dates = new Set(completedDates);
  if (dates.size === 0) return 0;

  let cursor = new Date(`${today}T00:00:00.000Z`);
  if (!dates.has(today)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!dates.has(cursor.toISOString().slice(0, 10))) return 0;
  }

  let streak = 0;
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function calculateProgressRings(
  weeklyWorkouts: number,
  weeklyMinutes: number,
  streak: number,
) {
  const percentage = (value: number, goal: number) =>
    Number.isFinite(value)
      ? Math.min(100, Math.max(0, Math.round((value / goal) * 100)))
      : 0;
  return {
    workouts: percentage(weeklyWorkouts, 4),
    minutes: percentage(weeklyMinutes, 200),
    consistency: percentage(streak, 7),
  };
}

export function getDashboardData(user: User, today: string) {
  const db = getDb();
  const workouts = db
    .prepare(
      `SELECT workout_date, status,
        (SELECT COUNT(*) FROM workout_exercises WHERE workout_id = workouts.id)
          AS exercise_count
       FROM workouts WHERE user_id = ? AND status = 'completed'
       ORDER BY workout_date DESC`,
    )
    .all(user.id) as WorkoutDateSummary[];

  const completedDates = workouts.map((workout) => workout.workout_date);
  const streak = calculateStreak(completedDates, today);
  const weeklyChart = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${today}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    const isoDate = date.toISOString().slice(0, 10);
    const workoutCount = workouts.filter(
      (workout) => workout.workout_date === isoDate,
    ).length;
    return {
      date: isoDate,
      day: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      workouts: workoutCount,
      minutes: workoutCount * 45,
    };
  });
  const weeklyWorkouts = weeklyChart.reduce(
    (total, day) => total + day.workouts,
    0,
  );
  const weeklyMinutes = weeklyChart.reduce(
    (total, day) => total + day.minutes,
    0,
  );
  const progressRings = calculateProgressRings(
    weeklyWorkouts,
    weeklyMinutes,
    streak,
  );

  return {
    streak,
    weeklyChart,
    progressRings,
    completedWorkouts: workouts.length,
    weeklyWorkouts,
    weeklyMinutes,
  };
}
