import {test,expect} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const app=(page,kind)=>page.locator(`[data-logic-app="deduction"][data-kind="${kind}"]`).first();
const button=(a,name)=>a.getByRole('button',{name,exact:true});
const state=a=>a.locator('.nd-status');
async function menu(a){if(await a.locator('.nd-sidebar').isHidden())await button(a,'Rules').click();}
async function rule(a,name){await menu(a);const group=['Ex falso','¬⊥ · classical','⊤ Intro'].includes(name)?'⊥, ⊤':name[0];await a.locator(`[data-rule-tab="${group}"]`).click();await button(a,name).click();}
async function assume(a,value){await menu(a);await button(a,'+ Assumption').click();await a.getByRole('dialog').getByRole('textbox',{name:'Formula',exact:true}).fill(value);await button(a.getByRole('dialog'),'Apply').click();await expect(a.locator('[data-node][aria-pressed="true"]')).toHaveCount(0);const ids=await a.locator('[data-node]').evaluateAll(ns=>ns.map(n=>Number(n.dataset.node)));await a.locator(`[data-node="${Math.max(...ids)}"]`).first().click();}
async function modal(a,label,value){const d=a.getByRole('dialog');const field=d.getByRole('textbox',{name:label,exact:true});await field.fill(value);await button(d,'Apply').click();}
test('direct rule buttons construct conjunction and keep assumptions off the canvas',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/textbook/proofs/');const a=app(page,'canvas');await expect(a).toHaveAttribute('data-mounted','true');
  await a.locator('[data-node="0"]').first().click();await rule(a,'∧ Elim · right');await expect(state(a)).toContainText('WIND');
  await expect(a.locator('[data-node][aria-pressed="true"]')).toHaveCount(0);await a.locator('[data-node="0"]').first().click();await rule(a,'∧ Elim · left');
  await a.locator('[data-node="1"]').first().click();await a.locator('[data-node="2"]').first().click();await rule(a,'∧ Intro');
  await expect(state(a)).toContainText('Derivation complete');await expect(a.locator('[data-node][aria-pressed="true"]')).toHaveCount(0);await expect(a.locator('.nd-board')).not.toContainText('Open assumptions');
  await button(a,'Text alternative').click();await expect(a.locator('ol')).toContainText('Open: h0');expect(errors).toEqual([]);
});
test('dialogs discharge assumptions and deletion removes dependent steps',async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'canvas');await button(a,'Temporary assumption').click();await assume(a,'RAIN');
  await rule(a,'∨ Intro · left');await modal(a,'Additional formula','WIND');await a.locator('[data-node="1"]').first().click();await rule(a,'→ Intro');await a.locator('[data-node="0"]').first().click();await button(a.getByRole('dialog'),'Apply').click();
  await expect(state(a)).toContainText('Derivation complete');await a.locator('[data-node="0"]').first().click();await expect(button(a,'Delete step 1')).toHaveCount(0);await menu(a);await expect(button(a,'+ Assumption')).toBeDisabled();await expect(button(a,'↶ Undo')).toBeDisabled();
  await page.goto('/tools/natural-deduction/');const scratch=app(page,'sandbox');await assume(scratch,'A');await rule(scratch,'∨ Intro · left');await modal(scratch,'Additional formula','B');await scratch.locator('[data-node="0"]').click();await button(scratch,'Delete step 1').click();await expect(scratch.locator('[data-node]')).toHaveCount(0);await menu(scratch);await button(scratch,'↶ Undo').click();await expect(scratch.locator('[data-node]')).toHaveCount(2);
});
test('save and reload a schematic derived rule and instantiate a compound formula',async({page})=>{
  await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');await assume(a,'A');await rule(a,'→ Intro');await a.locator('[data-node="0"]').first().click();await button(a.getByRole('dialog'),'Apply').click();await a.locator('[data-node="1"]').first().click();await menu(a);await button(a,'Save lemma').click();await modal(a,'Name','Identity');
  const downloading=page.waitForEvent('download');await button(a,'Save').click();const file=await downloading,path=await file.path();
  await page.reload();await expect(a).toHaveAttribute('data-mounted','true');await a.locator('input[type=file]').setInputFiles(path);await menu(a);await expect(button(a,'Identity')).toBeVisible();
  // Deselect the restored proof's (empty) selection: a closed rule needs no premises.
  await menu(a);await button(a,'Identity').click();await modal(a,'Formula for A','RAIN ∧ WIND');await expect(a.locator('.nd-board')).toContainText('((RAIN ∧ WIND) → (RAIN ∧ WIND))');await expect(a.locator('[data-node][aria-pressed="true"]')).toHaveCount(0);
  const texDownload=page.waitForEvent('download');await button(a,'LaTeX').click();expect((await texDownload).suggestedFilename()).toBe('derivation.tex');
  await expect(button(a,'Download PNG')).toBeVisible(); // Do not capture an image in tests.
  const choosing=page.waitForEvent('filechooser');await menu(a);await button(a,'Load lemmas').click();await (await choosing).setFiles(path);await expect(a.locator('[data-lemma]')).toHaveCount(2);
});
test('Lean output is highlighted, editable and linked to a populated playground',async({page})=>{
  await page.goto('/tools/lean-correspondence/');const a=app(page,'lean');await a.getByRole('textbox',{name:'Lean proof',exact:true}).fill('variable (A : Prop)\nexample (h : A) : A := by\n  exact h');await button(a,'Lean → ND').click();await expect(state(a)).toContainText('Translated and checked');
  await button(a,'ND → Lean').click();await expect(a.locator('code')).toContainText('example');const href=await page.getByRole('link',{name:'Open in Lean (opens in a new tab)',exact:true}).first().getAttribute('href');expect(decodeURIComponent(href)).toContain('example');
  const count=await a.locator('[data-node]').count();await button(a,'Edit Lean').click();await a.getByRole('textbox',{name:'Lean proof',exact:true}).fill('example : False := by\n  sorry');await button(a,'Lean → ND').click();await expect(state(a)).toContainText('Holes');await expect(a.locator('[data-node]')).toHaveCount(count);
});
test('worked displays show only the relevant example, with controls above stepped proofs',async({page})=>{
  await page.goto('/textbook/proofs/');const heating=app(page,'worked');await expect(heating.locator('.nd-board')).toContainText('HEATING');await expect(button(heating,'Next step')).not.toBeVisible();await expect(heating.locator('[aria-label="Examples"]')).not.toBeVisible();
  const a=page.locator('[data-kind="worked"][data-example="conditional"]');await expect(a.locator('.nd-board')).not.toContainText('Add an assumption');await a.locator('.nd-board').dblclick();await expect(a.getByRole('dialog')).not.toBeVisible();
  for(let i=0;i<2;i++)await button(a,'Next step').click();await expect(state(a)).toContainText('Apply ∨ Intro · left to RAIN');await expect(state(a).locator('li')).toHaveCount(1);await expect(a.locator('.nd-board button')).toHaveCount(0);
  const board=await a.locator('.nd-board').boundingBox(),nav=await a.locator('.nd-navigation').first().boundingBox();expect(nav.y+nav.height).toBeLessThanOrEqual(board.y);
  const rules=app(page,'rules');await expect(rules.locator('.nd-rules > .nd-tree')).toHaveCount(3);await button(rules,'∨').click();await expect(rules.locator('.nd-rules')).toContainText('∨ Elim');await button(rules,'Assumption').click();await expect(rules.locator('.nd-rules')).toContainText('A · h');await expect(rules.locator('.nd-picker')).toContainText('Operator:');expect(await rules.locator('.nd-picker').evaluate(n=>n.firstElementChild.textContent)).toBe('Assumption');
});
test('exercise tabs retain drafts and completion marks without a long level list',async({page})=>{
  await page.goto('/exercises/proof/');const a=app(page,'practice');await expect(a.locator('[aria-label="Levels"] button')).toHaveCount(4);await button(a,'Negation').click();await expect(a.locator('[aria-label="Levels"] button')).toHaveCount(6);
  await assume(a,'SUN');await button(a,'Conditionals').click();await expect(a.locator('[aria-label="Levels"] button')).toHaveCount(5);await button(a,'Negation').click();await expect(a.locator('.nd-board')).toContainText('SUN');
  await button(a,'2').click(); // A ⊢ ¬¬A
  await assume(a,'¬A');await a.locator('[data-node="0"]').first().click();await rule(a,'¬ Elim');await a.locator('[data-node="2"]').first().click();await rule(a,'¬ Intro');await a.locator('[data-node="1"]').first().click();await button(a.getByRole('dialog'),'Apply').click();await expect(state(a)).toContainText('Derivation complete');await expect(button(a,'2 ✓')).toBeVisible();
});
test('proof apps and rule dialogs have accessible controls and fit the page',{ tag: '@mobile' }, async({page})=>{
  await page.goto('/textbook/proofs/');const a=page.locator('[data-kind="worked"][data-example="conditional"]');await button(a,'Next step').focus();await page.keyboard.press('Enter');await expect(state(a)).toContainText('Assume');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const result=await new AxeBuilder({page}).include('[data-logic-app="deduction"]').analyze();expect(result.violations).toEqual([]);
  const c=app(page,'canvas');await menu(c);await button(c,'+ Assumption').click();const modalAudit=await new AxeBuilder({page}).include('.nd-dialog:not([hidden])').analyze();expect(modalAudit.violations).toEqual([]);await page.keyboard.press('Escape');await expect(c.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('link',{name:'Open this code in Lean (opens in a new tab)'}).first()).toHaveAttribute('href',/#code=/);
});

test('one assumption can supply both premises and the compact canvas fits a laptop',async({page})=>{
  await page.setViewportSize({width:1366,height:768});await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');
  await assume(a,'A');await menu(a);await button(a,'Use selected formula again').click();await expect(a.locator('.nd-order').first()).toHaveText('1,2');await rule(a,'∧ Intro');await expect(a.locator('.nd-board')).toContainText('(A ∧ A)');await expect(state(a).locator('li')).toHaveCount(1);
  const sizes=await a.evaluate(el=>[el,...el.querySelectorAll('.nd-layout,.nd-board,.nd-sidebar,.nd-rule-groups,.nd-rule-group,.nd-toolbar,.nd-lemmas,.nd-status,.nd-utilities')].map(n=>({class:n.className,w:Math.round(n.getBoundingClientRect().width),h:Math.round(n.getBoundingClientRect().height)})));expect((await a.boundingBox()).height,JSON.stringify(sizes)).toBeLessThan(720);
  const board=a.locator('.nd-board'),before=await board.boundingBox();expect(before.width).toBeCloseTo((await a.locator('.nd-layout').boundingBox()).width,0);await button(a,'Resize canvas height').scrollIntoViewIfNeeded();const handle=await button(a,'Resize canvas height').boundingBox();await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);await page.mouse.down();await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2+80);await page.mouse.up();expect((await board.boundingBox()).height).toBeGreaterThan(before.height+40);
});

