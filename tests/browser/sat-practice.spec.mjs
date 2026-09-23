import { test, expect } from './fixtures.mjs';
import { budget } from './budget.mjs';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { tableExercise, createResolutionSession, resolutionChoices, applyResolutionChoice, resolutionOutcome } from '../../assets/js/logic/sat-practice.js';
import { printFormula } from '../../assets/js/logic/sat.js';
import { useTestPassword, testPassword } from './solution-password.mjs';
const levels=JSON.parse(fs.readFileSync(new URL('../../data/sat-practice.json',import.meta.url)));
const app=(page,kind,deck=kind)=>page.locator('[data-logic-app="sat-practice"][data-kind="'+kind+'"][data-deck="'+deck+'"]');
const button=(a,name)=>a.getByRole('button',{name,exact:true});
test.beforeEach(async({page})=>{await page.goto('/exercises/sat/');});
async function prepare(a,source) {
  const model=tableExercise(source);
  await a.getByLabel('Variables (comma-separated)',{exact:true}).fill(model.problem.names.join(','));
  await a.getByLabel('Number of rows').fill(String(model.rows.length));
  await button(a,'Start').click();
  const nodes=[];
  function identify(n){nodes.push(n);n.children.forEach(identify);}identify(model.problem.conjunction);
  for(const col of model.columns.filter(c=>c.tree.children.length)) {
    const id=nodes.findIndex(n=>printFormula(n)===col.key)+1;
    await a.locator('[data-tree-node="'+id+'"]').click();
  }
  return model;
}
async function fillTable(a,model) {
  for(const input of await a.locator('[data-cell]').all()) {
    const [r,c]=(await input.getAttribute('data-cell')).split(':').map(Number);
    await input.fill(String(model.rows[r].cells[c].value));
  }
}
test('student constructs each table, including parsing, errors and restarting',async({page})=>{
  const a=app(page,'table');
  await a.getByLabel('Variables (comma-separated)',{exact:true}).fill('SUN,SUN');
  await a.getByLabel('Number of rows').fill('2');await button(a,'Start').click();
  await expect(a.getByRole('status')).toContainText('List each variable once');
  for(let i=0;i<levels.table.length;i++) {
    await button(a,'Level '+(i+1)).click();const model=await prepare(a,levels.table[i].formula);
    await button(a,'Check').click();await expect(a.locator('input[aria-invalid="true"]').first()).toBeVisible();
    await fillTable(a,model);await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct table');
  }
  await button(a,'Restart').click();await expect(a.getByLabel('Variables (comma-separated)',{exact:true})).toHaveValue('');
});
test('gap exercises retain givens and report wrong answers without replacing them',async({page})=>{
  const a=app(page,'gaps');
  for(let i=0;i<levels.gaps.length;i++) {
    await button(a,'Level '+(i+1)).click();const model=tableExercise(levels.gaps[i].formula);
    const first=a.locator('[data-cell]').first();await first.fill('x');await button(a,'Check').click();
    await expect(first).toHaveValue('x');await expect(first).toHaveAttribute('aria-invalid','true');
    await fillTable(a,model);await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct table');
  }
});
test('mystery accepts different equivalent answers and provides counterexamples immediately',async({page})=>{
  const a=app(page,'mystery');
  await button(a,'Level 7').click();await a.getByLabel('Your formula').fill('SUN');
  await expect(a.getByRole('status')).toContainText('Different value when');
  await a.getByLabel('Your formula').fill('¬(¬SUN ∧ WIND)');await expect(a.getByRole('status')).toContainText('Correct');
  await a.getByLabel('Your formula').fill('SNOW');await expect(a.getByRole('status')).toContainText('only the variables');
  for(let i=0;i<levels.mystery.length;i++) {await button(a,'Level '+(i+1)).click();await a.getByLabel('Your formula').fill(levels.mystery[i].formula);await expect(a.getByRole('status')).toContainText('Correct');}
});
test('resolution checks chosen parents and pivots, supports undo, and requires saturation',async({page})=>{
  test.setTimeout(budget(90_000));
  const a=app(page,'resolution');await button(a,'Saturated?').click();await expect(a.getByRole('status')).toContainText('unchecked');
  for(let i=0;i<levels.resolution.length;i++) {
    await button(a,'Level '+(i+1)).click();let state=createResolutionSession(levels.resolution[i].formula);
    while(resolutionOutcome(state)==='unfinished') {
      const action=resolutionChoices(state).find(a=>!a.checked);
      await a.getByRole('button',{name:new RegExp('^Clause '+action.first+':')}).click();
      await a.getByRole('button',{name:new RegExp('^Clause '+action.second+':')}).click();
      await a.getByLabel('Pivot',{exact:true}).selectOption(action.pivot);await button(a,'Resolve').click();
      state=applyResolutionChoice(state,action.first,action.second,action.pivot);
    }
    if(resolutionOutcome(state)==='satisfiable') {await button(a,'Saturated?').click();await expect(a.getByRole('status')).toContainText('input is satisfiable');}
    else await expect(a.getByRole('status')).toContainText('input is unsatisfiable');
    if(state.history.length) {await button(a,'Undo').click();await expect(a.getByRole('status')).toContainText('undone');}
  }
});
test('practice fits laptop width and has accessible states without screenshots',async({page},info)=>{
  if(info.project.name==='desktop')await page.setViewportSize({width:1366,height:768});
  await button(app(page,'table'),'Level 6').click();await prepare(app(page,'table'),levels.table[5].formula);
  await button(app(page,'circuit'),'Level 5').click();await button(app(page,'resolution'),'Level 8').click();
  await button(app(page,'resolution','inference'),'Level 5').click();
  for(const [kind,deck] of [['table','table'],['gaps','gaps'],['mystery','mystery'],['resolution','resolution'],['circuit','circuit'],['resolution','inference']]) {
    const a=app(page,kind,deck);if(info.project.name==='desktop')expect((await a.boundingBox()).height).toBeLessThan(680);
    expect(await a.evaluate(n=>n.getBoundingClientRect().right)).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth));
  }
  const result=await new AxeBuilder({page}).include('.sat-practice').analyze();expect(result.violations.map(v=>v.id+': '+v.help)).toEqual([]);
});
test('every revised exercise has a working solution control',async({page})=>{
  await useTestPassword(page);await page.reload();
  const buttons=page.locator('button[aria-controls$="Solution"]');await expect(buttons).toHaveCount(12);
  await buttons.first().click();await expect(page.locator('#passwordInput')).toBeFocused();await page.locator('#passwordInput').fill(testPassword);await page.locator('#passwordInput').press('Enter');
  await expect(page.locator('#passwordModal')).toBeHidden();
  await expect(page.locator('#truth-function-representationsSolution')).toBeVisible();
  for(let i=1;i<await buttons.count();i++) {const b=buttons.nth(i);await b.click();await expect(page.locator('[id="'+await b.getAttribute('aria-controls')+'"]')).toBeVisible();}
});
test('relay exercise diagrams compute their descriptions and expose their wiring',async({page})=>{
  await button(app(page,'circuit'),'Level 3').click();
  const a=page.locator('[data-logic-app="boolean"][data-preset="negated-input"]');
  for(const X of [0,1])for(const Y of [0,1]) {
    for(const [name,value] of [['X',X],['Y',Y]])if(await button(a,'Toggle '+({X:'INPUT₁',Y:'INPUT₂'}[name])).getAttribute('aria-pressed')!==String(Boolean(value)))await button(a,'Toggle '+({X:'INPUT₁',Y:'INPUT₂'}[name])).click();
    await expect(a.locator('[role="status"]')).toContainText('output = '+((1-X)&Y));
  }
  await button(a,'Show text alternative').click();await expect(a.locator('[data-text]')).toContainText('RELAY-ON');
  const result=await new AxeBuilder({page}).analyze();expect(result.violations.map(v=>v.id+': '+v.help)).toEqual([]);
});
test('SAT pseudocode deck checks new notation and retains completed entries',async({page})=>{
  const a=page.locator('[data-logic-app="pseudocode-practice"]');
  await button(a,'Check').click();await expect(a.locator('input').first()).toHaveAttribute('aria-invalid','true');
  const answers=[['while','='],['empty_list','==','add'],['for','in','add'],['for','if','else']];
  for(let i=0;i<answers.length;i++) {
    await a.locator('[data-level-picker] button').nth(i).click();
    for(let j=0;j<answers[i].length;j++) await a.locator('input').nth(j).fill(answers[i][j]);
    await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct.');
  }
  await a.locator('[data-level-picker] button').first().click();await expect(a.locator('input').first()).toHaveValue('while');
  const result=await new AxeBuilder({page}).include('.pseudocode-practice').analyze();expect(result.violations.map(v=>v.id)).toEqual([]);
});

