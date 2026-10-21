import {test, expect} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import {reviewScreenshot} from './review-screenshot.mjs';

const app = (page, name) => page.getByRole('region', {name, exact: true});
test.beforeEach(async ({page}) => {
  await page.goto('/textbook/neural-networks/');
  await expect(page.locator('.perceptron-app[data-mounted="true"]')).toHaveCount(8);
});

test('weights, bias, boundary zero, validation, reset, and instance isolation', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'Calculate a perceptron');
  await expect(root.locator('[data-network-score]')).toHaveText('z = −1.5');
  await expect(root.getByRole('img', {name: 'Step activation', exact: true})).toBeVisible();
  const toggle = root.getByRole('button', {name: 'Toggle x₁', exact: true});
  await expect(root.locator('.perceptron-stage').getByRole('button', {name: 'Toggle x₁', exact: true})).toBeVisible();
  await expect(root.locator('.perceptron-stage').getByLabel('Weight w₁', {exact: true})).toBeVisible();
  await toggle.focus(); await page.keyboard.press('Space'); await expect(toggle).toBeFocused();
  await root.getByRole('button', {name: 'Toggle x₂', exact: true}).click();
  await expect(root.locator('[data-verdict]')).toHaveText('y = step(0.5) = 1');
  await expect(root.locator('[data-network-score]')).toHaveText('z = 0.5');
  await expect(root.locator('[data-network-output]')).toHaveText('1');
  await expect(root.locator('.perceptron-edge[data-signal-source="output"]')).toHaveClass(/is-active/);
  await root.getByLabel('Bias b', {exact: true}).fill('-2');
  await expect(root.locator('[data-verdict]')).toHaveText('y = step(0) = 0');
  const weight = root.getByLabel('Weight w₁', {exact: true});
  await weight.fill('');
  await expect(root.getByRole('status')).toContainText('finite number');
  await expect(root.locator('[data-verdict]')).toHaveCount(0);
  await expect(weight).toBeFocused();
  await weight.pressSequentially('-1.5');
  await expect(weight).toHaveValue('-1.5');
  await expect(weight).toBeFocused();
  await expect(root.locator('[data-verdict]')).toHaveText('y = step(−2.5) = 0');
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.getByLabel('Weight w₁', {exact: true})).toHaveValue('1');
  await expect(root.locator('[data-verdict]')).toHaveText('y = step(−1.5) = 0');
  await expect(app(page, 'Boolean gates as perceptrons').locator('[data-output]')).toHaveText(['0','0','0','1']);
});

test('gate presets, XOR mismatch, and hidden outputs match the chapter', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'Boolean gates as perceptrons');
  for (const [name, values] of [['OR', ['0','1','1','1']], ['NOT', ['1','1','0','0']], ['IF', ['1','1','0','1']]]) {
    await root.getByRole('button', {name, exact: true}).click();
    await expect(root.locator('[data-output]')).toHaveText(values);
  }
  const separation = app(page, 'Try to separate XOR');
  await expect(separation.locator('.is-mismatch')).toHaveCount(1);
  await separation.getByLabel('Bias b', {exact: true}).fill('-1.5');
  await expect(separation.locator('.is-mismatch')).toHaveCount(3);
  const layers = app(page, 'XOR with a hidden layer');
  await expect(layers.locator('[data-output]')).toHaveText(['0','1','1','0']);
  await layers.getByRole('button', {name: 'Toggle x₁', exact: true}).click();
  await layers.getByRole('button', {name: 'Toggle x₂', exact: true}).click();
  await expect(layers.locator('[data-network-output]')).toHaveText('0');
  await expect(layers.locator('tr.is-selected')).toHaveAttribute('data-row', '3');
});

test('editable truth-tables compile constants and preserve keyboard focus', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'Build a network from a truth-table');
  const target = root.getByRole('button', {name: 'Toggle target for 11', exact: true});
  await target.focus(); await page.keyboard.press('Enter'); await expect(target).toBeFocused();
  await expect(root.locator('[data-output]')).toHaveText(['0','1','1','1']);
  await root.getByRole('button', {name: 'All 0', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['0','0','0','0']);
  await expect(root.locator('.perceptron-stage .perceptron-neuron')).toHaveCount(3);
  await root.getByRole('button', {name: 'All 1', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['1','1','1','1']);
  await expect(root.locator('.perceptron-stage .perceptron-neuron')).toHaveCount(3);
  await expect(root.locator('[data-dnf]')).toHaveText('f = ⊤');
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['0','1','1','0']);
  const kb = app(page, 'A network for a knowledge base');
  await expect(kb.locator('[data-output]')).toHaveText(['1','1','0','1','0','1','0','1']);
  await kb.getByRole('button', {name: 'Toggle R', exact: true}).click();
  await expect(kb.locator('[data-network-output]')).toHaveText('0');
  await kb.getByRole('button', {name: 'Toggle W', exact: true}).click();
  await expect(kb.locator('[data-network-output]')).toHaveText('1');
});

