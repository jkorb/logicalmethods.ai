import {test,expect} from './fixtures.mjs';
import {reviewScreenshot} from './review-screenshot.mjs';
import {budget} from './budget.mjs';
import AxeBuilder from '@axe-core/playwright';
const root=(page,name)=>page.getByRole('region',{name,exact:true});
test.beforeEach(async({page})=>{await page.goto('/textbook/many-valued/');});
test('Kleene models distinguish explosion, excluded middle and unknown conclusions',{tag:'@mobile'},async({page})=>{
 const app=root(page,'Kleene model space');await expect(app).toHaveAttribute('data-mounted','true');
 await expect(app.locator('[data-model]')).toHaveCount(9);await expect(app.locator('[role="status"]')).toContainText('Valid');
 await app.getByRole('button',{name:'Excluded middle',exact:true}).click();await expect(app.locator('.is-countermodel[data-world-art]')).toHaveCount(3);
 await expect(app.locator('[role="status"]')).toContainText('Invalid');await app.getByRole('button',{name:'Explosion',exact:true}).click();await expect(app.locator('[role="status"]')).toContainText('no world');
 const input=app.getByLabel('Inference',{exact:true});await expect(input).toHaveAttribute('readonly','');
 await input.click({force:true});await expect(input).not.toBeFocused();await app.getByRole('button',{name:'Edit',exact:true}).click();await input.fill('SUN\n∴ RAIN ∨ ¬RAIN');await app.getByRole('button',{name:'Check',exact:true}).click();
 await expect(app.locator('.is-countermodel[data-world-art]')).toHaveCount(1);await expect(input).toHaveAttribute('readonly','');
 await app.getByRole('button',{name:'Edit',exact:true}).click();await input.fill('SUN\n∴ WIND');await app.getByRole('button',{name:'Check',exact:true}).click();await expect(app.locator('[role="status"]')).toContainText('Use SUN and RAIN');await expect(app.locator('[data-model]')).toHaveCount(0);
 await app.getByRole('button',{name:'Reset',exact:true}).click();await expect(app.locator('[data-model]')).toHaveCount(9);
});
test('fuzzy interpretations can be edited by keyboard and rules can be repaired',{tag:'@mobile'},async({page})=>{
 const app=root(page,'Fuzzy predicate interpretations');await expect(app.locator('[role="status"]')).toContainText('degree 0.5');
 const dot=app.getByRole('button',{name:'IsCold point 2: 10°C, 1',exact:true});await dot.focus();await dot.press('ArrowDown');await expect(app.getByRole('button',{name:'IsCold point 2: 10°C, 0.95',exact:true})).toBeFocused();
 await app.getByRole('button',{name:'Edit',exact:true}).click();await app.getByLabel('Formula',{exact:true}).fill('¬IsWarm(x)');await app.getByRole('button',{name:'Check',exact:true}).click();await expect(app.locator('[role="status"]')).toContainText('degree 0.5');
 const rule=root(page,'Checking a fuzzy heating rule');await expect(rule.locator('[role="status"]')).toContainText('fails');
 await rule.getByRole('button',{name:'Edit',exact:true}).click();await rule.getByLabel('Rules',{exact:true}).fill('IsCold(x) ⇒ IsCold(x) ∨ HeatingOn(x)');await rule.getByRole('button',{name:'Check',exact:true}).click();await expect(rule.locator('[role="status"]')).toContainText('holds throughout');
 await rule.getByRole('button',{name:'Reset',exact:true}).click();await expect(rule.locator('[role="status"]')).toContainText('fails');
 const controller=root(page,'A fuzzy heating controller');await expect(controller.locator('[role="status"]')).toContainText('Heating: 50%');
 await controller.getByRole('button',{name:'Edit',exact:true}).click();await controller.getByLabel('Rules',{exact:true}).fill('IsCold(x) ⇒ 0.2\nIsWarm(x) ⇒ 0.4');await controller.getByRole('button',{name:'Check',exact:true}).click();await expect(controller.locator('[role="status"]')).toContainText('Heating: 30%');
 // The controller's examples are rule sets; its memberships are fixed.
 await expect(controller.locator('.mv-knot, .mv-point-editor')).toHaveCount(0);
 await controller.getByRole('button',{name:'Low when warm',exact:true}).click();await expect(controller.locator('[role="status"]')).toContainText('Heating: 60%');
 await controller.getByRole('button',{name:'Cold only',exact:true}).click();await expect(controller.locator('[role="status"]')).toContainText('Heating: 100%');
});
test('Kleene SQL examples execute with NULL and the derivation steps',{tag:'@mobile'},async({page},info)=>{
 for(const [title,rows] of [['Comparing a missing value', [1,4]],['No recorded match',[5]],['Kleene truth-functions in SQL',[3,9,9]],['Checking a Kleene identity',[0,0,1,1]],['Kleene countermodels',[0,3,2,0]],['Initializing Kleene values',[9]],['Initializing Kleene valuations',[9]]]) {
  const app=root(page,title);await app.getByRole('button',{name:'Run',exact:true}).click();await expect(app.locator('[data-sql-status]')).toHaveAttribute('data-state','success',{timeout:budget(15000)});
  for(const [i,n] of rows.entries())await expect(app.locator('[data-sql-results] table').nth(i).locator('tbody tr')).toHaveCount(n);
  if(title==='Kleene truth-functions in SQL')await reviewScreenshot(app,{path:`tmp/many-valued/revision-4/sql-operations-${info.project.name}.png`});
 }
 const app=root(page,'A Kleene derivation');await app.getByRole('button',{name:'Last step',exact:true}).click();await expect(app.locator('.boolean-derivation li')).toHaveCount(3);for(const line of await app.locator('.boolean-derivation li').all())await expect(line).toContainText('=');await expect(app.locator('.boolean-derivation li').last()).toContainText('NOT X');
});
for(const scheme of ['light','dark'])test(`many-valued apps fit and remain accessible in ${scheme}`,{tag:'@mobile'},async({page},info)=>{
 await page.emulateMedia({colorScheme:scheme});await page.reload();await expect(root(page,'Kleene model space')).toHaveAttribute('data-mounted','true');await page.evaluate(()=>document.fonts.ready);
 expect((await new AxeBuilder({page}).include('.mv-app').analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)}))).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 if(scheme==='light')for(const title of ['Kleene model space','Fuzzy predicate interpretations','A fuzzy heating controller'])await reviewScreenshot(root(page,title),{path:`tmp/many-valued/${title.replaceAll(' ','-')}-${info.project.name}.png`});
});

