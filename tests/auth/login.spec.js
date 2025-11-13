import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test("logs in successfully with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[data-testid="usernameInput"]', "testuser1");
    await page.fill('[data-testid="passwordInput"]', "password123");
    await page.click('[data-testid="loginButton"]');

    await expect(page).toHaveURL("/");
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[data-testid="usernameInput"]', "wronguser");
    await page.fill('[data-testid="passwordInput"]', "wrongpass");
    await page.click('[data-testid="loginButton"]');

    await expect(page.locator('[data-testid="loginError"]')).toBeVisible();
  });
});
