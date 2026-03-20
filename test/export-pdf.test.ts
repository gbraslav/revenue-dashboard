import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock puppeteer-core and @sparticuz/chromium so tests don't launch a real browser
vi.mock("puppeteer-core", () => ({
  default: {
    launch: vi.fn(),
  },
}));

vi.mock("@sparticuz/chromium", () => ({
  default: {
    args: [],
    executablePath: vi.fn().mockResolvedValue("/usr/bin/chromium"),
  },
}));

import puppeteer from "puppeteer-core";

function makeMockPage(overrides: Record<string, unknown> = {}) {
  return {
    setViewport: vi.fn(),
    goto: vi.fn(),
    evaluate: vi.fn(),
    waitForSelector: vi.fn(),
    pdf: vi.fn().mockResolvedValue(Buffer.from("%PDF-1.4 fake")),
    ...overrides,
  };
}

function makeMockBrowser(page: ReturnType<typeof makeMockPage>) {
  return {
    newPage: vi.fn().mockResolvedValue(page),
    close: vi.fn(),
  };
}

function makeRequest(host = "localhost:3000") {
  return new Request(`http://${host}/api/export-pdf`, {
    headers: { host },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/export-pdf", () => {
  it("returns a PDF response with correct content-type", async () => {
    const page = makeMockPage();
    const browser = makeMockBrowser(page);
    vi.mocked(puppeteer.launch).mockResolvedValue(browser as never);

    const { GET } = await import("../app/api/export-pdf/route");
    const res = await GET(makeRequest() as never);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain("attachment");
  });

  it("includes correct PDF content in response body", async () => {
    const fakeBuffer = Buffer.from("%PDF-1.4 test-content");
    const page = makeMockPage({ pdf: vi.fn().mockResolvedValue(fakeBuffer) });
    const browser = makeMockBrowser(page);
    vi.mocked(puppeteer.launch).mockResolvedValue(browser as never);

    const { GET } = await import("../app/api/export-pdf/route");
    const res = await GET(makeRequest() as never);

    const body = await res.arrayBuffer();
    expect(Buffer.from(body).toString()).toContain("%PDF");
  });

  it("closes the browser even on success", async () => {
    const page = makeMockPage();
    const browser = makeMockBrowser(page);
    vi.mocked(puppeteer.launch).mockResolvedValue(browser as never);

    const { GET } = await import("../app/api/export-pdf/route");
    await GET(makeRequest() as never);

    expect(browser.close).toHaveBeenCalledOnce();
  });

  it("returns 500 when Puppeteer throws", async () => {
    vi.mocked(puppeteer.launch).mockRejectedValue(new Error("Chromium not found"));

    const { GET } = await import("../app/api/export-pdf/route");
    const res = await GET(makeRequest() as never);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  it("returns 500 when page navigation fails", async () => {
    const page = makeMockPage({ goto: vi.fn().mockRejectedValue(new Error("timeout")) });
    const browser = makeMockBrowser(page);
    vi.mocked(puppeteer.launch).mockResolvedValue(browser as never);

    const { GET } = await import("../app/api/export-pdf/route");
    const res = await GET(makeRequest() as never);

    expect(res.status).toBe(500);
  });
});
