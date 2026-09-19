import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';

test('set buttons preview, select and restore regions independently', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/textbook/valid-inference/');
  const diagrams = page.locator('[data-set-diagram]');
  await expect(diagrams).toHaveCount(4);
  const overlap = diagrams.nth(1);
  const intersection = overlap.getByRole('button', { name: 'Intersection', exact: true });
  await intersection.click();
  await page.mouse.move(0,0);
  await expect(intersection).toHaveAttribute('aria-pressed', 'true');
  await expect(overlap.locator('[data-region="intersection"]')).toBeVisible();
  await expect(overlap.locator('[data-point].is-selected')).toHaveCount(1);
  const difference = overlap.getByRole('button', { name: 'Is S ⊆ T?', exact: true });
  await difference.hover();
  await expect(overlap.locator('[data-point="a"]')).toHaveClass(/is-selected/);
  await page.mouse.move(0,0);
  await expect(intersection).toHaveAttribute('aria-pressed', 'true');
  await difference.focus(); await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(difference).toHaveAttribute('aria-pressed', 'true');
  const valid = diagrams.nth(2), invalid = diagrams.nth(3);
  for (const diagram of [valid, invalid]) {
    const premises = diagram.getByRole('button', { name: '[P] ∩ [Q]', exact: true });
    await premises.click();
    await expect(premises).toHaveAttribute('aria-pressed', 'true');
    await expect(diagram.locator('[data-region="premises"]')).toBeVisible();
  }
  await valid.getByRole('button', { name:'Countermodels', exact:true }).click();
  await expect(valid.locator('[data-explanation="countermodels"]')).toContainText('There is no countermodel');
  await expect(valid.locator('[data-point].is-selected')).toHaveCount(0);
  await invalid.getByRole('button', { name:'Countermodels', exact:true }).click();
  await expect(invalid.locator('[data-point="m2"]')).toHaveClass(/is-selected/);
  await expect(overlap.locator('[data-point="a"]')).toHaveClass(/is-selected/);
  expect(errors).toEqual([]);
});

test('authored paths agree with membership and nested diagrams have no escaping region', async ({ page }) => {
  await page.goto('/textbook/valid-inference/');
  const errors = await page.evaluate(() => {
    const errors = [];
    for (const root of document.querySelectorAll('[data-set-diagram]')) {
      const scene = JSON.parse(root.querySelector('[data-scene]').textContent);
      const inside = (id, x, y) => root.querySelector(`[id$="-shape-${id}"]`).isPointInFill(new DOMPoint(x,y));
      for (const point of scene.points) for (const set of scene.sets) {
        if (inside(set.id,point.x,point.y) !== point.sets.includes(set.id)) errors.push(`${scene.title}: ${point.id} in ${set.id}`);
      }
      const nested = scene.title === 'Every member comes along' ? ['S'] : scene.title.includes('valid consequence') ? scene.premises : null;
      const outer = scene.conclusion || 'T';
      if (nested) for (let x=20; x<580; x+=3) for (let y=20; y<340; y+=3) {
        if (nested.every(id => inside(id,x,y)) && !inside(outer,x,y)) { errors.push(`${scene.title}: contour escapes at ${x},${y}`); break; }
      }
    }
    return errors;
  });
  expect(errors).toEqual([]);
});
for (const theme of ['light', 'dark']) {
  test(`chapter 3 accessibility and reflow in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/textbook/valid-inference/');
    await page.evaluate(() => document.fonts.ready);
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
test('set diagrams remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/textbook/formal-languages/');
  const diagram = page.locator('[data-set-diagram]');
  await expect(diagram.locator('.set-diagram__canvas')).toBeVisible();
  await expect(diagram.locator('.set-diagram__controls')).toBeHidden();
  await diagram.getByText('Read the diagram as text').click();
  await expect(diagram.locator('details')).toContainText('Little Jimmy, beer, 1');
  await context.close();
});