test('canvas panels move, hints float, and right-click offers applicable rules',async({page})=>{
  await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');await assume(a,'A ∧ B');
  await a.locator('[data-node="0"]').click({button:'right'});const context=a.getByRole('group',{name:'Applicable rules'});
  await expect(context).toBeVisible();expect(await button(context,'∧ Elim · left').locator('.nd-math').evaluate(n=>getComputedStyle(n).fontFamily)).toContain('Comic Shanns');await button(context,'∧ Elim · left').click();await expect(state(a)).toContainText('∧ Elim');
  await menu(a);await expect(button(a,'Save lemma').locator('svg')).toHaveCount(1);await expect(button(a,'Save lemma')).toHaveText('');expect(await button(a,'Save lemma').locator('svg').innerHTML()).not.toBe(await button(a,'Save').locator('svg').innerHTML());await expect(button(a,'Load lemmas')).toHaveText('');await expect(a.locator('.nd-rule-help')).toHaveCount(0);
  const save=await button(a,'Save lemma').boundingBox(),load=await button(a,'Load lemmas').boundingBox();expect(save.y).toBeCloseTo(load.y,0);const canvas=await a.locator('.nd-board').boundingBox(),toggle=await button(a,'Rules').boundingBox();expect(toggle.y).toBeGreaterThanOrEqual(canvas.y);expect(toggle.y+toggle.height).toBeLessThan(canvas.y+canvas.height);expect(toggle.x+toggle.width).toBeLessThanOrEqual(canvas.x+canvas.width);
  await button(a,'Hint').click();const prompt=a.getByRole('dialog');await expect(prompt).toContainText('Select formulas');await expect(button(prompt,'Apply')).not.toBeVisible();
  const handle=prompt.locator('.nd-drag-handle');const before=await prompt.boundingBox();await handle.focus();await page.keyboard.press('ArrowLeft');expect((await prompt.boundingBox()).x).toBeLessThan(before.x);await button(prompt,'Close').click();
  await menu(a);const menuHandle=a.locator('.nd-sidebar .nd-drag-handle');await menuHandle.focus();const old=await a.locator('.nd-sidebar').boundingBox();await page.keyboard.press('ArrowLeft');expect((await a.locator('.nd-sidebar').boundingBox()).x).toBeLessThan(old.x);await button(a,'Close rules').click();
  const board=a.locator('.nd-board');await board.scrollIntoViewIfNeeded();const box=await board.boundingBox();await page.mouse.move(box.x+20,box.y+20);await expect(a.locator('.nd-add-cursor')).toBeVisible();await page.mouse.click(box.x+20,box.y+20);await expect(prompt.getByRole('textbox',{name:'Formula',exact:true})).toBeVisible();await button(prompt,'Close').click();
  await a.locator('[data-node="0"]').first().hover();await expect(a.locator('.nd-add-cursor')).not.toBeVisible();
  expect(await board.evaluate(n=>getComputedStyle(n).scrollbarColor)).not.toBe('auto');
});

