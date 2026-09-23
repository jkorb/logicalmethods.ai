import { reviewScreenshot } from './review-screenshot.mjs';
import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
const app=(page,kind,preset)=>page.locator(`[data-logic-app="boolean"][data-kind="${kind}"]${preset?`[data-preset="${preset}"]`:''}`).first();
const button=(a,name)=>a.getByRole('button',{name,exact:true});
test.beforeEach(async({page})=>{await page.goto('/textbook/boolean/');});

test('derivation unfolds with rounded emphasis and sticky navigation',async({page})=>{
 const a=app(page,'derivation');await expect(a.locator('li')).toHaveCount(1);
 await button(a,'Next step').click();await expect(a.locator('li')).toHaveCount(2);await expect(a.locator('li').last()).toHaveAttribute('aria-current','step');
 await button(a,'Last step').click();await expect(a.locator('li')).toHaveCount(13);
 await expect(a.locator('li').last()).toContainText('NOT NOT X = X');
 expect(await a.locator('[data-toolbar]').evaluate(n=>getComputedStyle(n).position)).toBe('sticky');
 await button(a,'Previous step').click();await expect(a.locator('li')).toHaveCount(12);
 await expect(page.locator('.boolean-app select')).toHaveCount(0);
});

test('evaluation annotates the shared parsing tree and invalidates edited formulas',async({page})=>{
 const a=app(page,'evaluation');
 await a.getByRole('group',{name:'Value of RAIN',exact:true}).getByRole('button',{name:'1',exact:true}).click();
 await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('= 1');
 await expect(a.locator('.tree-valuation')).toHaveCount(6);
 await expect(a.locator('.tree-valuation').first()).toContainText('v(');
 await expect(a.locator('.boolean-operator')).not.toHaveCount(0);
 const input=a.getByLabel('Formula',{exact:true});await input.fill('RED ∧ ¬BLUE');
 await expect(a.locator('[data-picture] svg')).toHaveCount(0);await button(a,'Use formula').click();
 await a.getByRole('group',{name:'Value of RED',exact:true}).getByRole('button',{name:'1',exact:true}).click();
 await button(a,'Last step').click();await expect(a.getByRole('status')).toContainText('= 1');
 await input.fill('RED ∧');await button(a,'Use formula').click();await expect(a.locator('[data-picture] svg')).toHaveCount(0);
 await expect(button(a,'Next step')).toBeDisabled();
});

test('three independent model walkthroughs sit beside their explanations',async({page})=>{
 await expect(page.locator('[data-kind="models"]')).toHaveCount(3);
 const a=app(page,'models');await expect(button(a,'All worlds')).toHaveCount(0);await expect(a.locator('.boolean-world.is-selected')).toHaveCount(0);
 await button(a,'[SUN]').click();await expect(a.locator('.boolean-world.is-selected')).toHaveCount(2);
 const ds=app(page,'models','ds'),fallacy=app(page,'models','fallacy');
 await button(ds,'Countermodels').click();await expect(ds.getByRole('status')).toContainText('inference is valid');
 await button(fallacy,'Countermodels').click();await expect(fallacy.getByRole('status')).toContainText('M₁');await expect(fallacy.locator('.boolean-world.is-selected')).toHaveCount(1);
 await expect(a.locator('.boolean-world.is-selected')).toHaveCount(2);
 await expect(button(a,'First step')).toHaveCount(0);await button(a,'[¬RAIN]').click();await expect(a.locator('[data-model-set="¬RAIN"]')).toHaveClass(/is-active/);await expect(fallacy.locator('[data-world-art].is-countermodel')).toHaveCount(1);
});

