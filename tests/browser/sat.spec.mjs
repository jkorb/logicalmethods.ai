import { reviewScreenshot } from './review-screenshot.mjs';
import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const app = (page, kind, index = 0) => page.locator('[data-logic-app="sat"][data-kind="' + kind + '"]').nth(index);
const button = (a, name) => a.getByRole('button', {name, exact: true});
test.beforeEach(async ({page}) => { await page.goto('/textbook/sat/'); });

test('tables calculate, navigate rows, and distinguish both inference outcomes', async ({page}) => {
  const a = app(page, 'truth-table'), b = a;
  await expect(a.locator('textarea')).toHaveAttribute('readonly', '');
  await expect(a.locator('tbody tr')).toHaveCount(4);
  await button(a, 'Next step').click();
  await expect(a.locator('td.is-current')).toHaveCount(1);
  await expect(a.locator('.sat-current-formula')).toContainText('SUN ∨ RAIN');
  await button(a, 'Calculate row 3').click();
  await expect(button(a, 'Calculate row 3')).toHaveAttribute('aria-pressed', 'true');
  await expect(a.getByRole('status')).toContainText('Row 3');
  await button(a, 'Last step').click();
  await expect(a.getByRole('status')).toContainText('Valid:');
  await button(b, 'Invalid inference').click();
  await button(b, 'Last step').click();
  await expect(b.getByRole('status')).toContainText('Invalid:');
  await expect(b.locator('tr.is-witness')).toHaveCount(1);
  await a.locator('summary').click();
  await expect(a.locator('[data-text-tree]')).toContainText(' = ');
});

test('editing clears old answers and catches invalid input without affecting siblings', async ({page}) => {
  const a = app(page, 'truth-table'), b = a;
  await button(a, 'Edit input').click();
  await expect(button(a, 'Next step')).toBeDisabled();
  await expect(a.locator('table')).toHaveCount(0);
  await a.locator('textarea').fill('p ∧');
  await button(a, 'Use input').click();
  await expect(a.locator('textarea')).toBeEditable();
  await a.locator('textarea').fill('p ∧ ¬p');
  await button(a, 'Use input').click();
  await button(a, 'Last step').click();
  await expect(a.getByRole('status')).toContainText('Unsatisfiable:');
  await expect(app(page,'rewrite').locator('.sat-rewrites li')).toHaveCount(1);
  await button(a, 'Edit input').click();
  await a.locator('textarea').fill('a ∨ b ∨ c ∨ d ∨ e ∨ f ∨ g');
  await button(a, 'Use input').click();
  await expect(a.getByRole('status')).toContainText('six variables');
  await expect(a.locator('table')).toHaveCount(0);
});

test('rewrite trace switches targets and retains repetitions', async ({page}) => {
  const a = app(page, 'rewrite');
  await button(a, 'Last step').click();
  await expect(a.getByRole('status')).toContainText('CNF');
  await expect(a.locator('.sat-rewrites li').last()).toContainText('(SUN ∨ ¬RAIN) ∧ (SUN ∨ SUN)');
  await button(a, 'DNF').click();
  await button(a, 'Last step').click();
  await expect(a.getByRole('status')).toContainText('DNF');
  await expect(a.locator('.sat-rewrites li').last()).toContainText('∨');
  await button(a, 'Edit input').click();
  await expect(button(a, 'DNF')).toBeDisabled();
});

test('resolution displays a formula proof, saturates, and accepts a formula list', async ({page}) => {
  const a = app(page, 'resolution'), b = a;
  await button(a, 'Last step').click();
  await expect(a.getByRole('status')).toContainText('Unsatisfiable.');
  await expect(a.locator('.sat-proof')).toContainText('⊥');
  await expect(a.locator('.sat-clauses')).toContainText('pivot');
  await button(b, 'Invalid inference').click();
  await button(b, 'Last step').click();
  await expect(b.getByRole('status')).toContainText('Invalid.');
  await expect(b.getByRole('status')).toContainText('Every pair');
  await button(a, 'Edit input').click();
  await a.locator('textarea').fill('{p ∨ q, ¬p ∨ ¬q}');
  await button(a, 'Use input').click();
  await button(a, 'Last step').click();
  await expect(a.getByRole('status')).toContainText('Satisfiable.');
  await expect(a.locator('.sat-proof')).toHaveCount(0);
  await expect(a.locator('.sat-clauses')).not.toContainText('⊥');
});