test('curve dragging, numeric controls and fullscreen preserve the model',async({page})=>{
 const app=root(page,'Fuzzy predicate interpretations');const dot=app.getByRole('button',{name:'IsCold point 2: 10°C, 1',exact:true});await dot.scrollIntoViewIfNeeded();
 const box=await dot.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+box.height/2+30);await page.mouse.up();
 await expect(app.getByRole('button',{name:'IsCold point 2: 10°C, 1',exact:true})).toHaveCount(0);
 await app.getByLabel('Membership of selected point',{exact:true}).fill('0.6');await app.getByLabel('Membership of selected point',{exact:true}).press('Tab');
 await expect(app.getByRole('button',{name:'IsCold point 2: 10°C, 0.6',exact:true})).toBeVisible();
 await app.getByRole('button',{name:'Fullscreen',exact:true}).click();await expect.poll(()=>app.evaluate(n=>document.fullscreenElement===n)).toBe(true);
 await app.getByRole('button',{name:'Exit fullscreen',exact:true}).click();await expect.poll(()=>page.evaluate(()=>document.fullscreenElement===null)).toBe(true);
});

test('SQL outputs use natural table heights and share a row when they fit',{tag:'@mobile'},async({page},info)=>{
 const a=root(page,'A database with a missing value');await a.getByRole('button',{name:'Run',exact:true}).click();await expect(a.locator('[data-sql-status]')).toHaveAttribute('data-state','success',{timeout:budget(15000)});
 const tables=a.locator('.sql-result-table');await expect(tables).toHaveCount(3);
 for(const t of await tables.all())expect(await t.evaluate(n=>n.scrollHeight<=n.clientHeight+1)).toBe(true);
 if(info.project.name==='desktop'){
  const boxes=await tables.evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y};}));expect(boxes[0].y).toBeCloseTo(boxes[1].y,0);expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
 }
 await reviewScreenshot(a,{path:`tmp/many-valued/revision-2/sql-results-${info.project.name}.png`});
});
test('world targets align with the world shapes and their halos',{tag:'@mobile'},async({page})=>{
 const a=root(page,'Kleene model space');await expect(a.locator('[data-model]')).toHaveCount(9);
 const geometry=await a.evaluate(n=>[...n.querySelectorAll('[data-model]')].map(b=>{
  const halo=n.querySelector(`[data-world-art="${b.dataset.model}"] ellipse`),r=b.getBoundingClientRect(),h=halo.getBoundingClientRect();return {dx:r.x+r.width/2-h.x-h.width/2,dy:r.y+r.height/2-h.y-h.height/2};
 }));for(const {dx,dy} of geometry){expect(Math.abs(dx)).toBeLessThan(2);expect(Math.abs(dy)).toBeLessThan(2);}
});
test('fuzzy operation buttons select visible combinations and rules are checked together',async({page})=>{
 const a=root(page,'Fuzzy predicate interpretations');const before=await a.locator('.mv-result-curve').getAttribute('d');
 const buttons=a.locator('.mv-operations button');await expect(buttons).toHaveCount(3);await buttons.first().click();await expect(buttons.first()).toHaveAttribute('aria-pressed','true');await expect(a.getByLabel('Formula',{exact:true})).toHaveValue('¬IsCold(x)');await expect(a.locator('.mv-result-curve')).not.toHaveAttribute('d',before);
 expect(await a.locator('.mv-result-curve').evaluate(n=>getComputedStyle(n).strokeDasharray)).toBe('none');
 await buttons.last().click();await expect(a.getByLabel('Formula',{exact:true})).toHaveValue('IsCold(x) ∨ IsWarm(x)');
 const rule=root(page,'Checking a fuzzy heating rule');await rule.getByRole('button',{name:'Edit',exact:true}).click();await rule.getByLabel('Rules',{exact:true}).fill('IsCold(x) ⇒ IsCold(x)\nIsCold(x) ⇒ HeatingOn(x)');await rule.getByRole('button',{name:'Check',exact:true}).click();await expect(rule.locator('[role="status"]')).toContainText('Rule 2 fails');
});