test('Boolean presets compile networks and manual rows update their selection', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'Build a network from a truth-table');
  for (const [name, values] of [['XNOR', ['1','0','0','1']], ['IF', ['1','1','0','1']], ['AND', ['0','0','0','1']], ['XOR', ['0','1','1','0']]]) {
    const preset = root.getByRole('button', {name, exact: true});
    await preset.click();
    await expect(root.locator('[data-output]')).toHaveText(values);
    await expect(preset).toHaveAttribute('aria-pressed', 'true');
  }
  await root.getByRole('button', {name: 'Toggle target for 00', exact: true}).click();
  await expect(root.locator('[data-presets] [aria-pressed="true"]')).toHaveCount(0);
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.getByRole('button', {name: 'XOR', exact: true})).toHaveAttribute('aria-pressed', 'true');
});

test('queries leave unknown rows unknown and extract a biconditional only from a complete table', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'Extract rules from a black box');
  await expect(root.locator('[data-output]')).toHaveText(['?','?','?','?']);
  await root.getByRole('button', {name: 'Toggle x₁', exact: true}).click();
  await root.getByRole('button', {name: 'Test input', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['?','?','1','?']);
  await expect(root.locator('[data-rules]')).toContainText('(P ∧ ¬Q) → Y');
  await expect(root.locator('[data-equivalence]')).toHaveCount(0);
  await root.getByRole('button', {name: 'Test input', exact: true}).click();
  await expect(root.locator('[data-rules] li')).toHaveCount(1);
  await root.getByRole('button', {name: 'Test all inputs', exact: true}).click();
  await expect(root.locator('[data-equivalence]')).toHaveText('Y ↔ (¬P ∧ Q) ∨ (P ∧ ¬Q)');
  await expect(root.locator('[data-rules]')).toContainText('(P ∧ Q) → ¬Y');
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['?','?','?','?']);
  await expect(root.locator('[data-equivalence]')).toHaveCount(0);
});

test('hidden and output parameters are editable in the network and stay independent of the black box', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'XOR with a hidden layer');
  await root.getByLabel('Weight from h2 to y', {exact: true}).fill('0');
  await expect(root.locator('[data-output]')).toHaveText(['0','1','1','1']);
  await expect(root.locator('.is-mismatch')).toHaveCount(1);
  await root.getByLabel('Bias of h1', {exact: true}).fill('0.5');
  await expect(root.locator('[data-output]')).toHaveText(['1','1','1','1']);
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(root.locator('[data-output]')).toHaveText(['0','1','1','0']);

  const kb = app(page, 'A network for a knowledge base');
  const weight = kb.getByLabel('Weight R', {exact: true});
  await weight.fill('0');
  await expect(weight).toBeFocused();
  await expect(kb.locator('[data-output]')).toHaveText(['1','1','0','1','1','1','0','1']);
  await expect(kb.locator('.is-mismatch')).toHaveCount(1);
  await kb.getByLabel('Bias b', {exact: true}).fill('1.5');
  await expect(kb.locator('[data-output]')).toHaveText(['1','1','1','1','1','1','1','1']);

  const blackbox = app(page, 'Extract rules from a black box');
  await blackbox.getByRole('button', {name: 'Test all inputs', exact: true}).click();
  await expect(blackbox.locator('[data-output]')).toHaveText(['0','1','1','0']);
});

