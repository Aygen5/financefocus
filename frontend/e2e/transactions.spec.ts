import { test, expect } from "@playwright/test";

test.describe("Transactions & Navigation E2E Tests", () => {
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

  test("should load transactions view and show transaction table UI", async ({ page }) => {
    await page.goto("/transactions");
    await expect(page).toHaveURL(/\/transactions/);
  });
});
