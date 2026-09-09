import { test, expect } from '@playwright/test';

/* axe cannot see these. Both were real defects before the redesign:
   chapter navigation carried tabindex="-1", and no control had a focus ring. */

test.beforeEach(async ({ page }) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai', 'www.logicalmethods.ai'].includes(url.hostname)) {
      await route.fulfill({ response: await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` }) });
    } else if (url.hostname === '127.0.0.1') await route.continue();
    else await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
  });
});

async function walk(page, limit = 400) {
  const stops = [];
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        name: (el.getAttribute('aria-label') || el.innerText || el.value || '').replace(/\s+/g, ' ').trim(),
        ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
      };
    });
    if (!stop) break;
    stops.push(stop);
  }
  return stops;
}

test('the first stop is the skip link, and it targets main', async ({ page }) => {
  await page.goto('/textbook/boolean/');
  await page.keyboard.press('Tab');
  const link = page.locator(':focus');
  await expect(link).toHaveText(/skip to content/i);
  await expect(link).toHaveAttribute('href', '#main');
  await expect(page.locator('#main')).toHaveCount(1);
});

test('chapter navigation is reachable by keyboard', async ({ page }) => {
  await page.goto('/textbook/boolean/');
  const names = (await walk(page)).map(s => s.name.toLowerCase()).join(' | ');
  expect(names, 'previous-chapter link never received focus').toContain('previous');
  expect(names, 'next-chapter link never received focus').toContain('next');
});

test('every tab stop has a name and a visible focus indicator', async ({ page }) => {
  await page.goto('/textbook/boolean/');
  const stops = await walk(page);
  expect(stops.length).toBeGreaterThan(10);
  expect(stops.filter(s => !s.name)).toEqual([]);
  expect(stops.filter(s => !s.ring)).toEqual([]);
});

test('prev and next point at the neighboring chapters, in order', async ({ page }) => {
  await page.goto('/textbook/boolean/');            // chapter 4
  await expect(page.locator('.page-nav__link--prev')).toHaveAttribute('href', '/textbook/valid-inference/');
  await expect(page.locator('.page-nav__link--next')).toHaveAttribute('href', '/textbook/sat/');
});
