import {test,expect} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import {useTestPassword,testPassword} from './solution-password.mjs';
const app=(page,exercise)=>page.locator(`[data-logic-app="probability"][data-exercise="${exercise}"]`);
const button=(root,name)=>root.getByRole('button',{name,exact:true});
const feedback=root=>root.locator('[data-practice-feedback]');
async function weights(root,values){for(const [i,value]of values.entries())await root.getByLabel(`Probability of model ${i+1}`,{exact:true}).fill(String(value));}
test.beforeEach(async({page})=>{await page.goto('/exercises/probability/');});
test('weight construction checks all constraints, preserves drafts and resets the current level',{tag:'@mobile'},async({page})=>{
 const a=app(page,'weights');await expect(a).toHaveAttribute('data-mounted','true');await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await weights(a,['1/4','1/4','1/4','1/4']);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');await expect(button(a,'Level 1')).toHaveAttribute('data-done','true');
 await button(a,'Level 4').click();await expect(a.locator('[data-task]')).toContainText('RAIN ∨ (¬SUN → RAIN)');await weights(a,['1/8','1/4','1/8','1/2']);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 5').click();await weights(a,[0,0,.5,.5]);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await weights(a,[.375,.125,.125,.375]);await a.getByLabel('Probability of model 4',{exact:true}).press('Enter');await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 1').click();await expect(a.getByLabel('Probability of model 1',{exact:true})).toHaveValue('1/4');await button(a,'Reset level').click();await expect(a.getByLabel('Probability of model 1',{exact:true})).toHaveValue('2/5');await expect(feedback(a)).toBeEmpty();
 await a.getByLabel('Probability of model 1',{exact:true}).fill('');await button(a,'Check').click();await expect(feedback(a)).toContainText('between 0 and 1');
});
test('eight weather models synchronize picture and rows and check arithmetic separately',{tag:'@mobile'},async({page})=>{
 const a=app(page,'calculate');await expect(a.locator('tbody tr')).toHaveCount(8);await expect(a.locator('.boolean-world')).toHaveCount(8);
 await button(a,'Select model 1').focus();await page.keyboard.press('Space');await expect(a.locator('.boolean-world[data-model="M₁"]')).toHaveAttribute('aria-pressed','true');
 await a.locator('.boolean-world[data-model="M₂"]').click();await expect(button(a,'Select model 2')).toHaveAttribute('aria-pressed','true');
 await button(a,'Select model 5').click();await button(a,'Select model 6').click();
 await a.getByRole('textbox',{name:'Your probability'}).fill('1/2');await button(a,'Check').click();await expect(feedback(a)).toContainText('selected models are right');
 await a.getByRole('textbox',{name:'Your probability'}).fill('11/20');await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 7').click();for(const i of [1,3,6])await button(a,`Select model ${i}`).click();await a.getByLabel('Your probability').fill('3/4');await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 for(const i of [2,4,5])await button(a,`Select model ${i}`).click();await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 1').click();await expect(a.getByLabel('Your probability')).toHaveValue('11/20');await expect(a.locator('tbody .is-current')).toHaveCount(4);
 await button(a,'Reset level').click();await expect(a.locator('tbody .is-current')).toHaveCount(0);await expect(a.getByLabel('Your probability')).toBeEmpty();
});
test('independence levels accept classification and constrained constructions',{tag:'@mobile'},async({page})=>{
 const a=app(page,'independence');await button(a,'Check').click();await expect(feedback(a)).toContainText('Choose');await button(a,'Dependent').click();await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await button(a,'Independent').click();await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 3').click();await weights(a,[.25,.25,.25,.25]);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 4').click();await weights(a,[1,0,0,0]);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');await weights(a,[.4,.1,.1,.4]);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
 await button(a,'Level 5').click();await weights(a,[.25,.375,.375,0]);await button(a,'Check').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');
});
test('spam challenge locks the evidence and threshold and checks permitted probability changes',{tag:'@mobile'},async({page})=>{
 const a=app(page,'trick');await expect(a.getByLabel('Email subject')).toHaveAttribute('readonly','');await expect(a.getByLabel('Known sender')).toBeDisabled();await expect(a.getByLabel('Spam threshold',{exact:true})).toHaveCount(0);await expect(a.getByLabel('Unknown given spam',{exact:true})).toBeDisabled();
 await button(a,'Classify').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');await a.getByLabel('Pr(SPAM)',{exact:true}).fill('0.1');await expect(feedback(a)).toBeEmpty();await button(a,'Classify').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');await expect(a.locator('[data-classification]')).toContainText('Inbox');
 await button(a,'Level 2').click();await expect(a.getByLabel('Pr(SPAM)',{exact:true})).toBeDisabled();await expect(a.locator('[data-classification]')).toHaveCount(0);
 for(const name of ['Unknown','Urgent','Exclamation','Money']){await a.getByLabel(`${name} given spam`,{exact:true}).fill('0.2');await a.getByLabel(`${name} given nonspam`,{exact:true}).fill('0.8');}
 await button(a,'Classify').click();await expect(feedback(a)).toHaveAttribute('data-feedback','correct');await expect(a.locator('[data-spam-posterior]')).toHaveAttribute('data-value','0.001');
 await a.getByLabel('Unknown given spam',{exact:true}).fill('0');await button(a,'Classify').click();await expect(feedback(a)).toHaveAttribute('data-feedback','incorrect');
 await button(a,'Level 1').click();await expect(a.getByLabel('Pr(SPAM)',{exact:true})).toHaveValue('0.1');await button(a,'Reset').click();await expect(a.getByLabel('Pr(SPAM)',{exact:true})).toHaveValue('0.2');await expect(feedback(a)).toBeEmpty();
});
for(const theme of ['light','dark'])test(`probability exercises fit and are accessible in ${theme}`,{tag:'@mobile'},async({page})=>{
 await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await page.evaluate(()=>document.fonts.ready);
 await button(app(page,'trick'),'Classify').click();await button(app(page,'weights'),'Check').click();
 expect((await new AxeBuilder({page}).include('.probability-app').analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)}))).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 for(const a of await page.locator('.probability-app').all())expect(await a.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
});
test('exercise fullscreen preserves row choices',async({page})=>{
 const a=app(page,'calculate');await button(a,'Select model 1').click();await button(a,'Fullscreen').click();await expect.poll(()=>a.evaluate(el=>document.fullscreenElement===el)).toBe(true);await expect(button(a,'Select model 1')).toHaveAttribute('aria-pressed','true');await button(a,'Exit fullscreen').click();
});
test('existing solution anchors still open the revised answers',async({page})=>{
 await useTestPassword(page);await page.reload();await page.locator('[data-solution="coin-flipsSolution"]').click();await page.locator('#passwordInput').fill(testPassword);await page.locator('#passwordInput').press('Enter');await expect(page.locator('#coin-flipsSolution')).toBeVisible();
});


test('calculation and spam exercises remain compact on a small laptop',async({page})=>{
 await page.setViewportSize({width:1280,height:800});await page.evaluate(()=>document.fonts.ready);
 expect(await app(page,'calculate').evaluate(el=>el.getBoundingClientRect().height)).toBeLessThan(700);
 const a=app(page,'trick');
 for(const level of [1,2]){await button(a,`Level ${level}`).click();await button(a,'Classify').click();expect(await a.evaluate(el=>el.getBoundingClientRect().height)).toBeLessThan(720);}
});