test('NAND relays match the table for each input', async ({page}, testInfo) => {
  const a = page.locator('[data-kind="circuit"][data-preset="nand"]');
  for (const [x,y] of [[0,0],[1,0],[1,1],[0,1]]) {
    for (const [name, value] of [['INPUT₁',x],['INPUT₂',y]]) if (await button(a, 'Toggle ' + name).getAttribute('aria-pressed') !== String(Boolean(value))) await button(a, 'Toggle ' + name).click();
    await expect(a.getByRole('status')).toContainText('NAND = ' + (1-(x&y)));
  }
  await reviewScreenshot(a, {path:'tmp/sat-review/nand-' + testInfo.project.name + '.png'});
});

test('SAT apps fit a laptop, contain mobile overflow, and pass accessibility checks', async ({page}, testInfo) => {
  if (testInfo.project.name === 'desktop') await page.setViewportSize({width:1366,height:768});
  for (const kind of ['truth-table','rewrite','resolution','tseytin']) {
    const a = app(page,kind);
    await button(a,'Last step').click();
    const box = await a.boundingBox();
    if (testInfo.project.name === 'desktop') expect(box.height).toBeLessThan(650);
    expect(await a.evaluate(n => n.getBoundingClientRect().right)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
    await reviewScreenshot(a, {path: 'tmp/sat-review/' + kind + '-' + testInfo.project.name + '.png'});
  }
  const results = await new AxeBuilder({page}).include('.sat-app').analyze();
  expect(results.violations.map(v => v.id + ": " + v.help)).toEqual([]);
});

test('SAT controls work with keyboard and dark reduced-motion styles', async ({page}) => {
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  const a = app(page,'truth-table');
  await button(a,'Next step').focus();
  await page.keyboard.press('Enter');
  await expect(a.getByRole('status')).toContainText('Row 0');
  await button(a,'Edit input').focus();
  await page.keyboard.press('Enter');
  await expect(a.locator('textarea')).toBeFocused();
  await a.locator('textarea').fill('p ∨ ¬p');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(a.locator('textarea')).toHaveAttribute('readonly','');
  await button(a,'Last step').click();
  await expect(a.getByRole('status')).toContainText('Satisfiable:');
});

test('compact table separates assignments and keeps three-variable values in view', async ({page}, testInfo) => {
  const a = app(page, 'truth-table');
  await button(a,'Three variables').click();
  await button(a,'Last step').click();
  await expect(a.locator('[data-problem]')).toContainText('SAT formula:');
  await expect(a.locator('thead')).not.toContainText('F₁');
  await expect(a.locator('thead .sat-formula-boundary')).toHaveCount(1);
  if (testInfo.project.name === 'desktop') {
    expect(await a.locator('[data-work]').evaluate(n => n.scrollWidth <= n.clientWidth + 1)).toBe(true);
  }
  await expect(a.locator('thead th').last()).toContainText('∧');
  await reviewScreenshot(a, {path:'tmp/sat-revision-2/table-three-' + testInfo.project.name + '.png'});
});

test('resolution prepares a single conjunction and handles the larger inference', async ({page}) => {
  const a = app(page,'resolution');
  await button(a,'Circuit verification').click();
  await button(a,'Next step').click();
  await expect(a.locator('.sat-preparation')).toHaveCount(0);
  await expect(a.locator('.sat-clauses li')).toHaveCount(5);
  await button(a,'Last step').click();
  await expect(a.getByRole('status')).toContainText('Unsatisfiable.');
  await expect(a.locator('.sat-proof')).toContainText('⊥');
});

test('textareas grow and shrink with content and rewriting uses a field', async ({page}) => {
  const a = app(page,'truth-table');
  await button(a,'Edit input').click();
  const field = a.locator('textarea');
  await field.fill('p');
  const short = await field.evaluate(n => n.getBoundingClientRect().height);
  await field.fill('p\nq\nr\np ∧ q');
  await expect.poll(() => field.evaluate(n => n.getBoundingClientRect().height)).toBeGreaterThan(short * 2);
  await field.fill('p');
  await expect.poll(() => field.evaluate(n => n.getBoundingClientRect().height)).toBeLessThan(short + 2);
  await expect(app(page,'rewrite').locator('input[data-input]')).toHaveCount(1);
});

test('chapter references identify their destinations', async ({page}) => {
  const links = page.locator('a.chapter-reference');
  await expect(links.first()).toContainText('Chapter 4');
  await expect(page.locator('a.chapter-reference[href*="conditionals"]').first()).toContainText('Chapter 6');
});


test('presets share the circuit problem and resolution records checked pairs', async ({page}) => {
  for (const kind of ['truth-table','resolution']) {
    const a=app(page,kind);
    await button(a,'Circuit verification').click();
    await expect(button(a,'Circuit verification')).toHaveAttribute('aria-pressed','true');
    await button(a,'Last step').click();
    await expect(a.getByRole('status')).toContainText('Unsatisfiable');
    if(kind==='resolution') {
      await expect(a.locator('.sat-clauses li')).toHaveCount(6);
      await expect(a.locator('.sat-pair-checks summary')).toContainText('clause pairs checked');
    }
    await button(a,'Faulty circuit').click();
    await button(a,'Last step').click();
    await expect(a.getByRole('status')).toContainText('Satisfiable');
  }
});

test('Tseytin app names children before parents and asserts the root', async ({page},testInfo) => {
  const a=app(page,'tseytin');
  await button(a,'Next step').click();
  await expect(a.locator('.sat-bindings')).toContainText('u₁');
  await expect(a.locator('.sat-clauses li')).toHaveCount(3);
  await button(a,'Last step').click();
  await expect(a.locator('.sat-clauses li')).toHaveCount(7);
  await expect(a.locator('.sat-clauses li').last()).toHaveText('u₂');
  await expect(a.getByRole('status')).toContainText('equisatisfiable');
  await button(a,'Contradiction').click();
  await button(a,'Last step').click();
  await expect(a.locator('.sat-clauses li')).toHaveCount(6);
  await reviewScreenshot(a,{path:'tmp/sat-revision-3/tseytin-'+testInfo.project.name+'.png'});
  await button(a,'Edit input').click();
  await a.locator('[data-input]').fill('u₁ ∧ p');
  await button(a,'Use input').click();
  await button(a,'Last step').click();
  await expect(a.locator('.sat-clauses li').last()).toHaveText('u₂');
});


test('circuit calculations fit a laptop and resolution defaults to the short derivation',async({page},testInfo)=>{
  if(testInfo.project.name==='desktop') await page.setViewportSize({width:1366,height:768});
  for(const kind of ['truth-table','resolution']) {
    const a=app(page,kind);
    await button(a,'Circuit verification').click();
    await button(a,'Last step').click();
    if(testInfo.project.name==='desktop') {
      expect((await a.boundingBox()).height).toBeLessThan(680);
      if(kind==='truth-table') expect(await a.locator('[data-work]').evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
    }
    await reviewScreenshot(a,{path:'tmp/sat-revision-4/circuit-'+kind+'-'+testInfo.project.name+'.png'});
    if(kind==='truth-table') {
      await button(a,'Previous step').click();
      if(testInfo.project.name==='desktop') expect((await a.boundingBox()).height).toBeLessThan(680);
      await reviewScreenshot(a,{path:'tmp/sat-revision-4/circuit-active-'+testInfo.project.name+'.png'});
    }
  }
  const a=app(page,'resolution');
  await expect(a.locator('[data-count]')).toHaveText('4 / 4');
  await expect(a.locator('[data-detailed]')).toHaveCount(0);
});

test('weather table evaluates the conjunction and identifies its inference',async({page})=>{
  const a=app(page,'truth-table');
  await expect(a.locator('[data-problem]')).toContainText('∴ RAIN');
  await expect(a.locator('[data-problem]')).toContainText('¬RAIN');
  await button(a,'Last step').click();
  await expect(a.locator('tbody td:last-child')).toHaveText(['0','0','0','0']);
  await expect(a.locator('[data-inference]')).toContainText('⊨ RAIN');
  await button(a,'Previous step').click();
  await expect(a.locator('[data-inference]')).toContainText('∴ RAIN');
  await button(a,'Invalid inference').click();
  await expect(a.locator('[data-problem]')).toContainText('∴ ¬RAIN');
  await button(a,'Last step').click();
  await expect(a.locator('tbody tr.is-witness td:last-child')).toHaveText('1');
  await expect(a.locator('[data-inference]')).toContainText('⊭ ¬RAIN');
});

test('DNF circuit specification agrees and the resolution conclusion is centered', async ({page},testInfo) => {
  if(testInfo.project.name==='desktop') await page.setViewportSize({width:1366,height:768});
  const table=app(page,'truth-table');
  await button(table,'Circuit: DNF specification').click();
  await button(table,'Last step').click();
  await expect(table.getByRole('status')).toContainText('Unsatisfiable');
  if(testInfo.project.name==='desktop') expect((await table.boundingBox()).height).toBeLessThan(680);
  const resolution=app(page,'resolution');
  await button(resolution,'Last step').click();
  const conclusion=resolution.locator('.sat-proof-local > .sat-proof-formula');
  await expect(conclusion).toHaveText('⊥ [5]');
  await expect(conclusion).toHaveCSS('text-align','center');
  expect(await conclusion.evaluate(n=>parseFloat(getComputedStyle(n).fontSize))).toBeGreaterThanOrEqual(14);
});
