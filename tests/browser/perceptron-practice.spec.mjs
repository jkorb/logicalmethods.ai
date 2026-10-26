import {test, expect, TEST_ORIGIN} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import {createHash} from 'node:crypto';
import {testPassword} from './solution-password.mjs';
import {reviewScreenshot} from './review-screenshot.mjs';

const construction = page => page.getByRole('region', {name: 'Implementing truth-functions', exact: true});
const mystery = page => page.getByRole('region', {name: 'Identifying and rebuilding black-box functions', exact: true});
async function recordRows(root, arity) {
  for (let index = 0; index < 2 ** arity; index++) {
    for (const [i, name] of ['P', 'Q', 'R'].slice(0, arity).entries()) {
      const input = root.getByRole('button', {name: `Toggle ${name}`, exact: true});
      const value = (index >> (arity - i - 1)) & 1;
      if (await input.getAttribute('aria-pressed') !== String(Boolean(value))) await input.click();
    }
    await root.getByRole('button', {name: 'Test input', exact: true}).click();
  }
}
async function parameters(root, network, arity = 2) {
  if (!network.hidden) {
    for (const [i, name] of ['P', 'Q', 'R'].slice(0, arity).entries()) {
      const label = arity === 2 ? `Weight w${['₁', '₂'][i]}` : `Weight ${name}`;
      await root.getByLabel(label, {exact: true}).fill(String(network.weights[i]));
    }
    await root.getByLabel('Bias b', {exact: true}).fill(String(network.bias));
  } else {
    for (const [j, unit] of network.hidden.entries()) {
      for (const [i, name] of ['P', 'Q', 'R'].slice(0, arity).entries()) await root.getByLabel(`Weight from ${name} to h${j + 1}`, {exact: true}).fill(String(unit.weights[i]));
      await root.getByLabel(`Bias of h${j + 1}`, {exact: true}).fill(String(unit.bias));
      await root.getByLabel(`Weight from h${j + 1} to y`, {exact: true}).fill(String(network.output.weights[j]));
    }
    await root.getByLabel('Bias of y', {exact: true}).fill(String(network.output.bias));
  }
}
test.beforeEach(async ({page}) => {
  await page.goto('/exercises/neural-networks/');
  await expect(page.locator('.perceptron-app[data-mounted="true"]')).toHaveCount(3);
});

test('construction requires all rows and parameter edits invalidate observations and completion', {tag: '@mobile'}, async ({page}) => {
  const root = construction(page);
  await expect(root.locator('[data-output]')).toHaveText(['?', '?', '?', '?']);
  await root.getByRole('button', {name: 'Check', exact: true}).click();
  await expect(root.getByRole('status')).toHaveText('Test all 4 inputs first.');
  await recordRows(root, 2);
  await root.getByRole('button', {name: 'Check', exact: true}).click();
  await expect(root.getByRole('status')).toContainText('f requires 1');
  await parameters(root, {weights: [-1, -1], bias: 1.5});
  await expect(root.locator('[data-output]')).toHaveText(['?', '?', '?', '?']);
  await recordRows(root, 2);
  await root.getByRole('button', {name: 'Check', exact: true}).click();
  await expect(root.getByRole('status')).toHaveText('Correct: every output matches.');
  await expect(root.getByRole('button', {name: 'NAND ✓', exact: true})).toBeVisible();
  const bias = root.getByLabel('Bias b', {exact: true});
  await bias.fill('');
  await expect(bias).toBeFocused();
  await expect(root.getByRole('status')).toContainText('finite number');
  await root.getByRole('button', {name: 'Test input', exact: true}).click();
  await expect(root.getByRole('status')).toContainText('finite number');
  await bias.fill('1');
  await expect(root.locator('[data-output]')).toHaveText(['?', '?', '?', '?']);
  await expect(root.getByRole('button', {name: 'NAND', exact: true})).toBeVisible();
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(bias).toHaveValue('0');
  await expect(mystery(page).locator('[data-output]')).toHaveText(['?', '?', '?', '?']);
});

