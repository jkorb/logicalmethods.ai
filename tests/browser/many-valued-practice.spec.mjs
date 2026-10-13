import {test,expect,routeToTestSite,TEST_ORIGIN} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import {budget} from './budget.mjs';
import {reviewScreenshot} from './review-screenshot.mjs';
import {inferenceLevels,lawLevels,sqlSolution,speeds} from '../../assets/js/logic/many-valued-practice.js';
const app=(page,kind)=>page.locator(`[data-logic-app="mv-practice"][data-exercise="${kind}"]`);
const button=(a,name)=>a.getByRole('button',{name,exact:true});
const feedback=a=>a.locator('[data-practice-feedback]');
async function runSQL(a,source){
 const input=a.locator('[data-sql-source]');if(await input.isHidden()||await input.getAttribute('readonly')!==null)await a.locator('[data-edit-sql]').click();
 await input.fill(source);await a.locator('[data-run-sql]').click();
}
async function number(a,name,value){const input=a.getByRole('spinbutton',{name,exact:true});await input.fill(String(value));await input.press('Tab');}
async function slider(a,name,value){await a.getByRole('slider',{name,exact:true}).fill(String(value));}
async function curve(a,name,values){
 await button(a,name).click();
 for(let i=0;i<values.length;i++){
  await number(a,'Selected speed',speeds[i]);await number(a,'Selected membership degree',values[i]);
 }
}
test('SQL inference levels require a correct countermodel query and interpretation',async({page})=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'inference');
 await button(a,'⊭ Invalid').click();await expect(feedback(a)).toContainText('First run');
 await runSQL(a,'SELECT SUN, RAIN, WIND FROM Valuations WHERE 0;');await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await runSQL(a,sqlSolution(inferenceLevels[0],'inference'));await expect(feedback(a)).toContainText('Interpret');
 await button(a,'⊨ Valid').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await button(a,'⊭ Invalid').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');await expect(button(a,'Level 1')).toHaveAttribute('data-done','true');
 await button(a,'Level 3').click();await expect(a.locator('[data-task]')).toContainText('SUN, ¬SUN ∴ RAIN');await runSQL(a,sqlSolution(inferenceLevels[2],'inference'));await expect(feedback(a)).toContainText('Interpret');
 await button(a,'⊨ Valid').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 1').click();await expect(a.locator('[data-sql-source]')).toHaveValue(sqlSolution(inferenceLevels[0],'inference'));
 await button(a,'⊭ Invalid').click();await expect(feedback(a)).toContainText('First run');
 await runSQL(a,'DELETE FROM Valuations;');await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
});
test('law levels check all NULL counterexamples and retain editable drafts',{tag:'@mobile'},async({page},info)=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'laws');
 await runSQL(a,sqlSolution(lawLevels[0],'laws'));await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,`Level ${lawLevels.length}`).click();
 await runSQL(a,'SELECT X,Y,Z FROM ValueTriples WHERE (X OR NOT X) != 1;');await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await runSQL(a,sqlSolution(lawLevels.at(-1),'laws'));await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/sql-${info.project.name}.png`});
 await button(a,'Reset level').click();await expect(feedback(a)).toBeEmpty();await expect(a.locator('[data-sql-source]')).toHaveValue(/your condition/);
});
test('fuzzy curves and rule levels check editable diagrams with keyboard input',{tag:'@mobile'},async({page},info)=>{
 test.setTimeout(budget(60_000));
 await page.goto('/exercises/many-valued/');const a=app(page,'curves');
 await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await button(a,'Level 3').click();await curve(a,'Fast',[0,.5,.5,1]);await curve(a,'Slow',[1,.5,.5,0]);
 await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await expect(a.locator('.mv-gray-band')).toBeVisible();
 await a.locator('.mv-checkpoint').nth(1).focus();await page.keyboard.press('ArrowDown');await expect(a.getByRole('spinbutton',{name:'Selected membership degree'})).toHaveValue('0.45');
 await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await page.keyboard.press('Tab');await curve(a,'Slow',[1,.5,.5,0]);
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/curves-${info.project.name}.png`});
 const rules=app(page,'rules');await button(rules,'Level 3').click();await expect(rules.locator('.mv-checkpoint')).toHaveCount(0);await curve(rules,'Fast',[1,0,1,0]);await curve(rules,'Slow',[0,1,0,1]);await button(rules,'Check').click();await expect(feedback(rules)).toHaveAttribute('data-feedback','correct');
});
test('counterexamples compare degrees strictly and preserve level drafts',async({page})=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'counterexamples');await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await slider(a,'v(A)',.6);await slider(a,'v(B)',.3);await button(a,'Check').click();await expect(feedback(a)).toContainText('0.6 > 0.3');
 await button(a,'Level 2').click();await slider(a,'v(A)',.5);await slider(a,'v(B)',0);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 1').click();await expect(a.getByRole('slider',{name:'v(A)'})).toHaveValue('0.6');
 await button(a,'Reset level').click();await expect(a.getByRole('slider',{name:'v(A)'})).toHaveValue('1');
});
test('controller levels use three conditions and a consistent decimal power scale',{tag:'@mobile'},async({page},info)=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'braking');
 await expect(a.getByRole('spinbutton')).toHaveCount(3);await expect(a).not.toContainText('Strength');await expect(a).not.toContainText('%');
 await number(a,'Fast output',.9);await number(a,'Slow output',.1);await number(a,'Moderate output',.5);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await expect(a.locator('[data-controller-output]')).toContainText('60 km/h: 0.5');
 await button(a,'Level 2').click();await number(a,'Fast output',1);await button(a,'Check').click();await expect(feedback(a)).toContainText('between 0.6 and 0.7');
 await number(a,'Moderate output',.8);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await expect(a.locator('[data-controller-output]')).toContainText('60 km/h: 0.65');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/sugeno-${info.project.name}.png`});
 await button(a,'Level 4').click();await number(a,'Low ends at',.2);await number(a,'Medium peaks at',.75);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/braking-${info.project.name}.png`});
 await expect(a.locator('.mv-practice-graph')).toHaveCount(2);await expect(a.locator('.mv-output-sets')).toBeVisible();
 await expect(a.locator('[data-controller-output]')).toContainText('60 km/h: 0.625');
 await button(a,'Level 2').click();await expect(a.getByRole('spinbutton',{name:'Moderate output',exact:true})).toHaveValue('0.8');
 await button(a,'Reset level').click();await expect(a.getByRole('spinbutton',{name:'Moderate output',exact:true})).toHaveValue('0.3');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect((await new AxeBuilder({page}).include('.mv-practice').analyze()).violations).toEqual([]);
});
test('curve dragging and sliders remain live across pointer moves and fullscreen',async({page})=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'curves'),canvas=a.locator('.mv-practice-graph');
 await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox(),x=box.x+320/620*box.width,y=box.y+150/320*box.height;await page.mouse.move(x,y);await page.mouse.down();
 await page.mouse.move(x,y-20);await page.mouse.move(x,y-40);await page.mouse.up();
 expect(Number(await a.getByRole('spinbutton',{name:'Selected membership degree'}).inputValue())).toBeGreaterThan(.65);
 await button(a,'Fullscreen').click();await expect(a).toHaveJSProperty('clientWidth',1440);await expect(button(a,'Exit fullscreen')).toBeVisible();
 await button(a,'Exit fullscreen').click();await expect(button(a,'Fullscreen')).toBeVisible();
 const c=app(page,'counterexamples'),range=c.getByRole('slider',{name:'v(A)'});await range.scrollIntoViewIfNeeded();const b=await range.boundingBox();
 await page.mouse.move(b.x+b.width-8,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width*.7,b.y+b.height/2);await page.mouse.move(b.x+b.width*.3,b.y+b.height/2);await page.mouse.up();
 expect(Number(await range.inputValue())).toBeLessThan(.4);await expect(c.locator('[data-live] td').first()).toContainText('0.3');await expect(c.locator('[data-live]')).not.toContainText('Least premise');
});

