import { test, expect } from "@playwright/test";

const year = 1;
const moduleNum = 1;
const subject = "werkpraktijk";

test(`Art pieces load for year ${year}, module ${moduleNum}, subject ${subject}`, async ({
  page,
}) => {
  await page.goto(`/module/${year}/${moduleNum}/${subject}`);

  const artPieces = page.locator('[data-testid="artpieceCard"]');
  await artPieces.first().waitFor({ state: "visible" });

  const count = await artPieces.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const title = artPieces.nth(i).locator('[data-testid="artpieceTitle"]');
    await expect(title).toHaveText(/.+/);
    console.log(`Art piece ${i + 1} title:`, await title.textContent());
  }
});
