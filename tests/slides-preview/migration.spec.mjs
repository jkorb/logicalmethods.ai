import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
for (let n = 1; n <= 12; n++) {
  test(`Lecture ${n}: complete local preview and contact sheet`, async ({ page }) => {
    const manifest = JSON.parse(await fs.readFile(`slides/lecture-${n}.json`));
    const slug = manifest.output.split('/').at(-2).toLowerCase();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('requestfailed', request => failures.push(request.url()));
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    expect((await page.goto(`/slides/${slug}/`)).status()).toBe(200);
    const deck = page.locator('[data-slide-deck]');
    await expect(deck).toHaveAttribute('data-ready', 'true');
    await expect(deck.locator('[data-slide]')).toHaveCount(manifest.slides.length);
    await expect(page.locator('iframe')).toHaveCount(0);
    for (let i = 1; i <= manifest.slides.length; i++) {
      await deck.locator('[data-slide-menu] summary').click();
      await deck.locator(`[data-slide-choice="${i}"]`).click();
      const image = deck.locator(`[data-slide="${i}"] img`);
      await expect(image).toBeVisible();
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    }
    if (n === 7) await expect(deck.locator('.slide-deck__links a')).toHaveCount(4);
    await deck.getByRole('button', { name: 'Full screen', exact: true }).click();
    await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
    await page.keyboard.press('Home');
    await expect(deck.locator('[data-slide="1"]')).toBeVisible();
    await deck.getByRole('button', { name: 'Exit full screen', exact: true }).click();
    const images = await deck.locator('[data-slide] img').evaluateAll(images => images.map(img => ({ src: img.src, alt: img.alt })));
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.evaluate(images => {
      document.body.replaceChildren();
      document.body.className = "";
      Object.assign(document.body.style, { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', padding: '12px', background: '#eee' });
      images.forEach((image, i) => { const figure = document.createElement('figure'); figure.style.margin = '0'; const img = new Image(); img.src = image.src; img.style.width = '100%'; const caption = document.createElement('figcaption'); caption.textContent = `${i + 1}. ${image.alt}`; figure.append(img, caption); document.body.append(figure); });
    }, images);
    await page.evaluate(() => Promise.all([...document.images].map(img => img.decode())));
    await page.screenshot({ path: `tmp/slides-review/lecture-${n}-migration.png`, fullPage: true });
    expect(failures).toEqual([]);
  });
}
