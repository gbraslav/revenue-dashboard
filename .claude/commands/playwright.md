---
description: Run Playwright e2e tests and fix failures
argument-hint: Optional test file or grep pattern (e.g. navigation or e2e/dashboard.spec.ts)
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent
---

Run Playwright end-to-end tests for this project and fix any failures.

## Steps

1. If an argument was provided ("$ARGUMENTS"), use it to scope the test run:
   - If it looks like a file path (contains `/` or `.spec.`), run: `npx playwright test $ARGUMENTS`
   - Otherwise treat it as a grep pattern: `npx playwright test --grep "$ARGUMENTS"`
   - If no argument, run all tests: `npx playwright test`

2. If all tests pass, report the results and stop.

3. If any tests fail:
   - Read the failing test file(s) and the relevant application code
   - Diagnose the root cause — is it a test bug or an app bug?
   - Fix the issue (prefer fixing the app code; only fix the test if the test expectation is wrong)
   - Re-run the failing test(s) to confirm the fix
   - Repeat until green

## Notes
- Playwright config is at `playwright.config.ts`
- E2e tests live in `./e2e/`
- The dev server is started automatically by the Playwright webServer config
- Use `--headed` flag if the user asks to see the browser
