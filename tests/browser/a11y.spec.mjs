import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const ROUTES = ['/', '/about/', '/textbook/', '/textbook/boolean/', '/textbook/fol/', '/textbook/formal-languages/',
                '/tools/', '/tools/propositional-parser/',
                '/slides/', '/slides/logic-and-ai/', '/exercises/', '/exercises/preamble/', '/exercises/logic-and-ai/'];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const route of ROUTES) {
  test(`no WCAG violations: ${route}`, async ({ page }) => {
    expect((await page.goto(route)).status(), `Missing test page: ${route}`).toBe(200);
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