test('tree matching gives feedback and keeps keyboard focus; table inputs use paper colours',async({page})=>{
  const a=app(page,'table');
  await a.getByLabel('Variables (comma-separated)').fill('SUN, RAIN');await a.getByLabel('Number of rows').fill('4');await button(a,'Start').click();
  const root=a.locator('[data-tree-node="1"]');await root.focus();await root.press('Enter');
  await expect(a.getByRole('status')).toContainText('children already have columns');await expect(a).toHaveClass(/is-shaking/);
  const negation=a.getByRole('button',{name:/^Node \d+: ¬$/});await negation.focus();await negation.press('Enter');
  await expect(a.getByRole('button',{name:/^Node \d+: ¬$/})).toBeFocused();
  await root.press('Enter');await expect(a.getByRole('status')).toContainText('Columns matched');
  const colours=await a.locator('[data-cell]').first().evaluate(n=>({background:getComputedStyle(n).backgroundColor,alignment:getComputedStyle(n).textAlign}));
  expect(colours.background).not.toBe('rgb(0, 0, 0)');expect(colours.alignment).toBe('center');
  await fillTable(a,tableExercise(levels.table[0].formula));await button(a,'Check').click();
  await expect(a.locator('[data-level="0"] .practice-solved')).toBeVisible();
});
test('circuit levels check descriptions and equivalence has its own tasks',async({page})=>{
  const a=app(page,'circuit');
  for(let i=0;i<levels.circuit.length;i++) {
    await button(a,'Level '+(i+1)).click();await a.getByLabel('Circuit formula').fill(levels.circuit[i].formula);await button(a,'Check').click();
    await expect(a.locator('[data-controls] + [role="status"]')).toContainText('Correct');
  }
  await a.getByLabel('Circuit formula').fill('INPUT₁ ∨ INPUT₂');await button(a,'Check').click();await expect(a.locator('[data-controls] + [role="status"]')).toContainText('Use only');
  await a.getByLabel('Circuit formula').fill('INPUT₁ ∧ INPUT₂');await button(a,'Check').click();await expect(a.locator('[data-controls] + [role="status"]')).toContainText('disagree');
  const e=app(page,'mystery','equivalence');await button(e,'Level 3').click();
  await e.getByLabel('Your formula').fill('(SUN ↔ RAIN) ↔ WIND');await expect(e.getByRole('status')).toContainText('Different');
  await e.getByLabel('Your formula').fill('(SUN ↔ RAIN) ∧ (RAIN ↔ WIND)');await expect(e.getByRole('status')).toContainText('Correct');
  await expect(e.locator('th input')).toBeVisible();
});
test('inference practice requires the SAT clauses before resolution and permits editing',async({page})=>{
  const a=app(page,'resolution','inference');
  await a.getByLabel('CNF clauses').fill('RAIN');await button(a,'Start').click();await expect(a.getByRole('status')).toContainText('do not express');
  await a.getByLabel('CNF clauses').fill('¬RAIN, RAIN ∨ ¬SUN');await button(a,'Start').click();
  await expect(a.getByLabel('CNF clauses')).toHaveAttribute('readonly','');
  await button(a,'Clause 1: ¬RAIN').click();await button(a,'Clause 2: RAIN ∨ ¬SUN').click();await button(a,'Resolve').click();
  await button(a,'Saturated?').click();await expect(a.getByRole('status')).toContainText('inference is invalid');
  await button(a,'Edit').click();await expect(a.getByLabel('CNF clauses')).not.toHaveAttribute('readonly','');await expect(a.locator('[data-clause]')).toHaveCount(0);
  await button(a,'Level 2').click();await a.getByLabel('CNF clauses').fill('RAIN, RAIN ∨ WIND, ¬RAIN, ¬SUN');await button(a,'Start').click();
  await button(a,'Clause 1: RAIN').click();await button(a,'Clause 3: ¬RAIN').click();await button(a,'Resolve').click();await expect(a.getByRole('status')).toContainText('inference is valid');
});