test('arrow introduction accepts an unused antecedent and preserves existing assumptions',async({page})=>{
  await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');
  await assume(a,'RAIN');await rule(a,'→ Intro');await button(a.getByRole('dialog'),'Vacuous discharge').click();await modal(a,'Antecedent','RAIN');
  await expect(a.locator('.nd-board')).toContainText('(RAIN → RAIN)');await expect(state(a).locator('li')).toHaveCount(1);await expect(state(a)).toContainText('h0: RAIN');
  await menu(a);await button(a,'Reset derivation').click();await rule(a,'⊤ Intro');
  await a.locator('[data-node="0"]').click({button:'right'});await button(a.getByRole('group',{name:'Applicable rules'}),'→ Intro').click();
  await button(a.getByRole('dialog'),'Vacuous discharge').click();await modal(a,'Antecedent','SUN ∧ WIND');
  await expect(a.locator('.nd-board')).toContainText('((SUN ∧ WIND) → ⊤)');await expect(state(a)).toContainText('No open assumptions.');
  await menu(a);await button(a,'↶ Undo').click();await expect(a.locator('[data-node]')).toHaveCount(1);await expect(a.locator('.nd-board')).not.toContainText('SUN');
});

test('rule previews escape the menu clipping boundary and stay within the viewport',{ tag: '@mobile' }, async({page})=>{
  await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');await menu(a);
  for(const [group,key] of [['¬','notI'],['⊥, ⊤','raa'],['∨','orE']]){
    await a.locator(`[data-rule-tab="${group}"]`).click();const choice=a.locator(`[data-rule="${key}"]`).locator('..');await choice.hover();const tip=choice.locator('.nd-rule-tooltip');await expect(tip).toBeVisible();await expect(tip.locator('.nd-formula').first()).not.toBeEmpty();expect(await tip.locator('.nd-formula').first().evaluate(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(n).color===getComputedStyle(n.closest('.nd-rule-tooltip')).color;})).toBe(true);expect(await tip.evaluate(n=>n.matches(':popover-open'))).toBe(true);
    const box=await tip.boundingBox(),viewport=page.viewportSize();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.y).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(viewport.width);expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
    await page.keyboard.press('Escape');await expect(tip).not.toBeVisible();await menu(a);
  }
});

