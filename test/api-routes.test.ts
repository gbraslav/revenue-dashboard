import { describe, it, expect } from "vitest";

async function callRoute(mod: { GET: () => Promise<Response> }) {
  const res = await mod.GET();
  expect(res.status).toBe(200);
  return res.json();
}

describe("API Routes", () => {
  it("GET /api/activities returns activities array", async () => {
    const mod = await import("../app/api/activities/route");
    const data = await callRoute(mod);
    expect(data.activities).toBeInstanceOf(Array);
    expect(data.activities.length).toBeGreaterThanOrEqual(3);
    expect(data.activities[0]).toHaveProperty("title");
    expect(data.activities[0]).toHaveProperty("status");
  });

  it("GET /api/project-completion returns percentage and milestones", async () => {
    const mod = await import("../app/api/project-completion/route");
    const data = await callRoute(mod);
    expect(data).toHaveProperty("percentage");
    expect(data).toHaveProperty("milestonesReached");
    expect(data).toHaveProperty("breakdown");
  });

  it("GET /api/revenue-distribution returns sectors array", async () => {
    const mod = await import("../app/api/revenue-distribution/route");
    const data = await callRoute(mod);
    expect(data.sectors).toBeInstanceOf(Array);
    expect(data.sectors.length).toBeGreaterThan(0);
    expect(data.sectors[0]).toHaveProperty("name");
    expect(data.sectors[0]).toHaveProperty("percentage");
  });

  it("GET /api/system-performance returns score and uptime", async () => {
    const mod = await import("../app/api/system-performance/route");
    const data = await callRoute(mod);
    expect(data).toHaveProperty("score");
    expect(data).toHaveProperty("uptime");
    expect(data).toHaveProperty("responseTime");
  });

  it("GET /api/monthly-trends returns months array", async () => {
    const mod = await import("../app/api/monthly-trends/route");
    const data = await callRoute(mod);
    expect(data.months).toBeInstanceOf(Array);
    expect(data.months.length).toBeGreaterThan(0);
    expect(data.months[0]).toHaveProperty("name");
    expect(data.months[0]).toHaveProperty("value");
  });
});
