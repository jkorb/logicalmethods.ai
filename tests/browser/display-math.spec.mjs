import { test, expect } from '@playwright/test';

test.beforeEach(async ({context}) => {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai','www.logicalmethods.ai'].includes(url.hostname)) await route.fulfill({response: await route.fetch({url: `http://127.0.0.1:4173${url.pathname}${url.search}`})});
    else if (url.hostname === '127.0.0.1') await route.continue();
    else await route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>External content stub</title>'});
  });
});

test('displays trim boundary lines, fit smaller columns and regain their size', async ({page}) => {
  await page.goto('/textbook/formal-languages/');
  await page.evaluate(() => document.fonts.ready);
  const displays = page.locator('.math-display');
  expect(await displays.count()).toBeGreaterThan(5);
  const originals = await displays.locator(':scope > .math-content').allTextContents();
  originals.forEach(text => expect(text).toBe(text.trim()));
  const overflow = async () => displays.evaluateAll(blocks => blocks
    .map((block, index) => ({ index, width: block.clientWidth, scrollWidth: block.scrollWidth,
      text: block.textContent.trim() }))
    .filter(block => block.scrollWidth > block.width + 1));
  const applied = async () => displays.evaluateAll(blocks => blocks.map(block => parseFloat(getComputedStyle(block.firstElementChild).fontSize)));
  const settle = async width => {
    await page.setViewportSize({width,height:1000});
    await expect.poll(overflow).toEqual([]);
  };

  await settle(1440);
  const wide = await applied();
  /* Not every display fits a desktop column at full size — the longest lines
     here are shrunk even at 1440 — so what is checked is that the width alone
     decides the size, not the order the widths were seen in. */
  for (const width of [390, 320]) await settle(width);
  const narrow = await applied();
  expect(narrow.some((size,i) => size < wide[i]), 'nothing shrank on a phone').toBe(true);
  expect(narrow.every((size,i) => size <= wide[i] + 0.05), 'a display grew as the column narrowed').toBe(true);

  await settle(1440);
  (await applied()).forEach((size,i) => expect(size, `display ${i} did not regain its size`).toBeCloseTo(wide[i],1));
  expect(await displays.locator(':scope > .math-content').allTextContents()).toEqual(originals);
  const source = page.locator('pre code').first();
  await expect(source).toBeVisible();
  expect(await source.evaluate(el => el.style.fontSize)).toBe('');
});

test('sets match display scale and accessibility control is at the lower right', async ({page}, info) => {
  await page.goto('/textbook/formal-languages/');
  await page.evaluate(() => document.fonts.ready);
  const set = page.locator('.set-figure');
  const sizes = await set.evaluate(el => ({font:parseFloat(getComputedStyle(el).fontSize),image:el.querySelector('svg').getBoundingClientRect().height,brace:parseFloat(getComputedStyle(el.querySelector('.math-set__brace')).fontSize)}));
  expect(sizes.image / sizes.font).toBeLessThan(1.8);
  expect(sizes.brace / sizes.font).toBeLessThan(1.6);
  await set.screenshot({path:info.outputPath('set.png')});
  const app = page.locator('[data-logic-app="parser"]');
  await app.scrollIntoViewIfNeeded();
  const box = await app.boundingBox();
  const button = await app.getByRole('button',{name:'Show tree as text',exact:true}).boundingBox();
  expect(box.y+box.height-button.y-button.height).toBeLessThan(12);
  expect(box.x+box.width-button.x-button.width).toBeLessThan(12);
  await app.getByRole('button',{name:'Show tree as text',exact:true}).click();
  await expect(app.locator('.logic-app__text')).toBeVisible();
});

test('display fitting remeasures text whose spacing does not scale with its font', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');
  await page.evaluate(() => document.fonts.ready);
  // Fixed letter spacing models the part of a measured run that is not
  // proportional to font size; one proportional resize cannot fit it.
  const display = page.locator('.math-display').first();
  await display.evaluate(block => {
    block.style.width = '250px';
    const inner = block.firstElementChild;
    inner.textContent = 'p₁ ∧ p₂ ∧ p₃ ∧ p₄ ∧ p₅ ∧ p₆ ∧ p₇';
    inner.style.letterSpacing = '1px';
    window.dispatchEvent(new Event('resize'));
  });
  await expect.poll(() => display.evaluate(block => block.scrollWidth - block.clientWidth)).toBeLessThanOrEqual(1);
  const small = await display.locator('.math-content').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  await display.evaluate(block => { block.style.width = '700px'; window.dispatchEvent(new Event('resize')); });
  await expect.poll(() => display.locator('.math-content').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(small);
});
