import { test, expect } from "@playwright/test";

test.describe("Authentication E2E Tests", () => {
  test("should redirect unauthenticated users to login page", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should render login page elements correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("FinanceFocus")).toBeVisible();
    await expect(page.getByPlaceholder(/e-posta/i)).toBeVisible();
    await expect(page.getByPlaceholder(/şifre/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /giriş yap/i })).toBeVisible();
  });

  test("should toggle password visibility when clicking eye icon", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.getByPlaceholder(/şifre/i);
    await expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = page.locator("button:has(svg)");
    if ((await toggleButton.count()) > 0) {
      await toggleButton.first().click();
    }
  });

  test("should navigate from login to register page", async ({ page }) => {
    await page.goto("/login");
    await page.getByText(/kayıt ol/i).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByPlaceholder(/adınız/i)).toBeVisible();
  });
});
