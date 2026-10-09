import {test,expect} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const tools=[
 ['chaining',2],['horn-satisfiability',1],['sat-planning',1],['first-order-parser',2],
 ['first-order-models',4],['first-order-sql',2],['partial-model-reasoning',1],
 ['unification',2],['skolemization',2],['resolution',4],
 ['natural-deduction',4],['lean-correspondence',2],
 ['propositional-parser',2],['shunting-yard',1],['boolean-evaluation',1],
 ['truth-tables',2],['normal-forms',2],['tseytin',1],['circuit-sandbox',1]
];
const button=(root,name)=>root.getByRole('button',{name,exact:true});
test('tools catalogue links to every new reusable tool',async({page})=>{
 await page.goto('/tools/');
 for(const [slug] of tools)await expect(page.locator(`main a[href$="/tools/${slug}/"]`).first()).toBeVisible();
 await expect(page.locator('main')).not.toContainText('first-order tools will join');
});
for(const [slug,count] of tools)test(`tool mounts, is accessible and fits narrow screens: ${slug}`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 expect((await page.goto(`/tools/${slug}/`)).status()).toBe(200);
 await expect(page.locator('[data-logic-app]')).toHaveCount(count);
 await expect(page.locator('[data-logic-app]:not([data-mounted])')).toHaveCount(0);
 await page.evaluate(()=>document.fonts.ready);
 expect((await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)}))).toEqual([]);
 await page.setViewportSize({width:320,height:800});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 expect(errors).toEqual([]);
 await expect(page.locator('[aria-label="Examples"]:visible,[aria-label="Levels"]:visible,[data-examples]:not([data-logic-app]):visible:not(:empty)')).toHaveCount(0);
 const fields=page.locator('[data-logic-app] textarea:visible');
 for(const field of await fields.all()){await expect(field).toHaveValue('');await expect(field).toBeEditable();}
 await expect(page.locator('[data-logic-app="deduction"] [data-node]')).toHaveCount(0);

});
test('new syntax tools accept custom expressions',async({page})=>{
 await page.goto('/tools/first-order-parser/');const parser=page.locator('[data-kind="formula"]');
 await parser.getByRole('textbox',{name:'Formula',exact:true}).fill('∃x (Human(x) ∧ Mortal(x))');await button(parser,'Start parsing').click();await button(parser,'Last step').click();await expect(parser.locator('.logic-app__tree')).toContainText('∃x');
 await page.goto('/tools/unification/');const unify=page.locator('[data-kind="unify"][data-mode="demo"]');
 await unify.getByRole('textbox',{name:'First expression',exact:true}).fill('f(x)');await unify.getByRole('textbox',{name:'Second expression',exact:true}).fill('f(a)');await button(unify,'Check unifiability').click();await button(unify,'Last step').click();await expect(unify.getByRole('status')).toContainText('[x/a]');
 await page.goto('/tools/skolemization/');const skolem=page.locator('[data-kind="skolem"][data-mode="demo"]');
 await skolem.getByRole('textbox',{name:'First-order input',exact:true}).fill('∃x P(x)');await button(skolem,'Use input').click();await button(skolem,'Last step').click();await expect(skolem.locator('[data-work]')).toContainText('sk₁');
});
test('model tools start empty and accept a constructed model and custom inference',async({page})=>{
 await page.goto('/tools/first-order-models/');const model=page.locator('[data-kind="evaluate"]');
 await expect(model.locator('[data-model-health]')).toContainText('Incomplete');
 await model.evaluate(root=>root.folModel.set({domain:['socrates'],constants:{Socrates:'socrates',LittleJimmy:'socrates',MrSir:'socrates'},functions:{fatherOf:{'["socrates"]':'socrates'}},predicates:{Human:[['socrates']],Mortal:[],BiggerThan:[],Sibling:[]}}));
 await model.getByLabel('Formula',{exact:true}).fill('Human(Socrates) ∨ ¬Human(Socrates)');await button(model,'Check').click();if(await button(model,'Last step').isEnabled())await button(model,'Last step').click();await expect(model.locator('[data-answer]')).toContainText('True');
 await model.locator('[data-menu="model"]').click();await button(model,'Reset model').click();await expect(model.locator('[data-model-health]')).toContainText('Incomplete');
 await page.goto('/tools/partial-model-reasoning/');
 await page.getByRole('textbox',{name:'Premises and conclusion',exact:true}).fill('∀x (Bird(x) → Animal(x)); Bird(a) ∴ ∃x Animal(x)');
 await page.getByRole('button',{name:'Check consequence',exact:true}).click();
 const partial=page.locator('.fol-tool .fol-app');await expect(partial).toHaveCount(1);
 await button(partial,'Last step').click();await expect(partial.locator('[data-result]')).toHaveAttribute('data-result','true');
 await button(partial,'Use premise Bird(a)').click();await expect(partial.locator('[data-result]')).toHaveAttribute('data-result','unknown');
});
test('FOL resolution tool accepts a custom inference in its manual workspace',async({page})=>{
 await page.goto('/tools/resolution/');const root=page.locator('[data-kind="practice"]');
 await expect(root.locator('.sat-examples')).toBeHidden();await root.getByRole('textbox',{name:'First-order input',exact:true}).fill('P(a) ∴ P(a)');await button(root,'Use input').click();
 await root.locator('[data-literal="0:0"]').click();await root.locator('[data-literal="1:0"]').click();await button(root,'Resolve selected literals').click();await expect(root.getByRole('status')).toContainText('Empty clause derived');
 await button(root,'Fullscreen').click();await expect(button(root,'Exit fullscreen')).toHaveAttribute('aria-pressed','true');await button(root,'Exit fullscreen').click();
});
test('first-order proof tools construct and translate a custom universal instance',async({page})=>{
 await page.goto('/tools/natural-deduction/');const root=page.locator('[data-language="fol"][data-kind="sandbox"]');
 const menu=async()=>{if(await root.locator('.nd-sidebar').isHidden())await button(root,'Rules').click();};
 await menu();await button(root,'+ Assumption').click();await root.getByRole('dialog').getByRole('textbox',{name:'Formula',exact:true}).fill('∀x Human(x)');await button(root.getByRole('dialog'),'Apply').click();
 await root.locator('[data-node="0"]').first().click();await menu();await root.locator('[data-rule-tab="∀"]').click();await button(root,'∀ Elim').click();await root.getByRole('textbox',{name:'Witness term',exact:true}).fill('Socrates');await button(root.getByRole('dialog'),'Apply').click();await expect(root.locator('.nd-board')).toContainText('Human(Socrates)');
 await page.goto('/tools/lean-correspondence/');const lean=page.locator('[data-kind="lean"][data-language="fol"]');
 await lean.getByRole('textbox',{name:'Lean proof',exact:true}).fill('variable (Domain : Type) (Human : Domain → Prop) (Socrates : Domain)\n\nexample (h : ∀ x, Human x) : Human Socrates := by\n  exact h Socrates');await button(lean,'Lean → ND').click();await expect(lean.locator('.nd-status')).toContainText('Translated and checked');await button(lean,'ND → Lean').click();await expect(lean.locator('code')).toContainText('Human Socrates');
});
test('conditional and SQL tools run custom inputs',async({page})=>{
 for(const [slug,kind] of [['chaining','chaining'],['horn-satisfiability','horn']]){
  await page.goto(`/tools/${slug}/`);const root=page.locator(`[data-kind="${kind}"]`);await root.locator('[data-kb]').fill(kind==='horn'?'RAIN\nRAIN → ⊥':'RAIN\nRAIN → WET');if(kind==='chaining')await root.locator('[data-goal]').fill('WET');await button(root,'Start').click();await button(root,'Last step').click();await expect(root.getByRole('status')).toContainText(kind==='horn'?'unsatisfiable':'WET has been derived');
 }
 await page.goto('/tools/sat-planning/');const planner=page.locator('[data-kind="planning"]');await planner.locator('[data-initial]').fill('On(G,R)');await planner.locator('[data-goal]').fill('On(R,G)');await button(planner,'Add frame conditions').click();await button(planner,'Plan!').click();await button(planner,'Last step').click();await expect(planner.getByRole('status')).toContainText('goal conditions hold');
 await page.goto('/tools/first-order-sql/');const sql=page.locator('[data-kind="sql"]');await sql.evaluate(root=>{const language=root.folModel.config.language;root.folModel.set({domain:['France','Europe'],constants:Object.fromEntries(language.constants.map(n=>[n,n==='Europe'?'Europe':'France'])),functions:{},predicates:{CapitalOf:[],CityIn:[],LanguageOf:[],LocatedIn:[['France','Europe']]}});});await sql.getByLabel('Formula',{exact:true}).fill('LocatedIn(x,Europe)');await button(sql,'Formula → SQL').click();await expect(sql.locator('[data-sql-code]')).toContainText('SELECT DISTINCT');await button(sql,'Run').click();await expect(sql.locator('[data-sql-status]')).toHaveAttribute('data-state','success');await expect(sql.locator('[data-sql-results]')).toContainText('France');
});