test('independent subformulas can be matched in either order',async({page})=>{
  const a=app(page,'table');await button(a,'Level 3').click();
  await a.getByLabel('Variables (comma-separated)').fill('SUN, RAIN');await a.getByLabel('Number of rows').fill('4');await button(a,'Start').click();
  for(const op of ['¬','∨','∧'])await a.getByRole('button',{name:new RegExp('^Node \\d+: '+op+'$')}).click();
  await expect(a.locator('th').nth(2)).toContainText('¬SUN');
  const model=tableExercise(levels.table[2].formula);
  for(const input of await a.locator('[data-cell]').all()) {
    const [r,c]=(await input.getAttribute('data-cell')).split(':').map(Number), original=c===2?3:c===3?2:c;
    await input.fill(String(model.rows[r].cells[original].value));
  }
  await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct table');
});

test('function-table checker accepts both notations and rejects wrong normal forms',async({page})=>{
  const a=app(page,'normal-form');
  await a.getByLabel('DNF',{exact:true}).fill('(INPUT₁ ∧ INPUT₂)');await a.getByLabel('CNF',{exact:true}).fill('INPUT₁ ∧ INPUT₂');await button(a,'Check').click();
  await expect(a.getByRole('status')).toContainText('Correct');
  await a.getByLabel('CNF',{exact:true}).fill('¬(¬INPUT₁ ∨ ¬INPUT₂)');await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('not in CNF');
  await expect(a).toHaveClass(/is-shaking/);
  await button(a,'Level 2').click();await expect(a.getByLabel('DNF',{exact:true})).toHaveValue('');
});
test('exercise inputs begin without answers and resolution controls have labelled rows',async({page})=>{
  const table=app(page,'table');await expect(table.getByLabel('Variables (comma-separated)')).not.toHaveAttribute('placeholder');
  await expect(table.getByLabel('Number of rows')).toHaveAttribute('type','text');
  const actions=table.locator('.practice-actions');await expect(actions.getByRole('button',{name:'Start',exact:true})).toBeVisible();await expect(actions.getByRole('button',{name:'Restart',exact:true})).toBeVisible();
  await expect(app(page,'resolution','inference').getByLabel('CNF clauses')).not.toHaveAttribute('placeholder');
  await page.getByText('CNF rewriting',{exact:true}).click();
  const rewrite=page.locator('[data-logic-app="sat"][data-kind="rewrite"]');await expect(rewrite.locator('[data-input]')).toHaveValue('');await expect(rewrite.locator('[data-input]')).toBeEditable();await expect(rewrite.getByRole('status')).toContainText('Enter a formula');
  const res=app(page,'resolution');await expect(res.locator('.practice-actions').first().getByLabel('Pivot')).toBeVisible();await expect(res.locator('.practice-actions').first().getByRole('button',{name:'Resolve',exact:true})).toBeVisible();await expect(res.locator('.practice-actions').last().getByRole('button',{name:'Undo',exact:true})).toBeVisible();
});

test('tautological resolvents remain visible as discarded entries and undo removes them',async({page})=>{
  const a=app(page,'resolution');await button(a,'Level 6').click();
  await a.locator('[data-clause="1"]').click();await a.locator('[data-clause="2"]').click();await a.getByLabel('Pivot',{exact:true}).selectOption('SUN');await button(a,'Resolve').click();
  const discarded=a.locator('.practice-discarded');await expect(discarded).toBeVisible();await expect(discarded).toContainText('RAIN ∨ ¬RAIN');await expect(discarded).toContainText('Discarded: tautology');await expect(discarded).toContainText('From 1, 2 on SUN');
  await expect(discarded.getByRole('button')).toHaveCount(0);await expect(a.locator('[data-clause]')).toHaveCount(2);
  await button(a,'Undo').click();await expect(discarded).toHaveCount(0);
});
