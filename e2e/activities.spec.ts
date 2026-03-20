import { test, expect } from "@playwright/test";

test.describe("Activities Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/activities");
    // Wait for activities to load
    await expect(page.getByText("Architecture Review: Phase 22")).toBeVisible();
  });

  test("displays all activities from the API", async ({ page }) => {
    await expect(page.getByText("Architecture Review: Phase 22")).toBeVisible();
    await expect(page.getByText("Monthly Revenue Reconciliation")).toBeVisible();
    await expect(page.getByText("Security Patch Deployment")).toBeVisible();
    await expect(page.getByText("Q1 Dashboard Metrics Update")).toBeVisible();
    await expect(page.getByText("CI/CD Pipeline Optimization")).toBeVisible();
  });

  test("filters by Completed status", async ({ page }) => {
    // Open the status filter (first combobox)
    const statusTrigger = page.getByRole("combobox").first();
    await statusTrigger.click();

    // Select "Completed"
    await page.getByRole("option", { name: "Completed" }).click();

    // Should show only Completed activities
    await expect(page.getByText("Monthly Revenue Reconciliation")).toBeVisible();
    await expect(page.getByText("Q1 Dashboard Metrics Update")).toBeVisible();

    // Should not show non-Completed activities
    await expect(page.getByText("Architecture Review: Phase 22")).not.toBeVisible();
    await expect(page.getByText("Security Patch Deployment")).not.toBeVisible();
    await expect(page.getByText("CI/CD Pipeline Optimization")).not.toBeVisible();
  });

  test("filters by Urgent status", async ({ page }) => {
    const statusTrigger = page.getByRole("combobox").first();
    await statusTrigger.click();
    await page.getByRole("option", { name: "Urgent" }).click();

    await expect(page.getByText("Security Patch Deployment")).toBeVisible();

    await expect(page.getByText("Architecture Review: Phase 22")).not.toBeVisible();
    await expect(page.getByText("Monthly Revenue Reconciliation")).not.toBeVisible();
  });

  test("filters by In Progress status", async ({ page }) => {
    const statusTrigger = page.getByRole("combobox").first();
    await statusTrigger.click();
    await page.getByRole("option", { name: "In Progress" }).click();

    await expect(page.getByText("Architecture Review: Phase 22")).toBeVisible();
    await expect(page.getByText("CI/CD Pipeline Optimization")).toBeVisible();

    await expect(page.getByText("Monthly Revenue Reconciliation")).not.toBeVisible();
    await expect(page.getByText("Security Patch Deployment")).not.toBeVisible();
  });

  test("shows empty message when filter matches nothing after selecting and re-selecting", async ({ page }) => {
    // First filter to Completed
    const statusTrigger = page.getByRole("combobox").first();
    await statusTrigger.click();
    await page.getByRole("option", { name: "Completed" }).click();
    await expect(page.getByText("Monthly Revenue Reconciliation")).toBeVisible();

    // Reset to All Statuses
    await statusTrigger.click();
    await page.getByRole("option", { name: "All Statuses" }).click();
    await expect(page.getByText("Architecture Review: Phase 22")).toBeVisible();
    await expect(page.getByText("Security Patch Deployment")).toBeVisible();
  });

  test("sorts by category", async ({ page }) => {
    // Open sort dropdown (second combobox)
    const sortTrigger = page.getByRole("combobox").nth(1);
    await sortTrigger.click();
    await page.getByRole("option", { name: "Sort by Category" }).click();

    // Get all activity titles in order
    const titles = await page.locator("[data-slot='card'] p.font-medium").allTextContents();

    // Categories alphabetically: Analytics, DevOps, Finance Department, Infrastructure Optimization, Systems Ops
    expect(titles).toEqual([
      "Q1 Dashboard Metrics Update",        // Analytics
      "CI/CD Pipeline Optimization",         // DevOps
      "Monthly Revenue Reconciliation",      // Finance Department
      "Architecture Review: Phase 22",       // Infrastructure Optimization
      "Security Patch Deployment",           // Systems Ops
    ]);
  });

  test("sorts by status", async ({ page }) => {
    const sortTrigger = page.getByRole("combobox").nth(1);
    await sortTrigger.click();
    await page.getByRole("option", { name: "Sort by Status" }).click();

    const titles = await page.locator("[data-slot='card'] p.font-medium").allTextContents();

    // Statuses alphabetically: Completed (x2), In Progress (x2), Urgent (x1)
    expect(titles).toEqual([
      "Monthly Revenue Reconciliation",      // Completed
      "Q1 Dashboard Metrics Update",         // Completed
      "Architecture Review: Phase 22",       // In Progress
      "CI/CD Pipeline Optimization",         // In Progress
      "Security Patch Deployment",           // Urgent
    ]);
  });

  test("filter and sort work together", async ({ page }) => {
    // Filter to "In Progress"
    const statusTrigger = page.getByRole("combobox").first();
    await statusTrigger.click();
    await page.getByRole("option", { name: "In Progress" }).click();

    // Sort by category
    const sortTrigger = page.getByRole("combobox").nth(1);
    await sortTrigger.click();
    await page.getByRole("option", { name: "Sort by Category" }).click();

    const titles = await page.locator("[data-slot='card'] p.font-medium").allTextContents();

    // In Progress items sorted by category: DevOps, Infrastructure Optimization
    expect(titles).toEqual([
      "CI/CD Pipeline Optimization",         // DevOps
      "Architecture Review: Phase 22",       // Infrastructure Optimization
    ]);
  });
});
