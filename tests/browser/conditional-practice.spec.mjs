import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const app=(page,kind)=>page.locator(`[data-logic-app="conditional-practice"][data-kind="${kind}"]`);
const button=(a,name)=>a.getByRole('button',{name,exact:true});
test.beforeEach(async({page})=>{await page.goto('/exercises/conditionals/');});
test('students apply MP, undo, and construct a backward proof',async({page})=>{
  const a=app(page,'chaining'),rules=a.getByRole('group',{name:'Knowledge base'});
  await rules.getByRole('button',{name:'HUMID → CLOUDS',exact:true}).click();await button(a,'Apply MP').click();await expect(a.getByRole('status')).toContainText('First derive');
  for(const rule of ['RAIN → PUDDLES','PUDDLES → HUMID','HUMID → CLOUDS']) {await button(rules,rule).click();await button(a.getByRole('group',{name:'Known facts'}),rule.split(' → ')[0]).click();await button(a,'Apply MP').click();}
  await rules.getByRole('button',{name:/CLOUDS ∧ SNOW/}).click();await button(a,'Apply MP').click();await expect(a.getByRole('status')).toContainText('Select exactly');for(const fact of ['CLOUDS','SNOW'])await button(a.getByRole('group',{name:'Known facts'}),fact).click();await button(a,'Apply MP').click();await expect(a.getByRole('status')).toContainText('STORM has been proved');
  await button(a,'Undo').click();await expect(a.locator('[aria-label="Known facts"]')).not.toContainText('STORM');
  await button(a,'Backward').click();
  await rules.getByRole('button',{name:/CLOUDS ∧ SNOW/}).click();await button(a,'Reason backwards').click();
  await button(rules,'RAIN → CLOUDS').click();await button(a,'Reason backwards').click();
  // Finish the RAIN branch, then close the other given premise.
  await button(a.getByRole('group',{name:'Open goals'}),'RAIN').click();await button(a,'Given fact').click();await button(a,'Given fact').click();
  await expect(a.getByRole('status')).toContainText('STORM has been proved');
  await expect(a.getByRole('region',{name:'Text alternative'})).toBeHidden();await button(a,'Show text alternative').click();await expect(a.getByRole('region',{name:'Text alternative'})).toContainText('Your steps');await button(a,'Hide text alternative').click();
  await button(a,'Circular rules').click();await button(rules,'HUMID → CLOUDS').click();await button(a,'Reason backwards').click();await button(rules,'CLOUDS → HUMID').click();await button(a,'Reason backwards').click();
  for(let i=0;i<3;i++)await button(a,'Failed attempt').click();await expect(a.getByRole('status')).toContainText('no derivation');
});
test('Horn answers are checked semantically and equivalent repeats are rejected',async({page})=>{
  const selection=app(page,'horn').filter({has:page.locator('[type=checkbox]')}),a=page.locator('[data-kind=horn][data-part=examples]'),checks=selection.getByRole('checkbox');
  for(const i of [0,1,3,4,6,7])await checks.nth(i).check();await button(selection,'Check selection').click();await expect(selection.getByRole('status')).toContainText('Correct');
  const inputs=a.getByRole('textbox');await expect(inputs).toHaveCount(3);
  for(const [i,formula] of ['(RAIN | SUN) & ~RAIN','RAIN | SUN','SUN | RAIN'].entries())await inputs.nth(i).fill(formula);
  await button(a,'Check').click();await expect(inputs.nth(0)).toHaveAttribute('aria-invalid','true');await expect(inputs.nth(2)).toHaveAttribute('aria-invalid','true');
  for(const [i,formula] of ['RAIN | SUN','RAIN | SNOW','SUN | SNOW'].entries())await inputs.nth(i).fill(formula);
  await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct');
  await button(a,'Restart').click();for(const input of await inputs.all())await expect(input).toHaveValue('');
});
test('both card tasks accept exactly the potential counterexamples, including keyboard selection',async({page})=>{
  const a=app(page,'wason');await button(a,'3').click();await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Not yet');
  await button(a,'Restart').click();await button(a,'8').focus();await page.keyboard.press('Space');await button(a,'Red').click();await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct');
  await button(a,'A social rule').click();for(const card of ['Beer','16'])await button(a,card).click();await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct');
});
test('conditional circuits, resolution preparation, and planning export controls are available',async({page})=>{
  const circuit=page.locator('[data-preset="conditionals"]');await expect(circuit).toHaveAttribute('data-mounted','true');await expect(circuit.locator('[data-add="NAND"]')).toBeDisabled();
  const resolution=page.locator('[data-deck="conditional-inference"]');await resolution.getByRole('textbox',{name:'SAT formula'}).fill('(RAIN → WIND) ∧ ¬RAIN ∧ WIND');await button(resolution,'Start').click();await expect(resolution.locator('[data-clause]')).toHaveCount(3);await expect(resolution.locator('[data-cnf]')).toBeVisible();await expect(resolution.locator('[data-cnf]')).toContainText('(¬RAIN ∨ WIND) ∧ ¬RAIN ∧ WIND');await button(resolution,'Edit').click();await expect(resolution.locator('[data-cnf]')).toBeHidden();
  await expect(page.locator('[data-logic-app="sat"]')).toHaveCount(0);
  await button(circuit,'4. XNOR · NAND, AND').click();await expect(circuit.locator('[data-add=AND]')).toBeEnabled();await expect(circuit.locator('[data-add=NAND]')).toBeEnabled();
  for(const planning of await page.locator('[data-kind="planning"]').all())await expect(button(planning,'Download PNG')).toBeEnabled();
  // Presence and capture scope only: never generate an image in this suite.
  const monkey=page.locator('[data-example="monkey"]');await monkey.locator('[data-language]').fill('BoxUnderBanana; OnBox; HasBanana');await button(monkey,'Check language').click();await monkey.locator('[data-initial]').fill('none');await monkey.locator('[data-goal]').fill('HasBanana');await button(monkey,'Plan!').click();await expect(monkey.locator('[data-picture] .monkey-box svg')).toHaveCount(1);await expect(monkey.locator('[data-picture] .monkey-banana svg')).toHaveCount(1);
});
test('new activities are accessible and do not widen the page',async({page})=>{
  await expect(app(page,'wason')).toHaveAttribute('data-mounted','true');
  const result=await new AxeBuilder({page}).include('.conditional-practice').analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('exercise-only glossary entries return to their introductions',async({page})=>{
  await page.goto('/textbook/glossary/');
  for(const [term,path] of [['prefix-notation','formal-languages/#polish-notation'],['postfix-notation','formal-languages/#shunting-yard'],['monotonicity','valid-inference/#monotonicity-of-deductive-inference']])await expect(page.locator(`#${term} p a`)).toHaveAttribute('href',`/exercises/${path}`);
});

test('planning exercises require language and state translations without frame autofill',async({page})=>{
  const a=page.locator('[data-example="three"]'),status=a.locator('.conditional-aside [role=status]');
  await expect(button(a,'Use chapter frames')).toHaveCount(0);await expect(a.locator('[data-initial]')).toHaveValue('');await expect(a.locator('[data-goal]')).toHaveValue('');
  await expect(a.locator('[data-task-pictures]')).not.toContainText('On(');
  await button(a,'Plan!').click();await expect(status).toContainText('Check your language');
  await a.locator('[data-language]').fill('On(B,R)');await button(a,'Check language').click();await expect(a.locator('[data-language-feedback]')).toHaveAttribute('data-feedback','incorrect');
  await a.locator('[data-language]').fill('On(R,B,t); On(G,B,t); On(B,R,t); On(B,G,t)');await button(a,'Check language').click();await expect(a.locator('[data-language-feedback]')).toHaveAttribute('data-feedback','correct');
  await a.locator('[data-initial]').fill('On(R,G)');await a.locator('[data-goal]').fill('On(B,G), On(G,R)');await button(a,'Plan!').click();await expect(status).toContainText('pictured starting state');
  await a.locator('[data-initial]').fill('On(G,B), On(B,R)');await button(a,'Plan!').click();await button(a,'Last step').click();await expect(status).toContainText('Unexplained change');
});
test('equivalence rewrite accepts reordered DNF and rejects other forms or truth-functions',async({page})=>{
  const a=app(page,'equivalence'),input=a.getByRole('textbox',{name:'DNF rewrite'});
  await input.fill('RAIN | SUN');await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('different truth-values');
  await input.fill('RAIN <-> SUN');await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Write a DNF');
  await input.fill('(SUN & RAIN) | (~SUN & ~RAIN)');await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct');
});

test('planning time notation is visible and accepts missing indices or separators',async({page})=>{
  const a=page.locator('[data-example="three"]');
  await expect(a.locator('[data-state-help]')).toBeVisible();
  await a.locator('[data-language]').fill('On(R B t) On(G B t) On(B R t) On(B G t)');await button(a,'Check language').click();
  await a.locator('[data-initial]').fill('On(G B 0) On(B R 0)');await a.locator('[data-goal]').fill('On(B G 4) On(G R 4)');await button(a,'Plan!').click();await expect(a.locator('.conditional-aside [role=status]')).toContainText('Time 0');
  await a.locator('[data-horizon]').fill('2');await expect(a.locator('[data-goal]')).toHaveValue('On(B,G,2); On(G,R,2)');
});
test('conditionals pseudocode requires complete conditions and arguments',async({page})=>{
  const a=page.getByRole('region',{name:'Pseudocode practice: conditionals'});
  const levels=await a.locator('[data-levels]').evaluate(n=>JSON.parse(n.textContent));
  for(let i=0;i<levels.length;i++) {
    await a.getByRole('button',{name:new RegExp('^'+(i+1)+'\\. ')}).click();const fields=a.locator('input');
    await fields.first().fill('not');await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Not quite');
    for(let j=0;j<levels[i].answers.length;j++)await fields.nth(j).fill(levels[i].answers[j]);
    await button(a,'Check').click();await expect(a.getByRole('status')).toContainText('Correct');
  }
});
test('laptop circuit and chaining workspaces fit without screenshots',async({page})=>{
  await page.setViewportSize({width:1366,height:768});
  const circuit=page.locator('[data-preset="conditionals"]');const box=await circuit.boundingBox();expect(box.height).toBeLessThan(740);
  const canvas=await circuit.locator('.boolean-circuit').boundingBox();expect(canvas.height).toBeGreaterThan(400);
  const chaining=app(page,'chaining');await button(chaining,'Backward').click();await expect(chaining.getByRole('group',{name:'Known facts'})).toContainText('RAIN');await expect(chaining.getByRole('group',{name:'Known facts'})).toContainText('SNOW');
  expect((await chaining.boundingBox()).height).toBeLessThan(740);
});

test('monkey accepts explicit frame conditions and copied final punctuation',async({page})=>{
  const a=page.locator('[data-example="monkey"]'),status=a.locator('.conditional-aside [role=status]');
  await a.locator('[data-language]').fill('BoxUnderBanana, OnBox, HasBanana');await button(a,'Check language').click();
  await a.locator('[data-initial]').fill('none');await a.locator('[data-goal]').fill('HasBanana');
  const {monkeyFrames}=await import('../../assets/js/logic/planning.js');
  for(let i=0;i<2;i++)await a.locator(`[data-frame="${i}"]`).fill(monkeyFrames[i]+'.');
  await button(a,'Plan!').click();await expect(status).toContainText('PushBox');await button(a,'Last step').click();await expect(status).toContainText('goal conditions hold');await expect(status).not.toContainText('Unexplained');
  await a.locator('[data-horizon]').fill('2');await button(a,'Plan!').click();await expect(status).toContainText('No model');
});

test('XOR with power implements XNOR in conditional level three',async({page})=>{
  const a=page.locator('[data-preset="conditionals"]');await button(a,'3. XNOR · XOR, 1').click();
  await expect(a.locator('[data-node="POWER"]')).toHaveCount(1);await expect(a.locator('[data-add="AND"]')).toBeDisabled();
  await a.locator('.boolean-connections summary').click();
  for(const [id,inputs] of [['g1',['X (INPUT)','Y (INPUT)']],['g2',['g1 (XOR)','POWER (POWER)']]]) {
    await button(a,'+ XOR').click();for(let i=0;i<inputs.length;i++)await a.getByRole('group',{name:`${id} input ${i+1}`,exact:true}).getByRole('button',{name:inputs[i],exact:true}).click();
  }
  await button(a,'Connect from g2').click();await button(a,'Connect to out input 1').click();await button(a,'Check circuit').click();
  await expect(a.locator('[data-check-result]')).toContainText('implements XNOR');
});
