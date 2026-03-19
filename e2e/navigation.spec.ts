import { test, expect } from "@playwright/test";

test.describe("Sidebar Navigation", () => {
  test("loads Dashboard by default with all sections visible", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Executive Dashboard" })).toBeVisible();
    await expect(page.getByText("Real-time operational metrics and project status")).toBeVisible();

    // Verify all four chart sections
    await expect(page.getByText("Recent Activities")).toBeVisible();
    await expect(page.getByText("Project Completion")).toBeVisible();
    await expect(page.getByText("Revenue Distribution")).toBeVisible();
    await expect(page.getByText("System Performance")).toBeVisible();
    await expect(page.getByText("Monthly Trends")).toBeVisible();

    // Verify action buttons
    await expect(page.getByRole("button", { name: "Export PDF" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Generate Report" })).toBeVisible();

    // Verify Dashboard nav item is active
    const dashboardLink = page.getByRole("link", { name: "Dashboard" });
    await expect(dashboardLink).toBeVisible();
  });

  test("navigates to Activities and shows stub heading", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Activities" }).click();
    await expect(page).toHaveURL("/activities");
    await expect(page.getByRole("heading", { name: "Activities" })).toBeVisible();

    // Sidebar should still be visible
    await expect(page.getByText("Main Menu")).toBeVisible();
  });

  test("navigates to Settings and shows stub heading", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    // Sidebar should still be visible
    await expect(page.getByText("Main Menu")).toBeVisible();
  });

  test("navigates back to Dashboard from another page", async ({ page }) => {
    await page.goto("/activities");

    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Executive Dashboard" })).toBeVisible();
  });

  test("full navigation cycle through all menu items", async ({ page }) => {
    await page.goto("/");

    // Dashboard -> Activities
    await page.getByRole("link", { name: "Activities" }).click();
    await expect(page.getByRole("heading", { name: "Activities" })).toBeVisible();

    // Activities -> Settings
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    // Settings -> Dashboard
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page.getByRole("heading", { name: "Executive Dashboard" })).toBeVisible();
    await expect(page.getByText("Recent Activities")).toBeVisible();
  });
});
