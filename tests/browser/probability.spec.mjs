import {test,expect} from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import {reviewScreenshot} from './review-screenshot.mjs';
const app=(page,name)=>page.getByRole('region',{name,exact:true});
const finish=root=>root.getByRole('button',{name:'Last step',exact:true}).click();
test.beforeEach(async({page})=>{await page.goto('/textbook/probability/');});
test('probability calculations unfold over interpreted die models and validate weights',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Conditioning on an even roll');await expect(root).toHaveAttribute('data-mounted','true');
 await expect(root.locator('[data-probability]')).toHaveCount(0);
 await root.getByRole('button',{name:'Next step',exact:true}).click();await expect(root.locator('.prob-step')).toContainText('fails the condition');
 await root.getByRole('button',{name:'Next step',exact:true}).click();await expect(root.locator('.prob-step')).toContainText('add this model');await expect(root.locator('.prob-summand')).toHaveCount(1);
 await finish(root);await expect(root.locator('[data-probability]')).toHaveAttribute('data-value','1/3');
 await root.getByRole('button',{name:'Loaded',exact:true}).click();await finish(root);await expect(root.locator('[data-probability]')).toHaveAttribute('data-value','1/7');
 await root.getByRole('button',{name:'Certain',exact:true}).click();await finish(root);await expect(root.locator('[data-probability]')).toHaveAttribute('data-value','undefined');
 await root.getByRole('button',{name:'Fair',exact:true}).click();await root.getByLabel('Probability of model 1',{exact:true}).fill('1/3');await expect(root.getByRole('status')).toContainText('sum');
 await root.getByRole('button',{name:'Normalize',exact:true}).click();await finish(root);await expect(root.locator('[data-probability]')).toHaveAttribute('data-value','1/3');
 const input=root.getByLabel('Formula',{exact:true});await input.click({force:true});await expect(input).not.toBeFocused();await root.getByRole('button',{name:'Edit formula',exact:true}).click();await input.fill('D₂ ∨ D₄');await root.getByRole('button',{name:'Calculate',exact:true}).click();await expect(input).toHaveAttribute('readonly','');await finish(root);await expect(root.locator('[data-probability]')).toHaveAttribute('data-value','2/3');
 await root.getByRole('button',{name:'Reset',exact:true}).click();await expect(root.locator('[data-probability]')).toHaveCount(0);
});
test('weather pictures and table rows share a calculation',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Probabilities of formulas');await expect(root.locator('[data-world-art].is-selected')).toHaveCount(3);
 await root.locator('.boolean-world[data-model="M₂"]').click();await expect(root.locator('[data-row="1"]')).toHaveClass(/is-current/);await expect(root.locator('.prob-summand')).toHaveCount(2);
 await finish(root);await expect(root.locator('[data-probability]')).toHaveAttribute('data-value','3/4');
});
test('support sliders update the table and several measures can be graphed together',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Compare measures of support');await root.getByRole('button',{name:'Log probability ratio',exact:true}).click();await root.getByRole('button',{name:'Log-likelihood ratio',exact:true}).click();await expect(root.locator('.prob-curve')).toHaveCount(3);
 const range=root.getByRole('slider',{name:'Pr(C | E)',exact:true});await range.fill('0.4');await expect(root.locator('[data-support="difference"]')).toHaveAttribute('data-value','1/40');
 await expect.poll(async()=>root.getByLabel('Probability of model 1',{exact:true}).inputValue()).toBe('3/10');
 await root.getByRole('button',{name:'Edit conclusion',exact:true}).click();await root.getByLabel('Conclusion',{exact:true}).fill('SUN');await root.getByRole('button',{name:'Calculate',exact:true}).click();await expect(range).toBeDisabled();await expect(root.locator('[data-support="logLikelihood"]')).toHaveAttribute('data-value','∞');
});
test('sender scores distinguish logarithmic measures',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Evidence from an unknown sender');await expect(root.locator('[data-support="difference"]')).toHaveAttribute('data-value','1/15');await expect(root.locator('[data-support="logRatio"]')).toHaveAttribute('data-value','0.2877');await expect(root.locator('[data-support="logLikelihood"]')).toHaveAttribute('data-value','0.3747');
});
test('editable email highlights actual markers and recalculates parameters',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Naive Bayes spam filter');await root.getByRole('button',{name:'Classify',exact:true}).click();await expect(root.locator('[data-spam-posterior]')).toHaveAttribute('data-value','0.6693');await expect(root.locator('[data-classification]')).toContainText('Spam');await expect(root.getByLabel('Email body')).toBeHidden();await expect(root.locator('mark').first()).toBeVisible();
 await root.getByRole('button',{name:'Birthday',exact:true}).click();await expect(root.locator('[data-classification]')).toHaveCount(0);await root.getByRole('button',{name:'Classify',exact:true}).click();await expect(root.locator('[data-spam-posterior]')).toHaveAttribute('data-value','0.6693');
 await root.getByText('Probabilities and threshold',{exact:true}).click();await root.getByLabel('Spam threshold',{exact:true}).fill('0.8');await root.getByRole('button',{name:'Classify',exact:true}).click();await expect(root.locator('[data-classification]')).toContainText('Inbox');
 await root.getByRole('button',{name:'Edit email',exact:true}).click();await root.getByLabel('Email subject',{exact:true}).fill('Urgent investment');await root.getByLabel('Email body',{exact:true}).fill('Invest money today.');await root.getByRole('button',{name:'Classify',exact:true}).click();await expect(root.locator('[data-spam-posterior]')).toHaveAttribute('data-value','0.5399');
 await root.getByRole('button',{name:'Edit email',exact:true}).click();await root.getByLabel('Email subject').fill('Meeting');await root.getByLabel('Email body').fill('This is urgent but only the subject counts. <img>');await root.getByRole('button',{name:'Classify',exact:true}).click();await expect(root.locator('.prob-letter__preview mark')).toHaveCount(0);await expect(root.locator('.prob-letter__preview img')).toHaveCount(0);
 await root.getByLabel('Pr(SPAM)',{exact:true}).fill('');await root.getByRole('button',{name:'Classify',exact:true}).click();await expect(root.getByRole('status')).toContainText('between 0 and 1');
 await root.getByRole('button',{name:'Reset',exact:true}).click();await root.getByRole('button',{name:'Classify',exact:true}).click();await expect(root.locator('[data-spam-posterior]')).toHaveAttribute('data-value','0.6693');
});
test('the negation derivation unfolds equations with reasons',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Deriving the probability of a negation');await expect(root.locator('.boolean-derivation li')).toHaveCount(1);await finish(root);await expect(root.locator('.boolean-derivation li')).toHaveCount(3);await expect(root.locator('.is-current')).toContainText('Pr(¬A) = 1 − Pr(A)');
});
for(const theme of ['light','dark'])test(`probability apps fit and remain accessible in ${theme}`,{tag:'@mobile'},async({page},info)=>{
 await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await page.evaluate(()=>document.fonts.ready);
 await app(page,'Naive Bayes spam filter').getByRole('button',{name:'Classify',exact:true}).click();await finish(app(page,'Die probabilities'));
 expect((await new AxeBuilder({page}).include('.probability-app').analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)}))).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 for(const root of await page.locator('.probability-app').all())expect(await root.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 for(const plot of await page.locator('.prob-plot').all())expect(await plot.evaluate(el=>[...el.querySelectorAll('text')].every(text=>{const b=text.getBBox();return b.x>=0&&b.x+b.width<=el.viewBox.baseVal.width;}))).toBe(true);
 if(theme==='light')for(const name of ['Die probabilities','Compare measures of support','Naive Bayes spam filter'])await reviewScreenshot(app(page,name),{path:`tmp/probability-revision/round2/${name.replaceAll(' ','-')}-${info.project.name}.png`});
});
test('support comparison fits a small laptop screen',async({page})=>{
 await page.setViewportSize({width:1280,height:800});await page.evaluate(()=>document.fonts.ready);
 const root=app(page,'Compare measures of support');await root.getByRole('button',{name:'Log probability ratio',exact:true}).click();await root.getByRole('button',{name:'Log-likelihood ratio',exact:true}).click();
 expect(await root.evaluate(el=>el.getBoundingClientRect().height)).toBeLessThan(700);
});
test('probability fullscreen preserves selected measures',async({page})=>{
 const root=app(page,'Compare measures of support'),value=await root.locator('[data-support="difference"]').getAttribute('data-value');await root.getByRole('button',{name:'Fullscreen',exact:true}).click();await expect.poll(()=>root.evaluate(el=>document.fullscreenElement===el)).toBe(true);await expect(root.locator('[data-support="difference"]')).toHaveAttribute('data-value',value);await root.getByRole('button',{name:'Exit fullscreen',exact:true}).click();
});

