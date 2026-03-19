# Tech Stack

## Core Framework
- **Next.js 16.2.0** — App Router, React Server Components, API route handlers (`app/` directory)
- **React 19.2.4** — UI rendering
- **TypeScript 5** — strict mode, `moduleResolution: bundler`, path alias `@/*` maps to project root

## Styling
- **Tailwind CSS 4** — utility-first CSS via `@import "tailwindcss"` (v4 syntax, no `tailwind.config`)
- **@tailwindcss/postcss** — PostCSS integration for Tailwind v4
- **Bitcount Prop Double Ink  — Google Fonts for titles and headers loaded via `next/font/google`
- **Playfair Display  — Google Fonts for normal text loaded via `next/font/google`
- User shadcn-ui for all components and styles. No custom ui components. 

## Linting
- **ESLint 9** — flat config (`eslint.config.mjs`)
- **eslint-config-next** — `core-web-vitals` + `typescript` presets

## Tooling
- **postcss.config.mjs** — PostCSS configured for Tailwind v4

## Project Structure
- `app/` — Next.js App Router root (no `src/` directory)
- `app/layout.tsx` — root layout with font setup
- `app/page.tsx` — home page
- `app/globals.css` — global styles with Tailwind import and CSS variables for light/dark theme

## Data Layer
- No database configured yet
- API route handlers return hard-coded static data (see `_specs/temp-assumptions.md`)
- all data retuned to the UI and each chart will be driven from a dedicated API call. 
