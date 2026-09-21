import { test, expect } from './fixtures.mjs';

for (const route of ['/', '/about/', '/textbook/', '/textbook/boolean/', '/exercises/',
                     '/exercises/logic-and-ai/', '/slides/logic-and-ai/']) {
  test(`every icon has a glyph: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const missing = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('[class*="bi-"]')) {
        const cls = [...el.classList].find(c => c.startsWith('bi-'));
        if (!cls) continue;
        const content = getComputedStyle(el, '::before').content;
        // no rule for this icon in the subset
        if (!content || content === 'none' || content === 'normal') out.push(cls);
      }
      return [...new Set(out)];
    });
    expect(missing, 'icons used on the page but absent from the subset').toEqual([]);
  });
}

/* Icons that only appear after an interaction cannot be found by scanning the
   built HTML. Subsetting the font once dropped bi-sun and bi-moon-stars, and
   the theme toggle rendered an empty box as soon as it was clicked. */
const ORDER = ['system', 'light', 'dark'];

test('the theme toggle keeps a visible icon in every state', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const toggle = page.locator('#theme-toggle');
  await expect(toggle).toBeVisible();

  const seen = [];
  for (let i = 0; i < 4; i++) {
    const state = await page.evaluate(() => {
      const el = document.querySelector('#theme-toggle i');
      const cs = getComputedStyle(el, '::before');
      const box = el.getBoundingClientRect();
      return {
        icon: [...el.classList].find(c => c.startsWith('bi-')),
        content: cs.content,
        label: document.querySelector('#theme-toggle').getAttribute('aria-label'),
        mode: document.querySelector('#theme-state').textContent.trim(),
        drawn: box.width > 0 && box.height > 0
      };
    });
    expect(state.content, `no glyph for ${state.icon}`).not.toBe('none');
    expect(state.content, `no glyph for ${state.icon}`).not.toBe('normal');
    expect(state.drawn, `${state.icon} renders at zero size`).toBe(true);
    expect(state.label).toBeTruthy();
    seen.push(state.icon);
    // The click handler applies the next mode synchronously and records it in
    // #theme-state, so wait for that rather than for a fixed number of
    // milliseconds: a loaded runner may repaint later than any sleep allows.
    const next = ORDER[(ORDER.indexOf(state.mode) + 1) % ORDER.length];
    await toggle.click();
    await expect(page.locator('#theme-state')).toHaveText(next);
  }
  // system -> light -> dark -> system
  expect(new Set(seen).size).toBe(3);
});

test('the toggle actually changes the theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const ground = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const before = await ground();
  await page.locator('#theme-toggle').click();   // light
  await page.locator('#theme-toggle').click();   // dark
  // Waiting on the attribute the toggle sets, rather than on a sleep, keeps the
  // assertion about the theme instead of about how fast the machine repaints.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(ground).not.toBe(before);
});