test('Lean walkthrough links each command to its goal and derivation',async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'lean-walkthrough');await expect(a).toHaveAttribute('data-mounted','true');await expect(a.locator('.nd-goal')).toHaveText('Goal: HEATING');
  for(const [ruleName,goal] of [['→ Elim','COLD'],['→ Elim','RAIN ∨ WIND'],['∨ Intro · left','RAIN']]){
    await button(a,'Next step').click();await expect(a.locator('.nd-rule.is-current')).toHaveText(ruleName);await expect(a.locator('.nd-lean-line[aria-current="step"]')).toHaveCount(1);
    await button(a,'Next step').click();await expect(a.locator('.nd-goal')).toHaveText('Goal: '+goal);await expect(a.locator('.nd-tree.is-current > .nd-inference')).toContainText(goal);await expect(a.locator('.nd-rule.is-current')).toHaveCount(0);
  }
  await button(a,'Next step').click();await expect(a.locator('.nd-goal')).toHaveText('No goals remain');await expect(a.locator('.nd-lean-line[aria-current="step"]')).toHaveText('  exact rain');await button(a,'Next step').click();await expect(button(a,'Next step')).toBeDisabled();
  expect(await a.locator('code').evaluate(n=>getComputedStyle(n).textAlign)).toBe('start');
  await page.goto('/tools/lean-correspondence/');const lean=app(page,'lean');await expect(lean.locator('.code-block .lang-badge svg')).toHaveCount(1);expect(await lean.locator('code').evaluate(n=>getComputedStyle(n).textAlign)).toBe('start');await expect(lean.locator('.code-block').getByRole('button',{name:'View code',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Open in Lean (opens in a new tab)'}).first()).toHaveClass(/link-out/);await expect(app(page,'lean-walkthrough')).toHaveCount(0);
});

test('backward goals meet forward derivations and freeze a finished target',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/textbook/proofs/');const a=app(page,'canvas');
  await button(a,'Goal mode').click();await a.locator('[data-goal="0:"]').click();await rule(a,'∧ Intro');await expect(a.locator('.nd-hole')).toHaveCount(3);
  await a.locator('[data-goal="0:0"]').click();await rule(a,'∧ Elim · right');await modal(a,'Other conjunct','RAIN');
  await expect(a.locator('[data-goal="0:0"]')).toHaveClass(/nd-solved/);
  await a.locator('[data-node="0"]').first().click();await rule(a,'∧ Elim · left');
  await expect(state(a)).toContainText('Derivation complete');await menu(a);await expect(button(a,'+ Goal')).toBeDisabled();await expect(button(a,'∧ Intro')).toBeDisabled();await expect(button(a,'Goal mode')).toBeDisabled();expect(errors).toEqual([]);
});

