# Plan: Export PDF Report

## Context
The dashboard has a placeholder "Export PDF" button with no functionality. This plan wires it up to a server-side API endpoint that generates and downloads a PDF report containing all 4 dashboard charts and the full activities list, with a title/date header, no nav menu, in Letter orientation.

## Tech Constraints
- Next.js 16.2.0 app router (see AGENTS.md — read Next.js docs before writing code)
- React 19, TypeScript strict
- Charts use Recharts 3.x — Recharts requires a browser DOM; server-side rendering of charts must use a headless approach (Puppeteer or Playwright)
- UI uses shadcn/ui components and Tailwind CSS v4
- No database yet — data comes from existing API route handlers
- PDF generation must be entirely server-side

## Implementation Steps

### Step 1 — Install PDF generation dependency
- **What**: Add `@sparticuz/chromium` and `puppeteer-core` (lightweight Puppeteer for serverless/Next.js) to enable headless rendering → PDF conversion on the server.
- **Files**: `package.json`
- **Reuse**: None
- **Parallelisable**: Yes (can run while Step 2 is being written)

### Step 2 — Create the PDF report page (print view)
- **What**: Create a new Next.js route `/report/pdf` that renders all 4 chart components and the full activities list without the nav menu. This page will be visited headlessly by Puppeteer to generate the PDF. It must be a server component or a minimal client component that auto-fetches all data server-side. Include a title header with the report name and current date.
- **Files**:
  - `app/report/pdf/page.tsx` (new — the headless render target)
  - `app/report/pdf/layout.tsx` (new — layout with no nav sidebar/menu)
- **Reuse**:
  - `components/project-completion.tsx`
  - `components/revenue-distribution.tsx`
  - `components/system-performance.tsx`
  - `components/monthly-trends.tsx`
  - `components/recent-activities.tsx` (or fetch activities directly)
  - Existing API route handlers data shape (fetch internally server-side)
- **Parallelisable**: Yes (independent of Step 1)

### Step 3 — Create the PDF generation API endpoint
- **What**: Create `GET /api/export-pdf` route that: (1) launches Puppeteer/Chromium headlessly, (2) navigates to the internal `/report/pdf` page, (3) waits for charts to render, (4) calls `page.pdf()` with Letter size, (5) returns the PDF buffer as a `application/pdf` response with `Content-Disposition: attachment`.
- **Files**:
  - `app/api/export-pdf/route.ts` (new)
- **Reuse**:
  - Existing API route pattern from `app/api/activities/route.ts` and others
- **Parallelisable**: No — depends on Step 1 (Puppeteer installed) and Step 2 (report page exists)

### Step 4 — Wire up the Export PDF button
- **What**: Update the dashboard page to make the Export PDF button trigger a download from `/api/export-pdf`. Use `window.location.href` or an anchor tag approach so the browser handles the file download without navigating away.
- **Files**:
  - `app/(dashboard)/page.tsx` (modify — add onClick handler to the existing `<Button variant="outline">Export PDF</Button>`)
- **Reuse**:
  - Existing `Button` component from `@/components/ui/button`
- **Parallelisable**: No — depends on Step 3

### Step 5 — Write tests
- **What**: Add unit/integration tests for the export PDF API endpoint and the button interaction.
- **Files**:
  - `test/export-pdf.test.ts` (new)
- **Reuse**: Existing vitest + jsdom setup
- **Parallelisable**: Yes — can be written alongside Step 3 and Step 4
- **Test cases**:
  - API endpoint returns `content-type: application/pdf`
  - API endpoint returns a 500 error response when data fetching fails
  - The PDF generation call includes chart and activities data
  - Export PDF button triggers a request to `/api/export-pdf`

## Parallel Execution Map
- Steps 1 + 2 + 5 (partial) can start in parallel
- Step 3 must follow Steps 1 and 2
- Step 4 must follow Step 3
- Step 5 can be finalized after Step 3 and 4

## New Dependencies
```
npm install puppeteer-core @sparticuz/chromium
```
> Note: `@sparticuz/chromium` provides a Chromium binary compatible with serverless/Next.js environments. Alternatively, since `@playwright/test` is already installed as a devDependency, consider using Playwright's `chromium.launch()` in the API route for PDF generation — this avoids an extra production dependency. Evaluate which approach works in the deployed environment (Vercel).

## Verification
1. Run `npm run dev`
2. Visit `http://localhost:3000` — click "Export PDF"
3. A PDF file should download automatically
4. Open the PDF — verify:
   - Title header with report name and date is present
   - All 4 charts are visible and rendered
   - Activities list appears below charts with all entries
   - No navigation menu/sidebar is visible
5. Run `npm run build` — should pass with no TypeScript errors
6. Run `npx vitest run` — export-pdf tests should pass
