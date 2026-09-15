import { testPassword, useTestPassword } from './solution-password.mjs';
import { test, expect, routeToTestSite } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const chapter = '/textbook/formal-languages/';
test('parser walkthrough, backwards steps, changed input, and errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(chapter);
  const app = page.locator('[data-logic-app="parser"]');
  await expect(app).toHaveAttribute('data-mounted', 'true');
  await expect(app.getByLabel('Formula', { exact: true })).toHaveValue('((p ∧ q) → ¬r)');
  await expect(app.getByRole('button', { name: 'Previous step', exact: true })).toBeDisabled();
  await app.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('only binary operator');
  await app.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('∧ is the only binary operator');
  await app.getByRole('button', { name: 'Previous step', exact: true }).click();
  await expect(app.locator('.logic-app__tree svg text')).toHaveText(['?', '?', '→']);
  await app.getByRole('button', { name: 'Last step', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('Parsing finished: ((p ∧ q) → ¬r)');
  await app.getByRole('button', { name: 'Show tree as text', exact: true }).click();
  await expect(app.locator('.logic-app__text')).toContainText('p (complete)');
  await app.getByRole('button', { name: 'Edit formula', exact: true }).click();
  await app.getByLabel('Formula', { exact: true }).fill('(¬p ∧ q)');
  await expect(app.getByRole('status')).toContainText('Edit the formula');
  await expect(app.locator('.logic-app__tree svg')).toHaveCount(0);
  await app.getByRole('button', { name: 'Start parsing', exact: true }).click();
  await app.getByRole('button', { name: 'Last step', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('Parsing finished: (¬p ∧ q)');
  await app.getByRole('button', { name: 'Edit formula', exact: true }).click();
  await app.getByLabel('Formula', { exact: true }).fill('¬p ∧ q');
  await app.getByRole('button', { name: 'Start parsing', exact: true }).click();
  await app.getByRole('button', { name: 'Last step', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('Cannot parse');
  await expect(app.getByRole('status')).toContainText('outer brackets');
  await app.getByRole('button', { name: 'Edit formula', exact: true }).click();
  await app.getByLabel('Formula', { exact: true }).fill('<img src=x onerror=alert(1)>');
  await app.getByRole('button', { name: 'Start parsing', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('Unrecognized symbol');
  expect(errors).toEqual([]);
});
test('LaTeX conversion, keyboard controls, and frozen input', async ({ page }) => {
  await page.goto(chapter);
  const app = page.locator('[data-logic-app="parser"]');
  const input = app.getByLabel('Formula', { exact: true });
  await expect(input).toHaveAttribute('readonly', '');
  await app.getByRole('button', { name: 'Edit formula', exact: true }).click();
  await expect(input).not.toHaveAttribute('readonly', '');
  await input.fill(String.raw`\neg(p_1 \land q)`);
  await input.press('Enter');
  await expect(input).toHaveValue('¬(p₁ ∧ q)');
  await app.getByRole('button', { name: 'Next step', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(app.getByRole('status')).toContainText('begins with ¬');
  await app.getByRole('button', { name: 'Edit formula', exact: true }).click();
  await input.fill(String.raw`\neg `);
  await expect(input).toHaveValue('¬ ');
  await input.fill('p_{12}');
  await input.press('Tab');
  await expect(input).toHaveValue('p₁₂');
  await expect(app.getByRole('link', { name: 'LaTeX cheat sheet', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(app.getByRole('button', { name: 'Start parsing', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(input).toHaveAttribute('readonly', '');
});
test('conventional parser works inside the exercise solution', async ({ page }) => {
  await useTestPassword(page);
  await page.goto('/exercises/formal-languages/');
  const button = page.locator('[data-solution="conventional-grammarSolution"]');
  await button.click();
  await expect(page.locator('#passwordInput')).toBeFocused();
  await page.locator('#passwordInput').fill(testPassword);
  await page.locator('#passwordInput').press('Enter');
  await expect(page.locator('#passwordModal')).toBeHidden();
  const panel = page.locator('#conventional-grammarSolution');
  await expect(panel).toBeVisible();
  const app = panel.locator('[data-logic-app]');
  await app.getByRole('button', { name: 'Last step', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('Parsing finished: (¬p ∧ q)');
  await app.getByRole('button', { name: 'Edit formula', exact: true }).click();
  await app.getByLabel('Formula', { exact: true }).fill('p → q → r');
  await app.getByRole('button', { name: 'Start parsing', exact: true }).click();
  await app.getByRole('button', { name: 'Last step', exact: true }).click();
  await expect(app.getByRole('status')).toContainText('(p → (q → r))');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width + 1);
});
test('tree layout and accessibility in light and dark themes', async ({ page }, info) => {
  await page.goto(chapter);
  const app = page.locator('[data-logic-app="parser"]');
  await app.getByRole('button', { name: 'Last step', exact: true }).click();
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    const results = await new AxeBuilder({ page }).include('[data-logic-app="parser"]').analyze();
    expect(results.violations).toEqual([]);
    await app.screenshot({ style: '.site-header, .back-to-top { visibility: hidden !important; }', path: `tmp/content-review/formal-languages/${info.project.name}-${theme}-parser.png` });
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width + 1);
});
test('page without JavaScript retains the worked example and disabled app', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await routeToTestSite(context);
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173' + chapter);
  const app = page.locator('[data-logic-app="parser"]');
  await expect(app.getByLabel('Formula', { exact: true })).toBeDisabled();
  await expect(app.getByText('Enable JavaScript to step through the tree.', { exact: false })).toBeVisible();
  await expect(page.locator('#algorithms-and-pseudocode')).toBeVisible();
  await context.close();
});

test('two instances retain independent inputs and histories', async ({ page }) => {
  await page.goto('/textbook/tools/');
  const first = page.locator('[data-logic-app]').first();
  await expect(first).toHaveAttribute('data-mounted', 'true');
  const second = page.locator('[data-logic-app]').nth(1);
  await expect(second).toHaveAttribute('data-mounted', 'true');
  await second.getByRole('button', { name: 'Edit formula', exact: true }).click();
  await second.getByLabel('Formula', { exact: true }).fill('p ∧ q');
  await second.getByRole('button', { name: 'Start parsing', exact: true }).click();
  await second.getByRole('button', { name: 'Last step', exact: true }).click();
  await expect(second.getByRole('status')).toContainText('Parsing finished: (p ∧ q)');
  await expect(first.getByRole('status')).toContainText('Start with the whole formula');
  await expect(first.getByLabel('Formula', { exact: true })).toHaveValue('((p ∧ q) → ¬r)');
});


test('static ASTs, grammar solution, and notation appendix', async ({ page }, info) => {
  await page.goto(chapter);
  const comparison = page.locator('.ast-comparison');
  await expect(comparison.locator('figure')).toHaveCount(2);
  await comparison.scrollIntoViewIfNeeded();
  await comparison.screenshot({path: `tmp/content-review/formal-languages/${info.project.name}-static-trees.png`});
  const headings = await page.locator('main h2, main h3').allTextContents();
  const sections = ['Natural vs. formal languages', 'Sets', 'Formal languages', 'Propositional Languages', 'Parsing', 'Unique readability', 'Conventional notation'];
  let previous = -1;
  for (const title of sections) {
    const current = headings.findIndex(h => h.includes(title));
    expect(current).toBeGreaterThan(previous);
    previous = current;
  }
  await useTestPassword(page);
  await page.goto('/exercises/formal-languages/');
  await page.locator('[data-solution="parsingSolution"]').click();
  await page.locator('#passwordInput').fill(testPassword);
  await page.locator('#passwordInput').press('Enter');
  await expect(page.locator('#parsingSolution figure')).toHaveCount(4);
  await page.locator('#parsingSolution').screenshot({path: `tmp/content-review/formal-languages/${info.project.name}-exercise-trees.png`});
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width + 1);
  await page.goto('/textbook/notation/#latex-cheat-sheet');
  await expect(page.locator('#latex-cheat-sheet')).toBeVisible();
  await page.screenshot({path: `tmp/content-review/formal-languages/${info.project.name}-cheat-sheet.png`});
});


test('immediate conversion preserves longer commands and numeric subscripts', async ({ page }) => {
  await page.goto(chapter);
  const app = page.locator('[data-logic-app="parser"]');
  await app.getByRole('button', {name: 'Edit formula', exact: true}).click();
  const input = app.getByLabel('Formula', {exact: true});
  await input.fill('');
  await input.pressSequentially(String.raw`\neg(p_12 \land q)`);
  await expect(input).toHaveValue('¬(p₁₂ ∧ q)');
  await input.fill('');
  await input.pressSequentially(String.raw`\to`);
  await expect(input).toHaveValue('→');
  await input.pressSequentially('p');
  await expect(input).toHaveValue('⊤');
  await input.fill('');
  await input.pressSequentially(String.raw`\not\models`);
  await expect(input).toHaveValue('⊭');
});

test('formula labels preserve history and controls remain above the growing tree', async ({ page }, info) => {
  await page.goto(chapter);
  const app = page.locator('[data-logic-app="parser"]');
  const controls = app.locator('.logic-app__controls');
  await app.scrollIntoViewIfNeeded();
  const initial = (await controls.boundingBox()).y - (await app.boundingBox()).y;
  await app.getByRole('button', {name: 'Last step', exact: true}).click();
  const final = (await controls.boundingBox()).y - (await app.boundingBox()).y;
  expect(final).toBeCloseTo(initial, 0);
  await app.getByLabel('Show formulas at nodes', {exact: true}).check();
  await expect(app.locator('.logic-app__tree svg text').last()).toHaveText('((p ∧ q) → ¬r)');
  await app.screenshot({path: `tmp/content-review/formal-languages/revision-3/${info.project.name}-formula-labels.png`});
  await app.getByRole('button', {name: 'Previous step', exact: true}).click();
  await app.getByRole('button', {name: 'Show tree as text', exact: true}).click();
  await expect(app.locator('.logic-app__text')).toContainText('(p ∧ q)');
  await app.getByLabel('Show formulas at nodes', {exact: true}).uncheck();
  await expect(app.locator('.logic-app__text')).toContainText('→');
  const results = await new AxeBuilder({page}).include('[data-logic-app="parser"]').analyze();
  expect(results.violations).toEqual([]);
});


test('parser keeps tree and explanation side by side on smaller desktops', async ({ page }, testInfo) => {
  for (const width of [1024, 1366]) {
    await page.setViewportSize({ width, height: 768 });
    await page.goto(chapter);
    const app = page.locator('[data-logic-app="parser"]');
    await expect(app).toHaveAttribute('data-mounted', 'true');
    await app.getByRole('button', { name: 'Last step', exact: true }).click();
    const tree = await app.locator('.logic-app__tree').boundingBox();
    const explanation = await app.getByRole('status').boundingBox();
    expect(Math.abs(tree.y - explanation.y)).toBeLessThan(2);
    expect(tree.x + tree.width).toBeLessThanOrEqual(explanation.x);
    expect((await app.boundingBox()).height).toBeLessThan(680);
    await app.screenshot({ path: testInfo.outputPath(`parser-layout-${width}.png`) });
  }
});
