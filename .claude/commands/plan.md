---
description: Create a multi-step implementation plan from a spec file in _specs/
argument-hint: Spec file name (e.g. neon-auth or _specs/neon-auth.md)
allowed-tools: Read, Write, Glob, Grep, Agent
---

You are a senior software architect creating a detailed implementation plan from a feature spec. Always adhere to any rules or requirements in CLAUDE.md files.

Spec input: $ARGUMENTS

## Step 1. Resolve the spec file

From `$ARGUMENTS`, resolve the spec file path:
- If the argument already ends in `.md`, use it as-is
- Otherwise look for `_specs/<argument>.md`
- If the file doesn't exist, list all files in `_specs/` and ask the user to pick one

Read the spec file and `_specs/tech_spec.md` before proceeding.

## Step 2. Explore the codebase in parallel

Launch **up to 3 Explore subagents in parallel** (single message, multiple Agent tool calls) to gather context needed for the plan. Divide exploration by concern, for example:

- **Agent 1 — Frontend scope**: Find existing React components, hooks, context providers, and UI patterns relevant to the spec. Look in `src/` for reusable code.
- **Agent 2 — Backend scope**: Find existing Flask routes, middleware, models, and utilities in `server/` relevant to the spec.
- **Agent 3 — Config / dependencies scope** (only if needed): Inspect `package.json`, `requirements.txt`, `vite.config.ts`, and env files for relevant packages or missing dependencies.

Only launch agents that are relevant — skip agents whose scope has no bearing on the spec.

## Step 3. Draft the plan

Using the spec requirements and exploration results, write a plan file to `_plans/p_<feature-slug>.md` with this structure:

```markdown
# Plan: <Feature Title>

## Context
<Why this change is being made — the problem, the spec it implements, and the intended outcome.>

## Tech Constraints
<Key constraints from _specs/tech_spec.md that apply: UI must use shadcn-ui, Flask backend, TypeScript strict, etc.>

## Implementation Steps

Each step must include:
- **What**: what to build or change
- **Files**: exact file paths to create or modify
- **Reuse**: existing functions/utilities/components to leverage (with file paths)
- **Parallelisable**: yes/no — whether this step can run concurrently with another step

### Step 1 — <title>
...

### Step 2 — <title>
...

(continue for all steps)

## Parallel Execution Map
List which steps can run in parallel:
- Steps A + B can run together (both are independent)
- Step C must follow A
- Steps D + E can run together after C
...

## New Dependencies
List any npm packages or pip packages that need to be installed (with install commands). If none, write "None".

## Verification
How to test the implementation end-to-end:
- Manual steps (run `npm run dev`, visit URLs, check behaviour)
- API checks (curl commands or MCP tool calls)
- TypeScript: `npm run build` should pass with no errors
```

## Step 4. Output to user

After saving the plan file, respond with:

Plan file: _plans/p_<feature-slug>.md
Steps: <count>
Parallel opportunities: <brief summary>

Do not print the full plan in chat. The goal is to save the plan file and give the user a concise summary.