test('fuzzy operators follow the selected predicate and explicit second operand',{tag:'@mobile'},async({page})=>{
 const a=root(page,'Fuzzy predicate interpretations'),input=a.getByLabel('Formula',{exact:true});
 await a.locator('.mv-operations button').first().click();await expect(input).toHaveValue('¬IsCold(x)');
 await a.getByRole('group',{name:'Predicate interpretation',exact:true}).getByRole('button',{name:'⟦IsHot⟧',exact:true}).click();await expect(input).toHaveValue('¬IsHot(x)');
 await a.locator('.mv-operations button').nth(1).click();await expect(input).toHaveValue('IsHot(x) ∧ IsWarm(x)');
 await a.getByRole('group',{name:'Second predicate',exact:true}).getByRole('button',{name:'IsCold',exact:true}).click();await expect(input).toHaveValue('IsHot(x) ∧ IsCold(x)');
 await a.getByRole('button',{name:'Reset',exact:true}).click();await expect(input).toHaveValue('IsCold(x) ∨ IsWarm(x)');await expect(a.getByRole('button',{name:'⟦IsCold⟧',exact:true})).toHaveAttribute('aria-pressed','true');
});
test('two-input controller shows both input calculations and defuzzification',{tag:'@mobile'},async({page},info)=>{
 const a=root(page,'Temperature and humidity controller');await expect(a.locator('[role=status]')).toContainText('52.5% cooling');
 const temp=a.getByRole('slider',{name:'Temperature',exact:true}),humidity=a.getByRole('slider',{name:'Relative humidity',exact:true});
 await temp.fill('34');await humidity.fill('20');await expect(a.locator('[role=status]')).toContainText('80% cooling');
 await a.getByRole('button',{name:'Mamdani',exact:true}).click();await expect(a.locator('[role=status]')).toContainText('Centroid');await expect(a.locator('.mv-result-area')).toHaveCount(1);
 await a.getByRole('button',{name:'Reset',exact:true}).click();await expect(temp).toHaveValue('26');await expect(humidity).toHaveValue('70');await expect(a.locator('[role=status]')).toContainText('52.5% cooling');
 expect(await a.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
 await reviewScreenshot(a,{path:`tmp/many-valued/revision-3/ac-sugeno-${info.project.name}.png`});
 await a.getByRole('button',{name:'Mamdani',exact:true}).click();await reviewScreenshot(a,{path:`tmp/many-valued/revision-3/ac-mamdani-${info.project.name}.png`});
});

test('the chapter introduces invalid rules before the K₃ rules and leaves proof construction to exercises',{tag:'@mobile'},async({page},info)=>{
 const invalid=page.getByRole('figure',{name:'Classical rules that fail in K₃',exact:true}),valid=root(page,'K₃ rules');
 await expect(invalid.locator('.inference--invalid')).toHaveCount(3);expect((await invalid.boundingBox()).y).toBeLessThan((await valid.boundingBox()).y);
 await expect(page.locator('[data-logic-app="deduction"][data-kind="canvas"]')).toHaveCount(0);
 await reviewScreenshot(invalid,{path:`tmp/many-valued/revision-3/invalid-rules-${info.project.name}.png`});
});


test('AC rules edit the weights and outputs in both modes, with drafts and reset',{tag:'@mobile'},async({page},info)=>{
 const a=root(page,'Temperature and humidity controller'),input=a.getByLabel('Controller rules',{exact:true}),status=a.locator('[role=status]');
 await input.click({force:true});await expect(input).not.toBeFocused();await expect(input).toHaveAttribute('readonly','');
 await a.getByRole('button',{name:'Edit',exact:true}).click();
 await input.fill('IsWarm(x) ∨ IsHumid(y) ↦ 0.5\nIsHot(x) ↦ 1');
 await expect(status).toContainText('Check to apply');await a.getByRole('button',{name:'Check',exact:true}).click();
 await expect(status).toContainText('50% cooling');await expect(a.getByRole('meter',{name:'Rule 1 weight',exact:true})).toHaveAttribute('value','0.8');
 await expect(input).toHaveAttribute('readonly','');
 await a.getByRole('button',{name:'Mamdani',exact:true}).click();await a.getByRole('button',{name:'Edit',exact:true}).click();
 await input.fill('IsHumid(x) ↦ High');await a.getByRole('button',{name:'Check',exact:true}).click();await expect(status).toHaveAttribute('data-state','error');await expect(status).toContainText('IsHumid(y)');
 await a.getByRole('button',{name:'Sugeno',exact:true}).click();await expect(status).toContainText('50% cooling');
 await a.getByRole('button',{name:'Mamdani',exact:true}).click();await expect(input).toHaveValue('IsHumid(x) ↦ High');await expect(input).toBeEditable();
 await input.fill('IsHumid(y) ↦ High');await a.getByRole('button',{name:'Check',exact:true}).click();await expect(status).toContainText('Centroid: 87.8% cooling');
 await expect(a.locator('[data-rule-weight]')).toHaveCount(1);
 await reviewScreenshot(a,{path:`tmp/many-valued/revision-4/edited-controller-${info.project.name}.png`});
 await a.getByRole('button',{name:'Reset',exact:true}).click();await expect(status).toContainText('52.5% cooling');await expect(a.locator('[data-rule-weight]')).toHaveCount(3);
 await a.getByRole('button',{name:'Mamdani',exact:true}).click();await expect(a.locator('[data-rule-weight]')).toHaveCount(3);await expect(input).toHaveAttribute('readonly','');
 await reviewScreenshot(a,{path:`tmp/many-valued/revision-4/controller-${info.project.name}.png`});
});


test('introductory memberships and the direct heating policy remain editable',{tag:'@mobile'},async({page},info)=>{
 const memberships=root(page,'Editing fuzzy memberships');await expect(memberships.locator('form')).toBeHidden();
 await memberships.getByRole('button',{name:'⟦IsWarm⟧',exact:true}).click();
 await memberships.getByRole('button',{name:'IsWarm point 2: 10°C, 0',exact:true}).focus();
 await page.keyboard.press('ArrowUp');await expect(memberships.getByRole('button',{name:'IsWarm point 2: 10°C, 0.05',exact:true})).toBeFocused();
 await expect(memberships.locator('.mv-base-curve.is-active')).toHaveCount(1);
 await reviewScreenshot(memberships,{path:`tmp/many-valued/revision-5/memberships-${info.project.name}.png`});
 const policy=root(page,'Coldness determines heating power'),meter=policy.getByRole('meter',{name:'Heating power',exact:true});
 await expect(policy.locator('form')).toBeHidden();await expect(meter).toHaveAttribute('value','0.5');
 const temp=policy.getByRole('slider',{name:'Temperature',exact:true});await temp.fill('17');expect(Number(await meter.getAttribute('value'))).toBeCloseTo(.3);await expect(policy.locator('[data-heating-power]')).toHaveText('30%');
 await policy.getByRole('button',{name:'IsCold point 2: 10°C, 1',exact:true}).focus();await page.keyboard.press('ArrowDown');
 await expect(policy.locator('[data-heating-power]')).toHaveText('28.5%');
 await policy.getByRole('button',{name:'Reset',exact:true}).click();await expect(temp).toHaveValue('15');await expect(meter).toHaveAttribute('value','0.5');
 await page.emulateMedia({reducedMotion:'reduce'});expect(await policy.locator('.mv-policy-flow').evaluate(n=>getComputedStyle(n).animationName)).toBe('none');
 await reviewScreenshot(policy,{path:`tmp/many-valued/revision-5/policy-${info.project.name}.png`});
});
