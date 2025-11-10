import { test as base, expect as baseExpect } from "@playwright/test";

export const test = base.extend({
  login: async ({ page }, use) => {
    await page.goto("/login");
    await page.fill('[data-testid="usernameInput"]', "testuser1");
    await page.fill('[data-testid="passwordInput"]', "password123");
    await page.click('[data-testid="loginButton"]');
    await page.waitForURL("/");
    await use(page);
  },
});

export const expect = baseExpect;