test('relays animate live supplies and pull normally closed contacts toward magnets',async({page})=>{
 const a=app(page,'circuit','relay-on');await expect(a.locator('.magnetic-field')).toHaveCount(0);
 await button(a,'Toggle X').click();await expect(a.locator('.magnetic-field')).toHaveCount(3);
 expect(await a.locator('.relay-contact').getAttribute('d')).toContain('L262');
 await expect(a.locator('.circuit-switch .signal--1')).not.toHaveCount(0);
 const impl=app(page,'circuit','implementations');await button(impl,'OR').click();
 for(const [x,y] of [[0,0],[1,0],[1,1],[0,1]]){
  for(const [n,v]of [['X',x],['Y',y]])if(await button(impl,`Toggle ${n}`).getAttribute('aria-pressed')!==String(Boolean(v)))await button(impl,`Toggle ${n}`).click();
  await expect(impl.getByRole('status')).toContainText(`${x} OR ${y} = ${x|y}`);
 }
 await button(impl,'Pause animation').click();await expect(impl).toHaveAttribute('data-paused','true');await expect(button(impl,'Play animation')).toBeVisible();
 expect(await impl.locator('.signal--1').first().evaluate(n=>getComputedStyle(n).animationPlayState)).toBe('paused');
 await button(impl,'Play animation').click();await expect(impl).toHaveAttribute('data-paused','false');
 const full=app(page,'circuit','full');await expect(full.locator('[data-target="xor1"]')).toHaveCount(2);
 for(const n of ['X','Y','C'])await button(full,`Toggle ${n}`).click();
 await expect(full.getByRole('status')).toContainText('sum = 1; carry = 1');
});

test('two-bit adder discovers all sixteen sums without losing previous cells',async({page})=>{
 const a=app(page,'two-bit');await expect(a.locator('[data-discovered]')).toHaveText('0 / 16 sums found.');
 await button(a,'Toggle X₁').click();await button(a,'Toggle Y₀').click();await expect(a.locator('[data-discovered]')).toHaveText('0 / 16 sums found.');
 await button(a,'Record this sum').click();await expect(a.locator('[data-sum-cell="2,1"]')).toHaveText('011');await expect(button(a,'Record this sum')).toBeFocused();
 await button(a,'Decimal table').click();await expect(a.locator('[data-sum-cell="2,1"]')).toHaveText('3');await expect(a.locator('[data-sum-cell="0,0"]')).toHaveText('·');
 await expect(a.locator('.column-addition')).toHaveAttribute('aria-label',/10 plus 01 equals 011/);await button(a,'Decimal table').click();
 for(let x=0;x<4;x++)for(let y=0;y<4;y++){
  for(const [n,v]of [['X₁',x>>1],['X₀',x&1],['Y₁',y>>1],['Y₀',y&1]])if(await button(a,`Toggle ${n}`).getAttribute('aria-pressed')!==String(Boolean(v)))await button(a,`Toggle ${n}`).click();
  await button(a,'Record this sum').click();
  await expect(a.locator(`[data-sum-cell="${x},${y}"]`)).toHaveText((x+y).toString(2).padStart(3,'0'));
 }
 await expect(a.locator('[data-discovered]')).toHaveText('16 / 16 sums found.');
});

test('circuit profiles enforce allowed gates and mark incorrect table entries',async({page})=>{
 await page.goto('/exercises/boolean/');const a=app(page,'workbench','relays');await expect(button(a,'+ XOR')).toHaveCount(0);await expect(button(a,'+ NAND')).toHaveCount(0);
 async function relay(type,id,inputs){await button(a,`+ ${type}`).click();for(let i=0;i<inputs.length;i++)await a.getByRole('group',{name:`${id} input ${i+1}`,exact:true}).getByRole('button',{name:inputs[i],exact:true}).click();}
 await expect(a.locator('[data-add]')).toHaveCount(2);await a.locator('.boolean-connections summary').click();
 await relay('Default-off relay','g1',['X (INPUT)','Y (INPUT)']);
 await relay('Default-on relay','g2',['g1 (Default-off relay)','POWER (POWER)']);
 await button(a,'Connect from g2').click();await button(a,'Connect to out input 1').click();await button(a,'Check circuit').click();
 await expect(a.locator('[data-check-result]')).toContainText('implements NAND');await expect(button(a,'1. NAND ✓')).toBeVisible();
 await button(a,'Default-off relay g1').focus();await page.keyboard.press('Enter');await a.locator('.boolean-connections').evaluate(n=>n.open=true);await a.getByRole('group',{name:'g1 input 1',exact:true}).getByRole('button',{name:'g2 (Default-on relay)',exact:true}).click();await expect(a.getByRole('status')).toContainText('Feedback loop');
 await button(a,'Remove gate').click();await button(a,'Check circuit').click();await expect(a.locator('[data-check-result] .is-incorrect')).toHaveCount(4);
 const d=app(page,'workbench','definitions');await button(d,'2. NOT').click();await expect(button(d,'+ NAND')).toBeEnabled();await expect(button(d,'+ NOT')).toBeDisabled();await expect(button(d,'Toggle Y')).toHaveCount(0);
});

