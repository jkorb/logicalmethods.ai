import { test, expect } from './fixtures.mjs';
import { reviewScreenshot } from './review-screenshot.mjs';

const button = (scope, name) => scope.getByRole('button', { name, exact: true });

for (const fullscreen of [false, true]) {
  test(`lecture 7 canvas supports proof search ${fullscreen ? 'in fullscreen' : 'on the page'}`, { tag: '@mobile' }, async ({ page }, info) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ colorScheme: fullscreen ? 'dark' : 'light' });
    await page.goto('/slides/proof/');
    await expect(page.locator('[data-reveal-deck]')).toHaveAttribute('data-deck-ready', 'true');
    await page.evaluate(() => document.fonts.ready);
    const app = page.locator('.deck-canvas [data-kind="canvas"]');
    await app.evaluate(el => { location.hash = el.closest('.slide').id; });
    await expect(app).toBeVisible();
    if (fullscreen) {
      await button(page, 'Full screen').click();
      await expect.poll(() => page.evaluate(() => document.fullscreenElement?.matches('[data-reveal-deck]'))).toBe(true);
    }
    const slide = page.locator('.slide:has([data-kind="canvas"])');
    await expect.poll(() => slide.evaluate(el => ({
      horizontal: Math.max(0, el.scrollWidth - el.clientWidth),
      vertical: Math.max(0, el.scrollHeight - el.clientHeight)
    }))).toEqual({ horizontal: 0, vertical: 0 });
    for (const name of ['Rules', 'Goal mode', 'Reset derivation', 'Fullscreen']) await expect(button(app, name)).toBeVisible();
    await expect(app.locator('[data-export-image]')).toBeHidden();

    const board = app.locator('.nd-board');
    await board.scrollIntoViewIfNeeded();
    // Compare rendered positions with actual mouse coordinates at both sides
    // of the scaled canvas, including Reveal's transform and the app's zoom.
    for (const fraction of [.2, .7]) {
      await expect.poll(async () => {
        const r = await board.boundingBox();
        const point = { x: r.x + r.width * fraction, y: r.y + r.height * .7 };
        await page.mouse.move(point.x, point.y);
        return app.evaluate((el, point) => {
          const area = el.querySelector('.nd-layout'), r = area.getBoundingClientRect();
          const cursor = el.querySelector('.nd-add-cursor'), c = cursor.getBoundingClientRect();
          if (cursor.hidden) return Infinity;
          return Math.max(Math.abs(c.left - point.x - 12 * r.width / area.offsetWidth),
            Math.abs(c.top - point.y - 8 * r.height / area.offsetHeight));
        }, point);
      }, 'cursor distance from the mouse, allowing its 12 × 8 canvas-pixel offset').toBeLessThan(1.5);
    }

    await button(app, 'Rules').click();
    const panel = app.locator('.nd-sidebar');
    const handle = panel.locator('.nd-drag-handle');
    const before = await panel.boundingBox(), grip = await handle.boundingBox();
    const dx = -before.width * .4;
    await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
    await page.mouse.down();
    await page.mouse.move(grip.x + grip.width / 2 + dx, grip.y + grip.height / 2);
    await page.mouse.up();
    const after = await panel.boundingBox();
    expect(after.x - before.x, JSON.stringify({ before, after, dx })).toBeCloseTo(dx, 0);
    await button(app, 'Close rules').click();

    await button(app, 'Goal mode').click();
    await expect(button(app, 'Goal mode')).toHaveAttribute('aria-pressed', 'true');
    const goal = app.locator('[data-goal="0:"]');
    await goal.click();
    await button(app, 'Rules').click();
    await expect(panel.locator('.nd-panel-heading')).toHaveText('Rules · backwards');
    await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath(`nd-search-${fullscreen ? 'fullscreen' : 'inline'}.png`) });
    await button(app, '∧ Intro').click();
    await expect(app.locator('.nd-hole')).toHaveCount(3);

    // A right-click on a subgoal opens the same backward rules at the mouse.
    const subgoal = app.locator('[data-goal="0:0"]');
    const target = await subgoal.boundingBox();
    const point = { x: target.x + target.width / 2, y: target.y + target.height / 2 };
    await page.mouse.click(point.x, point.y, { button: 'right' });
    const context = app.getByRole('group', { name: 'Applicable rules', exact: true });
    await expect(context).toBeVisible();
    const placement = await context.evaluate((el, point) => {
      const r = el.getBoundingClientRect(), area = el.parentElement.getBoundingClientRect();
      return { actual: { x: r.left, y: r.top }, expected: {
        x: Math.max(area.left, Math.min(point.x, area.right - r.width)),
        y: Math.max(area.top, Math.min(point.y, area.bottom - r.height))
      } };
    }, point);
    // contextmenu coordinates and layout dimensions round to CSS pixels.
    expect(Math.abs(placement.actual.x - placement.expected.x), JSON.stringify(placement)).toBeLessThan(1.5);
    expect(Math.abs(placement.actual.y - placement.expected.y), JSON.stringify(placement)).toBeLessThan(1.5);
    await button(context, '∧ Elim · right').click();
    await app.getByRole('textbox', { name: 'Other conjunct', exact: true }).fill('RAIN');
    await button(app.getByRole('dialog'), 'Apply').click();
    await expect(app.locator('[data-goal="0:0"]')).toHaveClass(/nd-solved/);

    // Finish forwards from the given premise, closing the remaining goal.
    await app.locator('[data-node="0"]').first().click();
    await button(app, 'Rules').click();
    await button(app, '∧ Elim · left').click();
    await expect(app.locator('.nd-status')).toContainText('Derivation complete');
    await expect(app.locator('[data-goal="0:"]')).toHaveClass(/nd-solved/);
    await button(app, 'Reset derivation').click();
    await expect(button(app, 'Goal mode')).toBeEnabled();
    await expect(app.locator('.nd-plan')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
