import { describe, it, expect, beforeEach } from "vitest";

// Re-import fresh module for each test to reset in-memory state
async function freshModule() {
  // Use dynamic import with cache busting
  const mod = await import(`../app/api/settings/route`);
  return mod;
}

describe("Settings API", () => {
  it("GET returns default settings", async () => {
    const { GET } = await freshModule();
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("font");
    expect(data).toHaveProperty("backgroundColor");
    expect(data.font).toBe("playfair");
    expect(data.backgroundColor).toBe("#0b1120");
  });

  it("PUT updates settings and returns them", async () => {
    const { GET, PUT } = await freshModule();

    const putRes = await PUT(
      new Request("http://localhost/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ font: "inter", backgroundColor: "#ff0000" }),
      })
    );
    expect(putRes.status).toBe(200);
    const putData = await putRes.json();
    expect(putData.font).toBe("inter");
    expect(putData.backgroundColor).toBe("#ff0000");

    const getRes = await GET();
    const getData = await getRes.json();
    expect(getData.font).toBe("inter");
    expect(getData.backgroundColor).toBe("#ff0000");
  });

  it("PUT rejects invalid font", async () => {
    const { PUT } = await freshModule();
    const res = await PUT(
      new Request("http://localhost/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ font: "comic-sans" }),
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid font");
  });

  it("PUT rejects invalid backgroundColor", async () => {
    const { PUT } = await freshModule();
    const res = await PUT(
      new Request("http://localhost/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backgroundColor: "not-a-color" }),
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid backgroundColor");
  });
});
