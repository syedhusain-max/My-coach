export const MUSCLE_GROUPS = [
  "All",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export type Exercise = {
  id: string;
  name: string;
  muscle: Exclude<MuscleGroup, "All">;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
};

const makeGroup = (
  muscle: Exercise["muscle"],
  items: Array<[string, string, Exercise["difficulty"], number]>,
): Exercise[] =>
  items.map(([name, equipment, difficulty, minutes], index) => ({
    id: `${muscle.toLowerCase()}-${index + 1}`,
    name,
    muscle,
    equipment,
    difficulty,
    minutes,
  }));

export const EXERCISES: Exercise[] = [
  ...makeGroup("Chest", [
    ["Barbell bench press", "Barbell", "Intermediate", 8],
    ["Incline dumbbell press", "Dumbbells", "Intermediate", 8],
    ["Push-up", "Bodyweight", "Beginner", 6],
    ["Cable chest fly", "Cable", "Beginner", 7],
    ["Dumbbell pullover", "Dumbbells", "Intermediate", 7],
  ]),
  ...makeGroup("Back", [
    ["Lat pulldown", "Cable", "Beginner", 8],
    ["Barbell row", "Barbell", "Intermediate", 8],
    ["Seated cable row", "Cable", "Beginner", 8],
    ["Pull-up", "Bodyweight", "Advanced", 7],
    ["Single-arm dumbbell row", "Dumbbells", "Beginner", 7],
  ]),
  ...makeGroup("Shoulders", [
    ["Overhead press", "Barbell", "Intermediate", 8],
    ["Dumbbell lateral raise", "Dumbbells", "Beginner", 6],
    ["Arnold press", "Dumbbells", "Intermediate", 8],
    ["Face pull", "Cable", "Beginner", 6],
    ["Rear delt fly", "Dumbbells", "Beginner", 6],
  ]),
  ...makeGroup("Arms", [
    ["Dumbbell bicep curl", "Dumbbells", "Beginner", 6],
    ["Hammer curl", "Dumbbells", "Beginner", 6],
    ["Tricep pushdown", "Cable", "Beginner", 6],
    ["Skull crusher", "EZ bar", "Intermediate", 7],
    ["Bench dip", "Bodyweight", "Beginner", 6],
  ]),
  ...makeGroup("Legs", [
    ["Barbell back squat", "Barbell", "Intermediate", 10],
    ["Romanian deadlift", "Barbell", "Intermediate", 9],
    ["Walking lunge", "Dumbbells", "Beginner", 8],
    ["Leg press", "Machine", "Beginner", 8],
    ["Standing calf raise", "Machine", "Beginner", 6],
  ]),
  ...makeGroup("Core", [
    ["Plank", "Bodyweight", "Beginner", 4],
    ["Bicycle crunch", "Bodyweight", "Beginner", 5],
    ["Hanging knee raise", "Bodyweight", "Intermediate", 6],
    ["Russian twist", "Bodyweight", "Beginner", 5],
    ["Dead bug", "Bodyweight", "Beginner", 5],
  ]),
];

export function findExercise(id: string): Exercise | undefined {
  return EXERCISES.find((exercise) => exercise.id === id);
}