test('the two-input and three-input levels accept the worked network solutions', {tag: '@mobile'}, async ({page}) => {
  const root = construction(page);
  for (const [label, arity, network] of [
    ['NOR', 2, {weights: [-1, -1], bias: 0.5}],
    ['ANDNOT', 2, {weights: [1, -1], bias: -0.5}],
    ['Majority', 3, {weights: [1, 1, 1], bias: -1.5}],
    ['Exactly one', 3, {hidden: [{weights: [1, 1, 1], bias: -0.5}, {weights: [1, 1, 1], bias: -1.5}], output: {weights: [1, -1], bias: -0.5}}],
  ]) {
    await root.getByRole('button', {name: label, exact: true}).click();
    await expect(root.locator('[data-output]')).toHaveText(Array(2 ** arity).fill('?'));
    await parameters(root, network, arity);
    await recordRows(root, arity);
    await root.getByRole('button', {name: 'Check', exact: true}).click();
    await expect(root.getByRole('status')).toHaveText('Correct: every output matches.');
  }
  await root.getByRole('button', {name: 'NOR ✓', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['1', '0', '0', '0']);
  await expect(root.getByLabel('Weight w₁', {exact: true})).toHaveValue('-1');
  await expect(root.getByRole('status')).toHaveText('Correct: every output matches.');
  await root.getByRole('button', {name: 'NOR ✓', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['1', '0', '0', '0']);
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['?', '?', '?', '?']);
  await root.getByRole('button', {name: 'ANDNOT ✓', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['0', '0', '1', '0']);
});

test('black boxes reveal queried rows and accept equivalent formulas without showing an answer', {tag: '@mobile'}, async ({page}) => {
  const root = mystery(page), answer = root.getByRole('textbox', {name: 'Your formula', exact: true});
  await root.getByRole('button', {name: 'Test input', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['1', '?', '?', '?']);
  await answer.fill('¬(P ∨ Q)');
  await root.getByRole('button', {name: 'Check', exact: true}).click();
  await expect(root.getByRole('status')).toHaveText('Test all 4 inputs first.');
  await recordRows(root, 2);
  await answer.fill('P'); await answer.press('Enter');
  await expect(root.getByRole('status')).toContainText('P = 0, Q = 0');
  await answer.fill('R'); await answer.press('Enter');
  await expect(root.getByRole('status')).toHaveText('Use only P, Q as atoms.');
  await answer.fill('('); await answer.press('Enter');
  await expect(root).toHaveAttribute('data-feedback', 'incorrect');
  await answer.fill('\\neg(P \\lor Q)'); await answer.press('Enter');
  await expect(root.getByRole('status')).toHaveText('Correct: your formula agrees with every input.');
  await expect(root.locator('[data-rules], [data-equivalence]')).toHaveCount(0);
  await answer.fill('P');
  await expect(root.getByRole('button', {name: '1', exact: true})).toBeVisible();
  for (const [label, arity, formula] of [['2', 2, '¬P ∨ Q'], ['3', 3, '(P ∧ Q) ∨ (P ∧ R) ∨ (Q ∧ R)'], ['4', 3, 'R ∧ (P ↔ Q)']]) {
    await root.getByRole('button', {name: label, exact: true}).click();
    await expect(answer).toHaveValue('');
    await expect(root.locator('[data-output]')).toHaveText(Array(2 ** arity).fill('?'));
    await recordRows(root, arity); await answer.fill(formula); await answer.press('Enter');
    await expect(root.getByRole('status')).toHaveText('Correct: your formula agrees with every input.');
  }
});

test('all three written solutions open and the advanced problem is removed', {tag: '@mobile'}, async ({page}, info) => {
  // This checkout may use its own test origin; replace only the served hashes.
  await page.route(/\/js\/exercises[^/]*\.js(?:\?.*)?$/, async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({url: `${TEST_ORIGIN}${url.pathname}${url.search}`});
    const hash = createHash('sha256').update(testPassword).digest('hex');
    await route.fulfill({response, body: (await response.text()).replace(/"[a-f0-9]{64}"/g, `"${hash}"`)});
  });
  await page.reload();
  await expect(page.locator('.btn-solution')).toHaveCount(3);
  await expect(page.getByRole('heading', {name: /Advanced|sigmoid/})).toHaveCount(0);
  for (const [i, id] of ['implementations', 'separability', 'black-boxes'].entries()) {
    await page.locator(`[data-solution="${id}Solution"]`).click();
    if (!i) {
      const password = page.locator('#passwordInput');
      await expect(password).toBeFocused();
      await password.fill(testPassword); await password.press('Enter');
      await expect(page.locator('#passwordModal')).toBeHidden();
    }
    await expect(page.locator(`#${id}Solution`)).toBeVisible();
  }
  await expect(page.locator('#black-boxesSolution')).toContainText('The first hidden unit fires only on');
  await expect(page.locator('.prose')).not.toContainText('$$');
  await reviewScreenshot(page.locator('#black-boxesSolution'), {path: `tmp/neural-exercises-review/rebuilding-solution-${info.project.name}.png`, style: 'header { visibility: hidden; }'});
});

for (const theme of ['light', 'dark']) test(`exercise apps fit and remain accessible in ${theme}`, {tag: '@mobile'}, async ({page}, info) => {
  await page.evaluate(value => document.documentElement.setAttribute('data-theme', value), theme);
  await construction(page).getByRole('button', {name: 'Exactly one', exact: true}).click();
  await mystery(page).getByRole('button', {name: '4', exact: true}).click();
  await recordRows(mystery(page), 3);
  const spatial = separation(page);
  await spatial.getByRole('button', {name: 'Majority', exact: true}).click();
  await markPoints(spatial, [0, 0, 0, 1, 0, 1, 1, 1]);
  await setRange(spatial, 'Bias', -1.5);
  expect((await new AxeBuilder({page}).include('main').analyze()).violations.map(v => ({id: v.id, nodes: v.nodes.map(n => n.html)}))).toEqual([]);
  const geometry = await page.evaluate(() => ({width: innerWidth, scroll: document.documentElement.scrollWidth, apps: [...document.querySelectorAll('.perceptron-app')].map(el => ({width: el.clientWidth, scroll: el.scrollWidth}))}));
  expect(geometry.scroll, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.width + 1);
  for (const app of geometry.apps) expect(app.scroll, JSON.stringify(app)).toBeLessThanOrEqual(app.width + 1);
  await reviewScreenshot(construction(page), {path: `tmp/neural-exercises-review/construction-${theme}-${info.project.name}.png`});
  await reviewScreenshot(mystery(page), {path: `tmp/neural-exercises-review/blackbox-${theme}-${info.project.name}.png`});
  await reviewScreenshot(spatial, {path: `tmp/neural-exercises-review/separation-${theme}-${info.project.name}.png`});
});

const separation = page => page.getByRole('region', {name: 'Plotting and separating truth-functions', exact: true});
async function markPoints(root, values) {
  for (const [i, value] of values.entries()) {
    const point = root.locator(`[data-point="${i}"]`);
    await point.click();
    if (value) await point.click();
  }
  await root.getByRole('button', {name: 'Check points', exact: true}).click();
}
async function setRange(root, name, value) {
  await root.getByRole('slider', {name, exact: true}).evaluate((el, value) => {el.value = value; el.dispatchEvent(new Event('input', {bubbles: true}));}, String(value));
}

test('separation mixes new two-input tables and keeps partial and completed work across levels', {tag: '@mobile'}, async ({page}) => {
  const root = separation(page);
  await root.locator('[data-point="0"]').click();
  for (const [name, values, weights, bias] of [
    ['Table A', [0,0,1,1], [1,0], -0.5],
    ['Table B', [0,1,1,0], null, null],
    ['Table C', [1,0,1,1], [1,-1], 0.5],
  ]) {
    await root.getByRole('button', {name, exact: true}).click();
    await markPoints(root, values);
    if (weights) {
      await root.getByRole('spinbutton', {name: 'Weight P', exact: true}).fill(String(weights[0]));
      await root.getByRole('spinbutton', {name: 'Weight Q', exact: true}).fill(String(weights[1]));
      await root.getByRole('spinbutton', {name: 'Bias', exact: true}).fill(String(bias));
    }
    await root.getByRole('button', {name: weights ? 'Check separator' : 'Not separable', exact: true}).click();
    await expect(root.getByRole('button', {name: `${name} ✓`, exact: true})).toBeVisible();
  }
  await root.getByRole('button', {name: 'Table A ✓', exact: true}).click();
  await expect(root.getByRole('spinbutton', {name: 'Bias', exact: true})).toHaveValue('-0.5');
  await expect(root.locator('[data-mark]')).toHaveText(['0','0','1','1']);
  await expect(root.getByRole('status')).toHaveText('Correct: this line separates the two values.');
  await root.getByRole('button', {name: 'Table A ✓', exact: true}).click();
  await expect(root.locator('[data-mark]')).toHaveText(['0','0','1','1']);
  await root.getByRole('button', {name: 'NAND', exact: true}).click();
  await expect(root.locator('[data-mark]')).toHaveText(['0','?','?','?']);
  await expect(root.getByRole('button', {name: 'Check separator', exact: true})).toBeHidden();
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.locator('[data-mark]')).toHaveText(['?','?','?','?']);
  await root.getByRole('button', {name: 'Table B ✓', exact: true}).click();
  await expect(root.locator('[data-mark]')).toHaveText(['0','1','1','0']);
  await expect(root.getByRole('status')).toContainText('not linearly separable');
});

test('points must match the table before trying a separator; keyboard marking and reset work', {tag: '@mobile'}, async ({page}, info) => {
  const root = separation(page), check = root.getByRole('button', {name: 'Check points', exact: true});
  await expect(root.getByRole('button', {name: 'Check separator', exact: true})).toBeHidden();
  await check.click(); await expect(root.getByRole('status')).toContainText('every point');
  for (let i = 0; i < 4; i++) await root.locator(`[data-point="${i}"]`).click();
  await check.click(); await expect(root.getByRole('status')).toContainText('point (0, 0)');
  for (let i = 0; i < 3; i++) {
    const point = root.locator(`[data-point="${i}"]`);
    await point.focus(); await point.press('Space'); await expect(point).toBeFocused();
    await expect(point).toHaveAttribute('data-value', '1');
  }
  await check.click();
  await root.getByRole('button', {name: 'Not separable', exact: true}).click();
  await expect(root.getByRole('status')).toContainText('separator exists');
  await setRange(root, 'Weight P', -1); await setRange(root, 'Weight Q', -1); await setRange(root, 'Bias', 1.5);
  await root.getByRole('button', {name: 'Check separator', exact: true}).click();
  await expect(root.getByRole('status')).toHaveText('Correct: this line separates the two values.');
  await reviewScreenshot(root, {path: `tmp/neural-exercises-review/separation-line-${info.project.name}.png`});
  await root.getByRole('slider', {name: 'Bias', exact: true}).press('ArrowLeft');
  await expect(root.getByRole('button', {name: 'NAND', exact: true})).toBeVisible();
  await root.getByRole('button', {name: 'All equal', exact: true}).click();
  await markPoints(root, [1, 0, 0, 0, 0, 0, 0, 1]);
  await root.getByRole('button', {name: 'Check separator', exact: true}).click();
  await expect(root.getByRole('status')).toContainText('needs output');
  await root.getByRole('button', {name: 'Not separable', exact: true}).click();
  await expect(root).toHaveAttribute('data-feedback', 'correct');
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.locator('[data-point][data-value="unknown"]')).toHaveCount(8);
});

