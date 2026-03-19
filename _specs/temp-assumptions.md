# Temporary Assumptions

This file documents temporary implementation decisions that are intentionally simplified and expected to be replaced in the future.

## API Data — Hard-coded Responses

**Assumption:** The Next.js API route handlers that serve chart data will return hard-coded, static data lists rather than querying a database.

**Why:** No database has been set up yet. Hard-coded data allows the frontend to be built and tested against realistic API response shapes without a DB dependency.

**Future replacement:** Once a database is available, the hard-coded data in each route handler will be replaced with actual DB queries. The API response contract (shape/schema) should remain the same so the frontend requires no changes.