test('step graph marks zero and truth-tables use the earlier chapters’ rules', {tag: '@mobile'}, async ({page}) => {
  const graph = page.locator('.perceptron-step');
  await expect(graph.getByRole('img')).toHaveAccessibleName(/zero for z less than or equal to zero/);
  await expect(graph.locator('.perceptron-step-closed')).toHaveAttribute('cy', '160');
  await expect(graph.locator('.perceptron-step-open')).toHaveAttribute('cy', '65');
  const centering = await graph.evaluate(el => {
    const parent = el.parentElement.getBoundingClientRect(), graph = el.getBoundingClientRect();
    return Math.abs((graph.left + graph.right) / 2 - (parent.left + parent.right) / 2);
  });
  expect(centering).toBeLessThan(2);
  await expect(page.locator('.perceptron-title, .perceptron-controls')).toHaveCount(0);
  const table = app(page, 'Calculate a perceptron').locator('.perceptron-truth-table');
  await expect(table.getByRole('columnheader')).toHaveText(['x₁', 'x₂', 'f', 'y']);
  await expect(page.locator('.perceptron-app [role=status]')).toHaveText(Array(8).fill(''));
  await expect(page.locator('.perceptron-app details, .perceptron-note')).toHaveCount(0);
  const rules = await table.evaluate(table => ({
    header: getComputedStyle(table.tHead).borderBottomWidth,
    divider: getComputedStyle(table.tBodies[0].rows[0].cells[2]).borderLeftWidth,
    data: getComputedStyle(table.tBodies[0].rows[0].cells[1]).borderWidth,
    inputIsText: !table.tBodies[0].rows[0].cells[1].querySelector('button')
  }));
  expect(rules).toEqual({header: '2px', divider: '2px', data: '0px', inputIsText: true});
});

test('firing connections animate, pause, and respect reduced motion', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'Calculate a perceptron');
  await root.getByRole('button', {name: 'Toggle x₁', exact: true}).click();
  await root.getByRole('button', {name: 'Toggle x₂', exact: true}).click();
  await expect(root.locator('.perceptron-edge.is-active')).toHaveCount(3);
  const output = root.locator('.perceptron-edge[data-signal-source="output"]');
  await expect(output).toHaveCSS('animation-name', 'perceptron-current');
  await expect(output).toHaveCSS('animation-play-state', 'running');
  await root.getByRole('button', {name: 'Pause animation', exact: true}).click();
  await expect(output).toHaveCSS('animation-play-state', 'paused');
  await root.getByRole('button', {name: 'Play animation', exact: true}).click();
  await expect(output).toHaveCSS('animation-play-state', 'running');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(root.getByRole('button', {name: 'Animation off: reduced motion', exact: true})).toBeDisabled();
  await expect(output).toHaveCSS('animation-name', 'none');
});

