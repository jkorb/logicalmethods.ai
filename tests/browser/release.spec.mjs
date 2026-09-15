import { test, expect, chapters } from './fixtures.mjs';

/* Staged publication is a temporary development state, not a permanent feature:
   a chapter carries `locked: true` in its front matter until it is released.
   These checks read that front matter instead of listing chapters, so releasing
   one needs no test edit. Once nothing is locked they assert an empty set and
   this file can be deleted along with the `locked` parameter itself. */

for (const section of ['textbook', 'exercises', 'slides']) {
  test(`${section}: locked chapters are listed but not linked`, async ({ page }) => {
    const all = await chapters(section);
    const locked = all.filter(chapter => chapter.locked);

    await page.goto(`/${section}/`);
    await expect(page.locator('.chapter-card.is-locked')).toHaveCount(locked.length);
    for (const { slug } of locked) {
      await expect(page.locator(`a.chapter-card[href="/${section}/${slug}/"]`)).toHaveCount(0);
    }
    for (const { slug } of all.filter(chapter => !chapter.locked)) {
      await expect(page.locator(`a.chapter-card[href="/${section}/${slug}/"]`)).toBeVisible();
    }
    if (!locked.length) return;

    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.chapter-card.is-locked').first()).toHaveCSS('border-top-style', 'dashed');
    // Locking hides the card; it is not access control, so the page still loads.
    const [{ slug, title }] = locked;
    expect((await page.goto(`/${section}/${slug}/`)).status()).toBe(200);
    await expect(page.locator('main')).toContainText(title.split(':').pop().trim());
  });
}

/* The glossary deliberately keeps terms whose chapter is still locked: the
   released notation appendix references them, and locking hides a chapter from
   the index without making it unreachable. `npm run check:site` already proves
   every glossary link and anchor resolves, so nothing is asserted here. */
