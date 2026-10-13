import {test,expect} from './fixtures.mjs';
import {reviewScreenshot} from './review-screenshot.mjs';
import AxeBuilder from '@axe-core/playwright';
const app=(page,name)=>page.getByRole('region',{name,exact:true});
const button=(a,name)=>a.getByRole('button',{name,exact:true});
async function menu(a){if(await a.locator('.nd-sidebar').isHidden())await button(a,'Rules').click();}
async function rule(a,group,name){await menu(a);await a.locator(`[data-rule-tab="${group}"]`).click();await button(a,name).and(a.locator('[data-rule]')).click();}
async function modal(a,label,value){const d=a.getByRole('dialog');await d.getByRole('textbox',{name:label,exact:true}).fill(value);await button(d,'Apply').click();}
async function assume(a,f){await menu(a);await button(a,'+ Assumption').click();await modal(a,'Formula',f);}
test('Priest rules and stepped cases use the K₃ rule set',{tag:'@mobile'},async({page},info)=>{
 await page.goto('/textbook/many-valued/');const rules=app(page,'K₃ rules');
 await button(rules,'DeM').click();await expect(rules.locator('.nd-rules > .nd-tree')).toHaveCount(4);
 await button(rules,'Explosion').click();await expect(rules.locator('.nd-rules')).toContainText('¬A');await expect(rules.locator('.nd-rules')).not.toContainText('A ∧ ¬A');await expect(button(rules,'→')).toHaveCount(0);
 const a=app(page,'K₃ derivations');while(await button(a,'Next step').isEnabled())await button(a,'Next step').click();
 await expect(a.locator('.nd-board')).toContainText('Explosion');await expect(a.locator('.nd-board')).toContainText('∨ Elim');await expect(a.locator('.nd-status li')).toHaveCount(2);
 expect((await new AxeBuilder({page}).include('[data-proof-logic="k3"]').analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await reviewScreenshot(a,{path:`tmp/many-valued/revision-2/k3-proof-${info.project.name}.png`});
});
test('the K₃ canvas checks a cases proof, saves it, and rejects a classical workspace',async({page})=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'K₃ derivation exercises');await button(a,'Cases').click();await a.locator('[data-example="k3-mp"]').click();
 await assume(a,'¬SUN');await a.locator('[data-node="2"]').first().click();await a.locator('[data-node="1"]').first().click();await rule(a,'Explosion','Explosion');await modal(a,'Conclusion','RAIN');
 await assume(a,'RAIN');for(const id of [0,3,4])await a.locator(`[data-node="${id}"]`).first().click();await rule(a,'∨','∨ Elim');
 await a.locator('[data-node="2"]').first().click();await a.locator('[data-node="4"]').first().click();await button(a.getByRole('dialog'),'Apply').click();
 await expect(a.locator('.nd-status')).toContainText('Derivation complete');await expect(a.locator('.nd-status li')).toHaveCount(2);
 await menu(a);const download=page.waitForEvent('download');await button(a,'Save').click();const path=await(await download).path();
 await page.reload();await expect(a).toHaveAttribute('data-mounted','true');await a.locator('input[type=file]').setInputFiles(path);await expect(a.locator('.nd-status')).toContainText('Derivation complete');
 const {emptyProof}=await import('../../assets/js/logic/deduction.js');
 await a.locator('input[type=file]').setInputFiles({name:'classical.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'logicalmethods-nd',version:1,proof:emptyProof(),lemmas:[]}))});
 await expect(a.locator('.nd-status')).toContainText('different logic');await expect(a.locator('.nd-board')).toContainText('Explosion');
});
test('K₃ practice levels check DN and allow backward De Morgan',async({page})=>{
 await page.goto('/exercises/many-valued/');const a=app(page,'K₃ derivation exercises');
 await a.locator('[data-node="0"]').click();await rule(a,'DN','DN · introduce');await expect(a.locator('.nd-status')).toContainText('Derivation complete');await expect(a.locator('[data-example="k3-dn"]')).toHaveClass(/is-complete/);
 await a.locator('[data-example="k3-demorgan"]').click();await button(a,'Goal mode').click();await a.locator('[data-goal="0:"]').click();await rule(a,'DeM','DeM · ∧ to ¬∨');
 await a.locator('[data-goal="0:0"]').click();await rule(a,'∧','∧ Intro');await expect(a.locator('.nd-status')).toContainText('Derivation complete');
 await button(a,'Cases').click();await expect(a.locator('[aria-label="Levels"] button')).toHaveCount(5);
});