test('model exercises check exact selections and generalize to eight worlds',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/exercises/boolean/');
 const a=app(page,'model-exercise');await a.locator('[data-model="M₁"]').click();await button(a,'Check selection').click();await expect(a.getByRole('status')).toContainText('Correct.');
 await a.locator('[data-model="M₂"]').click();await button(a,'Check selection').click();await expect(a.getByRole('status')).toContainText('1 extra');
 let w=page.locator('[data-kind="model-exercise"][data-variables="3"]').first();await expect(w.locator('.boolean-world')).toHaveCount(8);
 for(const id of ['M₁','M₃'])await w.locator(`[data-model="${id}"]`).click();await button(w,'Check selection').click();await expect(w.getByRole('status')).toContainText('Correct.');
 w=app(page,'model-exercise','custom');const input=w.getByRole('textbox',{name:'Inference'});await expect(input).toHaveAttribute('readonly','');await button(w,'Edit inference').click();await input.fill('WIND\n∴ SUN');await button(w,'Use inference').click();
 for(const id of ['M₅','M₇'])await w.locator(`[data-model="${id}"]`).click();await button(w,'Check selection').click();await expect(w.getByRole('status')).toContainText('Correct.');
 await button(w,'Edit inference').click();await input.fill('broken');await button(w,'Use inference').click();await input.fill('WIND\n∴ WIND');await button(w,'Use inference').click();await button(w,'Check selection').click();await expect(w.getByRole('status')).toContainText('Correct.');expect(errors).toEqual([]);
});

for(const theme of ['light','dark'])test(`Boolean visuals and accessibility in ${theme}`,async({page},info)=>{
 await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});await page.reload();await page.evaluate(()=>document.fonts.ready);
 await button(app(page,'derivation'),'Next step').click();await button(app(page,'evaluation'),'Last step').click();
 for(const [kind,preset]of [['derivation',''],['evaluation',''],['models',''],['circuit','implementations'],['circuit','full'],['two-bit','']])await reviewScreenshot(app(page,kind,preset), {style:'.site-header, .back-to-top {visibility:hidden!important}',path:`tmp/boolean-revision-4/${info.project.name}-${theme}-${kind}-${preset||'default'}.png`});
 for(const path of ['/textbook/boolean/','/exercises/boolean/']){
  if(!page.url().endsWith(path))await page.goto(path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.evaluate(()=>scrollTo(0,0));const result=await new AxeBuilder({page}).include('.boolean-app').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations.map(v=>`${v.id}: ${v.nodes.map(n=>n.target.join(' ')).join('; ')}`)).toEqual([]);
 }
 await reviewScreenshot(page.locator('[data-kind="model-exercise"][data-variables="3"]').first(), {style:'.site-header, .back-to-top {visibility:hidden!important}',path:`tmp/boolean-revision-4/${info.project.name}-${theme}-eight-worlds.png`});
});

test('binary figures and operation tables retain their teaching layout',async({page},info)=>{
 for(const name of ['bool_binary_example']){
  const labels={bool_binary_example:'The binary number 1101',bool_bits_example:'The digits of 1101',bool_addition_example:'Column addition:'};
  const drawing=page.getByRole('img',{name:new RegExp(`^${labels[name]}`)}).first();
  if(await drawing.count())await reviewScreenshot(drawing, {path:`tmp/boolean-revision-4/${info.project.name}-${name}.png`});
 }
 await reviewScreenshot(page.getByRole('region',{name:'1101 plus 1001 equals 10110, in binary',exact:true}), {path:`tmp/boolean-revision-4/${info.project.name}-13-plus-9.png`});
 await reviewScreenshot(page.getByRole('figure',{name:/^Bits of 1101/}), {path:`tmp/boolean-revision-4/${info.project.name}-bit-positions.png`});
 await reviewScreenshot(page.locator('.function-tables').first(), {path:`tmp/boolean-revision-4/${info.project.name}-function-tables.png`});
});


