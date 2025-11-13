import { test, expect } from "../setup/login";

test("Create artpiece", async ({ login: page }) => {
  const timestamp = Date.now();
  const title = `New Test Piece ${timestamp}`;
  const description = "A test artpiece upload.";
  const year = "1";
  const module = "2";
  const subject = "WERKPRAKTIJK_1";

  await page.goto("/upload");

  const form = page.locator('form[data-testid="uploadForm"]');
  await expect(form).toBeVisible();

  await page.fill('[data-testid="titleInput"]', title);
  await page.fill('[data-testid="descriptionInput"]', description);
  await page.selectOption('[data-testid="yearSelect"]', year);
  await page.selectOption('[data-testid="moduleSelect"]', module);
  await page.selectOption('[data-testid="subjectSelect"]', subject);

  await page.click('[data-testid="submitButton"]');

  await expect(page).toHaveURL("/module/1/2/werkpraktijk");

  const artpieceCard = page.locator('[data-testid="artpieceCard"]', {
    has: page.locator(`[data-testid="artpieceTitle"]`, { hasText: title }),
  });

  await expect(artpieceCard).toBeVisible();
});
