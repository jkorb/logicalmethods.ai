import { test, expect } from '@playwright/test';

/* WCAG 1.4.10: content must reflow to 320 CSS px without a horizontal scrollbar.
   Truth tables and syntax-highlighted code both broke this before the redesign. */

test.use({ viewport: { width: 320, height: 800 } });

test.beforeEach(async ({ page }) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai', 'www.logicalmethods.ai'].includes(url.hostname)) {
      await route.fulfill({ response: await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` }) });
    } else if (url.hostname === '127.0.0.1') await route.continue();
    else await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
  });
});

for (const route of ['/', '/about/', '/textbook/', '/textbook/boolean/', '/textbook/fol/', '/textbook/formal-languages/', '/textbook/tools/', '/assignments/assignment_3/',
                     '/exercises/preamble/', '/exercises/logic-and-ai/', '/slides/logic-and-ai/', '/assignments/']) {
  test(`no horizontal scroll at 320px: ${route}`, async ({ page }) => {
    expect((await page.goto(route)).status(), `Missing test page: ${route}`).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(scrollWidth, `${route} overflows by ${scrollWidth - clientWidth}px`).toBeLessThanOrEqual(clientWidth + 1);
  });
}