test('comparison sliders recover from boundary probabilities and mark excluded ranges',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Compare measures of support');
 await expect(root.locator('.prob-excluded-range')).toHaveCount(2);
 await root.getByRole('button',{name:'Log probability ratio',exact:true}).click();
 const prior=root.getByRole('slider',{name:'Pr(C)',exact:true});
 await prior.fill('0');await expect(root.locator('[data-support="logRatio"]')).toHaveAttribute('data-value','undefined');
 await expect(prior).toBeEnabled();await prior.fill('0.375');
 await expect(root.locator('[data-support="difference"]')).toHaveAttribute('data-value','-1/24');
 for(const boundary of ['0','1']){
  const evidence=root.getByRole('slider',{name:'Pr(E)',exact:true});
  await evidence.fill(boundary);await expect(evidence).toBeEnabled();await evidence.fill('0.75');
  await expect(root.locator('[data-support="difference"]')).toHaveAttribute('data-value','-1/24');
 }
 const posterior=root.getByRole('slider',{name:'Pr(C | E)',exact:true});
 await prior.fill('0.5');await root.getByRole('slider',{name:'Pr(E)',exact:true}).fill('0.25');
 await expect(root.locator('.prob-endpoint[data-open="true"]')).toHaveCount(1);
 await expect(posterior).toBeEnabled();
});
test('disjunction derivation subtracts the overlap step by step',{tag:'@mobile'},async({page})=>{
 const root=app(page,'Deriving the probability of a disjunction');
 await expect(root.locator('.boolean-derivation li')).toHaveCount(1);
 await root.getByRole('button',{name:'Next step',exact:true}).click();
 await expect(root.locator('.is-current')).toContainText('Pr(¬A ∧ B) = Pr(B) − Pr(A ∧ B)');
 await finish(root);await expect(root.locator('.boolean-derivation li')).toHaveCount(4);
 await expect(root.locator('.is-current')).toContainText('Pr(A ∨ B) = Pr(A) + Pr(B) − Pr(A ∧ B)');
});
