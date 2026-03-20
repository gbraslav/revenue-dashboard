# Plan: Activities Page with Detailed Descriptions

## Context
The activities page (`/activities`) is currently a stub. This plan implements it as a full-featured page displaying all activities from the API, each with an expandable description field. The page will also support filtering by status and sorting by category/time. The existing dashboard "View All Tasks" link will navigate here.

## Tech Constraints
- Next.js 16 App Router with TypeScript strict mode
- Tailwind CSS 4 (v4 syntax, no tailwind.config)
- shadcn-ui for all UI components (Card, Badge, Button, Select already available)
- No database — API returns hard-coded static data
- Path alias `@/*` maps to project root
- Read Next.js docs in `node_modules/next/dist/docs/` before writing code

## Implementation Steps

### Step 1 — Extend the Activities API with description field
- **What**: Add a `description` string field to each activity in the API response
- **Files**: `app/api/activities/route.ts`
- **Reuse**: Existing route handler structure
- **Parallelisable**: Yes (independent of frontend work initially, but frontend depends on the shape)

### Step 2 — Build the Activities page component
- **What**: Replace the stub `/activities` page with a client component that fetches from `/api/activities` and renders a full list of activity cards. Each card shows icon, title, category, time, status badge (reusing the color scheme from `recent-activities.tsx`), and an expandable description section (collapsed by default, click to expand).
- **Files**: `app/(dashboard)/activities/page.tsx`
- **Reuse**: Status color scheme from `components/recent-activities.tsx`; shadcn `Card`, `Badge`, `Button` components from `components/ui/`
- **Parallelisable**: No — depends on Step 1 for the API shape

### Step 3 — Add filtering and sorting controls
- **What**: Add a filter dropdown for status (All, Completed, In Progress, Urgent) and a sort dropdown (by category, by time) above the activities list. Use shadcn `Select` component.
- **Files**: `app/(dashboard)/activities/page.tsx`
- **Reuse**: `components/ui/select.tsx`, `components/ui/badge.tsx`
- **Parallelisable**: No — part of the same page component from Step 2, but can be built as a follow-on section

### Step 4 — Wire up "View All Tasks" link on dashboard
- **What**: Update the "View All Tasks" link in the Recent Activities component to navigate to `/activities`
- **Files**: `components/recent-activities.tsx`
- **Reuse**: Existing link/button in the component
- **Parallelisable**: Yes (independent of Steps 2–3)

### Step 5 — Handle empty and error states
- **What**: Add an empty state message when no activities are returned, and an error fallback when the API fetch fails
- **Files**: `app/(dashboard)/activities/page.tsx`
- **Reuse**: shadcn `Card` for consistent styling
- **Parallelisable**: No — part of the page component from Step 2

### Step 6 — Write tests
- **What**: Create tests covering: API returns activities with description field; activities page renders all activities; description text is displayed; empty state is shown when no activities returned
- **Files**: `test/activities-page.test.tsx`, `test/activities-api.test.ts`
- **Reuse**: Existing test patterns from `test/api-routes.test.ts` and `test/charts.test.tsx`
- **Parallelisable**: Yes (can run in parallel with Steps 4–5)

## Parallel Execution Map
- Step 1 runs first (API shape must be defined)
- Steps 2 + 4 can run together after Step 1
- Step 3 follows Step 2
- Step 5 follows Step 2
- Step 6 can run after Step 1 (API tests) and after Step 2 (component tests)

## New Dependencies
None — all required shadcn-ui components are already installed.

## Verification
- Run `npm run build` — should pass with no errors
- Run `npx vitest run` — all new and existing tests pass
- Run `npm run dev`, visit `/activities` — page shows all activities with expandable descriptions
- Use filter/sort controls to verify filtering by status and sorting work
- On dashboard page, click "View All Tasks" — navigates to `/activities`
- Test empty state by temporarily returning empty array from API
