# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build
- `npm start` — Start production server
- `npm run lint` — Run ESLint

- `npx vitest run` — Run unit tests (in `./test`)
- `npx playwright test` — Run Playwright e2e tests (in `./e2e`)
- `npx playwright test --ui` — Open Playwright UI mode

## Architecture

Defined in _specs\tech_stack.md

## Data Layer

- API route handlers return hard-coded static data (no database yet).
- Each chart/section in the UI is driven by a dedicated API call.
- When a DB is added, API response shapes should stay the same so the frontend doesn't need changes.

## Spec-Driven Workflow

- Feature specs live in `_specs/`. Use `/spec` to create a new spec + branch, `/plan` to generate an implementation plan from a spec.
- Plans output to `.claude/plans/`.
