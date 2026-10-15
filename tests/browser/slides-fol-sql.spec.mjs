import { test, expect } from './fixtures.mjs';
import { budget } from './budget.mjs';
import { reviewScreenshot } from './review-screenshot.mjs';
import AxeBuilder from '@axe-core/playwright';

const button = (root, name) => root.getByRole('button', { name, exact: true });
const overflow = el => ({ x: Math.max(0, el.scrollWidth - el.clientWidth), y: Math.max(0, el.scrollHeight - el.clientHeight) });
async function open(page, title) {
  await page.goto('/slides/fol/');
  await expect(page.locator('[data-reveal-deck]')).toHaveAttribute('data-deck-ready', 'true');
  await page.evaluate(() => document.fonts.ready);
  const slide = page.locator('.slide').filter({ has: page.getByRole('heading', { name: title, exact: true, includeHidden: true }) });
  await slide.evaluate(el => { location.hash = el.id; });
  await expect(slide).toBeVisible();
  return slide;
}
async function run(root) {
  await button(root, 'Run').click();
  await expect(root.locator('[data-sql-status]')).toHaveAttribute('data-state', 'success', { timeout: budget(15000) });
}

test('lecture 8 initializes SQL with a compact output below the code', { tag: '@mobile' }, async ({ page }, info) => {
  const slide = await open(page, 'Models as databases'), root = slide.locator('.sql-app');
  const code = root.locator('.fol-code');
  await expect.poll(() => slide.evaluate(overflow)).toEqual({ x: 0, y: 0 });
  const before = await code.boundingBox();
  await run(root);
  await expect(root.locator('[data-sql-status]')).toHaveText('Database initialized.');
  await expect(root.locator('[data-sql-results]')).toBeEmpty();
  await expect.poll(() => root.evaluate(el => el.querySelector('[data-sql-output]').getBoundingClientRect().top
    - el.querySelector('.fol-code').getBoundingClientRect().bottom), 'output below code after slide fitting').toBeGreaterThanOrEqual(-1);
  const after = await code.boundingBox();
  expect(after.width).toBeCloseTo(before.width, 0);
  await expect.poll(() => slide.evaluate(overflow)).toEqual({ x: 0, y: 0 });
  await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath('database-initialized.png') });
  await button(page, 'Full screen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect.poll(() => slide.evaluate(overflow)).toEqual({ x: 0, y: 0 });
  await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath('database-fullscreen.png') });
  await run(root); // Each initialization starts with a fresh database.
});

test('lecture 8 switches to executable SQL and runs both positive queries', { tag: '@mobile' }, async ({ page }, info) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const slide = await open(page, 'Queries as open formulas'), root = slide.locator('.fol-app');
  const toggle = button(root, 'SQL view');
  await expect(toggle.locator('.lang-icon')).toBeVisible();
  await toggle.click();
  await expect(toggle.locator('[data-formula-view-icon]')).toHaveText('∀x∃y');
  await expect(toggle.locator('[data-formula-view-icon]')).toBeVisible();
  await expect(root.locator('.fol-walkthrough')).toBeHidden();
  await run(root);
  await expect(root.locator('[data-sql-results] tbody tr')).toHaveText(['France', 'United Kingdom', 'Greece']);
  const code = await root.locator('.fol-code').boundingBox(), output = await root.locator('[data-sql-output]').boundingBox();
  expect(output.x).toBeGreaterThanOrEqual(code.x + code.width);
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath(`countries-${theme}.png`) });
  }
  await button(root, 'European capitals').click();
  await expect(root.locator('[data-sql-results]')).toBeEmpty();
  await expect(root.locator('[data-sql-code]')).toContainText('CapitalOf');
  await run(root);
  await expect(root.locator('[data-sql-results] tbody tr')).toHaveText(['Paris', 'London', 'Athens']);
  await expect.poll(() => slide.evaluate(overflow)).toEqual({ x: 0, y: 0 });
  await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath('capitals.png') });
  await button(page, 'Full screen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect.poll(() => slide.evaluate(overflow)).toEqual({ x: 0, y: 0 });
  await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath('capitals-fullscreen.png') });
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect(root.locator('.fol-walkthrough')).toBeVisible();
  await expect(root.locator('[data-formula]')).toHaveValue('∃y (CapitalOf(y, x) ∧ LocatedIn(y, Europe))');
  await expect(root.locator('[data-sql]')).toBeHidden();
  await toggle.click();
  await expect(root.locator('[data-sql-results] tbody tr')).toHaveCount(3);
  await button(root, 'Edit SQL').click();
  await root.getByLabel('SQL', { exact: true }).fill('SELECT COUNT(*) AS total FROM LocatedIn;');
  await run(root);
  await expect(root.locator('[data-sql-results] tbody tr')).toHaveText(['5']);
  expect((await new AxeBuilder({ page }).include(`#${await slide.getAttribute('id')}`).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('negated query prints its completed answer even with the preview hidden', { tag: '@mobile' }, async ({ page }, info) => {
  const slide = await open(page, 'Queries as open formulas'), root = slide.locator('.fol-app');
  await button(root, 'Negated query').click();
  await button(root, 'Show query extension').click();
  await expect(root.locator('[data-query-result]')).toBeEmpty();
  await button(root, 'Last step').click();
  await expect(root.locator('[data-answer]')).toHaveText('Query complete: 17 matching values.');
  await expect(root.locator('[data-query-result]')).toBeVisible();
  await expect(root.locator('[data-query-extension] .fol-tuple')).toHaveCount(17);
  await expect(root.locator('[data-query-extension] [data-object="Asia"]')).toHaveCount(0);
  await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath('negated-answer.png') });
  await button(root, 'SQL view').click(); await run(root);
  await expect(root.locator('[data-sql-results] tbody tr')).toHaveCount(17);
  await expect(root.locator('[data-sql-results] td').filter({ hasText: /^Asia$/ })).toHaveCount(0);
  await expect.poll(() => slide.evaluate(overflow)).toEqual({ x: 0, y: 0 });
  await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath('negated-sql.png') });
});
