import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import { LEVELS } from '../../assets/js/apps/formula-builder.js';

const builder = page => ({
  app: page.locator('.builder'),
  board: page.locator('[data-builder-board]'),
  goal: page.locator('[data-builder-goal]'),
  atom: page.locator('[data-builder-atom]'),
  add: page.getByRole('button', { name: 'Add', exact: true }),
  undo: page.getByRole('button', { name: 'Undo the last step' }),
  clear: page.getByRole('button', { name: 'Clear the board' }),
  status: page.locator('.builder__status'),
  op: name => page.getByRole('button', { name: new RegExp(`^${name},`) }),
  /* only unbuilt formulas are selectable, so the buttons are the board's roots.
     The match has to be exact: "p₁" is a substring of "(p₁ ∧ p₃)". */
  node: label => page.getByRole('button', { name: label, exact: true }),
  used: label => page.locator('.builder__node.is-used').filter({ hasText: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) })
});

async function addAtom({ atom, add }, label) {
  await atom.fill(label);
  await add.click();
}
async function combine(parts, operator, labels) {
  for (const label of labels) await parts.node(label).first().click();
  await parts.op(operator).click();
}

test('the chapter builder constructs its formula and refuses anything else', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');
  const parts = builder(page);
  await parts.app.scrollIntoViewIfNeeded();
  await expect(parts.goal).toHaveText('((p₁ ∧ p₃) → ¬p₂)');
  await expect(parts.board).toHaveAttribute('data-empty', 'true');
  // the field is driven by its data hook above, so check the label here
  expect(await parts.atom.evaluate(el =>
    el.labels?.[0]?.textContent.trim() || el.getAttribute('aria-label') || '')).not.toBe('');

  // an atom is the only way in, and it has to be one of the language's atoms
  await addAtom(parts, 'zzz');
  await expect(parts.status).toContainText('is not an atom');
  await expect(parts.board).toHaveAttribute('data-empty', 'true');

  await addAtom(parts, 'p_1');           // the field converts LaTeX, as elsewhere
  await expect(parts.node('p₁')).toBeVisible();
  await addAtom(parts, 'p₃');
  await addAtom(parts, 'p₂');

  // an operator needs the right number of formulas selected
  await expect(parts.op('Conjunction')).toBeDisabled();
  await parts.node('p₁').click();
  await expect(parts.op('Conjunction')).toBeDisabled();
  await expect(parts.op('Negation')).toBeEnabled();
  await parts.node('p₃').click();
  await expect(parts.op('Negation')).toBeDisabled();
  await parts.op('Conjunction').click();
  await expect(parts.node('(p₁ ∧ p₃)')).toBeVisible();

  // the parts are spent: they are no longer selectable
  await expect(parts.node('p₁')).toHaveCount(0);
  await expect(parts.used('p₁')).toHaveCount(1);

  await combine(parts, 'Negation', ['p₂']);
  await combine(parts, 'Conditional', ['(p₁ ∧ p₃)', '¬p₂']);
  await expect(parts.goal).toHaveAttribute('data-state', 'done');
  await expect(parts.status).toContainText('built exactly as the definition allows');
});

test('order of selection decides which side a formula lands on', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');
  const parts = builder(page);
  await parts.app.scrollIntoViewIfNeeded();
  await addAtom(parts, 'p');
  await addAtom(parts, 'q');
  await combine(parts, 'Conditional', ['q', 'p']);
  await expect(parts.node('(q → p)')).toBeVisible();

  await parts.undo.click();
  await expect(parts.node('(q → p)')).toHaveCount(0);
  await expect(parts.node('p')).toBeVisible();      // the parts come back
  await combine(parts, 'Conditional', ['p', 'q']);
  await expect(parts.node('(p → q)')).toBeVisible();

  await parts.clear.click();
  await expect(parts.board).toHaveAttribute('data-empty', 'true');
  await expect(parts.undo).toBeDisabled();
});

test('the exercise builder runs twelve levels and remembers what is done', async ({ page }) => {
  await page.goto('/exercises/formal-languages/');
  const parts = builder(page);
  await parts.app.scrollIntoViewIfNeeded();
  const levels = page.locator('.builder__level');
  await expect(levels).toHaveCount(LEVELS.length);
  expect(LEVELS.length).toBeGreaterThanOrEqual(10);

  await expect(parts.goal).toHaveText(LEVELS[0]);
  await addAtom(parts, 'p');
  await combine(parts, 'Negation', ['p']);
  await expect(parts.goal).toHaveAttribute('data-state', 'done');
  await expect(levels.first()).toHaveAttribute('data-done', 'true');

  // picking a level clears the board and sets the new target
  await levels.nth(4).click();
  await expect(parts.goal).toHaveText(LEVELS[4]);
  await expect(parts.board).toHaveAttribute('data-empty', 'true');
  await expect(levels.nth(4)).toHaveAttribute('aria-current', 'true');

  await page.reload();
  await expect(page.locator('.builder__level').first()).toHaveAttribute('data-done', 'true');
});

test('the builder is reachable by keyboard and has no WCAG violations', async ({ page }) => {
  await page.goto('/textbook/formal-languages/');
  const parts = builder(page);
  await parts.app.scrollIntoViewIfNeeded();
  await addAtom(parts, 'p');
  await addAtom(parts, 'q');

  // a formula on the board is a real button: focus it and press it
  await parts.node('p').focus();
  await page.keyboard.press('Enter');
  await expect(parts.node('p')).toHaveAttribute('aria-pressed', 'true');
  await parts.node('q').focus();
  await page.keyboard.press('Space');
  await parts.op('Disjunction').click();
  await expect(parts.node('(p ∨ q)')).toBeVisible();

  const { violations } = await new AxeBuilder({ page }).include('.builder')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
});

test('without JavaScript the builder is inert and says so', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/textbook/formal-languages/');
  await expect(page.locator('[data-builder-atom]')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
  await expect(page.locator('.builder [data-app-fallback]')).toContainText('Enable JavaScript');
  await context.close();
});