test('focus rings fit inside adders and arithmetic stays alongside the table',async({page},info)=>{
 await page.evaluate(()=>document.fonts.ready);
 for(const kind of ['half','full']){
  const a=app(page,'circuit',kind);const toggle=button(a,'Toggle X');await toggle.focus();await page.keyboard.press('Space');
  await expect(toggle).toBeFocused();await expect(toggle).toHaveAttribute('aria-pressed','true');
  // Focus can start a smooth scroll. Read both rectangles in the same frame:
  // separate protocol calls can compare positions from different scroll offsets.
  const clearance=await toggle.evaluate(input=>{
   const canvas=input.closest('svg.boolean-circuit');
   return canvas.getBoundingClientRect().bottom-input.getBoundingClientRect().bottom;
  });
  expect(clearance,`${kind} adder leaves room for the focus outline`).toBeGreaterThan(5);
  await reviewScreenshot(a, {style:'.site-header, .back-to-top {visibility:hidden!important}',path:`tmp/boolean-revision-4/${info.project.name}-focused-${kind}.png`});
 }
 const a=app(page,'two-bit');const spacing=await a.evaluate(root=>{
  const arithmetic=root.querySelector('.column-addition').getBoundingClientRect(),table=root.querySelector('.function-table').getBoundingClientRect();
  return {horizontal:table.left-arithmetic.right,vertical:table.bottom-arithmetic.top};
 });
 expect(spacing.horizontal).toBeGreaterThanOrEqual(0);expect(spacing.vertical).toBeGreaterThan(0);
 await expect(a.locator('.column-addition__carry')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(button(a,'Animation off: reduced motion')).toBeDisabled();
});

test('union includes the overlap once; difference and complement remove the right members',async({page},info)=>{
 const union=page.getByRole('figure',{name:'Union of two sets',exact:true});await button(union,'S ∪ T').click();
 await expect(union.locator('[data-point].is-selected')).toHaveCount(4);await expect(union.locator('[data-point="b"]')).toHaveClass(/is-selected/);
 const diff=page.getByRole('figure',{name:'Difference of two sets',exact:true});await button(diff,'S ∖ T').click();await expect(diff.locator('[data-point].is-selected')).toHaveCount(1);
 await button(diff,'W ∖ S').click();await expect(diff.locator('[data-point].is-selected')).toHaveCount(5);
 for(const [name,diagram]of [['union',union],['difference',diff]])await reviewScreenshot(diagram, {style:'.site-header, .back-to-top {visibility:hidden!important}',path:`tmp/boolean-revision-4/${info.project.name}-${name}.png`});
 const {violations}=await new AxeBuilder({page}).include('[data-set-diagram]').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(violations).toEqual([]);
 const relay=app(page,'circuit','implementations');await button(relay,'OR').click();await button(relay,'Toggle X').click();
 await reviewScreenshot(relay, {animations:'disabled',style:'.site-header, .back-to-top {visibility:hidden!important}',path:`tmp/boolean-revision-4/${info.project.name}-or-relay.png`});
});


test('switch redraws preserve scroll and group bits by operand',async({page})=>{
 await page.evaluate(()=>document.fonts.ready);
 for(const [kind,preset]of [['circuit','full'],['two-bit','']]){
  const a=app(page,kind,preset),toggle=button(a,kind==='two-bit'?'Toggle X₁':'Toggle X');
  await toggle.scrollIntoViewIfNeeded();await toggle.evaluate(n=>{const r=n.getBoundingClientRect();window.scrollBy({top:r.top-innerHeight+160,behavior:'instant'});});
  const before=await page.evaluate(()=>scrollY),box=await toggle.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeCloseTo(before,0);
 }
 const labels=await app(page,'two-bit').locator('.circuit-switch').evaluateAll(ns=>ns.map(n=>n.getAttribute('aria-label')));expect(labels).toEqual(['Toggle X₁','Toggle X₀','Toggle Y₁','Toggle Y₀']);
});

test('dragging moves pins and attached wires before pointer release',async({page},info)=>{
 test.skip(info.project.name==='mobile','Pointer-drag geometry on desktop; touch alternatives use the same transform.');
 await page.goto('/exercises/boolean/');const a=app(page,'workbench','definitions');await button(a,'+ NOT').click();
 await a.locator('.boolean-connections').evaluate(n=>n.open=true);await a.getByRole('group',{name:'g1 input 1',exact:true}).getByRole('button',{name:'X (INPUT)',exact:true}).click();
 const gate=button(a,'NOT gate g1'),pin=button(a,'Connect from g1');await gate.scrollIntoViewIfNeeded();const b=await gate.boundingBox(),p=await pin.boundingBox(),wire=await a.locator('[data-target="g1"]').getAttribute('d');
 await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2+50,b.y+b.height/2+35,{steps:5});
 const moved=await pin.boundingBox();expect(moved.x-p.x).toBeGreaterThan(40);expect(await a.locator('[data-target="g1"]').getAttribute('d')).not.toBe(wire);await page.mouse.up();
});

