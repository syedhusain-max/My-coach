import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";

test("landing, signup, workout flow, persistence, and logout", async ({
  page,
}, testInfo) => {
  const consoleIssues: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleIssues.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.goto("/");
  await expect(page).toHaveTitle(/PulseFit/);
  await expect(page.getByRole("link", { name: "PulseFit" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "The All-In-One" })).toBeVisible();

  await page.locator("#testimonials").scrollIntoViewIfNeeded();
  await expect(page.locator("#testimonials .gradient-text").first()).toHaveText(
    "+82%",
    { timeout: 6_000 },
  );

  await page.goto("/");
  await page.getByRole("link", { name: "Start Your Workout" }).first().click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();

  await page.getByLabel("Your name").focus();
  await page.keyboard.press("Tab");
  await expect
    .poll(() =>
      page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.name),
    )
    .toBe("email");

  const email = `pw-${testInfo.project.name}-${randomUUID()}@pulsefit.test`;
  await page.getByLabel("Your name").fill("PulseFit Tester");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill("FitStart2026");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/dashboard$/, { timeout: 20_000 });
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /Let’s get after it/ })).toBeVisible();

  await page.getByRole("link", { name: "Workout library" }).click();
  await expect(page.getByRole("heading", { name: "Workout library" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(30);

  for (const group of ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"]) {
    await page.getByRole("button", { name: group, exact: true }).click();
    await expect(page.getByRole("article")).toHaveCount(5);
    await expect(page.locator("article").first()).toContainText(group);
  }

  await page.getByRole("button", { name: "Chest", exact: true }).click();
  await page.getByRole("button", { name: /Add Barbell bench press/ }).click();
  await page.getByRole("button", { name: /Add Push-up/ }).click();
  await expect(page.getByRole("button", { name: /Added Barbell bench press/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Added Push-up/ })).toBeDisabled();

  await page.getByRole("link", { name: "Overview" }).click();
  await expect(page.getByText("2 exercises · 6 sets")).toBeVisible();
  await page.getByRole("button", { name: "Start workout" }).click();
  await expect(page).toHaveURL(/\/workout\/live$/);
  await expect(page.getByRole("heading", { name: "Stay in your flow." })).toBeVisible();

  await page.getByRole("button", { name: "Tick set 1 for Barbell bench press" }).click();
  await expect(page.getByText("01:00")).toBeVisible();
  await expect(page.getByText("00:59")).toBeVisible({ timeout: 3_000 });

  for (const exercise of ["Barbell bench press", "Push-up"]) {
    for (let set = 1; set <= 3; set += 1) {
      const tick = page.getByRole("button", {
        name: `Tick set ${set} for ${exercise}`,
      });
      if (await tick.isVisible()) await tick.click();
    }
  }
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await page.getByRole("button", { name: "Finish workout" }).click();
  await expect(page.getByRole("status")).toContainText("Workout complete!");
  await expect(page.locator(".confetti-piece")).toHaveCount(30);

  await page.getByRole("link", { name: "Back to dashboard" }).click();
  await expect(page.getByText("1 day", { exact: true })).toBeVisible();
  await expect(page.getByText("1 session", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /training minutes/ }).first()).toBeVisible();
  await expect(page.getByLabel(/Workouts progress 25%/)).toBeVisible();
  await page.reload();
  await expect(page.getByText("Workout complete. Nice work!")).toBeVisible();
  await expect(page.getByText("1 day", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Log in to PulseFit" })).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(horizontalOverflow).toBe(false);
  expect(consoleIssues).toEqual([]);
});
