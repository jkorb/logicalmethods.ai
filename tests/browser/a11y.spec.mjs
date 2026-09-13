import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

// Production absolute URLs must exercise the local artifact, never the live site.
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

const ROUTES = ['/', '/about/', '/textbook/', '/textbook/boolean/', '/textbook/FOL/', '/textbook/formal-languages/', '/textbook/tools/', '/assignments/assignment_3/',
                '/slides/', '/slides/logic-and-ai/', '/exercises/', '/exercises/preamble/', '/exercises/logic-and-ai/',
                '/assignments/'];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const route of ROUTES) {
  test(`no WCAG violations: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const exceptions = JSON.parse(await readFile('tests/a11y-exceptions.json', 'utf8'));
    const remaining = violations.filter(v => !exceptions.some(x => x.id === v.id && x.reason));
    expect(remaining.map(v => `${v.id} (${v.nodes.length}): ${v.help}`)).toEqual([]);
  });
}

// Both themes are shipped, so both are audited. Contrast is theme-dependent.
for (const scheme of ['light', 'dark']) {
  test(`no WCAG violations in ${scheme} mode: /textbook/boolean/`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/textbook/boolean/');
    await page.evaluate(() => document.fonts.ready);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
  });
}