for (const theme of ['light', 'dark']) test(`perceptron apps fit and remain accessible in ${theme}`, {tag: '@mobile'}, async ({page}, info) => {
  await page.evaluate(value => document.documentElement.setAttribute('data-theme', value), theme);
  await page.evaluate(() => document.fonts.ready);
  await app(page, 'Extract rules from a black box').getByRole('button', {name: 'Test all inputs', exact: true}).click();
  await app(page, 'Calculate a perceptron').getByRole('button', {name: 'Toggle x₁', exact: true}).click();
  await app(page, 'Calculate a perceptron').getByRole('button', {name: 'Toggle x₂', exact: true}).click();
  expect((await new AxeBuilder({page}).include('.perceptron-app').analyze()).violations.map(v => ({id: v.id, nodes: v.nodes.map(n => n.html)}))).toEqual([]);
  const geometry = await page.evaluate(() => ({viewport: innerWidth, page: document.documentElement.scrollWidth, apps: [...document.querySelectorAll('.perceptron-app')].map(el => ({kind: el.dataset.kind, client: el.clientWidth, scroll: el.scrollWidth}))}));
  expect(geometry.page, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport + 1);
  for (const size of geometry.apps) expect(size.scroll, JSON.stringify(size)).toBeLessThanOrEqual(size.client + 1);
  const networks = await page.locator('.perceptron-app:is([data-kind="layers"], [data-kind="table"], [data-kind="kb"]) [data-network] .perceptron-scroll').evaluateAll(regions => regions.map(el => ({kind: el.closest('[data-kind]').dataset.kind, client: el.clientWidth, scroll: el.scrollWidth})));
  for (const size of networks) expect(size.scroll, JSON.stringify(size)).toBeLessThanOrEqual(size.client + 1);
  const layout = await page.locator('.perceptron-app[data-kind="unit"]').evaluate(root => {
    const network = root.querySelector('[data-network]').getBoundingClientRect();
    const table = root.querySelector('[data-table]').getBoundingClientRect();
    const plot = root.querySelector('.perceptron-plot').getBoundingClientRect();
    const cells = [...root.querySelectorAll('thead th')].map(cell => cell.getBoundingClientRect().width);
    const sum = root.querySelector('.perceptron-sum').getBoundingClientRect();
    const activation = root.querySelector('.perceptron-activation').getBoundingClientRect();
    const output = root.querySelector('[data-network-output]').getBoundingClientRect();
    return {cells, sumRight: sum.right, activationLeft: activation.left, activationRight: activation.right, outputLeft: output.left, networkRight: network.right, networkTop: network.top, networkBottom: network.bottom, tableLeft: table.left, tableTop: table.top, tableBottom: table.bottom, plotTop: plot.top};
  });
  expect(layout.tableLeft, JSON.stringify(layout)).toBeGreaterThan(layout.networkRight);
  expect(Math.abs(layout.tableTop - layout.networkTop), JSON.stringify(layout)).toBeLessThan(2);
  expect(layout.plotTop, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.tableBottom);
  expect(Math.max(...layout.cells), JSON.stringify(layout)).toBeLessThan(44);
  expect(layout.activationLeft, JSON.stringify(layout)).toBeGreaterThan(layout.sumRight);
  expect(layout.outputLeft, JSON.stringify(layout)).toBeGreaterThan(layout.activationRight);
  const collisions = await page.locator('.perceptron-stage').evaluateAll(stages => {
    const collisions = [];
    for (const stage of stages) {
      const lines = [...stage.querySelectorAll('line')].map(line => {
        const matrix = line.getScreenCTM();
        return [new DOMPoint(line.x1.baseVal.value, line.y1.baseVal.value).matrixTransform(matrix), new DOMPoint(line.x2.baseVal.value, line.y2.baseVal.value).matrixTransform(matrix)];
      });
      for (const field of stage.querySelectorAll('.perceptron-weight:not([hidden]) input')) {
        const box = field.getBoundingClientRect();
        for (const [a, b] of lines) {
          // Clip a segment to the field rectangle; a nonempty interval is an overlap.
          let start = 0, end = 1;
          for (const [axis, min, max] of [['x', box.left, box.right], ['y', box.top, box.bottom]]) {
            const delta = b[axis] - a[axis];
            if (!delta) {if (a[axis] < min || a[axis] > max) end = -1;}
            else {
              const t1 = (min - a[axis]) / delta, t2 = (max - a[axis]) / delta;
              start = Math.max(start, Math.min(t1, t2)); end = Math.min(end, Math.max(t1, t2));
            }
          }
          if (start <= end) collisions.push({kind: stage.closest('[data-kind]').dataset.kind, field: field.getAttribute('aria-label'), box: box.toJSON(), line: [a.toJSON(), b.toJSON()]});
        }
      }
    }
    return collisions;
  });
  expect(collisions).toEqual([]);
  await reviewScreenshot(page.locator('.perceptron-step'), {path: `tmp/neural-revision-20261021/screenshots/step-${theme}-${info.project.name}.png`});
  for (const kind of ['unit', 'layers', 'table', 'kb', 'blackbox']) await reviewScreenshot(page.locator(`.perceptron-app[data-kind="${kind}"]`), {path: `tmp/neural-revision-20261021/screenshots/${kind}-${theme}-${info.project.name}.png`});
});

