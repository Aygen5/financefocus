import { test, expect } from "@playwright/test";

test.describe("Demo Mode & End-to-End Consistency E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          firstName: "Demo",
          lastName: "Tester",
          email: "demo.tester@financefocus.com",
          role: "User",
        }),
      );
      localStorage.setItem("is_demo_mode", "true");
    });
  });

  test("should display Demo Mode banner and global DEMO MODE header badge", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Şu anda Demo Modundasınız/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Demo'dan Çık/i })).toBeVisible();
    await expect(page.getByText(/DEMO MODE/i).first()).toBeVisible();
  });

  test("should open confirmation modal when clicking Demo'dan Çık button", async ({ page }) => {
    await page.goto("/");
    const exitBtn = page.getByRole("button", { name: /Demo'dan Çık/i });
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();
    await expect(
      page.getByText(/Demo modundan çıkmak istediğinize emin misiniz/i),
    ).toBeVisible();
  });

  test("should disable mutation actions while in Demo Mode", async ({ page }) => {
    await page.goto("/transactions");
    const addBtn = page.getByRole("button", { name: /Yeni İşlem Ekle/i });
    if (await addBtn.isVisible()) {
      await expect(addBtn).toBeDisabled();
    }
  });

  test("should navigate across main modules cleanly in Demo Mode", async ({ page }) => {
    await page.goto("/reports");
    await expect(page.getByText(/Finansal Raporlar/i).first()).toBeVisible();

    await page.goto("/forecast");
    await expect(page.getByText(/Tahmin Motoru/i).first()).toBeVisible();

    await page.goto("/financial-health");
    await expect(page.getByText(/Finansal Sağlık Skoru/i).first()).toBeVisible();

    await page.goto("/ai-assistant");
    await expect(page.getByText(/Finansal AI Asistan/i).first()).toBeVisible();
  });
});
