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
        name: (el.getAttribute('aria-label') || [...(el.labels || [])].map(label => label.innerText).join(' ') || el.innerText || el.value || '').replace(/\s+/g, ' ').trim(),
        ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
      };
    });
    if (!stop) break;
    stops.push(stop);
  }
  return stops;
}

test('the first stop is the skip link, and it targets main', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');
  await page.keyboard.press('Tab');
  const link = page.locator(':focus');
  await expect(link).toHaveText(/skip to content/i);
  await expect(link).toHaveAttribute('href', '#main');
  await expect(page.locator('#main')).toHaveCount(1);
});

test('chapter navigation is reachable by keyboard', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');
  const names = (await walk(page)).map(s => s.name.toLowerCase()).join(' | ');
  expect(names, 'previous-chapter link never received focus').toContain('previous');
  expect(names, 'next-chapter link never received focus').toContain('next');
});

test('every tab stop has a name and a visible focus indicator', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');
  const stops = await walk(page);
  expect(stops.length).toBeGreaterThan(10);
  expect(stops.filter(s => !s.name)).toEqual([]);
  expect(stops.filter(s => !s.ring)).toEqual([]);
});

test('prev and next point at the neighboring chapters, in order', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');            // chapter 2
  await expect(page.locator('.page-nav__link--prev')).toHaveAttribute('href', '/textbook/logic-and-ai/');
  await expect(page.locator('.page-nav__link--next')).toHaveAttribute('href', '/textbook/notation/');
});

test('fields and buttons use the same blue focus ring', async ({ page }) => {
  const ring = el => {
    const style = getComputedStyle(el);
    return { colour: style.outlineColor, width: parseFloat(style.outlineWidth), halo: style.boxShadow };
  };
  const blue = [];
  for (const [route, field] of [['/exercises/preamble/', '[data-game-answer]'],
                                ['/textbook/formal-languages/', '[data-builder-atom]'],
                                ['/textbook/formal-languages/', '.logic-app__input'],
                                ['/textbook/glossary/', '#glossary-search']]) {
    await page.goto(route);
    const input = page.locator(field);
    await input.scrollIntoViewIfNeeded();
    if (await input.isDisabled()) await page.locator('.logic-app__edit').click();   // the parser's field
    await input.focus();
    blue.push({ field, ...await input.evaluate(ring) });
  }
  for (const got of blue) {
    expect(got.halo, `${got.field} still has a halo`).toBe('none');
    expect(got.width, `${got.field} ring is too thin`).toBeGreaterThanOrEqual(3);
    // --blue-ink, in whichever theme is active
    expect(['rgb(18, 99, 174)', 'rgb(78, 155, 224)'], `${got.field} is not blue`).toContain(got.colour);
  }

  await page.goto('/textbook/formal-languages/');
  const button = page.locator('[data-logic-app="parser"]').getByRole('button', { name: 'Last step', exact: true });
  await button.scrollIntoViewIfNeeded();
  await button.focus();
  const focus = await button.evaluate(ring);
  expect(focus.halo).toBe('none');
  expect(['rgb(18, 99, 174)', 'rgb(78, 155, 224)']).toContain(focus.colour);
});
