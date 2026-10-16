import { test, expect } from './fixtures.mjs';
import { budget } from './budget.mjs';
import { reviewScreenshot } from './review-screenshot.mjs';

const button = (root, name) => root.getByRole('button', { name, exact: true });
const overflow = el => ({ x: Math.max(0, el.scrollWidth - el.clientWidth), y: Math.max(0, el.scrollHeight - el.clientHeight) });
const slideFont = el => {
  const slide = el.closest('.slide');
  return parseFloat(getComputedStyle(el).fontSize) * el.getBoundingClientRect().width / el.offsetWidth
    / (slide.getBoundingClientRect().width / slide.offsetWidth);
};
async function open(page, deck, number) {
  await page.goto(`/slides/${deck}/#slide-${number}`);
  await expect(page.locator('[data-reveal-deck]')).toHaveAttribute('data-deck-ready', 'true');
  await page.evaluate(() => document.fonts.ready);
  const slide = page.locator(`#slide-${number}`);
  await expect(slide).toBeVisible();
  return slide;
}

test('lecture 9 countermodel keeps its explanation short and readable', { tag: '@mobile' }, async ({ page }, info) => {
  const slide = await open(page, 'fol-inference', 5), app = slide.locator('.fol-app');
  await button(page, 'Full screen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect(slide.locator('.slide__body > p').last()).toContainText('∀x (Human(x) → Mortal(x)), Mortal(Socrates) ⊭ Human(Socrates)');
  await expect(app).toHaveAttribute('data-kind', 'evaluate');
  await expect(app.locator('[data-formula]')).toHaveValue('((∀x (Human(x) → Mortal(x)) ∧ Mortal(Socrates)) ∧ ¬Human(Socrates))');
  await expect(app.locator('[data-calculation] > p')).toHaveText([
    '∀x (Human(x) → Mortal(x)): True', 'Mortal(Socrates): True', '¬Human(Socrates): True'
  ]);
  await expect(app.getByRole('group', { name: 'Calculation steps' })).toBeVisible();
  await expect(button(app, 'View')).toBeVisible();
  await expect(button(app, 'Check')).toBeVisible();
  await expect.poll(() => slide.evaluate(overflow)).toEqual({ x: 0, y: 0 });
  await expect.poll(() => app.locator('.fol-step-claim').first().evaluate(slideFont)).toBeGreaterThanOrEqual(20);
  await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath('countermodel.png') });
  await button(app, 'Edit formula').click();
  await app.getByLabel('Formula', { exact: true }).fill('∀x Human(x)');
  await button(app, 'Check').click();
  await expect(app.locator('[data-calculation]')).toContainText('Human(x): False');
  await button(app, 'Next step').click();
  await expect(app.locator('[data-calculation]')).toContainText('∀x Human(x): False');
  await expect(app.locator('[data-answer]')).toContainText('False in this model.');
  await page.goto('/textbook/fol-inference/');
  const chapter = page.getByRole('region', { name: 'A countermodel to the reversed Socrates inference', exact: true });
  await expect(chapter).toHaveAttribute('data-explanation', 'full');
  await expect(chapter.locator('[data-calculation]')).toContainText('The conditional passes: its antecedent is false or its consequent is true.');
});

test('lecture 10 switches between database initialization and NULL queries', { tag: '@mobile' }, async ({ page }, info) => {
  const slide = await open(page, 'many-valued', 4), app = slide.locator('.sql-app');
  await button(page, 'Full screen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  const run = async () => {
    await button(app, 'Run').click();
    await expect(app.locator('[data-sql-status]')).toHaveAttribute('data-state', 'success', { timeout: budget(15_000) });
  };
  const checkLayout = async view => {
    await expect.poll(() => slide.evaluate(overflow), `${view}: slide bounds`).toEqual({ x: 0, y: 0 });
    await expect.poll(() => app.locator('.chroma').evaluate(overflow), `${view}: all SQL is visible`).toEqual({ x: 0, y: 0 });
    const boxes = await app.evaluate(el => ({
      code: el.querySelector('.code-block').getBoundingClientRect().right,
      output: el.querySelector('.sql-output').getBoundingClientRect().left
    }));
    expect(boxes.output, JSON.stringify(boxes)).toBeGreaterThan(boxes.code);
    await expect.poll(() => app.locator('td').first().evaluate(slideFont)).toBeGreaterThanOrEqual(18);
    await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath(`sql-${view}.png`) });
  };
  await expect(button(app, 'Initialization')).toHaveAttribute('aria-pressed', 'true');
  await run();
  await expect(app.locator('tbody tr')).toHaveCount(6);
  await expect(app.locator('tr').filter({ hasText: 'Zimbabwe' }).locator('td')).toHaveText(['Zimbabwe', 'NULL']);
  await checkLayout('initialization');
  await run(); // Initialization must also work on a second run.
  await button(app, 'Query').focus(); await page.keyboard.press('Enter');
  await expect(app.locator('[data-sql-results]')).toBeEmpty();
  await expect(button(app, 'Query')).toHaveAttribute('aria-pressed', 'true');
  await run();
  await expect(app.locator('table')).toHaveCount(2);
  await expect(app.locator('table').first().locator('tbody td')).toHaveText(['Netherlands']);
  await expect(app.locator('table').last().locator('tbody td')).toHaveText(['US', 'Germany', 'Italy', 'Japan']);
  await checkLayout('query');
  for (const view of ['Initialization', 'Query']) {
    await button(app, view).click();
    const original = await app.locator('[data-sql-code]').textContent();
    await button(app, 'Edit SQL').click();
    await app.getByLabel('SQL', { exact: true }).fill('SELECT 42;');
    await button(app, 'Reset SQL').click();
    await expect(app.locator('[data-sql-code]')).toHaveText(original);
    await expect(app.locator('[data-sql-results]')).toBeEmpty();
    await run();
  }
});

