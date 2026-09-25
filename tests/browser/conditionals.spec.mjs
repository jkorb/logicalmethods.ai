import { test, expect } from './fixtures.mjs';
import {monkeyFrames} from '../../assets/js/logic/planning.js';
import AxeBuilder from '@axe-core/playwright';
const app=(page,kind)=>page.locator(`[data-logic-app="conditionals"][data-kind="${kind}"]`).first();
const button=(root,name)=>root.getByRole('button',{name,exact:true});
test('separate forward and backward players show MP inferences and instructions',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/textbook/conditionals/');
  const forward=page.locator('[data-kind="chaining"][data-method="forward"]'),backward=page.locator('[data-kind="chaining"][data-method="backward"]');
  await expect(forward).toHaveAttribute('data-mounted','true');
  await button(forward,'Last step').click();await expect(forward.getByRole('status')).toContainText('RAINBOW has been derived');
  await expect(forward.locator('[data-work] .conditional-rule').first()).toContainText('→');await expect(forward.locator('[data-code]')).toContainText('return');
  await button(backward,'Next step').click();await expect(backward.locator('[data-work]')).toContainText('to prove');
  await button(backward,'Circular rules').click();await button(backward,'Last step').click();await expect(backward.getByRole('status')).toContainText('HUMID has been derived');
  await button(backward,'Show text alternative').click();await expect(backward.locator('[data-text-tree]')).toContainText('RAIN');
  await button(backward,'Missing fact').click();await button(backward,'Last step').click();await expect(backward.getByRole('status')).toContainText('not derivable');
  await button(forward,'Edit').click();await forward.locator('[data-kb]').fill('p → (q ∨ r)');await button(forward,'Start').click();await expect(forward.getByRole('status')).toContainText('one atom');expect(errors).toEqual([]);
});
test('comparison keeps independent searches and records their different proofs',async({page})=>{
  await page.goto('/textbook/conditionals/');const a=app(page,'comparison');
  const forward=a.getByRole('region',{name:'Forward search',exact:true}),backward=a.getByRole('region',{name:'Backward search',exact:true});
  await button(forward,'Last step').click();await expect(forward.getByRole('status')).toContainText('STORM has been derived');
  await expect(backward.getByRole('status')).toContainText('Try to prove');await button(backward,'Last step').click();
  const f=await forward.locator('[data-proofs] > details').count(),b=await backward.locator('[data-proofs] > details').count();expect(f).toBeGreaterThan(b);
  await expect(backward.locator('[data-text-tree]')).toContainText('HUMID');
  await button(a,'Edit').click();await expect(forward.locator('[data-work]')).toBeEmpty();await expect(backward.locator('[data-work]')).toBeEmpty();
});
test('Horn app retains counters, least model and explicit contradiction',async({page})=>{
  await page.goto('/textbook/conditionals/');const a=app(page,'horn');await button(a,'Next step').click();await expect(a.locator('[aria-current="step"]')).toContainText('RAIN');
  await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('Satisfiable');await button(a,'Unsatisfiable').click();await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('unsatisfiable');await expect(a.locator('[data-work]')).toContainText('⊥');
});
test('two-block planning starts editable with frames and supports partial initial states',async({page})=>{
  await page.goto('/textbook/conditionals/');const a=app(page,'planning');
  await expect(a.locator('[data-frame="0"]')).toHaveValue(/On\(X,Y,t\)/);await expect(a.locator('[data-horizon]')).toHaveAttribute('type','text');await expect(button(a,'Three blocks')).toHaveCount(0);
  await button(a,'Plan!').click();await expect(a.getByRole('status')).toContainText('Unstack(G,R)');await expect(a.locator('[data-frame="0"]')).toBeEditable();
  await expect(a.locator('.planning-goal')).toHaveCount(1);await expect(a.locator('.planning-cube svg path')).not.toHaveCount(0);
  await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('goal conditions hold');
  await button(a,'Clear frames').click();await button(a,'Plan!').click();await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('Unexplained change');
  await button(a,'Use chapter frames').click();await a.locator('[data-horizon]').fill('1');await button(a,'Plan!').click();await expect(a.getByRole('status')).toContainText('No model');
  await a.locator('[data-initial]').fill('');await a.locator('[data-complete]').uncheck();await button(a,'Plan!').click();await expect(a.locator('[data-rules]')).toContainText('one of the permitted initial states');
  await button(a,'Both on table').click();await button(a,'Plan!').click();await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('goal conditions hold');
});
test('exercise planning is blank; student chaining has a direction selector',async({page})=>{
  await page.goto('/exercises/conditionals/');const three=page.locator('[data-kind="planning"][data-example="three"]'),monkey=page.locator('[data-kind="planning"][data-example="monkey"]');
  for(const a of [three,monkey]) {await expect(a.locator('[data-frame="0"]')).toHaveValue('');await expect(button(a,'Use chapter frames')).toHaveCount(0);const threeBlocks=a===three;await a.locator('[data-language]').fill(threeBlocks?'On(R,B);On(G,B);On(B,R);On(B,G)':'BoxUnderBanana;OnBox;HasBanana');await button(a,'Check language').click();await a.locator('[data-initial]').fill(threeBlocks?'On(G,B);On(B,R)':'none');await a.locator('[data-goal]').fill(threeBlocks?'On(B,G);On(G,R)':'HasBanana');await a.locator('[data-frame="0"]').fill(threeBlocks?'On(X,Y,t) ∧ ¬Unstack(X,Y,t) → On(X,Y,t+1)':monkeyFrames[0]);await a.locator('[data-frame="1"]').fill(threeBlocks?'¬On(X,Y,t) ∧ ¬Stack(X,Y,t) → ¬On(X,Y,t+1)':monkeyFrames[1]);await button(a,'Plan!').click();await button(a,'Last step').click();}
  await expect(three.locator('[data-rules]')).toContainText('On(B,G,4)');await expect(monkey.locator('[data-rules]')).toContainText('HasBanana');
  const chaining=page.locator('[data-logic-app="conditional-practice"][data-kind="chaining"]');await button(chaining,'Backward').click();await expect(button(chaining,'Reason backwards')).toBeEnabled();
});
test('conditional worlds and rewrite examples remain scoped to this chapter',async({page})=>{
  await page.goto('/textbook/conditionals/');const worlds=page.locator('[data-kind="models"]');await expect(worlds.getByRole('status')).toContainText('[RAIN → SUN]');await expect(worlds.getByRole('status')).toContainText('W ∖ [RAIN]');await expect(worlds.getByRole('status')).toContainText(' = {');await expect(button(worlds,'[¬SUN]')).toHaveCount(1);
  const rewrite=page.locator('[data-logic-app="sat"]');await expect(rewrite.locator('[data-example]')).toHaveCount(4);await button(rewrite,'Negated conditional').click();await button(rewrite,'Last step').click();await expect(rewrite.locator('.sat-rewrites')).toContainText('¬WIND');
  await button(rewrite,'Conjunctive antecedent').click();await button(rewrite,'Last step').click();await expect(rewrite.locator('.sat-rewrites')).toContainText('¬SUN');
  const refs=page.locator('a.chapter-reference');expect(await refs.count()).toBeGreaterThan(5);
});
test('apps have accessible controls and keep overflow inside their panels',async({page})=>{
  await page.goto('/textbook/conditionals/');await expect(app(page,'horn')).toHaveAttribute('data-mounted','true');await button(app(page,'planning'),'Plan!').click();
  const result=await new AxeBuilder({page}).include('.conditional-app').analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const a=app(page,'chaining');await button(a,'Edit').focus();await page.keyboard.press('Enter');await expect(a.locator('[data-kb]')).toBeFocused();
});
test('laptop planning fits without internal image scrolling in dark mode',async({page})=>{
  await page.setViewportSize({width:1366,height:768});await page.emulateMedia({colorScheme:'dark'});await page.goto('/textbook/conditionals/');const a=app(page,'planning');await button(a,'Plan!').click();
  const box=await a.boundingBox();expect(box.height).toBeLessThan(660);
  expect(await a.locator('[data-work]').evaluate(n=>n.scrollHeight<=n.clientHeight+1 && n.scrollWidth<=n.clientWidth+1)).toBe(true);
  for(const field of await a.locator('[data-frame]').all())expect(await field.evaluate(n=>n.scrollHeight<=n.clientHeight+1)).toBe(true);
  const geometry=await a.locator('.planning-stage').evaluate(stage=>{
    const bounds=stage.getBoundingClientRect(),table=stage.querySelector('.planning-table svg').getBoundingClientRect();
    const cubes=[...stage.querySelectorAll('.planning-cube')].map(n=>n.getBoundingClientRect());
    return {ratio:table.width/table.height,inside:cubes.every(r=>r.left>=bounds.left && r.right<=bounds.right && r.top>=bounds.top && r.bottom<=bounds.bottom),cubeRatio:cubes[0].width/table.width};
  });
  expect(geometry.ratio).toBeCloseTo(365/305.5,1);expect(geometry.inside).toBe(true);expect(geometry.cubeRatio).toBeLessThan(.12);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const contrast=await new AxeBuilder({page}).include('.conditional-app').withRules(['color-contrast']).analyze();expect(contrast.violations.map(v=>v.nodes.map(n=>n.target))).toEqual([]);
});

test('long chaining proofs and frozen knowledge bases fit their available width',async({page})=>{
  await page.goto('/textbook/conditionals/');
  for(const method of ['forward','backward']) {
    const a=page.locator(`[data-kind="chaining"][data-method="${method}"]`);
    await button(a,'Last step').click();
    await expect(a.locator('[data-kb]')).toBeHidden();
    await expect(a.locator('.conditional-kb-preview')).toBeVisible();
    await expect.poll(()=>a.locator('[data-work]').evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
    expect(await a.locator('.conditional-kb-preview').evaluate(n=>n.scrollHeight<=n.clientHeight+1)).toBe(true);
    expect(await a.locator('[data-work] > .conditional-inference').evaluate(n=>parseFloat(getComputedStyle(n).fontSize))).toBeGreaterThanOrEqual(14);
  }
});
