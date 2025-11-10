import { test, expect } from "../setup/login";

test("Delete specific artpiece", async ({ login: page }) => {
  const year = 1;
  const moduleNum = 1;
  const subject = "werkpraktijk";
  const targetTitle = "Artpiece title 1";

  await page.goto(`/module/${year}/${moduleNum}/${subject}`);

  const artPieces = page.locator('[data-testid="artpieceCard"]');
  const targets = artPieces.filter({
    has: page.locator(`[data-testid="artpieceTitle"]`, {
      hasText: targetTitle,
    }),
  });

  await expect(targets).toHaveCount(2);

  const target = targets.first();

  await target.hover();

  const deleteButton = target.locator('[data-testid="deleteButton"]');
  await deleteButton.click();

  const modal = page.locator("form", { hasText: "Weet je zeker" });
  await expect(modal).toBeVisible();

  await modal.locator('button:has-text("Verwijderen")').click();

  await expect(modal).toBeHidden();

  await expect(
    page.locator(`[data-testid="artpieceTitle"]`, { hasText: targetTitle }),
  ).toHaveCount(1);
});
