# PulseFit

PulseFit pairs the original Everfit-inspired landing-page layout with a
workout-tracking app. Athletes can create an account, choose from 30 exercises,
build today's session, track sets and rest, and review streaks and weekly
progress.

## Stack

- Next.js 14 App Router, React, TypeScript, and Tailwind CSS
- SQLite (`better-sqlite3`) for persistent users, sessions, workouts, and sets
- HttpOnly, SameSite=Lax session cookies; passwords are hashed with scrypt
- Vitest and Supertest for API tests; Playwright for desktop and mobile browser tests

## Run locally

Use Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database is
created at `.data/pulsefit.sqlite` on first use. Set `PULSEFIT_DATABASE_PATH`
to use a different database file.

## Tests and production build

```bash
npm test              # API and streak/progress tests
npm run test:e2e      # Chromium desktop and 375px iPhone-size flows
npm run test:all      # Both suites
npm run build         # Production build
npm start             # Serve the production build
```

Test suites use separate temporary databases and unique test accounts. They do
not connect to the local development database.

## Main routes

- `/` — marketing landing page
- `/signup`, `/login` — account creation and login
- `/dashboard` — workout stats, streak, chart, rings, and today's plan
- `/workouts` — searchable-by-group exercise library
- `/workout/live` — set tracking, rest timer, and workout completion

## API

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`
- `GET /api/stats`, `GET /api/dashboard`, `GET /api/exercises?muscle=Chest`
- `GET /api/workouts`, `POST /api/workouts`
- `GET /api/workouts/:id`, `POST /api/workouts/:id/exercises`,
  `POST /api/workouts/:id/start`, `POST /api/workouts/:id/complete`
- `PATCH /api/sets/:id`

Workout and set endpoints verify ownership before returning or changing data.

## Hosting

The app requires a Node.js server and writable persistent storage for SQLite.
GitHub Pages can host only static files, so the former Pages deployment has
been replaced with CI checks. GitHub remains the source repository; deploy the
app to a Node-capable host with a persistent disk before enabling production
traffic.
