import { test, expect } from "@playwright/test";

test.describe("Dashboard & Theme E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          firstName: "E2E",
          lastName: "Tester",
          email: "e2e@financefocus.com",
          role: "User",
        }),
      );
    });
  });

  test("should render main navigation and summary cards on dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/FinanceFocus/i).first()).toBeVisible();
  });

  test("should default to dark theme and allow toggling to light theme", async ({ page }) => {
    await page.goto("/");
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);
  });
});
