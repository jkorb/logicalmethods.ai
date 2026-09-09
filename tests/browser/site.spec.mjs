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
    // Figures are lazy-loaded, so force them to resolve before asserting they exist.
    await page.locator('img').evaluateAll(images => images.forEach(i => { i.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 15000 });
    expect(await page.locator('img').evaluateAll(images => images.filter(i => i.naturalWidth === 0).map(i => i.src))).toEqual([]);
    expect(failures).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('page.png') });
  });
}

test('the section links in the header reach a chapter', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main"]');
  await expect(nav.getByRole('link', { name: 'Textbook' })).toBeVisible();
  await nav.getByRole('link', { name: 'Textbook' }).click();
  await expect(page).toHaveURL(/\/textbook\/$/);
  await page.getByRole('link', { name: /Logic and AI/ }).first().click();
  await expect(page).toHaveURL(/\/textbook\/logic-and-ai\/$/);
  await expect(page.locator('main h1')).toBeVisible();
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

test('custom notation renders with the loaded faces', async ({ page }) => {
  await page.goto('/textbook/boolean/');
  await expect(page.locator('.excalifont').first()).toBeVisible();
  await expect(page.locator('.Boolean').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px Excalifont'))).toBe(true);
  // Logic symbols are text in the patched object-language face, not images.
  // Boolean algebra spells its connectives, so the quantifier chapter is the
  // one that exercises the added glyphs.
  expect(await page.evaluate(() => document.fonts.check('16px "Comic Shanns Logic"'))).toBe(true);
  await page.goto('/textbook/FOL/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => /[∀∃∧∨→⊨]/.test(document.body.innerText))).toBe(true);
  expect(await page.locator('img[src*="/img/forall"], img[src*="/img/conjunction"]').count()).toBe(0);
});

test('KaTeX renders on the LaTeX exercise, and is not loaded anywhere else', async ({ page }) => {
  await page.goto('/exercises/preamble/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.katex').first()).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);

  // Every other page strips $ before Markdown runs, so KaTeX would render
  // nothing there; it must not be shipped.
  const katexRequests = [];
  page.on('request', r => { if (/katex/i.test(r.url())) katexRequests.push(r.url()); });
  await page.goto('/textbook/boolean/');
  await page.evaluate(() => document.fonts.ready);
  expect(katexRequests).toEqual([]);
});