test('lecture 10 presents every K3 rule variant beside the invalid rules', { tag: '@mobile' }, async ({ page }, info) => {
  const slide = await open(page, 'many-valued', 9), app = slide.locator('.nd-app');
  await button(page, 'Full screen').click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  for (const [name, count] of [['Assumption', 1], ['∧', 3], ['∨', 3], ['DN', 2], ['DeM', 4], ['Explosion', 1]]) {
    await button(app, name).click();
    for (let i = 0; i < count; i++) {
      await expect(app.locator('.nd-rules > .nd-tree')).toHaveCount(1);
      await expect.poll(() => slide.evaluate(overflow), `${name} variant ${i + 1}: slide bounds`).toEqual({ x: 0, y: 0 });
      await expect.poll(() => app.locator('.nd-rules').evaluate(overflow), `${name} variant ${i + 1}: rule bounds`).toEqual({ x: 0, y: 0 });
      await expect.poll(() => app.locator('.nd-formula').first().evaluate(slideFont), `${name} rule text`).toBeGreaterThanOrEqual(22);
      await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath(`rule-${name === '∨' ? 'or' : name === '∧' ? 'and' : name}-${i}.png`) });
      if (i < count - 1) await button(app, 'Next rule').click();
    }
    if (count > 1) {
      await expect(button(app, 'Next rule')).toBeDisabled();
      await button(app, 'Previous rule').focus(); await page.keyboard.press('Enter');
      await expect(app.locator('.nd-rule-navigation span')).toHaveText(`${count - 1} / ${count}`);
    }
  }
  const positions = await slide.evaluate(el => ({
    left: el.querySelector('.inference-rules').getBoundingClientRect().right,
    right: el.querySelector('.nd-app').getBoundingClientRect().left
  }));
  expect(positions.right, JSON.stringify(positions)).toBeGreaterThan(positions.left);
});

for (const [deck, number, ids] of [
  ['fol-inference', 18, ['switcheroo', 'universal', 'distribution', 'witness']],
  ['many-valued', 10, ['k3-ds', 'k3-negative', 'k3-dn', 'k3-demorgan', 'k3-swap', 'k3-mp', 'k3-negative-cases', 'k3-contraposition', 'k3-negative-disjunction']]
]) {
  test(`${deck}: chapter proof examples remain readable through every step`, { tag: '@mobile' }, async ({ page }, info) => {
    test.setTimeout(budget(60_000));
    const slide = await open(page, deck, number), app = slide.locator('.nd-app'), board = app.locator('.nd-board');
    await button(page, 'Full screen').click();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
    if (deck === 'fol-inference') await expect(app.locator('[aria-label="Examples"] [data-example]')).toHaveCount(ids.length);
    for (const id of ids) {
      if (deck === 'many-valued') {
        await button(app, ['k3-negative', 'k3-dn', 'k3-demorgan', 'k3-swap'].includes(id) ? 'Negation' : 'Cases').click();
      }
      await app.locator(`[aria-label="Examples"] [data-example="${id}"]`).click();
      await expect(app.locator(`[data-example="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
      while (await button(app, 'Next step').isEnabled()) {
        await button(app, 'Next step').click();
        await expect.poll(() => board.evaluate(overflow), `${id}: proof bounds`).toEqual({ x: 0, y: 0 });
        await expect.poll(() => slide.evaluate(overflow), `${id}: slide bounds`).toEqual({ x: 0, y: 0 });
      }
      await expect.poll(() => board.locator('.nd-formula').first().evaluate(slideFont), `${id}: final proof font in slide pixels`).toBeGreaterThanOrEqual(20);
      await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath(`${id}.png`) });
    }
  });
}
