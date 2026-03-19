# Plan: Settings Page

## Context
Implements `_specs/settings-page.md`. Users need to customize dashboard appearance (font and background color) via a settings page. Settings are read/written through an API endpoint and applied live to the dashboard. In-memory storage only (no DB persistence across restarts). Includes a "Reset to defaults" button.

## Tech Constraints
- shadcn-ui for all UI components (no custom components)
- Next.js 16 App Router, `"use client"` for interactive pages
- Tailwind CSS 4 (no tailwind.config)
- TypeScript strict mode, `@/*` path alias
- API routes return hard-coded defaults, in-memory store for updates
- Google Fonts via `next/font/google`

## Implementation Steps

### Step 1 — Settings API route
- **What**: Create `GET` and `PUT` handlers at `/api/settings`. GET returns `{ font: "playfair", backgroundColor: "#09090b" }` by default. PUT validates and updates an in-memory store. Add hex color validation and font whitelist validation.
- **Files**: `app/api/settings/route.ts` (create)
- **Reuse**: Pattern from `app/api/activities/route.ts`
- **Parallelisable**: yes

### Step 2 — Add shadcn Select and Label components
- **What**: Add shadcn `select` and `label` components needed for the settings form.
- **Files**: `components/ui/select.tsx`, `components/ui/label.tsx` (created via CLI)
- **Reuse**: Existing shadcn setup
- **Parallelisable**: yes

### Step 3 — Load additional Google Fonts
- **What**: Add Inter, Roboto, Open Sans, and Lato font imports in root layout using `next/font/google`. Set CSS variables for each (`--font-inter`, `--font-roboto`, `--font-opensans`, `--font-lato`) so they can be switched dynamically.
- **Files**: `app/layout.tsx` (modify)
- **Reuse**: Existing Playfair Display font pattern
- **Parallelisable**: yes

### Step 4 — Settings context provider
- **What**: Create a `SettingsProvider` React context that fetches `GET /api/settings` on mount, exposes current settings and a `refetch` function. The provider applies settings by setting inline styles (font-family, background-color) on a wrapper div. Include this in the dashboard layout.
- **Files**: `components/settings-provider.tsx` (create), `app/(dashboard)/layout.tsx` (modify to wrap children)
- **Reuse**: `components/sidebar.tsx` import pattern in dashboard layout
- **Parallelisable**: no (depends on Steps 1 and 3)

### Step 5 — Build the Settings page
- **What**: Replace placeholder with a full settings form using shadcn Card, Select, Button, and Label. Include:
  - Font selector (Select with 5 font options)
  - Background color picker (native `<input type="color">`)
  - Save button (PUT to `/api/settings`, then refetch context)
  - Reset to Defaults button (PUT default values, then refetch)
  - Success/error feedback after save
- **Files**: `app/(dashboard)/settings/page.tsx` (modify)
- **Reuse**: `components/ui/card.tsx`, `components/ui/button.tsx`, `components/ui/select.tsx`, `components/ui/label.tsx`
- **Parallelisable**: no (depends on Steps 1, 2, 4)

### Step 6 — Unit tests
- **What**: Add tests for the settings API route (GET defaults, PUT updates, PUT validation rejects invalid input).
- **Files**: `test/settings-api.test.ts` (create)
- **Reuse**: Pattern from `test/api-routes.test.ts`
- **Parallelisable**: no (depends on Step 1)

## Parallel Execution Map
- Steps 1 + 2 + 3 can all run together (independent)
- Step 4 follows Steps 1 + 3
- Step 5 follows Steps 1 + 2 + 4
- Step 6 follows Step 1

## New Dependencies
```bash
npx shadcn@latest add select label
```
No other npm packages needed.

## Verification
- `npm run build` — should pass with no errors
- `npm run dev`, visit `/settings`:
  - Verify font selector and color picker render with defaults
  - Change both settings, click Save — verify success feedback
  - Navigate to dashboard — verify new font and background color applied
  - Return to settings, click "Reset to Defaults" — verify defaults restored
  - Navigate to dashboard — verify defaults applied
- `npx vitest run` — all tests pass including new settings API tests
