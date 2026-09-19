import { test, expect } from './fixtures.mjs';
import { readFile } from 'node:fs/promises';

for (const [path, selector] of [
  ['/textbook/boolean/', '[data-preset="full"]'],
  ['/textbook/formal-languages/', '[data-logic-app="parser"]'],
  ['/textbook/formal-languages/', '[data-logic-app="builder"]'],
  ['/exercises/formal-languages/', '[data-logic-app="shunting-yard"]'],
  ['/exercises/boolean/', '[data-preset="relays"]'],
  ['/exercises/boolean/', '[data-kind="model-exercise"][data-variables="3"]'],
]) test(`PNG captures current app state: ${selector}`, async ({ page }, info) => {
  await page.goto(path);
  const app = page.locator(selector).first();
  await app.evaluate(n => { for (let p = n.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true; });
  if (selector.includes('relays')) {
    await app.locator('[data-add="RELAY-OFF"]').click();
    await app.locator('[data-check]').click();
    await expect(app.locator('[data-check-result]')).toHaveAttribute('data-feedback', 'incorrect');
    await expect(app.getByRole('status')).not.toContainText('incorrect');
    await expect(app.locator('[data-check-message]')).toContainText('Connect every');
    expect(await app.locator('svg.boolean-circuit').evaluate(n => n.viewBox.baseVal.height)).toBeGreaterThanOrEqual(760);
  }
  if (selector.includes('model-exercise')) await app.locator('button[data-model]').first().click();
  const download = page.waitForEvent('download');
  await app.getByRole('button', { name: 'Download PNG', exact: true }).click();
  const file = await download;
  const filename = info.outputPath('app.png');
  await file.saveAs(filename);
  const bytes = await readFile(filename);
  expect(bytes.subarray(1, 4).toString()).toBe('PNG');
  const image = await page.evaluate(async data => {
    const img = new Image(); img.src = data; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
    const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
    let ink = 0, green = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] && Math.min(pixels[i], pixels[i+1], pixels[i+2]) < 150) ink++;
      if (pixels[i+1] > pixels[i] * 1.3 && pixels[i+1] > pixels[i+2] * 1.1) green++;
    }
    return { width: img.width, height: img.height, ink, green };
  }, `data:image/png;base64,${bytes.toString('base64')}`);
  expect(image.width).toBeGreaterThan(250);
  if (selector.includes('relays')) {
    const box=await app.locator('[data-picture]').boundingBox();
    expect(Math.abs(image.height-box.height*2)).toBeLessThan(5);
  }
  expect(image.height).toBeGreaterThan(250);
  expect(image.ink).toBeGreaterThan(1000);
  if (/relays|full/.test(selector)) expect(image.green).toBeGreaterThan(30);
  await expect(app.locator('.logic-app__export-notice')).toHaveText('PNG downloaded.');
});