test('curve editing keeps only task checkpoints and supports keyboard pulling',async({page})=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'curves');await expect(a.locator('.mv-checkpoint')).toHaveCount(2);
 await a.locator('.mv-curve-hit').focus();await page.keyboard.press('ArrowUp');await page.keyboard.press('ArrowRight');
 await expect(a.getByRole('spinbutton',{name:'Selected speed'})).toHaveValue('70');
 await expect(a.locator('.mv-checkpoint')).toHaveCount(2);await expect(a.locator('.mv-knot')).toHaveCount(0);
 await button(a,'Level 3').click();await expect(a.locator('.mv-checkpoint')).toHaveCount(4);
});
test('level tasks and controls follow the selected theme despite OS preferences',{tag:'@mobile'},async({page},info)=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('/exercises/many-valued/');
 await page.evaluate(()=>document.documentElement.dataset.theme='light');
 for(const kind of ['inference','laws','curves','rules','counterexamples','braking'])await expect(app(page,kind).locator('[data-task] > strong')).toHaveText('Task');
 const a=app(page,'curves'),field=a.getByRole('spinbutton',{name:'Selected membership degree'});
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme)).toBe('light');
 const styles=await field.evaluate(e=>({background:getComputedStyle(e).backgroundColor,paper:getComputedStyle(document.documentElement).getPropertyValue('--paper').trim()}));expect(styles.background).toBe('rgb(252, 251, 247)');
 await expect(page.locator('[data-proof-logic="k3"][data-kind="practice"] .nd-goal > strong')).toHaveText('Task: ');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/light-controls-${info.project.name}.png`});
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');expect(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
 expect((await new AxeBuilder({page}).include('.mv-practice').analyze()).violations).toEqual([]);
 await reviewScreenshot(app(page,'braking'),{path:`tmp/many-valued/exercises/dark-braking-${info.project.name}.png`});
});

test('written fuzzy validity tasks use course inference figures',{tag:'@mobile'},async({page},info)=>{
 await page.goto('/exercises/many-valued/');const figure=page.getByRole('figure',{name:'Fuzzy inferences to prove',exact:true});
 await expect(figure).toContainText('A ∧ B');await expect(figure.locator('.inference-rules__item')).toHaveCount(3);
 await reviewScreenshot(figure,{path:`tmp/many-valued/exercises/valid-inferences-${info.project.name}.png`});
});

test('supplied memberships render without JavaScript',{tag:'@mobile'},async({browser},info)=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport});const page=await context.newPage();
 try{
  await routeToTestSite(page);await page.goto(`${TEST_ORIGIN}/exercises/many-valued/`);await page.evaluate(()=>document.fonts.ready);
  const inputs=page.locator('[data-fuzzy-diagrams="inputs"]');
  await expect(inputs.getByRole('img')).toHaveAccessibleName(/Fast rises linearly.*Moderate rises from 0 to 1/);
  await expect(page.locator('#smooth-controller-outputSolution')).toBeAttached();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await reviewScreenshot(inputs,{path:`tmp/many-valued/exercises/supplied-predicates-${info.project.name}.png`});
 }finally{await context.close();}
});

test('static fuzzy diagrams have accessible markup',{tag:'@mobile'},async({page})=>{
 await page.goto('/exercises/many-valued/');
 expect((await new AxeBuilder({page}).include('.fuzzy-diagrams').analyze()).violations).toEqual([]);
});

test('smooth braking asks for controller values and checks the join',{tag:'@mobile'},async({page},info)=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'braking');await button(a,'Level 3').click();
 await expect(a.getByRole('button',{name:'Level 4',exact:true})).toBeVisible();await expect(a.getByRole('spinbutton')).toHaveCount(3);
 await number(a,'Fast output',.9);await number(a,'Slow output',.1);await button(a,'Check').click();
 await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');await expect(feedback(a)).toContainText('still a corner');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/smooth-corner-${info.project.name}.png`});
 await number(a,'Moderate output',.5);await button(a,'Check').click();
 await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/smooth-controller-${info.project.name}.png`});
 await button(a,'Reset level').click();await expect(a.getByRole('spinbutton',{name:'Moderate output',exact:true})).toHaveValue('0.3');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect((await new AxeBuilder({page}).include('[data-exercise="braking"]').analyze()).violations).toEqual([]);
});

test('Mamdani inspection links clipping, aggregation, centroid, and selected speed',{tag:'@mobile'},async({page},info)=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'braking');await button(a,'Level 4').click();
 const speed=a.getByRole('slider',{name:'Inspect speed (km/h)',exact:true}),clips=a.locator('[data-clip-heights]'),centroid=a.locator('[data-centroid-output]');
 await expect(speed).toHaveValue('60');await expect(clips).toHaveText('Low ≤ 0.5Medium ≤ 1High ≤ 0.5');
 await expect(a.locator('[data-combined-area]')).toBeVisible();await expect(centroid).toHaveText('Centroid power: 0.5');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/mamdani-clipping-${info.project.name}.png`});
 await speed.focus();await page.keyboard.press('Home');
 await expect(speed).toBeFocused();await expect(clips).toHaveText('Low ≤ 1Medium ≤ 0High ≤ 0');await expect(centroid).toHaveText('Centroid power: 0.133');
 await page.keyboard.press('End');await expect(speed).toHaveValue('120');
 await expect(clips).toHaveText('Low ≤ 0Medium ≤ 0High ≤ 1');await expect(centroid).toHaveText('Centroid power: 0.867');
 await speed.evaluate(e=>{e.value='30';e.dispatchEvent(new Event('input',{bubbles:true}));});await page.keyboard.press('ArrowRight');
 await expect(speed).toHaveValue('31');await expect(a.locator('[data-inspect-speed]')).toHaveText('31 km/h');
 const response=a.getByRole('group',{name:'Braking power by speed',exact:true});
 await response.scrollIntoViewIfNeeded();const box=await response.boundingBox();
 await response.click({position:{x:(45+550*.75)/620*box.width,y:100/320*box.height}});
 await expect(speed).toHaveValue('90');await expect(clips).toHaveText('Low ≤ 0.25Medium ≤ 0.5High ≤ 0.75');
 expect(await a.locator('[data-centroid]').getAttribute('data-centroid')).toBe(await a.locator('[data-selected-power]').getAttribute('data-selected-power'));
 const area=await a.locator('[data-combined-area]').getAttribute('d');await number(a,'Low ends at',.2);
 await expect(speed).toHaveValue('90');expect(await a.locator('[data-combined-area]').getAttribute('d')).not.toBe(area);
 await number(a,'Medium peaks at',.75);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await speed.focus();await page.keyboard.press('Home');await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 1').click();await expect(a.getByRole('slider')).toHaveCount(0);
 await button(a,'Level 4').click();await expect(speed).toHaveValue('0');
 await button(a,'Reset level').click();await expect(speed).toHaveValue('60');await expect(centroid).toHaveText('Centroid power: 0.5');
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');
 // Audit the final theme, after the button's background transition completes.
 await expect(button(a,'Check')).toHaveCSS('background-color','rgb(27, 30, 35)');
 await reviewScreenshot(a,{path:`tmp/many-valued/exercises/mamdani-clipping-dark-${info.project.name}.png`});
 expect((await new AxeBuilder({page}).include('[data-exercise="braking"]').analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
