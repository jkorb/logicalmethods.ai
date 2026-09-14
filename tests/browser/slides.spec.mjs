import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ context }) => {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai', 'www.logicalmethods.ai'].includes(url.hostname)) {
      await route.fulfill({ response: await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` }) });
    } else if (url.hostname === '127.0.0.1') await route.continue();
    else await route.abort();
  });
});
for (const [slug, count] of [['logic-and-ai', 20]]) {
  test(`${slug}: all slides load locally and keyboard/clicker navigation works`, async ({ page }, info) => {
    const errors = []; const offsite = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (!['127.0.0.1', 'logicalmethods.ai', 'www.logicalmethods.ai'].includes(new URL(r.url()).hostname)) offsite.push(r.url()); });
    expect((await page.goto(`/slides/${slug}/`)).status()).toBe(200);
    const deck = page.locator('[data-slide-deck]');
    await expect(deck).toHaveAttribute('data-ready', 'true');
    await expect(page.locator('iframe, [data-embed]')).toHaveCount(0);
    await expect(deck.locator('[data-slide]')).toHaveCount(count);
    for (let i = 1; i <= count; i++) {
      await page.getByLabel('Go to slide').click();
      await page.locator(`[data-slide-choice="${i}"]`).click();
      const slide = deck.locator(`[data-slide="${i}"]`);
      await expect(slide).toBeVisible();
      await expect(slide.locator('img')).toHaveJSProperty('complete', true);
      expect(await slide.locator('img').evaluate(img => img.naturalWidth)).toBeGreaterThan(1000);
      expect(new URL(await slide.locator('img').getAttribute('src'), page.url()).origin).toBe(new URL(page.url()).origin);
    }
    await deck.focus(); await page.keyboard.press('Home');
    await expect(page.getByLabel('Previous slide')).toBeDisabled();
    await page.keyboard.press('PageDown'); await expect(page).toHaveURL(/#slide-2$/);
    await page.keyboard.press('ArrowRight'); await expect(page).toHaveURL(/#slide-3$/);
    await page.keyboard.press('PageUp'); await expect(page).toHaveURL(/#slide-2$/);
    await page.keyboard.press('Space'); await expect(page).toHaveURL(/#slide-3$/);
    await page.keyboard.press('Shift+Space'); await expect(page).toHaveURL(/#slide-2$/);
    await page.reload(); await expect(deck.locator('[data-slide="2"]')).toBeVisible();
    await deck.focus(); await page.keyboard.press('End');
    await expect(page.getByLabel('Next slide')).toBeDisabled();
    await page.getByLabel('Go to slide').click();
    await page.locator('[data-slide-choice="8"]').click();
    await deck.screenshot({ path: info.outputPath(`${slug}-viewer.png`) });
    expect(errors).toEqual([]); expect(offsite).toEqual([]);
  });
}
test('fullscreen, accessible controls, and narrow layout', async ({ page }, info) => {
  await page.goto('/slides/logic-and-ai/#slide-8');
  const deck = page.locator('[data-slide-deck]');
  await expect(deck.locator('[data-slide="8"]')).toBeVisible();
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    expect((await new AxeBuilder({ page }).include('.slide-deck').analyze()).violations).toEqual([]);
  }
  await page.getByRole('button', { name: 'Full screen', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.classList.contains('slide-deck'))).toBe(true);
  await page.keyboard.press('PageDown'); await expect(page).toHaveURL(/#slide-9$/);
  await page.screenshot({ path: info.outputPath("fullscreen.png") });
  await page.getByRole('button', { name: 'Exit full screen', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBeNull();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
});
test('no JavaScript leaves every slide and its text available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  // Shared site styles may still have production URLs; the slides must be local.
  await page.route('https://logicalmethods.ai/**', async route => {
    const url = new URL(route.request().url());
    await route.fulfill({ response: await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}` }) });
  });
  await page.goto('http://127.0.0.1:4173/slides/logic-and-ai/');
  await expect(page.locator('[data-slide]:visible')).toHaveCount(20);
  await expect(page.locator('[data-slide-controls]:visible')).toHaveCount(0);
  await page.locator('.slide-text summary').click();
  await expect(page.locator('#slide-text-20')).toBeVisible();
  await context.close();
});


test('unreviewed lecture decks remain outside the normal build', async ({ page, request }) => {
  for (const slug of ['formal-languages', 'valid-inference', 'boolean', 'sat', 'conditionals', 'proof', 'fol', 'fol-inference', 'many-valued', 'probability', 'anns']) {
    expect((await page.goto(`/slides/${slug}/`)).status()).toBe(200);
    await expect(page.locator('[data-slide-deck], iframe, [data-embed]')).toHaveCount(0);
    await expect(page.locator('main')).toContainText('awaiting content and image review');
    expect((await request.get(`/slides/${slug}/deck/slide-01.svg`)).status()).toBe(404);
  }
});


test('an authored deck description names its slides and replaces the extraction', async ({ page }) => {
  await page.goto('/slides/logic-and-ai/');
  const deck = page.locator('[data-slide-deck]');
  // Every slide image is named by a sentence, not by its navigation title.
  for (const number of [1, 12, 20]) {
    const image = deck.locator(`[data-slide="${number}"] img`);
    const alt = await image.getAttribute('alt');
    expect(alt.length).toBeGreaterThan(30);
    await expect(image).toHaveAttribute('aria-describedby', `slide-text-${number}`);
    await expect(page.locator(`#slide-text-${number}`)).toHaveClass(/slide-text__note/);
  }
  await expect(page.locator('.slide-text pre')).toHaveCount(0);
  await page.locator('.slide-text summary').click();
  // The drawings are described, not just the words printed on the slide.
  await expect(page.locator('#slide-text-6')).toContainText('circle');
  await expect(page.locator('#slide-text-15')).toContainText('timeline');

});
