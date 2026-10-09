import {test,expect} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import {MODEL_REASONING_LEVELS,RESOLUTION_LEVELS} from '../../assets/js/logic/fol-inference-exercises.js';
import {readFOLProblem,nextResolution} from '../../assets/js/logic/fol-inference.js';
import {startModelReasoning,canUnfold,availableObjects,unfoldTruthCondition,checkModelReasoning} from '../../assets/js/logic/fol-model-reasoning.js';
const button=(root,name)=>root.getByRole('button',{name,exact:true});
const route='/exercises/fol-inference/';

test('unifier quiz has levels, keeps completion, and does not disclose answers on retries',async({page})=>{
 await page.goto(route);const root=page.locator('[data-kind="unify-quiz"]');
 await expect(root.locator('form')).toHaveCount(1);await expect(root.locator('[data-levels] button')).toHaveCount(6);
 await root.locator('[data-answer="1"]').click();await button(root,'Check answer').click();
 await expect(root.getByRole('status')).toContainText('Try again');await expect(root.getByRole('status')).not.toContainText('three argument positions');
 for(const [i,correct] of [0,2,1,1,1,1].entries()){
  await button(root,'Level '+(i+1)).click();await root.locator(`[data-answer="${correct}"]`).click();await button(root,'Check answer').click();
  await expect(root.getByRole('status')).toHaveAttribute('data-feedback','correct');
 }
 await button(root,'Level 1').click();await expect(button(root,'Level 1')).toHaveAttribute('data-done','true');
 await expect(root.locator('legend')).toContainText('LiesBetween');
});

test('algorithm operations follow chapter order and omit duplicate histories',async({page})=>{
 await page.goto(route);
 for(const [kind,order] of [['unify',['delete','occurs','eliminate','orient','clash','decompose','finish']],['skolem',['arrow','iff','de-morgan','double-negation','negated-quantifier','rename','skolem','finish']]]){
  const root=page.locator(`[data-logic-app="fol-inference"][data-kind="${kind}"]`);
  expect(await root.locator('[data-operation]').evaluateAll(ns=>ns.map(n=>n.dataset.operation))).toEqual(order);
  for(const label of await root.locator('.finf-operation-label').all())await expect(label).not.toBeEmpty();
  await expect(root.locator('details')).toHaveCount(0);
 }
});