test('exercise checkers cover three-bit addition, RGB valuations and evaluation examples',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/exercises/boolean/');
 const adder=app(page,'ripple-adder');await expect(adder).toBeHidden();await page.getByText('Check with a three-bit adder',{exact:true}).click();
 for(const n of ['X₂','X₀','Y₂','Y₁','Y₀'])await button(adder,`Toggle ${n}`).click();await expect(adder.getByRole('status')).toContainText('101 + 111 = 1100');await expect(adder.locator('.column-addition__carry')).toHaveCount(3);
 await reviewScreenshot(adder, {path:`tmp/boolean-revision-4/${info.project.name}-three-bit.png`});
 const rgb=app(page,'models','rgb');for(let n=0;n<8;n++){
  for(const [name,shift]of [['RED',2],['GREEN',1],['BLUE',0]])await rgb.getByRole('group',{name:`Value of ${name}`,exact:true}).getByRole('button',{name:String(n>>shift&1),exact:true}).click();await button(rgb,'Record this valuation').click();
 }await expect(rgb.getByRole('status')).toHaveText('8 of 8 valuations recorded.');await expect(rgb.locator('tbody tr')).toHaveCount(8);
 const evaluation=app(page,'evaluation');await expect(evaluation).toBeHidden();await page.getByText('Check the evaluations',{exact:true}).click();
 for(const [i,value]of [[1,1],[2,1],[3,0],[4,0]]){await button(evaluation,`Example ${i}`).click();await button(evaluation,'Last step').click();await expect(evaluation.getByRole('status')).toContainText(`= ${value}`);}
 await button(evaluation,'Your formula').click();await evaluation.getByLabel('Formula',{exact:true}).fill('SUN ∧ RAIN');await button(evaluation,'Use formula').click();await expect(evaluation.locator('[data-picture] svg')).toHaveCount(1);expect(errors).toEqual([]);
});

 test('model artwork and proposition outlines match their valuations',async({page},info)=>{
 const models=app(page,'models');await button(models,'[SUN ∨ RAIN]').click();await expect(models.locator('.boolean-proposition-outline:not(.is-component)')).toHaveCount(1);await expect(models.locator('[data-world-art].is-selected')).toHaveCount(3);
 await reviewScreenshot(models, {path:`tmp/boolean-revision-4/${info.project.name}-selected-union.png`});
 const fallacy=app(page,'models','fallacy');await button(fallacy,'Countermodels').click();await reviewScreenshot(fallacy, {path:`tmp/boolean-revision-4/${info.project.name}-countermodel.png`});
 await page.goto('/exercises/boolean/');const a=page.locator('[data-kind="model-exercise"][data-variables="3"]').first();
 const ids=await a.locator('button[data-model]').evaluateAll(ns=>ns.map(n=>n.dataset.model));expect(ids).toEqual(['M₁','M₂','M₃','M₄','M₅','M₆','M₇','M₈']);
 for(const id of ['M₁','M₃'])await a.locator(`[data-model="${id}"]`).click();await reviewScreenshot(a, {path:`tmp/boolean-revision-4/${info.project.name}-selected-eight-worlds.png`});
 });

