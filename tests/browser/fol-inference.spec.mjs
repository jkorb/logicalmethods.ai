import {test,expect} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const app=(page,kind)=>page.locator(`[data-logic-app="fol-inference"][data-kind="${kind}"]`);
const button=(a,name)=>a.getByRole('button',{name,exact:true});
async function expectResolutionLayout(a){
 const layout=await a.locator('.sat-layout').evaluate(el=>{
  const board=el.querySelector('.sat-work').getBoundingClientRect(),aside=el.querySelector('.sat-aside').getBoundingClientRect(),panel=el.getBoundingClientRect();
  return {boardWidth:board.width,panelWidth:panel.width,boardBottom:board.bottom,asideTop:aside.top,asideRight:aside.right,panelRight:panel.right};
 });
 expect(Math.abs(layout.boardWidth-layout.panelWidth)).toBeLessThanOrEqual(1);
 expect(layout.asideTop).toBeGreaterThanOrEqual(layout.boardBottom);
 expect(layout.asideRight).toBeLessThanOrEqual(layout.panelRight+1);
}
async function rule(a,name){const menu=button(a,'Rules');if(await a.locator('.nd-sidebar').isHidden())await menu.click();await a.locator(`[data-rule-tab="${name[0]}"]`).click();await button(a,name).click();}
async function perform(a,operation,selected='0'){
 if(selected!==null)await a.locator(`[data-select="${selected}"]`).click();
 await a.locator(`[data-operation="${operation}"]`).click();
}
test('chapter algorithms are stepped demonstrations with the SAT navigation',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/textbook/fol-inference/');
 await expect(page.locator('[data-logic-app]:not([data-mounted])')).toHaveCount(0);
 for(const kind of ['unify','skolem']){
   const a=app(page,kind);await expect(a.locator('[data-operation],select,input[type=checkbox]')).toHaveCount(0);
   await expect(button(a,'Previous step')).toBeDisabled();await button(a,'Next step').click();await expect(button(a,'Previous step')).toBeEnabled();
   await button(a,'Previous step').click();await button(a,'Last step').click();await expect(button(a,'Next step')).toBeDisabled();await button(a,'First step').click();await expect(button(a,'Previous step')).toBeDisabled();
 }
 const u=app(page,'unify');await button(u,'Composition').click();await button(u,'Last step').click();await expect(u.getByRole('status')).toContainText('[x/a, y/f(a)]');
 const sk=app(page,'skolem');await button(sk,'Nested negation').click();await button(sk,'Next step').click();await expect(sk.getByRole('status')).toContainText('Eliminate the conditional');await button(sk,'Next step').click();await expect(sk.getByRole('status')).toContainText('Move negation');await button(sk,'Last step').click();await expect(sk.getByRole('status')).toContainText('equisatisfiable');await expect(sk).toContainText('sk₁(x)');
 const r=app(page,'resolution').first();
 for(const example of ['Socrates','PolyphemOS','Factoring','Growing terms']){await button(r,example).click();await button(r,'Last step').click();await expectResolutionLayout(r);}
 await button(r,'Socrates').click();await button(r,'Last step').click();await expect(r.getByRole('status')).toContainText('Empty clause derived');await button(r,'First step').click();await expect(r.locator('.sat-clauses > li')).toHaveCount(3);
 expect(errors).toEqual([]);
});
test('students perform Robinson steps directly on equations and retain their work',async({page})=>{
 await page.goto('/exercises/fol-inference/');const u=app(page,'unify');await button(u,'Composition').click();
 await expect(u.locator('select,input[type=checkbox]')).toHaveCount(0);
 await perform(u,'delete');await expect(u.getByRole('status')).toContainText('identical');await expect(u.locator('[data-select="0"]')).toHaveAttribute('aria-pressed','true');
 await perform(u,'decompose',null);await perform(u,'eliminate','1');await perform(u,'eliminate');await perform(u,'finish',null);
 await expect(u.getByRole('status')).toContainText('[y/f(a), x/a]');await expect(u.locator('[data-operation="finish"]')).toBeDisabled();
 await button(u,'Undo').click();await expect(u.locator('[data-operation="finish"]')).toBeEnabled();
 await button(u,'Occurs check').click();await perform(u,'occurs');await expect(u.getByRole('status')).toContainText('occurs check');
 await button(u,'Composition').click();await expect(u.locator('.nd-board')).toContainText('No equations remain');
 await button(u,'Restart').click();await expect(u.locator('.nd-board')).toContainText('R(x, y)');
 await u.locator('[data-select="0"]').focus();await page.keyboard.press('Enter');await expect(u.locator('[data-select="0"]')).toHaveAttribute('aria-pressed','true');
});
test('Skolem exercises select formula scopes and check complete witness terms',async({page})=>{
 await page.goto('/exercises/fol-inference/');const a=app(page,'skolem');await button(a,'Dependent witnesses').click();
 await expect(a.locator('select,input[type=checkbox]')).toHaveCount(0);
 await a.locator('[data-select="[0]"]').click();await expect(a.locator('.finf-subformula.is-selected')).toContainText('∃y');
 await button(a,'Replace existential').click();await a.getByRole('textbox',{name:'Witness term',exact:true}).fill('sk₁');await button(a,'Apply replacement').click();await expect(a.getByRole('status')).toContainText('universal variables in scope');
 await a.getByRole('textbox',{name:'Witness term',exact:true}).fill('sk₁(x)');await button(a,'Apply replacement').click();await expect(a.locator('.nd-board')).toContainText('sk₁(x)');
 await button(a,'Finish Skolemization').click();await expect(a.getByRole('status')).toContainText('equisatisfiable');
 await button(a,'Undo').click();await button(a,'Undo').click();await expect(a.locator('.nd-board')).toContainText('∃y');
 await button(a,'Nested negation').click();await a.locator('[data-select="[0]"]').focus();await page.keyboard.press('Space');await button(a,'Eliminate conditional').click();await expect(a.locator('.nd-board')).not.toContainText('→');
 await button(a,'Edit input').click();await a.getByRole('textbox',{name:'First-order input'}).fill('P(x)');await button(a,'Use input').click();await expect(a.getByRole('status')).toBeVisible();await expect(a.getByRole('status')).toContainText('Close free variables');
});
test('resolution exercises select literal occurrences for resolution and factoring',async({page})=>{
 await page.goto('/exercises/fol-inference/');const p=page.getByRole('region',{name:'Refute the negation of the drinker conclusion',exact:true});
 const input=async source=>{await button(p,'Edit input').click();await p.getByRole('textbox',{name:'First-order input',exact:true}).fill(source);await button(p,'Use input').click();};
 await expect(p.locator('.sat-examples')).toBeHidden();
 await input('∀x (Human(x) → Mortal(x)); Human(Socrates) ∴ Mortal(Socrates)');
 await expect(p.locator('select,input[type=checkbox]')).toHaveCount(0);
 const choose=async(a,b,operation)=>{await p.locator(`[data-literal="${a}"]`).click();await p.locator(`[data-literal="${b}"]`).click();await button(p,operation).click();};
 await choose('0:0','1:0','Resolve selected literals');await expect(p.locator('.nd-tree').first()).toContainText('Resolution');await expectResolutionLayout(p);
 await choose('2:0','3:0','Resolve selected literals');await expect(p.getByRole('status')).toContainText('Empty clause derived');
 await button(p,'Undo').click();await expect(p.getByRole('status')).not.toContainText('Empty clause derived');
 await input('∀x ∀y (P(x) ∨ P(y)); ∀x ∀y (¬P(x) ∨ ¬P(y))');await choose('0:0','0:1','Resolve selected literals');await expect(p.getByRole('status')).toContainText('opposite-polarity');await expect(p.locator('.sat-clauses > li')).toHaveCount(2);
 await button(p,'Factor selected literals').click();await expect(p.locator('.nd-tree').first()).toContainText('Factoring');
});
test('quantifier controls construct Socrates and replay a saved proof',async({page})=>{
 await page.goto('/exercises/fol-inference/');const a=page.locator('[data-logic-app="deduction"][data-kind="canvas"]');await a.locator('[data-example="socrates"]').click();
 await a.locator('[data-node="0"]').first().click({button:'right'});await button(a.locator('.nd-context'),'∀ Elim').click();await a.getByRole('textbox',{name:'Witness term'}).fill('Socrates');await button(a.getByRole('dialog'),'Apply').click();
 await a.locator('[data-node="2"]').first().click();await a.locator('[data-node="1"]').first().click();await rule(a,'→ Elim');await expect(a.locator('.nd-status')).toContainText('Derivation complete');
 const download=page.waitForEvent('download');await button(a,'Save').click();const path=await (await download).path();await page.reload();await a.locator('input[type=file]').setInputFiles(path);await expect(a.locator('.nd-status')).toContainText('Derivation complete');await button(a,'Reset derivation').click();await expect(a.locator('[data-node]')).toHaveCount(2);await expect(a.locator('[data-example="socrates"]')).not.toHaveClass(/is-complete/);await a.locator('[data-node="0"]').first().click();await rule(a,'∀ Elim');await expect(a.getByRole('dialog')).toBeVisible();
});
test('FOL Curry–Howard translates both ways and walkthroughs advance',async({page})=>{
 await page.goto('/textbook/proofs/');const a=page.locator('[data-logic-app="deduction"][data-language="fol"][data-kind="lean"]');await a.locator('[data-example="witness"]').click();await button(a,'Lean → ND').click();await expect(a.locator('.nd-status')).toContainText('Translated and checked');await button(a,'ND → Lean').click();await expect(a.locator('code')).toContainText('Exists.elim');
 await page.goto('/textbook/fol-inference/');const w=page.locator('[data-kind="lean-walkthrough"][data-example="witness"]');await button(w,'Next step').click();await expect(w.getByRole('status')).toContainText('Exists.elim');await button(w,'Reset walkthrough').click();await expect(button(w,'Previous step')).toBeDisabled();
});
test('chapter 9 stays within the viewport and has accessible app controls',async({page})=>{
 await page.goto('/textbook/fol-inference/');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('[data-logic-app]:not([data-mounted])')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const {violations}=await new AxeBuilder({page}).include('[data-logic-app]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(violations.map(v=>v.id+': '+v.help)).toEqual([]);
});

test('FOL exercise deck uses chapter 7 practice controls and multiple-choice feedback',async({page})=>{
 await page.goto('/exercises/fol-inference/');await expect(page.locator('[data-logic-app]:not([data-mounted])')).toHaveCount(0);
 await button(app(page,'unify-quiz'),'Level 6').click();const q=app(page,'unify-quiz').locator('form');await q.locator('[data-answer="0"]').click();await button(q,'Check answer').click();await expect(q.getByRole('status')).toContainText('Try again');await q.locator('[data-answer="1"]').click();await button(q,'Check answer').click();await expect(q.getByRole('status')).toContainText('Correct');
 const a=page.locator('[data-logic-app="deduction"][data-kind="practice"][data-deck="exercises"]');await button(a,'Interaction').click();await a.locator('[data-example="nonempty"]').click();await expect(a.locator('.nd-goal')).toContainText('∀x A(x)');await button(a,'Goal mode').click();await a.locator('[data-goal="0:"]').click();await rule(a,'∃ Intro');await a.getByRole('textbox',{name:'Witness term'}).fill('default');await button(a.getByRole('dialog'),'Apply').click();await expect(a.locator('[data-goal="0:0"]')).toContainText('A(default)');
 await a.locator('[data-goal="0:0"]').click();await rule(a,'∀ Elim');await a.getByRole('textbox',{name:'Universal formula; witness term'}).fill('∀x A(x); default');await button(a.getByRole('dialog'),'Apply').click();await expect(a.locator('.nd-status')).toContainText('Derivation complete');
});
test('identity and nonemptiness round-trip in the Curry–Howard app without lambdas',async({page})=>{
 await page.goto('/textbook/proofs/');const a=page.locator('[data-language="fol"][data-kind="lean"]');
 for(const label of ['Nonempty domain','Substitute equals','Symmetry of identity','Classical duality']){await button(a,label).click();await button(a,'Lean → ND').click();await expect(a.locator('.nd-status')).toContainText('Translated and checked');await button(a,'ND → Lean').click();await expect(a.locator('code')).not.toContainText('fun ');await expect(a.locator('code')).toContainText('Domain');}
 await page.goto('/textbook/fol-inference/');const w=page.locator('[data-kind="lean-walkthrough"][data-example="nonempty"]');await button(w,'Next step').click();await expect(w.locator('.nd-lean-line[aria-current="step"]')).toContainText('default : Domain');
});

test('exercise selection and replacement controls fit the viewport and remain accessible',async({page})=>{
 await page.goto('/exercises/fol-inference/');const a=app(page,'skolem');await button(a,'Friends').click();await a.locator('[data-select="[0,0,0]"]').click();await button(a,'Replace existential').click();
 await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const {violations}=await new AxeBuilder({page}).include('[data-logic-app="fol-inference"]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(violations.map(v=>v.id+': '+v.help)).toEqual([]);
});


test('partial model reasoning distinguishes proofs from missing information',async({page})=>{
 await page.goto('/textbook/fol-inference/');
 const a=page.locator('[data-kind="consequence"]').first();
 await button(a,'Last step').click();await expect(a.locator('[data-result]')).toHaveAttribute('data-result','true');
 await expect(a.locator('[data-display]')).toContainText('Missing memberships');
 const fact=button(a,'Use premise Human(Socrates)');await fact.click();
 await expect(a.locator('[data-result]')).toHaveAttribute('data-result','unknown');
 await button(a,'View').click();await button(a,'Set diagram').click();
 await expect(a.locator('[data-display]')).toContainText('No members specified');
 await expect(a.getByRole('status')).toContainText('Undetermined');
 await fact.focus();await page.keyboard.press('Space');await button(a,'Last step').click();
 await expect(a.locator('[data-result]')).toHaveAttribute('data-result','true');
 await button(a,'Edit conclusion').click();await a.getByRole('textbox',{name:'Conclusion'}).fill('¬Human(Socrates)');await button(a,'Check consequence').click();await button(a,'Last step').click();
 await expect(a.locator('[data-result]')).toHaveAttribute('data-result','false');
 const math=page.locator('[data-kind="consequence"]').last();await button(math,'Last step').click();await expect(math.locator('[data-result]')).toHaveAttribute('data-result','true');
 await expect(math.locator('[data-display]')).toContainText('S(d)');
 await button(math,'Use premise ∀x LessThan(x, S(x))').click();await expect(math.locator('[data-result]')).toHaveAttribute('data-result','unknown');
});
test('Robinson uses paired fields and resolution has a compact four-step growth example',async({page})=>{
 await page.goto('/textbook/fol-inference/');const a=app(page,'unify');
 const fields=a.getByRole('textbox');await expect(fields).toHaveCount(2);
 const [left,right]=await Promise.all([fields.nth(0).boundingBox(),fields.nth(1).boundingBox()]);expect(Math.abs(left.y-right.y)).toBeLessThan(2);
 await button(a,'Edit input').click();await fields.nth(0).fill('x');await fields.nth(1).fill('f(x)');await button(a,'Check unifiability').click();await button(a,'Last step').click();
 await expect(a.getByRole('status')).toContainText('Occurs check');await expect(a.getByRole('status')).toContainText('No unifier');
 await button(a,'Edit second expression').click();await fields.nth(1).fill('a');await button(a,'Check unifiability').click();await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('[x/a]');
 const r=app(page,'resolution').first();await expect(r.locator('details')).toHaveCount(0);await button(r,'Growing terms').click();await button(r,'Last step').click();await expect(r.locator('[data-count]')).toHaveText('5 / 5');await expect(r.getByRole('status')).toContainText('4 inferences');
 const rules=page.locator('[data-logic-app="deduction"][data-kind="rules"]');await expect(button(rules,'∀')).toHaveAttribute('aria-pressed','true');await expect(button(rules,'∧')).toHaveCount(0);
 await expect(page.locator('h2#quantifiers-in-lean')).toHaveText(/Lean/);
});

test('inference walkthrough shares all model presentations and accumulates only established facts',async({page})=>{
 await page.goto('/textbook/fol-inference/');
 const a=page.locator('[data-kind="consequence"]').first();
 await button(a,'View').click();await button(a,'Tables').click();
 await expect(a.locator('[data-display]')).toContainText('no tuples specified');
 await button(a,'Last step').click();await expect(a.locator('[data-display]')).not.toContainText('no tuples specified');
 for(const view of ['Semantic facts','Knowledge graph','Set diagram']){await button(a,'View').click();await button(a,view).click();await expect(a.locator('[data-display]')).toContainText('unspecified');}
 await button(a,'First step').click();await expect(a.locator('[data-display]')).toContainText('No members specified');
 await expect(a).not.toContainText('Incomplete model:');
 const math=page.locator('[data-kind="consequence"]').last();await button(math,'Last step').click();
 await button(math,'View').click();await button(math,'Tables').click();
 await expect(math.locator('[data-display]')).toContainText('?');
 await expect(math.locator('[data-result]')).toHaveAttribute('data-result','true');
});
test('Boolean verification presents typed subproofs and complete Lean links without an ND translation',async({page})=>{
 await page.goto('/textbook/fol-inference/');
 await expect(page.locator('#verifying-boolean-algebra')).toBeVisible();
 await expect(page.locator('[data-kind="canvas"],[data-kind="lean"],[data-kind="boolean-verification"]')).toHaveCount(0);
 const code=page.locator('code.language-lean').filter({hasText:'have step_13'});
 const source=await code.textContent();
 for(let i=1;i<=13;i++)expect(source).toMatch(new RegExp(`have step_${i} : .* := by`));
 expect(source).toContain('exact step_13');expect(source).not.toMatch(/\b(?:rw|calc|fun|let|motive|sorry)\b/);
 const link=code.locator('xpath=ancestor::div[contains(@class,"code-block")]/following-sibling::p[1]/a');
 expect(decodeURIComponent(await link.getAttribute('href'))).toContain(source.trim());
 await expect(page.locator('code.language-lean').filter({hasText:'example : ∀ x : Bool, (!!x) = x := by simp'})).toHaveCount(1);
});
test('compact FOL input rejects capture without substituting a different term',async({page})=>{
 await page.goto('/exercises/fol-inference/');const a=page.locator('[data-kind="canvas"]');
 await button(a,'Rules').click();await button(a,'+ Assumption').click();
 await a.getByRole('dialog').getByRole('textbox',{name:'Formula',exact:true}).fill('∀x∃yRxy');await button(a.getByRole('dialog'),'Apply').click();
 const node=a.locator('[data-node="2"]');await expect(node).toContainText('∀x ∃y R(x, y)');await node.click();await rule(a,'∀ Elim');
 const dialog=a.getByRole('dialog');await dialog.getByRole('textbox',{name:'Witness term'}).fill('y');await button(dialog,'Apply').click();
 await expect(dialog.getByRole('status')).toContainText('capture');await expect(dialog.getByRole('textbox',{name:'Witness term'})).toHaveValue('y');await expect(a.locator('[data-node]')).toHaveCount(3);
 await dialog.getByRole('textbox',{name:'Witness term'}).fill('z');await button(dialog,'Apply').click();
 await expect(a.locator('[data-node="3"]')).toContainText('∃y R(z, y)');
 const download=page.waitForEvent('download');await button(a,'Save').click();const path=await (await download).path();
 await button(a,'Reset derivation').click();await a.locator('input[type=file]').setInputFiles(path);await expect(a.locator('[data-node="3"]')).toContainText('∃y R(z, y)');
});
