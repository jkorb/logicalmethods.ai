import { reviewScreenshot } from './review-screenshot.mjs';
import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
test('annotated alphabet has readable symbol groups and responsive over/underbraces', async ({ page }, testInfo) => {
  await page.goto('/textbook/formal-languages/');
  const figure = page.locator('.annotated-math');
  await expect(figure).toHaveAttribute('aria-label', /p₁, p₂, p₃, … \(variables \(atoms\)\)/);
  await expect(figure.locator('.annotated-math__symbols')).toHaveText(['p₁, p₂, p₃, …', '¬, ∧, ∨, →, ↔', '(, )']);
  for (const width of [1366, 390]) {
    await page.setViewportSize({width, height: 768});
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      await figure.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      const top = await figure.locator('.annotated-math__group--above .annotated-math__label').boundingBox();
      const symbols = await figure.locator('.annotated-math__group--above .annotated-math__symbols').boundingBox();
      expect(top.y + top.height).toBeLessThan(symbols.y);
      expect((await new AxeBuilder({page}).include('.annotated-math').analyze()).violations).toEqual([]);
      await reviewScreenshot(figure, {path:testInfo.outputPath(`annotated-alphabet-${width}-${theme}.png`)});
    }
  }
});