test('parallel relay branches implement XOR and model controls expose formulas',async({page},info)=>{
 const models=app(page,'models');await expect(models.locator('.boolean-model-contour')).toHaveCount(0);
 const ds=app(page,'models','ds');await button(ds,'[SUN ∨ RAIN] ∩ [¬SUN]').click();await expect(ds.locator('.boolean-proposition-outline:not(.is-component)')).toHaveCount(1);
 await reviewScreenshot(ds, {path:`tmp/boolean-final-tweaks/${info.project.name}-intersection.png`});
 await page.goto('/exercises/boolean/');const a=app(page,'workbench','relays');await a.locator('.boolean-connections summary').click();await button(a,'2. XOR').click();
 for(const [id,inputs]of [['g1',['X (INPUT)','Y (INPUT)']],['g2',['Y (INPUT)','X (INPUT)']]]){
   await button(a,'+ Default-on relay').click();for(let i=0;i<2;i++)await a.getByRole('group',{name:`${id} input ${i+1}`,exact:true}).getByRole('button',{name:inputs[i],exact:true}).click();
   await button(a,`Connect from ${id}`).click();await button(a,'Connect to out input 1').click();
 }
 await button(a,'Check circuit').click();await expect(a.locator('[data-check-result]')).toContainText('implements XOR');await expect(a.locator('[data-target="out"]')).toHaveCount(2);
 await button(a,'Toggle X').click();await expect(a.getByRole('status')).toContainText('output = 1');
 await reviewScreenshot(a, {path:`tmp/boolean-final-tweaks/${info.project.name}-relay-xor.png`});
 const counter=app(page,'model-exercise');await expect(counter.locator('[data-toolbar]')).toContainText('∴ ¬RAIN');await counter.locator('[data-model="M₁"]').click();await button(counter,'Check selection').click();await expect(counter.locator('[data-toolbar]')).toContainText('✓');
 await reviewScreenshot(counter, {path:`tmp/boolean-final-tweaks/${info.project.name}-countermodels.png`});
 const custom=app(page,'model-exercise','custom');await expect(custom.getByLabel('Inference',{exact:true})).toHaveAttribute('readonly','');await expect(custom.locator('[data-inspector]')).not.toContainText('SUN ∨ RAIN');await reviewScreenshot(custom, {path:`tmp/boolean-final-tweaks/${info.project.name}-inference.png`});
});

test('switch and wiring targets are separated, and success respects reduced motion',async({page})=>{
 await page.goto('/exercises/boolean/');
 for(const preset of ['relays','definitions','nand-circuits']){
  const a=app(page,'workbench',preset),pin=button(a,'Connect from X'),toggle=button(a,'Toggle X');await pin.scrollIntoViewIfNeeded();
  const p=await pin.boundingBox(),t=await toggle.boundingBox();expect(p.y+p.height+8).toBeLessThan(t.y);
  await pin.click();await expect(toggle).toHaveAttribute('aria-pressed','false');await page.keyboard.press('Escape');await toggle.click();await expect(toggle).toHaveAttribute('aria-pressed','true');
 }
 const a=app(page,'model-exercise');await page.emulateMedia({reducedMotion:'no-preference'});await a.locator('[data-model="M₁"]').click();await button(a,'Check selection').click();
 await expect(a.getByRole('status')).toHaveAttribute('data-feedback','correct');await expect(a.locator('.logic-app__confetti')).toHaveCount(1);
 await expect(a.locator('.logic-app__confetti')).toHaveCount(0,{timeout:3000});
 await page.emulateMedia({reducedMotion:'reduce'});await button(a,'Check selection').click();await expect(a.locator('.logic-app__confetti')).toHaveCount(0);await expect(a.getByRole('status')).toContainText('Correct.');
 await a.locator('[data-model="M₂"]').click();await expect(a.getByRole('status')).not.toHaveAttribute('data-feedback','correct');
});

test('the sandbox opens with every component, no task, and a live circuit table',async({page})=>{
 await page.goto('/tools/circuit-sandbox/');
 const a=app(page,'workbench','sandbox');
 for(const name of ['+ NOT','+ AND','+ OR','+ XOR','+ NAND','+ NOR','+ XNOR','+ Default-off relay','+ Default-on relay'])await expect(button(a,name)).toBeEnabled();
 await expect(button(a,'Check circuit')).toHaveCount(0);
 await expect(a.locator('[data-target-table]')).toContainText('?');
 await button(a,'+ NOT').click();
 const from=button(a,'Connect from X');await from.scrollIntoViewIfNeeded();await from.click();
 await button(a,'Connect to g1 input 1').click();
 await button(a,'Connect from g1').click();await button(a,'Connect to out input 1').click();
 await expect(a.locator('[data-target-table]')).not.toContainText('?');
 await expect(a.getByRole('status')).toContainText('output = 1');
});
