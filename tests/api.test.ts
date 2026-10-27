import { randomUUID } from "node:crypto";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { calculateProgressRings, calculateStreak } from "@/lib/dashboard";

const api = () => request(process.env.PULSEFIT_TEST_API_URL!);
const email = () => `test-${randomUUID()}@pulsefit.test`;
const password = "FitStart2026";

async function createUser(name = "Test Athlete") {
  const agent = request.agent(process.env.PULSEFIT_TEST_API_URL!);
  const response = await agent
    .post("/api/auth/signup")
    .send({ name, email: email(), password });
  expect(response.status).toBe(201);
  return { agent, user: response.body.user };
}

describe("PulseFit API", () => {
  it("signs up users, rejects duplicate email, and blocks weak or empty passwords", async () => {
    const agent = request.agent(process.env.PULSEFIT_TEST_API_URL!);
    const userEmail = email();
    const signup = await agent
      .post("/api/auth/signup")
      .send({ name: "A Test User", email: userEmail, password });
    expect(signup.status).toBe(201);
    expect(signup.headers["set-cookie"][0]).toContain("HttpOnly");
    expect(signup.body.user.email).toBe(userEmail);

    const duplicate = await api()
      .post("/api/auth/signup")
      .send({ name: "Another User", email: userEmail, password });
    expect(duplicate.status).toBe(409);

    for (const weakPassword of ["short", ""]) {
      const weak = await api()
        .post("/api/auth/signup")
        .send({ name: "Test User", email: email(), password: weakPassword });
      expect(weak.status).toBe(400);
      expect(weak.body.error).toMatch(/password/i);
    }

    const malformed = await api()
      .post("/api/auth/signup")
      .send({ name: "", email: "not-an-email", password });
    expect(malformed.status).toBe(400);
  });

  it("logs in, rejects a wrong password, returns the authenticated user, and clears the cookie on logout", async () => {
    const userEmail = email();
    const signup = await api()
      .post("/api/auth/signup")
      .send({ name: "Login Test", email: userEmail, password });
    expect(signup.status).toBe(201);

    const agent = request.agent(process.env.PULSEFIT_TEST_API_URL!);
    const wrongPassword = await agent
      .post("/api/auth/login")
      .send({ email: userEmail, password: "WrongPass2026" });
    expect(wrongPassword.status).toBe(401);

    const login = await agent
      .post("/api/auth/login")
      .send({ email: userEmail, password });
    expect(login.status).toBe(200);
    expect(login.body.user.email).toBe(userEmail);
    expect((await agent.get("/api/auth/me")).body.user.name).toBe("Login Test");

    const logout = await agent.post("/api/auth/logout");
    expect(logout.status).toBe(200);
    expect(logout.headers["set-cookie"][0]).toMatch(/Max-Age=0/);
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  });

  it("returns 401 for protected endpoints when logged out", async () => {
    const paths: Array<[string, string, object?]> = [
      ["get", "/api/auth/me"],
      ["get", "/api/stats"],
      ["get", "/api/dashboard"],
      ["get", "/api/exercises"],
      ["get", "/api/workouts"],
      ["post", "/api/workouts"],
      ["get", "/api/workouts/workout-id"],
      ["post", "/api/workouts/workout-id/exercises", { exerciseId: "chest-1" }],
      ["post", "/api/workouts/workout-id/start"],
      ["post", "/api/workouts/workout-id/complete"],
      ["patch", "/api/sets/set-id", { completed: true }],
    ];
    for (const [method, path, body] of paths) {
      const response =
        method === "get"
          ? await api().get(path)
          : method === "patch"
            ? await api().patch(path).send(body)
            : await api().post(path).send(body);
      expect(response.status, `${method.toUpperCase()} ${path}`).toBe(401);
    }
  });

  it("returns member, completed workout, and class counts as numbers", async () => {
    const { agent } = await createUser();
    const response = await agent.get("/api/stats");
    expect(response.status).toBe(200);
    expect(typeof response.body.members).toBe("number");
    expect(typeof response.body.workoutsCompleted).toBe("number");
    expect(typeof response.body.classesThisWeek).toBe("number");
    expect(response.body.members).toBeGreaterThan(0);
  });

  it("returns a seven-day dashboard chart with finite progress-ring values", async () => {
    const { agent } = await createUser();
    const response = await agent.get("/api/dashboard");
    expect(response.status).toBe(200);
    expect(response.body.streak).toBe(0);
    expect(response.body.weeklyChart).toHaveLength(7);
    expect(response.body.progressRings).toEqual({
      workouts: 0,
      minutes: 0,
      consistency: 0,
    });
    for (const value of Object.values(response.body.progressRings) as number[]) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it("calculates streaks correctly against fake dates", () => {
    const today = "2026-10-22";
    expect(calculateStreak([], today)).toBe(0);
    expect(
      calculateStreak(["2026-10-20", "2026-10-21", "2026-10-22"], today),
    ).toBe(3);
    expect(
      calculateStreak(["2026-10-19", "2026-10-20", "2026-10-22"], today),
    ).toBe(1);
    expect(
      calculateStreak(["2026-10-19", "2026-10-20"], today),
    ).toBe(0);
    expect(
      calculateStreak(["2026-10-21", "2026-10-22"], today),
    ).toBe(2);
  });

  it("caps progress rings at 100 percent and never returns NaN", () => {
    const values = calculateProgressRings(500, 20_000, 900);
    expect(Object.values(values)).toEqual([100, 100, 100]);
    const invalidValues = calculateProgressRings(Number.NaN, Number.NaN, Number.NaN);
    for (const value of Object.values(invalidValues)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBe(0);
    }
  });

  it("returns all 30 exercises and filters correctly by every muscle group", async () => {
    const { agent } = await createUser();
    const all = await agent.get("/api/exercises");
    expect(all.status).toBe(200);
    expect(all.body.exercises).toHaveLength(30);

    for (const muscle of ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"]) {
      const result = await agent.get(`/api/exercises?muscle=${muscle}`);
      expect(result.status).toBe(200);
      expect(result.body.exercises).toHaveLength(5);
      expect(result.body.exercises.every((item: { muscle: string }) => item.muscle === muscle)).toBe(true);
    }
    expect((await agent.get("/api/exercises?muscle=unknown")).status).toBe(400);
  });

  it("creates, adds to, starts, and completes today's workout", async () => {
    const { agent } = await createUser();
    const created = await agent.post("/api/workouts");
    expect(created.status).toBe(201);
    expect(created.body.workout.date).toBe(new Date().toISOString().slice(0, 10));

    const duplicate = await agent.post("/api/workouts");
    expect(duplicate.status).toBe(200);
    expect(duplicate.body.workout.id).toBe(created.body.workout.id);

    const added = await agent
      .post(`/api/workouts/${created.body.workout.id}/exercises`)
      .send({ exerciseId: "chest-1" });
    expect(added.status).toBe(201);
    expect(added.body.workout.exercises).toHaveLength(1);
    expect(added.body.workout.exercises[0].sets).toHaveLength(3);

    const started = await agent.post(`/api/workouts/${created.body.workout.id}/start`);
    expect(started.status).toBe(200);
    expect(started.body.workout.status).toBe("active");

    const completed = await agent.post(`/api/workouts/${created.body.workout.id}/complete`);
    expect(completed.status).toBe(200);
    expect(completed.body.workout.status).toBe("completed");
    expect((await agent.get("/api/stats")).body.workoutsCompleted).toBe(1);
  });

  it("rejects invalid and duplicate exercises and invalid workout transitions", async () => {
    const { agent } = await createUser();
    const created = await agent.post("/api/workouts");
    const workoutId = created.body.workout.id as string;

    expect(
      (await agent.post(`/api/workouts/${workoutId}/exercises`).send({ exerciseId: "missing" })).status,
    ).toBe(400);
    expect(
      (await agent.post(`/api/workouts/${workoutId}/complete`)).status,
    ).toBe(409);

    await agent.post(`/api/workouts/${workoutId}/exercises`).send({ exerciseId: "chest-1" });
    expect(
      (await agent.post(`/api/workouts/${workoutId}/exercises`).send({ exerciseId: "chest-1" })).status,
    ).toBe(409);
    expect((await agent.post(`/api/workouts/${workoutId}/start`)).status).toBe(200);
    expect(
      (await agent.post(`/api/workouts/${workoutId}/exercises`).send({ exerciseId: "back-1" })).status,
    ).toBe(409);
  });

  it("ticks and unticks sets and rejects malformed set updates", async () => {
    const { agent } = await createUser();
    const created = await agent.post("/api/workouts");
    const workoutId = created.body.workout.id as string;
    const added = await agent
      .post(`/api/workouts/${workoutId}/exercises`)
      .send({ exerciseId: "chest-1" });
    const setId = added.body.workout.exercises[0].sets[0].id as string;
    expect((await agent.patch(`/api/sets/${setId}`).send({ completed: true })).status).toBe(409);
    await agent.post(`/api/workouts/${workoutId}/start`);

    const ticked = await agent.patch(`/api/sets/${setId}`).send({ completed: true });
    expect(ticked.status).toBe(200);
    expect(ticked.body.set.completed).toBe(true);
    const unticked = await agent.patch(`/api/sets/${setId}`).send({ completed: false });
    expect(unticked.status).toBe(200);
    expect(unticked.body.set.completed).toBe(false);
    expect((await agent.patch(`/api/sets/${setId}`).send({ completed: "yes" })).status).toBe(400);
  });

  it("prevents one user from viewing or changing another user's workouts and sets", async () => {
    const { agent: userA } = await createUser("User A");
    const { agent: userB } = await createUser("User B");
    const created = await userB.post("/api/workouts");
    const workoutId = created.body.workout.id as string;
    const added = await userB
      .post(`/api/workouts/${workoutId}/exercises`)
      .send({ exerciseId: "chest-1" });
    const setId = added.body.workout.exercises[0].sets[0].id as string;
    await userB.post(`/api/workouts/${workoutId}/start`);

    expect((await userB.get(`/api/workouts/${workoutId}`)).status).toBe(200);
    expect((await userA.get(`/api/workouts/${workoutId}`)).status).toBe(404);
    expect((await userA.post(`/api/workouts/${workoutId}/start`)).status).toBe(404);
    expect((await userA.post(`/api/workouts/${workoutId}/complete`)).status).toBe(404);
    expect(
      (await userA.post(`/api/workouts/${workoutId}/exercises`).send({ exerciseId: "back-1" })).status,
    ).toBe(404);
    expect((await userA.patch(`/api/sets/${setId}`).send({ completed: true })).status).toBe(404);
    expect((await userB.patch(`/api/sets/${setId}`).send({ completed: true })).status).toBe(200);
  });
});
