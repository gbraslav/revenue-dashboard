# Plan: Executive Dashboard Initial Build

## Context
Build a dark-themed executive dashboard with sidebar navigation, activity feed, and four metric charts. The spec is in `_specs/executive-dashboard-initial-build.md` and the visual target is `_specs/mock_ui.jpg`. Only the Dashboard view is fully implemented; Activities and Settings are stubs. All data comes from API route handlers returning hard-coded data.

## Tech Constraints
- Next.js 16.2.0 with App Router (`app/` directory, no `src/`)
- React 19, TypeScript strict
- Tailwind CSS v4 (no `tailwind.config`, uses `@import "tailwindcss"` and `@theme inline`)
- shadcn/ui for all UI components — needs to be initialized first
- Recharts for charts
- Fonts: Bitcount Prop Double Ink (titles), Playfair Display (body) via `next/font/google`
- Dark theme enforced
- API routes use `route.ts` with `export async function GET()`
- Components default to Server Components; use `'use client'` only when interactivity needed

## Implementation Steps

### Step 1 — Initialize shadcn/ui and install dependencies
- **What**: Init shadcn/ui, install Recharts, configure for dark theme
- **Files**: `components.json`, `lib/utils.ts`, `app/globals.css` (modify)
- **Reuse**: Existing `app/globals.css` Tailwind setup
- **Parallelisable**: No (all other steps depend on this)`
- **Commands**:`
  ```bash
  npx shadcn@latest init
  npm install recharts
  ```

### Step 2 — Set up fonts and dark theme globals
- **What**: Replace Geist fonts with Bitcount Prop Double Ink + Playfair Display. Force dark theme. Update CSS variables for dark palette matching mock UI.
- **Files**: `app/layout.tsx` (modify), `app/globals.css` (modify)
- **Reuse**: Existing layout structure
- **Parallelisable**: No (depends on Step 1)

### Step 3 — Create API route handlers (all 4 in parallel)
- **What**: Create hard-coded API routes for activities, project completion, revenue distribution, system performance, and monthly trends
- **Files**:
  - `app/api/activities/route.ts`
  - `app/api/project-completion/route.ts`
  - `app/api/revenue-distribution/route.ts`
  - `app/api/system-performance/route.ts`
  - `app/api/monthly-trends/route.ts`
- **Reuse**: None
- **Parallelisable**: Yes (all routes are independent; also parallel with Steps 4-5)

### Step 4 — Build sidebar navigation layout
- **What**: Create a dashboard layout with persistent left sidebar. Three nav items: Dashboard, Activities, Settings. Active item highlighted. Use shadcn/ui components (Button, etc). Sidebar includes app title "Main Menu / MANAGEMENT" at top, Help and Logout at bottom per mock.
- **Files**:
  - `app/(dashboard)/layout.tsx` — layout with sidebar + main content area
  - `components/sidebar.tsx` — client component for nav with active state
- **shadcn components needed**: `button`, `badge`, `card`, `separator`
- **Reuse**: None
- **Parallelisable**: Yes (parallel with Step 3)

### Step 5 — Create stub pages for Activities and Settings
- **What**: Simple pages rendering just a heading
- **Files**:
  - `app/(dashboard)/activities/page.tsx`
  - `app/(dashboard)/settings/page.tsx`
- **Reuse**: None
- **Parallelisable**: Yes (parallel with Steps 3-4)

### Step 6 — Build dashboard page and chart components
- **What**: Build the main dashboard page and all chart/section components. Each component fetches from its respective API route.
- **Files**:
  - `app/(dashboard)/page.tsx` — Dashboard page (title, subtitle, Export PDF + Generate Report buttons, grid of sections)
  - `components/recent-activities.tsx` — client component, fetches `/api/activities`
  - `components/project-completion.tsx` — client component, fetches `/api/project-completion`, shows progress bar + breakdown
  - `components/revenue-distribution.tsx` — client component, fetches `/api/revenue-distribution`, Recharts PieChart/donut
  - `components/system-performance.tsx` — client component, fetches `/api/system-performance`, gauge-style display
  - `components/monthly-trends.tsx` — client component, fetches `/api/monthly-trends`, Recharts AreaChart
- **shadcn components needed**: `card`, `badge`, `button`, `progress`
- **Reuse**: shadcn Card for all chart containers, Badge for status badges
- **Parallelisable**: No (depends on Steps 1-4)

### Step 7 — Polish and verify
- **What**: Ensure dark theme consistency, layout matches mock, no TS/lint errors
- **Files**: Various touch-ups
- **Reuse**: N/A
- **Parallelisable**: No (depends on Step 6)

### Step 8 — Write tests
- **What**: Create test files for navigation, API routes, activity list rendering, chart rendering
- **Files**:
  - `test/navigation.test.tsx`
  - `test/api-routes.test.ts`
  - `test/recent-activities.test.tsx`
  - `test/charts.test.tsx`
- **Reuse**: None
- **Parallelisable**: No (depends on Step 6; needs test runner setup)
- **Note**: No test runner configured yet — will need to install vitest or similar

## Parallel Execution Map
- Step 1 runs first (foundation)
- Step 2 follows Step 1
- Steps 3 + 4 + 5 can run in parallel (after Step 1)
- Step 6 follows Steps 2 + 3 + 4
- Step 7 follows Step 6
- Step 8 follows Step 7

## New Dependencies
```bash
npx shadcn@latest init
npx shadcn@latest add card badge button progress separator
npm install recharts
# For testing (Step 8):
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

## Verification
- `npm run build` — must pass with no TypeScript or lint errors
- `npm run dev` → visit `http://localhost:3000`:
  - Dashboard loads with sidebar, title, activities, 4 charts
  - Click "Activities" → main area shows "Activities" heading, sidebar stays
  - Click "Settings" → main area shows "Settings" heading, sidebar stays
  - Click "Dashboard" → returns to full dashboard
- API checks:
  ```bash
  curl http://localhost:3000/api/activities
  curl http://localhost:3000/api/project-completion
  curl http://localhost:3000/api/revenue-distribution
  curl http://localhost:3000/api/system-performance
  curl http://localhost:3000/api/monthly-trends
  ```
- Visual: dark theme matches `_specs/mock_ui.jpg`
