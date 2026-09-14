import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai', 'www.logicalmethods.ai'].includes(url.hostname)) {
      await route.fulfill({ response: await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` }) });
    } else if (url.hostname === '127.0.0.1') await route.continue();
    else await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
  });
});

const later = ['valid-inference', 'boolean', 'sat', 'conditionals', 'proofs',
  'FOL', 'FOL-inference', 'many-valued', 'probability', 'learning'];

for (const section of ['textbook', 'exercises', 'slides']) {
  test(`${section}: release navigation and legacy direct URLs`, async ({ page }, testInfo) => {
    await page.goto(`/${section}/`);
    for (const chapter of (section === 'slides' ? ['logic-and-ai'] : ['logic-and-ai', 'formal-languages'])) {
      await expect(page.locator(`a.chapter-card[href="/${section}/${chapter}/"]`)).toBeVisible();
    }
    await expect(page.locator('.chapter-card.is-locked')).toHaveCount(section === 'slides' ? 11 : 10);
    for (let chapter of later) {
      if (section !== 'textbook' && chapter === 'proofs') chapter = 'proof';
      if (section === 'slides' && chapter === 'learning') chapter = 'anns';
      await expect(page.locator(`a.chapter-card[href="/${section}/${chapter}/"]`)).toHaveCount(0);
    }
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.chapter-card.is-locked').first()).toHaveCSS('border-top-style', 'dashed');
    await page.screenshot({ path: testInfo.outputPath(`${section}-release.png`), fullPage: true });
    expect((await page.goto(`/${section}/valid-inference/`)).status()).toBe(200);
    await expect(page.locator('main')).toContainText(/valid inference/i);
  });
}

test('glossary includes notation dependencies but omits unreleased definitions', async ({ page }) => {
  await page.goto('/textbook/glossary/');
  await expect(page.locator('.glossary-entry')).toHaveCount(100);
  await expect(page.locator('#algorithm')).toBeVisible();
  await expect(page.locator('#countermodel')).toBeVisible();
  await expect(page.locator('#fair-search, #axiom')).toHaveCount(0);
  const destinations = await page.locator('.glossary-entry p:last-child a').evaluateAll(
    links => links.map(link => new URL(link.href).pathname));
  expect(destinations.every(path => ['/textbook/logic-and-ai/', '/textbook/formal-languages/',
    '/textbook/notation/'].includes(path))).toBe(true);
});