test('goal plans save, reload and export sorry only for unfinished branches',async({page})=>{
  await page.goto('/tools/lean-correspondence/');const a=app(page,'lean');await menu(a);await button(a,'+ Goal').click();await modal(a,'Formula','RAIN → (RAIN ∨ WIND)');await a.locator('[data-goal="0:"]').click();await rule(a,'→ Intro');
  await a.locator('[data-goal="0:0"]').click();await button(a,'ND → Lean').click();await expect(a.locator('code')).toContainText('sorry');await expect(a.locator('code')).toContainText('intro');
  const downloading=page.waitForEvent('download');await button(a,'Save').click();const path=await(await downloading).path();await page.reload();await expect(a).toHaveAttribute('data-mounted','true');await a.locator('input[type=file]').setInputFiles(path);await expect(a.locator('[data-goal="0:0"]')).toBeVisible();
  await a.locator('[data-goal="0:0"]').click();await rule(a,'∨ Intro · left');await expect(a.locator('[data-goal="0:"]')).toHaveClass(/nd-solved/);await button(a,'ND → Lean').click();await expect(a.locator('code')).not.toContainText('sorry');
});

test('fullscreen supports the icon and F without capturing text input',{ tag: '@mobile' }, async({page})=>{
  await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');await expect(button(a,'Fullscreen').locator('svg path')).toHaveCount(1);await expect(button(a,'Goal mode')).toHaveText('Goals');expect(await button(a,'Goal mode').evaluate(n=>n.nextElementSibling.getAttribute('aria-label'))).toBe('Fullscreen');await button(a,'Fullscreen').click();await expect.poll(()=>a.evaluate(n=>document.fullscreenElement===n||n.classList.contains('nd-fullscreen'))).toBe(true);
  await a.locator('.nd-board').focus();await page.keyboard.press('f');await expect.poll(()=>a.evaluate(n=>document.fullscreenElement===n||n.classList.contains('nd-fullscreen'))).toBe(false);
  await menu(a);await button(a,'+ Assumption').click();await a.getByRole('textbox',{name:'Formula',exact:true}).fill('F');await expect.poll(()=>a.evaluate(n=>document.fullscreenElement===n||n.classList.contains('nd-fullscreen'))).toBe(false);
});