test('cube labels survive rotation and three-dimensional separation checks all eight inputs', {tag: '@mobile'}, async ({page}) => {
  const root = separation(page);
  await root.getByRole('button', {name: 'Majority', exact: true}).click();
  await markPoints(root, [0, 0, 0, 1, 0, 1, 1, 1]);
  const point = root.locator('[data-point="0"]'), before = await point.getAttribute('transform');
  await root.getByRole('slider', {name: 'Rotate cube', exact: true}).press('ArrowRight');
  await expect(point).not.toHaveAttribute('transform', before);
  await expect(point).toHaveAttribute('data-value', '0');
  await setRange(root, 'Bias', -1.5);
  await expect(root.locator('polygon.separation-boundary')).toHaveCount(1);
  await root.getByRole('button', {name: 'Check separator', exact: true}).click();
  await expect(root.getByRole('status')).toHaveText('Correct: this plane separates the two values.');
  await root.getByRole('spinbutton', {name: 'Tilt cube', exact: true}).fill('215');
  const savedPoint = await point.getAttribute('transform');
  await root.getByRole('button', {name: 'Exactly one', exact: true}).click();
  await markPoints(root, [0, 1, 1, 0, 1, 0, 0, 0]);
  await root.getByRole('button', {name: 'Not separable', exact: true}).click();
  await expect(root).toHaveAttribute('data-feedback', 'correct');
  await root.locator('[data-point="0"]').click();
  await expect(root.getByRole('button', {name: 'Check separator', exact: true})).toBeHidden();
  await root.getByRole('button', {name: 'Majority ✓', exact: true}).click();
  await expect(point).toHaveAttribute('transform', savedPoint);
  await expect(root.getByRole('spinbutton', {name: 'Rotate cube', exact: true})).toHaveValue('36');
  await expect(root.getByRole('spinbutton', {name: 'Tilt cube', exact: true})).toHaveValue('215');
  await expect(root.getByRole('spinbutton', {name: 'Bias', exact: true})).toHaveValue('-1.5');
  await expect(root.getByRole('status')).toHaveText('Correct: this plane separates the two values.');
});

