import { test, expect } from "@playwright/test";

test.describe("Export PDF", () => {
  test("Export PDF button triggers a PDF file download", async ({ page }) => {
    await page.goto("/");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export PDF" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("executive-dashboard-report.pdf");
  });

  test("downloaded file is a valid PDF", async ({ page }) => {
    await page.goto("/");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export PDF" }).click();
    const download = await downloadPromise;

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks);

    // PDF files start with the %PDF magic bytes
    expect(content.subarray(0, 4).toString()).toBe("%PDF");
    expect(content.length).toBeGreaterThan(1000);
  });

  test("report page renders all 4 charts with no nav menu", async ({ page }) => {
    await page.goto("/report/pdf");

    // All 4 chart sections must be present
    await expect(page.getByText("Project Completion")).toBeVisible();
    await expect(page.getByText("Revenue Distribution")).toBeVisible();
    await expect(page.getByText("System Performance")).toBeVisible();
    await expect(page.getByText("Monthly Trends")).toBeVisible();

    // Activities section must be present
    await expect(page.getByText("Recent Activities")).toBeVisible();

    // No sidebar / nav menu
    await expect(page.getByText("Main Menu")).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).not.toBeVisible();

    // Report header
    await expect(page.getByText("Executive Dashboard Report")).toBeVisible();
  });

  test("report page has a date header", async ({ page }) => {
    await page.goto("/report/pdf");

    await expect(page.getByText(/Generated on/)).toBeVisible();
  });

  test("Export PDF button shows loading state while generating", async ({ page }) => {
    await page.goto("/");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export PDF" }).click();

    // Button should show loading text immediately after click
    await expect(page.getByRole("button", { name: "Generating…" })).toBeVisible();

    await downloadPromise;
  });
});