test('equivalence introduction follows a goal regardless of premise selection order',async({page})=>{
  await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');await assume(a,'A → B');await assume(a,'B → A');
  await menu(a);await button(a,'+ Goal').click();await modal(a,'Formula','A ↔ B');
  await a.locator('[data-node="1"]').first().click();await a.locator('[data-node="0"]').first().click();await rule(a,'↔ Intro');await expect(a.locator('[data-goal="0:"]')).toHaveClass(/nd-solved/);
});

test('wide worked proofs remain scrollable and their branches can be folded',{ tag: '@mobile' }, async({page})=>{
  await page.goto('/textbook/proofs/');const a=page.locator('[data-kind="worked"][data-deck="strategies"]');await button(a,'An indirect proof').click();
  while(await button(a,'Next step').isEnabled())await button(a,'Next step').click();
  await expect(state(a)).toContainText('All goals have derivations');const board=a.locator('.nd-board');expect(await board.evaluate(n=>getComputedStyle(n).overflowX)).toBe('auto');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const fold=button(a,'Collapse branch').first();await fold.click();await expect(button(a,'Expand branch').first()).toBeVisible();await expect(button(a,'Expand branch').first()).toHaveText('⋮');expect(await button(a,'Expand branch').first().evaluate(n=>{const s=getComputedStyle(n.nextElementSibling);return s.borderTopStyle==='solid'&&parseFloat(s.borderTopWidth)>0;})).toBe(true);expect(await button(a,'Expand branch').first().evaluate(n=>getComputedStyle(n).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
});

test('right-click switches between backward goals and forward proof rules',async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'canvas');await button(a,'Goal mode').click();await a.locator('[data-goal="0:"]').click({button:'right'});const context=a.getByRole('group',{name:'Applicable rules'});
  await expect(context).toContainText('Work backwards');await button(context,'∧ Intro').click();await expect(a.locator('[data-goal="0:0"]')).toBeVisible();
  await a.locator('[data-node="0"]').click({button:'right'});await expect(context).toContainText('Apply to selected derivations');await button(context,'∧ Elim · left').click();await expect(state(a)).toContainText('∧ Elim');
});

test('Lean playground links sit quietly below code and outside the translator',async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'lean');await expect(a.getByRole('link',{name:'Open in Lean (opens in a new tab)'})).toHaveCount(0);
  const links=page.locator('[data-kind="lean"] + .lean-playground-link').getByRole('link');for(const link of await links.all())await expect(link).toHaveAttribute('href',/#code=/);
  const styles=await page.locator('.lean-playground-link').evaluateAll(ns=>ns.map(n=>({align:getComputedStyle(n).textAlign,size:parseFloat(getComputedStyle(n).fontSize),parentSize:parseFloat(getComputedStyle(n.parentElement).fontSize)})));
  for(const s of styles){expect(s.align).toBe('right');expect(s.size).toBeLessThan(s.parentSize);}
});

test('open assumptions and the text alternative align with their list markers',async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'worked');const status=a.locator('.nd-status');
  expect(await status.evaluate(n=>getComputedStyle(n).textAlign)).toBe('start');
  const items=status.locator('li');expect(await items.count()).toBeGreaterThan(1);
  for(const item of await items.all())expect(await item.evaluate(n=>getComputedStyle(n).textAlign)).toBe('start');
  await button(a,'Text alternative').click();const list=a.locator('.nd-text');await expect(list).toBeVisible();expect(await list.evaluate(n=>getComputedStyle(n).textAlign)).toBe('start');await expect(list.locator('li').first()).not.toHaveText(/^1\./);
});