test('compact canvases keep tables beside networks, and fullscreen and zoom preserve edits', {tag: '@mobile'}, async ({page}) => {
  for (const kind of ['unit', 'gates', 'layers', 'table', 'kb']) {
    const root = page.locator(`.perceptron-app[data-kind="${kind}"]`);
    const geometry = await root.evaluate(root => {
      const network = root.querySelector('[data-network]').getBoundingClientRect(), table = root.querySelector('[data-table]').getBoundingClientRect();
      return {network: network.toJSON(), table: table.toJSON(), height: root.getBoundingClientRect().height};
    });
    expect(geometry.table.left, JSON.stringify(geometry)).toBeGreaterThan(geometry.network.right);
    expect(Math.abs(geometry.table.top - geometry.network.top), JSON.stringify(geometry)).toBeLessThan(2);
    expect(geometry.height, JSON.stringify(geometry)).toBeLessThan(560);
  }
  const root = app(page, 'A network for a knowledge base');
  await root.getByLabel('Weight R', {exact: true}).fill('0');
  const stage = root.locator('.perceptron-stage');
  const before = await stage.evaluate(el => el.getBoundingClientRect().width);
  await root.getByRole('button', {name: 'Enlarge network', exact: true}).click();
  await expect.poll(() => stage.evaluate(el => el.getBoundingClientRect().width)).toBeGreaterThan(before);
  await root.getByRole('button', {name: 'Fit network', exact: true}).click();
  await root.getByRole('button', {name: 'Fullscreen', exact: true}).click();
  await expect(root.getByRole('button', {name: 'Exit fullscreen', exact: true})).toHaveAttribute('aria-pressed', 'true');
  await expect(root.getByLabel('Weight R', {exact: true})).toHaveValue('0');
  await root.getByRole('button', {name: 'Exit fullscreen', exact: true}).click();
  await expect(root.getByRole('button', {name: 'Fullscreen', exact: true})).toHaveAttribute('aria-pressed', 'false');
  // Also exercise the modal fallback used when native fullscreen is unavailable.
  await root.evaluate(el => {el.requestFullscreen = undefined;});
  await root.getByRole('button', {name: 'Fullscreen', exact: true}).click();
  await expect(page.getByRole('dialog', {name: 'A network for a knowledge base', exact: true})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(root.getByLabel('Weight R', {exact: true})).toHaveValue('0');
});

test('chapter 12 is listed while the learning drafts stay out of navigation', {tag: '@mobile'}, async ({page}) => {
  await expect(page.locator('.chapter-rail__item.is-current')).toContainText('12');
  await expect(page.locator('.chapter-rail')).not.toContainText('Logic-based learning');
  await expect(page.locator('.page-nav__link--prev')).toHaveAttribute('href', '/textbook/probability/');
  await expect(page.locator('.page-nav__link--next')).toHaveAttribute('href', '/textbook/notation/');
  await page.goto('/textbook/');
  await expect(page.locator('a.chapter-card[href="/textbook/neural-networks/"]')).toBeVisible();
  await expect(page.locator('.chapter-list')).not.toContainText('Logic-based learning');
  await page.goto('/exercises/');
  await expect(page.locator('.chapter-list')).not.toContainText('Logic-based learning');
});

test('sigmoid probability estimates follow cloud cover and parameter edits', {tag: '@mobile'}, async ({page}) => {
  const root = app(page, 'Estimating rain probability');
  const input = root.getByRole('slider', {name: 'Cloud cover x'});
  await expect(root.getByRole('img', {name: 'Sigmoid activation', exact: true})).toBeVisible();
  await expect(root.locator('[data-verdict]')).toHaveText('Pr(RAIN | x) ≈ sigmoid(1.25) = 0.7773');
  const reference = await root.locator('.perceptron-reference-point').evaluateAll(nodes => nodes.map(n => [n.getAttribute('cx'), n.getAttribute('cy')]));
  await input.fill('0.5');
  await expect(root.locator('[data-network-output]')).toHaveText('0.5');
  await root.getByLabel('Weight x', {exact: true}).fill('0');
  await root.getByLabel('Bias b', {exact: true}).fill('0');
  await input.fill('1');
  await expect(root.locator('[data-network-output]')).toHaveText('0.5');
  await expect(root.locator('.perceptron-probability-curve')).toHaveAttribute('points', /45,132.5 47.25,132.5/);
  expect(await root.locator('.perceptron-reference-point').evaluateAll(nodes => nodes.map(n => [n.getAttribute('cx'), n.getAttribute('cy')]))).toEqual(reference);
  await root.getByLabel('Bias b', {exact: true}).fill('');
  await expect(root.getByRole('status')).toContainText('finite number');
  await expect(root.locator('[data-verdict]')).toHaveCount(0);
  await root.getByRole('button', {name: 'Reset', exact: true}).click();
  await expect(input).toHaveValue('0.75');
  await expect(root.locator('[data-network-output]')).toHaveText('0.7773');
  const bounds = await root.evaluate(node => {
    const network = node.querySelector('[data-network]').getBoundingClientRect();
    const plot = node.querySelector('[data-detail]').getBoundingClientRect();
    return {sideBySide: network.right <= plot.left, height: node.getBoundingClientRect().height};
  });
  expect(bounds.sideBySide).toBe(true);
  expect(bounds.height).toBeLessThan(500);
});
