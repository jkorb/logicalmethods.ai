import { test, expect, chapters } from './fixtures.mjs';

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
  // Chapter navigation skips what is still locked, so take the neighbours from
  // the released chapters in weight order rather than naming three of them.
  const [previous, current, next] = (await chapters('textbook')).filter(chapter => !chapter.locked);
  await page.goto(`/textbook/${current.slug}/`);
  await expect(page.locator('.page-nav__link--prev')).toHaveAttribute('href', `/textbook/${previous.slug}/`);
  await expect(page.locator('.page-nav__link--next')).toHaveAttribute('href', `/textbook/${next.slug}/`);
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
