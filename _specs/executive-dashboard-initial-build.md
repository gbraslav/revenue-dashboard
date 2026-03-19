# Spec for executive-dashboard-initial-build

branch: claude/feature/executive-dashboard-initial-build

## Summary

Build the initial version of a dark-themed Executive Dashboard application. The app features a left navigation sidebar with three items (Dashboard, Activities, Settings). Only the Dashboard view is fully implemented; the other nav items render a simple placeholder with the item's title. The Dashboard displays a "Recent Activities" list and four metric charts, all populated from server-side API routes that return hard-coded data. The visual design follows the mock UI in `_specs/mock_ui.jpg`. All technologies must adhere to `_specs/tech-stack.md`.

## Functional Requirements

- The app shell has a persistent left navigation sidebar containing three items: **Dashboard**, **Activities**, and **Settings**.
- Each nav item, when clicked, refreshes the main content area without a full page reload (client-side navigation).
- **Dashboard** (fully implemented):
  - Page title: "Executive Dashboard" with a subtitle "Real-time operational metrics and project status".
  - **Recent Activities** section: a list of activity cards. Each card shows: icon, activity title, department/category, time elapsed, and a status badge (e.g. In Progress, Completed, Urgent). A "View All Tasks" link appears in the section header.
  - **Project Completion** chart: displays overall progress percentage (large number), a progress bar, milestones reached count, and a breakdown bar showing named components (e.g. Core API, UI Components).
  - **Revenue Distribution** chart: a donut/pie chart showing revenue split by business sector (e.g. SaaS Subscriptions, Consulting, Maintenance) with a legend showing percentage per sector.
  - **System Performance** chart: a gauge/speedometer chart displaying a key metric (e.g. 94.2), with uptime and response time stats shown below.
  - **Monthly Trends** chart: an area/line chart showing growth over recent months (Jul–Dec).
  - Two action buttons in the header area: "Export PDF" and "Generate Report".
- **Activities** (stub): renders a heading that reads "Activities".
- **Settings** (stub): renders a heading that reads "Settings".
- All dashboard data (activities list, chart data) is fetched by the client from dedicated Next.js API route handlers (one route per data type).
- Each API route returns hard-coded static data shaped to match the UI's needs.
- The entire application uses a **dark theme** (dark backgrounds, light text) consistent with the mock UI.
- Use **shadcn/ui** for all UI components (cards, badges, buttons, navigation items, progress bars). No custom UI primitives.
- Typography: **Bitcount Prop Double Ink** for titles/headers, **Playfair Display** for body/normal text, loaded via `next/font/google`.

## Possible Edge Cases

- Navigation between items should not cause a flash or loss of layout (sidebar must remain stable).
- Status badges should handle unknown status values gracefully (render a neutral style).
- Chart components should render without errors if the data array is empty.
- Activity list should handle zero items without breaking layout.

## Acceptance Criteria

- Navigating to `/` loads the Dashboard view with the sidebar visible.
- Clicking "Activities" in the sidebar replaces the main content with the text "Activities"; sidebar remains visible.
- Clicking "Settings" in the sidebar replaces the main content with the text "Settings"; sidebar remains visible.
- Clicking "Dashboard" returns to the full dashboard view.
- The Recent Activities section renders at least 3 activity cards with title, category, elapsed time, and status badge.
- All four charts (Project Completion, Revenue Distribution, System Performance, Monthly Trends) are visible on the Dashboard.
- All dashboard data originates from a fetch to an API route, not from inline component state.
- The UI matches the dark theme from `_specs/mock_ui.jpg` (dark background, appropriate contrast).
- All components are sourced from shadcn/ui; no ad-hoc custom UI primitives.
- The app builds without TypeScript or lint errors.

## Open Questions

- Should the "Export PDF" and "Generate Report" buttons be functional in this build, or just rendered as non-interactive stubs? no
- Are the chart libraries (e.g. Recharts) already approved for use, or does a library need to be selected and added to the tech stack? use Rechart and shadcn-ui
- Should the sidebar show the active nav item highlighted? yes highligh 

# Testing Guidelines

Create a test file(s) in the `./test` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Navigation: clicking each sidebar item renders the correct main content area (Dashboard view, "Activities" heading, "Settings" heading).
- API routes: each route returns a 200 response with the expected data shape (correct top-level keys, non-empty arrays where applicable).
- Recent Activities list: renders the correct number of activity cards and each card contains a title and status badge.
- Charts: each chart component renders without throwing when given valid data.
