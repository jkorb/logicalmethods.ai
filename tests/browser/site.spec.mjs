import { test, expect } from '@playwright/test';

// Production absolute URLs must exercise the local artifact, never the live site.
// Third-party resources are stubbed; their availability is checked separately.
test.beforeEach(async ({ page }) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai', 'www.logicalmethods.ai'].includes(url.hostname)) {
      const response = await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` });
      await route.fulfill({ response });
    } else if (url.hostname === '127.0.0.1') await route.continue();
    else await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>External content stub</title>' });
  });
});

for (const route of ['/', '/textbook/', '/textbook/boolean/', '/exercises/logic-and-ai/', '/slides/logic-and-ai/', '/tutoraat/', '/verdiepingspakketten/']) {
  test(`page and first-party assets: ${route}`, async ({ page }, testInfo) => {
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    expect((await page.goto(route)).status()).toBe(200);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('body')).toBeVisible();
    expect(await page.title()).not.toBe('');
    expect(await page.locator('img').evaluateAll(images => images.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src))).toEqual([]);
    expect(failures).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('page.png') });
  });
}

test('course navigation opens, expands and follows a chapter link', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-bs-target="#offcanvas-nav"]').click();
  const nav = page.locator('#offcanvas-nav');
  await expect(nav).toBeVisible();
  await nav.locator('[data-bs-toggle="collapse"]').first().click();
  const chapter = nav.locator('a[href="/textbook/logic-and-ai/"]');
  await expect(chapter).toBeVisible();
  await chapter.click();
  await expect(page).toHaveURL(/\/textbook\/logic-and-ai\/$/);
});

test('exercise solution rejects wrong password, opens with Enter, and closes', async ({ page }) => {
  await page.goto('/exercises/logic-and-ai/');
  const button = page.locator('button[aria-controls="definitionsSolution"]');
  const solution = page.locator('#definitionsSolution');
  await expect(solution).toBeHidden();
  await button.click();
  await expect(page.locator('#passwordModal')).toBeVisible();
  await page.locator('#passwordInput').fill('incorrect-test-password');
  page.once('dialog', async dialog => { expect(dialog.message()).toContain('Incorrect password'); await dialog.accept(); });
  await page.locator('#passwordSubmitButton').click();
  await expect(solution).toBeHidden();
  await page.locator('#passwordInput').fill('apple');
  await page.locator('#passwordInput').press('Enter');
  await expect(solution).toHaveClass(/\bcollapse\b.*\bshow\b/);
  await expect(solution).toBeVisible();
  await expect(page.locator('#passwordModal')).toBeHidden();
  await button.click();
  await expect(solution).toBeHidden();
});

test('custom notation and KaTeX render with loaded fonts', async ({ page }) => {
  // Register before the shared auto-render callback, so its real configuration
  // must render this probe during DOMContentLoaded.
  await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
    const probe = document.createElement('div');
    probe.id = 'math-test-probe'; probe.textContent = '\\(x^2\\)'; document.body.append(probe);
  }));
  await page.goto('/textbook/boolean/');
  await expect(page.locator('.excalifont').first()).toBeVisible();
  await expect(page.locator('.Boolean').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px Excalifont'))).toBe(true);
  await expect(page.locator('#math-test-probe .katex')).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
});
