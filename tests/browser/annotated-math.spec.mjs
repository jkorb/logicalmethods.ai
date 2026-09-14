import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('annotated alphabet has readable symbol groups and responsive over/underbraces', async ({ page, context }, testInfo) => {
  await context.route('https://logicalmethods.ai/**', async route => {
    const url = new URL(route.request().url());
    await route.fulfill({response: await route.fetch({url: `http://127.0.0.1:4173${url.pathname}`})});
  });
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
      await figure.screenshot({path:testInfo.outputPath(`annotated-alphabet-${width}-${theme}.png`)});
    }
  }
});