test('black-box levels and network structures retain formulas, parameters, inputs and partial tables', {tag: '@mobile'}, async ({page}) => {
  const root = mystery(page), answer = root.getByRole('textbox', {name: 'Your formula', exact: true});
  await recordRows(root, 2); await answer.fill('¬(P ∨ Q)'); await answer.press('Enter');
  await root.getByRole('button', {name: 'Your network', exact: true}).click();
  await parameters(root, {weights: [-1,-1], bias: 0.5});
  await root.getByRole('button', {name: 'Toggle Q', exact: true}).click();
  await root.getByRole('button', {name: 'Test input', exact: true}).click();
  await root.getByRole('button', {name: 'Hidden layer', exact: true}).click();
  await root.getByLabel('Bias of y', {exact: true}).fill('0.75');
  await root.getByRole('button', {name: 'Test input', exact: true}).click();
  await root.getByRole('button', {name: 'One perceptron', exact: true}).click();
  await expect(root.getByLabel('Bias b', {exact: true})).toHaveValue('0.5');
  await expect(root.locator('[data-output]')).toHaveText(['?','?','0','?']);
  await root.getByRole('button', {name: 'Hidden layer', exact: true}).click();
  await expect(root.getByLabel('Bias of y', {exact: true})).toHaveValue('0.75');
  await expect(root.locator('[data-output]')).toHaveText(['?','?','1','?']);
  await root.getByRole('button', {name: '2', exact: true}).click();
  await root.getByRole('button', {name: 'Test input', exact: true}).click();
  await root.getByRole('button', {name: '1', exact: true}).click();
  await expect(root.getByRole('button', {name: 'Your network', exact: true})).toHaveAttribute('aria-pressed', 'true');
  await expect(root.getByLabel('Bias of y', {exact: true})).toHaveValue('0.75');
  await expect(root.getByRole('button', {name: 'Toggle P', exact: true})).toHaveAttribute('aria-pressed', 'true');
  await expect(root.getByRole('button', {name: 'Toggle Q', exact: true})).toHaveAttribute('aria-pressed', 'false');
  await expect(root.locator('[data-output]')).toHaveText(['?','?','1','?']);
  await root.getByRole('button', {name: 'Black box', exact: true}).click();
  await expect(answer).toHaveValue('¬(P ∨ Q)');
  await expect(root.locator('[data-output]')).toHaveText(['1','0','0','0']);
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(answer).toHaveValue('');
  await expect(root.getByRole('button', {name: 'Your network', exact: true})).toBeDisabled();
  await root.getByRole('button', {name: '2', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['1','?','?','?']);
});

test('black-box completion requires a separately tested network and preserves the observed table', {tag: '@mobile'}, async ({page}, info) => {
  const root = mystery(page), answer = root.getByRole('textbox', {name: 'Your formula', exact: true});
  await expect(root.getByRole('button', {name: 'Your network', exact: true})).toBeDisabled();
  for (const [label, arity, formula, network] of [
    ['1', 2, '¬(P ∨ Q)', {weights: [-1, -1], bias: 0.5}],
    ['2', 2, 'P → Q', {weights: [-1, 1], bias: 0.5}],
    ['3', 3, '(P ∧ Q) ∨ (P ∧ R) ∨ (Q ∧ R)', {weights: [1, 1, 1], bias: -1.5}],
    ['4', 3, '(P ↔ Q) ∧ R', {hidden: [{weights: [-1, -1, 1], bias: -0.5}, {weights: [1, 1, 1], bias: -2.5}], output: {weights: [1, 1], bias: -0.5}}],
  ]) {
    await root.getByRole('button', {name: label, exact: true}).click();
    await recordRows(root, arity); const observed = await root.locator('[data-output]').allTextContents();
    await answer.fill(formula); await answer.press('Enter');
    await expect(root.getByRole('button', {name: label, exact: true})).toBeVisible();
    await root.getByRole('button', {name: 'Your network', exact: true}).click();
    await expect(answer).toBeHidden();
    if (label === '1') {
      const layout = await root.evaluate(el => {
        const rect = selector => {const r = el.querySelector(selector).getBoundingClientRect(); return {left:r.left, top:r.top, bottom:r.bottom};};
        return {network:rect('[data-network]'), test:rect('.perceptron-network-actions button'), tab:rect('.perceptron-task-tabs [data-choice="build"]'), options:rect('.perceptron-architecture')};
      });
      expect(layout.test.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.network.bottom - 1);
      expect(layout.options.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.tab.bottom);
      expect(layout.options.left, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.tab.left);
    }
    await expect(root.locator('[data-output]')).toHaveText(Array(2 ** arity).fill('?'));
    await root.getByRole('button', {name: 'Check', exact: true}).click();
    await expect(root.getByRole('status')).toContainText('inputs first');
    if (label === '1') {
      await recordRows(root, arity); await root.getByRole('button', {name: 'Check', exact: true}).click();
      await expect(root.getByRole('status')).toContainText('black box requires 1');
    }
    if (network.hidden) await root.getByRole('button', {name: 'Hidden layer', exact: true}).click();
    await parameters(root, network, arity); await recordRows(root, arity);
    await root.getByRole('button', {name: 'Check', exact: true}).click();
    await expect(root.getByRole('button', {name: `${label} ✓`, exact: true})).toBeVisible();
    await root.getByRole('button', {name: 'Black box', exact: true}).click();
    await expect(root.locator('[data-output]')).toHaveText(observed);
    await root.getByRole('button', {name: 'Your network', exact: true}).click();
    await expect(root.locator('[data-output]')).toHaveText(observed);
  }
  await reviewScreenshot(root, {path: `tmp/neural-exercises-review/rebuilt-network-${info.project.name}.png`});
  await root.getByLabel('Bias of y', {exact: true}).fill('0');
  await expect(root.locator('[data-output]')).toHaveText(Array(8).fill('?'));
  await expect(root.getByRole('button', {name: '4', exact: true})).toBeVisible();
  await root.getByRole('button', {name: 'Black box', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['0','1','0','0','0','0','0','1']);
  await answer.fill('P');
  await expect(root.getByRole('button', {name: 'Your network', exact: true})).toBeDisabled();
});

async function dragSeparator(page, target, dx, dy, mobile, anchor = [0.5, 0.5]) {
  // Keep gesture start points clear of the sticky navigation, including when
  // a drag begins near a graph corner rather than at the target's centre.
  await target.evaluate(el => el.scrollIntoView({block: 'center', inline: 'nearest', behavior: 'instant'}));
  const box = await target.boundingBox(), x = box.x + box.width*anchor[0], y = box.y + box.height*anchor[1];
  const hit = await page.evaluate(({x,y}) => {
    const el = document.elementFromPoint(x,y);
    return {x,y,inPlot:Boolean(el?.closest('.separation-coordinates')),element:el?.tagName,class:el?.getAttribute('class'),viewport:[innerWidth,innerHeight]};
  }, {x,y});
  expect(hit.inPlot, JSON.stringify({box, hit})).toBe(true);
  if (mobile) {
    const client = await page.context().newCDPSession(page);
    await client.send('Input.dispatchTouchEvent', {type:'touchStart', touchPoints:[{x, y}]});
    await client.send('Input.dispatchTouchEvent', {type:'touchMove', touchPoints:[{x:x+dx, y:y+dy}]});
    await client.send('Input.dispatchTouchEvent', {type:'touchEnd', touchPoints:[]});
    await client.detach();
  } else {
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x+dx, y+dy, {steps:5}); await page.mouse.up();
  }
}

test('separator numbers, sliders, mouse and touch dragging share one set of parameters', {tag: '@mobile'}, async ({page}, info) => {
  const root = separation(page);
  await markPoints(root, [1,1,1,0]);
  const weight = root.getByRole('spinbutton', {name:'Weight P', exact:true});
  const bias = root.getByRole('spinbutton', {name:'Bias', exact:true});
  await weight.fill('-1');
  await root.getByRole('spinbutton', {name:'Weight Q', exact:true}).fill('-1');
  await bias.fill('1.5');
  await expect(root.getByRole('slider', {name:'Bias', exact:true})).toHaveValue('1.5');
  await expect(root.locator('[data-region="0"]')).toHaveCount(1);
  await expect(root.locator('[data-region="1"]')).toHaveCount(1);
  const bounds = await root.evaluate(el => {
    const point = el.querySelector('[data-point="3"]').transform.baseVal.getItem(0).matrix;
    const boundary = el.querySelector('.separation-boundary');
    return {corner:point.e, max:Math.max(...Array.from(boundary.points, p=>p.x)), colors:[...el.querySelectorAll('[data-region]')].map(p=>getComputedStyle(p).fill)};
  });
  expect(bounds.max).toBeGreaterThan(bounds.corner);
  expect(new Set(bounds.colors).size).toBe(2);
  await root.getByRole('button', {name:'Check separator', exact:true}).click();
  await expect(root).toHaveAttribute('data-feedback', 'correct');
  await bias.fill(''); await expect(bias).toHaveAttribute('aria-invalid','true');
  await expect(root.locator('[data-region]')).toHaveCount(0);
  await root.getByRole('button', {name:'Check separator', exact:true}).click();
  await expect(root.getByRole('status')).toContainText('finite number');
  await bias.fill('-6.25');
  await expect(root.getByRole('slider', {name:'Bias', exact:true})).toHaveValue('-6.25');
  await expect(root.locator('[data-region="1"]')).toHaveCount(0);
  await bias.fill('6.25'); await expect(root.locator('[data-region="0"]')).toHaveCount(0);
  await bias.fill('1.5');
  const move = root.getByRole('button', {name:'Move separator', exact:true});
  await dragSeparator(page, move, 24, 12, info.project.name === 'mobile');
  await expect(bias).not.toHaveValue('1.5'); await expect(weight).toHaveValue('-1');
  await expect(root.getByRole('slider', {name:'Bias', exact:true})).toHaveValue(await bias.inputValue());
  await dragSeparator(page, root.getByRole('button', {name:'Turn separator: handle 1', exact:true}), -24, 18, info.project.name === 'mobile');
  await expect(weight).not.toHaveValue('-1');
  await expect(root).not.toHaveAttribute('data-dragging','true');
  const previous = await bias.inputValue();
  await move.focus(); await move.press('ArrowDown');
  await expect(move).toBeFocused(); await expect(bias).not.toHaveValue(previous);
  await expect(root.locator('[data-point][data-value="unknown"]')).toHaveCount(0);
});

test('the three-dimensional plane can be moved and turned directly', {tag: '@mobile'}, async ({page}, info) => {
  const root = separation(page);
  await root.getByRole('button', {name:'Majority', exact:true}).click();
  await markPoints(root, [0,0,0,1,0,1,1,1]);
  await root.getByRole('spinbutton', {name:'Bias', exact:true}).fill('-1.5');
  await root.getByRole('spinbutton', {name:'Rotate cube', exact:true}).fill('55');
  await expect(root.getByRole('slider', {name:'Rotate cube', exact:true})).toHaveValue('55');
  await dragSeparator(page, root.getByRole('button', {name:'Move separator', exact:true}), 18, -14, info.project.name === 'mobile');
  await expect(root.getByRole('spinbutton', {name:'Bias', exact:true})).not.toHaveValue('-1.5');
  const before = await root.getByRole('spinbutton', {name:'Weight R', exact:true}).inputValue();
  await dragSeparator(page, root.getByRole('button', {name:'Turn separator: handle 1', exact:true}), 22, 10, info.project.name === 'mobile');
  await expect(root.getByRole('spinbutton', {name:'Weight R', exact:true})).not.toHaveValue(before);
  await expect(root.locator('[data-point]')).toHaveCount(8);
  await expect(root.locator('[data-point][data-value="unknown"]')).toHaveCount(0);
  await expect(root.locator('.separation-boundary')).toHaveCount(1);
});

test('the cube rotates through complete horizontal and vertical turns with correct visible faces', {tag: '@mobile'}, async ({page}, info) => {
  const root = separation(page);
  await root.getByRole('button', {name:'Majority', exact:true}).click();
  await markPoints(root, [0,0,0,1,0,1,1,1]);
  await root.getByRole('spinbutton', {name:'Bias', exact:true}).fill('-1.5');
  await root.getByRole('button', {name:'Check separator', exact:true}).click();
  const turn = root.getByRole('spinbutton', {name:'Rotate cube', exact:true});
  const tilt = root.getByRole('spinbutton', {name:'Tilt cube', exact:true});
  const positions = () => root.locator('[data-point]').evaluateAll(points => points.map(p => [p.dataset.point, p.getAttribute('transform')]).sort());
  const original = await positions();
  await turn.fill('215'); await tilt.fill('334');
  expect(await positions()).not.toEqual(original);
  const faces = await root.locator('[data-face]').evaluateAll(parts => [...new Set(parts.map(p => p.dataset.face))].sort());
  expect(faces).toEqual(['P=-0.25','Q=-0.25','R=-0.25']);
  // 000 is nearest the viewer from this octant and must be drawn last.
  await expect(root.locator('[data-point]').last()).toHaveAttribute('data-point','0');
  await expect(root.getByRole('button', {name:'Majority ✓', exact:true})).toBeVisible();
  await reviewScreenshot(root, {path:`tmp/neural-exercises-review/cube-rear-${info.project.name}.png`, style:'header {visibility:hidden}'});
  for (const angle of ['0', '90', '180', '270']) {
    await turn.fill(angle); await tilt.fill(angle);
    const invalid = await root.locator('svg').evaluate(svg => /NaN|Infinity/.test(svg.innerHTML));
    expect(invalid).toBe(false);
    await expect(root.locator('[data-point]')).toHaveCount(8);
  }
  await turn.fill('395'); await tilt.fill('386');
  expect(await positions()).toEqual(original);
  await turn.fill('359');
  await root.getByRole('slider', {name:'Rotate cube', exact:true}).press('ArrowRight');
  await expect(turn).toHaveValue('0');
  await root.getByRole('slider', {name:'Rotate cube', exact:true}).press('ArrowLeft');
  await expect(turn).toHaveValue('359');
  await tilt.fill('0');
  await root.getByRole('slider', {name:'Tilt cube', exact:true}).press('ArrowLeft');
  await expect(tilt).toHaveValue('359');
  await expect(root.getByRole('spinbutton', {name:'Weight R', exact:true})).toHaveValue('1');
  await expect(root.getByRole('spinbutton', {name:'Bias', exact:true})).toHaveValue('-1.5');
});

test('dragging empty cube space rotates the view without changing labels or the separator', {tag: '@mobile'}, async ({page}, info) => {
  const root = separation(page);
  await root.getByRole('button', {name:'All equal', exact:true}).click();
  await markPoints(root, [1,0,0,0,0,0,0,1]);
  await root.getByRole('button', {name:'Not separable', exact:true}).click();
  const turn = root.getByRole('spinbutton', {name:'Rotate cube', exact:true});
  const tilt = root.getByRole('spinbutton', {name:'Tilt cube', exact:true});
  const labels = () => root.locator('[data-point]').evaluateAll(points => points.map(p => [p.dataset.point, p.dataset.value]).sort());
  const original = await labels();
  const view = root.getByRole('button', {name:'Rotate cube view', exact:true});
  await dragSeparator(page, view, 90, 65, info.project.name === 'mobile', [0.04, 0.04]);
  await expect(turn).not.toHaveValue('35'); await expect(tilt).not.toHaveValue('26');
  await expect(root).not.toHaveAttribute('data-dragging','true');
  expect(await labels()).toEqual(original);
  await expect(root.getByRole('button', {name:'All equal ✓', exact:true})).toBeVisible();
  await expect(root.getByRole('spinbutton', {name:'Weight P', exact:true})).toHaveValue('1');
  await expect(root.getByRole('spinbutton', {name:'Bias', exact:true})).toHaveValue('-1');
  const before = await turn.inputValue();
  await view.focus(); await view.press('ArrowRight');
  await expect(view).toBeFocused(); await expect(turn).not.toHaveValue(before);
  await root.getByRole('button', {name:'Reset', exact:true}).click();
  await expect(turn).toHaveValue('35'); await expect(tilt).toHaveValue('26');
  await expect(root.locator('[data-point][data-value="unknown"]')).toHaveCount(8);
});