test('a saved disjunctive syllogism uses the direct proof and lists both input assumptions',async({page})=>{
  const {fromLean}=await import('../../assets/js/logic/deduction-lean.js');const {makeLemma}=await import('../../assets/js/logic/deduction-tools.js');const {emptyProof}=await import('../../assets/js/logic/deduction.js');
  const source=fromLean('variable (A B : Prop)\nexample (h : A ∨ B) (na : ¬A) : B := by\n apply Or.elim h\n · intro a\n   exact False.elim (na a)\n · intro b\n   exact b');
  await page.goto('/tools/natural-deduction/');const a=app(page,'sandbox');await expect(a).toHaveAttribute('data-mounted','true');
  await a.locator('input[type=file]').setInputFiles({name:'syllogism.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'logicalmethods-nd',version:1,proof:emptyProof(),lemmas:[makeLemma(source.proof,source.root,'Disjunctive syllogism')]}))});
  await assume(a,'(RAIN ∧ WIND) ∨ SNOW');await a.locator('[data-node="0"]').click();await assume(a,'¬(RAIN ∧ WIND)');await expect(state(a).locator('li')).toHaveCount(2);
  await a.locator('[data-node="1"]').click();await a.locator('[data-node="0"]').click();await a.locator('[data-node="1"]').click();await menu(a);await button(a,'Disjunctive syllogism').click();
  await expect(state(a)).toContainText('Disjunctive syllogism applied');await expect(state(a).locator('li')).toHaveCount(2);await expect(a.locator('.nd-board')).toContainText('∨ Elim');await expect(a.locator('.nd-board')).not.toContainText('→ Intro');await expect(a.locator('.nd-board')).not.toContainText('→ Elim');
});


test('the Lean walkthrough preserves the original code before its explanation',async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'lean-walkthrough');await expect(a).toHaveAttribute('data-mounted','true');
  const before=await a.evaluate(n=>{for(let s=n.previousElementSibling;s;s=s.previousElementSibling){const code=s.querySelector('code.language-lean');if(code)return {source:code.textContent,connected:code.isConnected,highlighted:!!code.querySelector('.nd-lean-line')};}return null;});
  expect(before).not.toBeNull();expect(before.source).toContain('apply if_cold_then_heating');expect(before.connected).toBe(true);expect(before.highlighted).toBe(false);await expect(a.locator('code.language-lean')).toContainText('apply if_cold_then_heating');
});

test('walkthrough panes align and highlighting preserves code indentation',async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'lean-walkthrough');await expect(a).toHaveAttribute('data-mounted','true');
  const block=await a.locator('.code-block').boundingBox(),board=await a.locator('.nd-board').boundingBox();
  if(page.viewportSize().width>720)expect(block.y).toBeCloseTo(board.y,0);
  const line=a.locator('.nd-lean-line').filter({hasText:'apply if_cold_then_heating'});
  const start=await line.boundingBox();await button(a,'Next step').click();await expect(line).toHaveAttribute('aria-current','step');const active=await line.boundingBox();expect(active.x).toBeCloseTo(start.x,1);expect(active.width).toBeCloseTo(start.width,1);expect(await line.evaluate(n=>getComputedStyle(n).borderInlineStartWidth)).toBe('0px');
});

test('chapter 7 completed derivations can be reset from the canvas controls',{ tag: '@mobile' }, async({page})=>{
  await page.goto('/textbook/proofs/');const a=app(page,'canvas');
  await a.locator('[data-node="0"]').click();await rule(a,'∧ Elim · right');
  await a.locator('[data-node="0"]').first().click();await rule(a,'∧ Elim · left');
  await a.locator('[data-node="1"]').first().click();await a.locator('[data-node="2"]').first().click();await rule(a,'∧ Intro');
  await expect(state(a)).toContainText('Derivation complete');
  await expect(a.locator('[data-example="swap"]')).toHaveClass(/is-complete/);
  await button(a,'Reset derivation').click();
  await expect(a.locator('[data-node]')).toHaveCount(1);
  await expect(a.locator('[data-example="swap"]')).not.toHaveClass(/is-complete/);
  await a.locator('[data-node="0"]').click();await rule(a,'∧ Elim · right');
  await expect(a.locator('[data-node="1"]')).toBeVisible();
});