test('propositional resolution practice checks selected literals and supports undo',async({page})=>{
 await page.goto('/tools/resolution/');const root=page.locator('[data-logic-app="sat-practice"]');
 await root.getByRole('textbox',{name:'Propositional input',exact:true}).fill('p ∨ q; ¬p ∴ q');await button(root,'Use input').click();
 await root.getByRole('button',{name:'Clause 1: p',exact:true}).click();await root.getByRole('button',{name:'Clause 2: ¬p',exact:true}).click();await button(root,'Resolve selected literals').click();
 await root.getByRole('button',{name:'Clause 4: q',exact:true}).click();await root.getByRole('button',{name:'Clause 3: ¬q',exact:true}).click();await button(root,'Resolve selected literals').click();await expect(root.getByRole('status')).toContainText('inference is valid');
 await button(root,'Undo').click();await expect(root.getByRole('status')).not.toContainText('Empty clause');
 await button(root,'Restart').click();await expect(root.locator('[data-work] li')).toHaveCount(3);
 await button(root,'Edit input').click();await root.getByRole('textbox',{name:'Propositional input',exact:true}).fill('p');await button(root,'Use input').click();await button(root,'Check saturation').click();await expect(root.getByRole('status')).toContainText('input is satisfiable');
 await button(root,'Fullscreen').click();await expect(button(root,'Exit fullscreen')).toHaveAttribute('aria-pressed','true');await button(root,'Exit fullscreen').click();
});
test('unification and Skolemization tools let readers perform the operations',async({page})=>{
 await page.goto('/tools/unification/');const unify=page.locator('[data-kind="unify"][data-mode="practice"]');
 await unify.getByRole('textbox',{name:'First expression',exact:true}).fill('f(x)');await unify.getByRole('textbox',{name:'Second expression',exact:true}).fill('f(a)');await button(unify,'Check unifiability').click();
 await unify.locator('[data-select="0"]').click();await button(unify,'Decompose').click();await unify.locator('[data-select="0"]').click();await button(unify,'Eliminate variable').click();await button(unify,'Declare success').click();await expect(unify.getByRole('status')).toContainText('unifier');
 await button(unify,'Restart').click();await expect(unify.locator('[data-work]')).toContainText('f(x)');
 await page.goto('/tools/skolemization/');const skolem=page.locator('[data-kind="skolem"][data-mode="practice"]');
 await skolem.getByRole('textbox',{name:'First-order input',exact:true}).fill('∃x P(x)');await button(skolem,'Use input').click();await button(skolem,'Select ∃x P(x)').click();await button(skolem,'Replace existential').click();await skolem.getByRole('textbox',{name:'Witness term',exact:true}).fill('sk₁');await button(skolem,'Apply replacement').click();await button(skolem,'Finish Skolemization').click();await expect(skolem.locator('[data-work]')).toContainText('P(sk₁)');await button(skolem,'Undo').click();await button(skolem,'Undo').click();await expect(skolem.locator('[data-work]')).toContainText('∃x');
});
test('normal-form and table practice accepts custom variables',async({page})=>{
 await page.goto('/tools/normal-forms/');const normal=page.locator('[data-logic-app="sat-practice"]');
 await normal.getByRole('textbox',{name:'Practice input',exact:true}).fill('p ∨ q');await button(normal,'Use input').click();await normal.getByRole('textbox',{name:'DNF',exact:true}).fill('p ∨ q');await normal.getByRole('textbox',{name:'CNF',exact:true}).fill('p ∨ q');await button(normal,'Check').click();await expect(normal.getByRole('status')).toContainText('Correct');
 await page.goto('/tools/truth-tables/');const table=page.locator('[data-logic-app="sat-practice"]');
 await table.getByRole('textbox',{name:'Practice input',exact:true}).fill('p ∧ q');await button(table,'Use input').click();await table.getByRole('textbox',{name:'Variables (comma-separated)',exact:true}).fill('p,q');await table.getByRole('textbox',{name:'Number of rows',exact:true}).fill('4');await button(table,'Start').click();await expect(table.locator('tbody tr')).toHaveCount(4);await expect(table.getByRole('status')).toContainText('Match each column');
});