test('countermodels use the model editor and require true premises with a false conclusion',async({page})=>{
 await page.goto(route);const root=page.locator('[data-exercise="countermodel"]'),model=root.locator('[data-logic-app="fol-model"]'),status=root.locator(':scope > [data-practice-feedback]');
 await button(root,'Check').last().click();await expect(status).toContainText('Premise 2 is false');
 await button(model,'Modify').click();await button(model.getByRole('group',{name:'predicate symbols',exact:true}),'Interpret Mortal').click();
 await button(model.locator('[data-display]'),'Select Socrates').first().click();
 await button(root,'Check').last().click();await expect(status).toHaveAttribute('data-feedback','correct');
 const answers=[{BiggerThan:[['jimmy','sir'],['sir','socrates'],['socrates','jimmy']]},{Human:[['jimmy']],Mortal:[['sir'],['socrates']]},{Human:[['jimmy']],Mortal:[['sir']]},{Human:[['jimmy']]},{Human:[['jimmy']]}];
 for(const [i,predicates] of answers.entries()){
  await button(root,'Level '+(i+2)).click();
  await model.evaluate((el,predicates)=>{const m=el.folModel.get();m.predicates={...m.predicates,...predicates};el.folModel.set(m);},predicates);
  await button(root,'Check').last().click();await expect(status).toHaveAttribute('data-feedback','correct');
 }
 await button(root,'Level 1').click();await expect(button(root,'Level 1')).toHaveAttribute('data-done','true');
 await model.evaluate(el=>{const m=el.folModel.get();m.predicates.Human=[['socrates']];m.predicates.Mortal=[['socrates']];el.folModel.set(m);});
 await button(root,'Check').last().click();await expect(status).toContainText('conclusion is also true');
 expect((await new AxeBuilder({page}).include('[data-exercise="countermodel"]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});

test('library exercise permits students to resolve the knowledge base to contradiction',async({page})=>{
 await page.goto(route);const root=page.getByRole('region',{name:'Resolution: library permissions',exact:true});
 await expect(root.locator('[data-operation="resolve"]')).toHaveText('Resolve');
 await expect(root.locator('[data-operation="factor"]')).toHaveText('Factor');
 await expect(root.locator('.sat-examples button')).toHaveCount(5);
 for(const [name,source] of RESOLUTION_LEVELS){
  await button(root,name).click();await expect(root.locator('textarea')).toHaveValue(source);
  const clauses=readFOLProblem(source).clauses;
  for(let i=0;i<16&&!clauses.some(c=>!c.length);i++){
   const next=nextResolution(clauses);expect(next).toBeTruthy();
   await root.locator(`[data-literal="${next.a}:${next.i}"]`).click();await root.locator(`[data-literal="${next.kind==='factor'?next.a:next.b}:${next.j}"]`).click();
   await button(root,next.kind==='factor'?'Factor selected literals':'Resolve selected literals').click();clauses.push(next.clause);
  }
  await expect(root.getByRole('status')).toContainText('Empty clause derived');
 }
});

test('model reasoning solutions show established facts and retain an open domain',async({page})=>{
 await page.goto(route);
 await page.locator('#reasoning-in-modelsSolution').evaluate(n=>n.classList.add('show'));
 const roots=page.locator('#reasoning-in-modelsSolution [data-kind="consequence"]');await expect(roots).toHaveCount(3);
 for(const root of await roots.all()){
  await button(root,'Last step').click();await expect(root.locator('[data-result]')).toHaveAttribute('data-result','true');
  await expect(root).not.toContainText('Incomplete model:');await expect(root.locator('[data-display]')).not.toBeEmpty();
 }
 await expect(roots.last()).toContainText('arbitrary');
});

test('all ND exercises have independent Lean templates and Boolean tasks include reference tables',async({page})=>{
 await page.goto(route);
 const templates=page.locator('#lean code.language-lean');await expect(templates).toHaveCount(3);
 const source=(await templates.allTextContents()).join('\n');expect(source.match(/example /g)).toHaveLength(12);expect(source.match(/sorry/g)).toHaveLength(12);
 for(const code of await page.locator('code.language-lean').all()){
  const source=(await code.textContent()).trim();const link=code.locator('xpath=ancestor::div[contains(@class,"code-block")]/following-sibling::p[1]/a');
  expect(decodeURIComponent(await link.getAttribute('href'))).toContain(source);
 }
 const advanced=page.locator('#verify-boolean-derivations');await expect(advanced.locator('.question__head')).toContainText('advanced');await expect(advanced.locator('table')).toHaveCount(2);await expect(advanced.locator('code.language-lean')).toContainText('theorem booleanReduction');
 await expect(page.locator('#what-if-the-type-were-emptySolution code.language-lean')).toContainText('Empty.elim');
});

test('ND screenshot controls occupy a clear canvas corner in proofs and walkthroughs',async({page})=>{
 for(const [path,selector] of [['/textbook/fol-inference/','[data-logic-app="deduction"][data-kind="worked"]'],['/textbook/fol-inference/','[data-kind="lean-walkthrough"]'],[route,'[data-logic-app="deduction"][data-kind="practice"]'],['/textbook/proofs/','[data-logic-app="deduction"][data-kind="worked"]']]){
  await page.goto(path);const root=page.locator(selector).first(),camera=button(root,'Download PNG');await expect(camera).toBeVisible();await page.evaluate(()=>document.fonts.ready);
  const rects=await root.evaluate(el=>{
   const camera=el.querySelector('[data-export-image]'),board=el.querySelector('.nd-board'),tools=camera.closest('.nd-canvas-controls');
   const a=camera.getBoundingClientRect(),b=board.getBoundingClientRect();
   const overlaps=[...board.querySelectorAll('.nd-formula,.nd-rule')].some(n=>{const r=n.getBoundingClientRect();return r.width&&r.height&&r.left<a.right&&r.right>a.left&&r.top<a.bottom&&r.bottom>a.top;});
   return {tools:!!tools,inside:a.left>=b.left&&a.right<=b.right+1&&a.top>=b.top&&a.bottom<=b.bottom,overlaps};
  });expect(rects).toEqual({tools:true,inside:true,overlaps:false});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});


test('students unfold truth conditions in models rather than choose a verdict',async({page})=>{
 await page.goto(route);const root=page.locator('[data-exercise="validity"]');
 await expect(root.locator('[data-levels] button')).toHaveCount(6);await expect(root.locator('[data-validity]')).toHaveCount(0);
 const feedback=root.locator(':scope > [data-practice-feedback]');
 const language={constants:[],functions:{},predicates:{Human:1,Mortal:1,Sibling:2}};
 await button(root,'Check').last().click();await expect(feedback).toContainText('Continue unfolding');
 for(const [i,problem] of MODEL_REASONING_LEVELS.entries()){
  await button(root,'Level '+(i+1)).click();let state=startModelReasoning(problem,language);
  for(let j=0;j<100&&checkModelReasoning(state).result==='unfinished';j++){
   let next;
   for(const [bi,b] of state.branches.entries()){const ei=b.entries.findIndex(e=>canUnfold(b,e));if(ei>=0){next={bi,ei,object:availableObjects(b,b.entries[ei])[0]};break;}}
   expect(next).toBeTruthy();
   if(state.branches.length>1)await button(root,'Case '+(next.bi+1)).click();
   await root.locator(`[data-requirement="${next.ei}"]`).focus();await page.keyboard.press('Enter');await expect(root.locator(`[data-requirement="${next.ei}"]`)).toBeFocused();await expect(root.locator('[data-truth-condition]')).not.toBeEmpty();
   await button(root,next.object?'At '+next.object:'Unfold').click();state=unfoldTruthCondition(state,next.bi,next.ei,next.object);
   const negative=state.branches[next.bi].entries.filter(e=>!e.value&&e.ast.kind==='predicate');
   if(negative.length)await expect(root.locator('[data-display]')).toContainText('Known false:');
   if(negative.some(e=>e.ast.name==='Human'))await expect(root.locator('.fol-graph')).toContainText('∉ ⟦Human⟧');
  }
  await button(root,'Check').last().click();await expect(feedback).toHaveAttribute('data-feedback','correct');await expect(feedback).toContainText(i<3?'inference is valid':'inference is invalid');
  await expect(root.locator('[data-model-health]')).not.toContainText('Incomplete');
 }
 await button(root,'Level 1').click();await expect(button(root,'Level 1')).toHaveAttribute('data-done','true');
 await button(root,'Undo').click();await button(root,'Check').last().click();await expect(feedback).toContainText('Continue unfolding');
 await button(root,'Restart').click();await expect(root.locator('[data-requirement]')).toHaveCount(3);
 expect((await new AxeBuilder({page}).include('[data-exercise="validity"]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});

test('countermodel canvas fills its container and fullscreen retains the exercise controls',async({page})=>{
 await page.goto(route);const root=page.locator('[data-exercise="countermodel"]'),model=root.locator('[data-logic-app="fol-model"]');
 const fits=()=>root.evaluate(r=>{const m=r.querySelector('[data-logic-app="fol-model"]'),canvas=m.querySelector('[data-display]');return {root:r.clientWidth,canvas:canvas.getBoundingClientRect().width,model:m.getBoundingClientRect().width,font:getComputedStyle(m).fontSize,parentFont:getComputedStyle(r).fontSize};});
 let sizes=await fits();expect(sizes.canvas/sizes.root).toBeGreaterThan(.95);expect(sizes.font).toBe(sizes.parentFont);
 await button(root,'Fullscreen').click();await expect(button(root,'Exit fullscreen')).toHaveAttribute('aria-pressed','true');
 expect(await root.evaluate(r=>document.fullscreenElement===r||r.classList.contains('fol-fullscreen'))).toBe(true);
 sizes=await fits();expect(sizes.root/page.viewportSize().width).toBeGreaterThan(.95);expect(sizes.canvas/sizes.root).toBeGreaterThan(.9);
 await expect(root.locator('[data-task]')).toBeVisible();await expect(button(root,'Level 2')).toBeVisible();await expect(button(root,'Check').last()).toBeVisible();
 await button(root,'Level 2').click();await expect(root.locator('[data-task]')).toContainText('BiggerThan');
 await button(root,'Check').last().click();await expect(root.locator(':scope > [data-practice-feedback]')).toContainText('Premise 1 is false');
 await button(root,'Exit fullscreen').click();await expect(button(root,'Fullscreen')).toHaveAttribute('aria-pressed','false');
});

test('Skolem formula and witness inputs convert typed and pasted LaTeX',async({page})=>{
 await page.goto(route);const root=page.locator('[data-logic-app="fol-inference"][data-kind="skolem"]');
 await button(root,'Edit input').click();const formula=root.getByRole('textbox',{name:'First-order input',exact:true});
 await formula.fill(String.raw`\forall x \exists y R(x,y)`);await expect(formula).toHaveValue('∀ x ∃ y R(x,y)');await button(root,'Use input').click();
 await root.locator('[data-select="[0]"]').click();await button(root,'Replace existential').click();
 const witness=root.getByRole('textbox',{name:'Witness term',exact:true});await witness.pressSequentially('sk_{1}(x)');await expect(witness).toHaveValue('sk₁(x)');
 await button(root,'Apply replacement').click();await expect(root.locator('.nd-board')).toContainText('sk₁(x)');
});


test('resolution fullscreen preserves the derivation in demonstration and practice',async({page})=>{
 for(const [path,selector] of [['/textbook/fol-inference/','[data-kind="resolution"]'],[route,'[data-kind="practice"][data-logic-app="fol-inference"]']]){
  await page.goto(path);const root=page.locator(selector).first();
  if(path.includes('textbook'))await button(root,'Next step').click();
  const before=await root.locator('.sat-clauses').textContent();
  await button(root,'Fullscreen').click();await expect(button(root,'Exit fullscreen')).toHaveAttribute('aria-pressed','true');
  expect(await root.evaluate(el=>el.clientWidth/innerWidth)).toBeGreaterThan(.95);
  await expect(root.locator('.sat-clauses')).toHaveText(before);
  await button(root,'Exit fullscreen').click();await expect(button(root,'Fullscreen')).toHaveAttribute('aria-pressed','false');await expect(root.locator('.sat-clauses')).toHaveText(before);
  await root.evaluate(el=>{el.requestFullscreen=undefined;});await button(root,'Fullscreen').click();await expect(root).toHaveClass(/nd-fullscreen/);await root.press('Escape');await expect(root).not.toHaveClass(/nd-fullscreen/);await expect(button(root,'Fullscreen')).toBeFocused();
 }
});
