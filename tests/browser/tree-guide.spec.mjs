import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ context }) => {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai', 'www.logicalmethods.ai'].includes(url.hostname)) {
      await route.fulfill({ response: await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` }) });
    } else if (url.hostname === '127.0.0.1') await route.continue();
    else await route.fulfill({ status: 200, body: '' });
  });
});

test('tree definitions support click, focus, hover, and clearing', async ({ page }, testInfo) => {
  await page.goto('/textbook/formal-languages/');
  const guide = page.locator('[data-tree-guide]');
  const highlighted = guide.locator('[data-node].is-highlighted');
  await expect(guide.locator('figcaption')).toHaveCount(0);
  await expect(guide.locator('dd:visible')).toHaveCount(0);
  await guide.getByRole('button', { name: 'Leaf', exact: true }).click();
  await expect(highlighted).toHaveCount(3);
  await expect(guide.locator('[data-concept=leaf] dd')).toBeVisible();
  await expect(guide.locator('dd:visible')).toHaveCount(1);
  await expect(guide.locator('[data-node="bird"]')).toHaveClass('is-highlighted');
  const branch = guide.getByRole('button', { name: 'Branch', exact: true });
  await branch.focus();
  await expect(guide.locator('[data-edge].is-highlighted')).toHaveCount(2);
  await branch.press('Enter');
  await expect(branch).toHaveAttribute('aria-expanded', 'true');
  await expect(guide.locator('[data-concept=leaf] dd')).toBeHidden();
  await expect(guide.locator('[data-concept=branch] dd')).toBeVisible();
  await branch.press('Escape');
  await expect(guide.locator('dd:visible')).toHaveCount(0);
  await expect(highlighted).toHaveCount(0);
  if (testInfo.project.name === 'desktop') {
    await guide.getByRole('button', { name: 'Root', exact: true }).hover();
    await expect(highlighted).toHaveCount(1);
    await expect(guide.locator('[data-node="rabbit"]')).toHaveClass('is-highlighted');
  }
  await guide.getByRole('button', { name: 'Children', exact: true }).click();
  await expect(highlighted).toHaveCount(2);
  await guide.getByRole('button', { name: 'Children', exact: true }).click();
  await expect(highlighted).toHaveCount(0);
});

test('tree fits narrow screens and is accessible in both themes', async ({ page }, testInfo) => {
  await page.goto('/textbook/formal-languages/');
  const guide = page.locator('[data-tree-guide]');
  for (const theme of ['light', 'dark']) {
    await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
    await guide.getByRole('button', { name: 'Branch', exact: true }).click();
    await page.mouse.move(0, 0);
    await guide.getByRole('button', { name: 'Branch', exact: true }).evaluate(button => button.blur());
    const diagram = await guide.locator('svg').boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    expect(diagram.y).toBeGreaterThanOrEqual(header.y + header.height);
    const results = await new AxeBuilder({ page }).include('[data-tree-guide]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({ path: `tmp/tree-guide-${testInfo.project.name}-${theme}.png` });
  }
  await page.setViewportSize({ width: 320, height: 720 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('tree and definitions remain readable without JavaScript', async ({ browser, context }) => {
  const plain = await browser.newContext({ javaScriptEnabled: false });
  // Reuse the local routing setup via a standalone route for production assets.
  await plain.route('https://logicalmethods.ai/**', async route => {
    const url = new URL(route.request().url());
    return route.fulfill({ response: await context.request.get(`http://127.0.0.1:4173${url.pathname}`) });
  });
  const page = await plain.newPage();
  await page.goto('http://127.0.0.1:4173/textbook/formal-languages/');
  const guide = page.locator('[data-tree-guide]');
  await expect(guide.locator('dt')).toHaveCount(10);
  await expect(guide.locator('dd:visible')).toHaveCount(10);
  await expect(guide.locator('svg')).toBeVisible();
  await expect(guide.getByRole('button')).toHaveCount(0);
  await expect(guide.locator('.tree-guide__hint')).toBeHidden();
  await plain.close();
});
