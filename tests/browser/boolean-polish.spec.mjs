import { reviewScreenshot } from './review-screenshot.mjs';
import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';

test('workbench fits a half-width laptop window and edits directly on canvas',async({page},info)=>{
 await page.setViewportSize({width:700,height:800});await page.goto('/exercises/boolean/');
 const a=page.locator('[data-preset="relays"]').first();
 await expect(a.locator('[data-inspector]')).not.toBeVisible();
 await a.locator('[data-add="RELAY-OFF"]').click();
 expect((await a.locator('.boolean-circuit').boundingBox()).height).toBeLessThanOrEqual(481);
 await a.getByRole('button',{name:'Connect from X',exact:true}).click();await a.getByRole('button',{name:'Connect to g1 input 1',exact:true}).click();
 await expect(a.locator('[data-target="g1"]')).toHaveCount(1);
 await a.getByRole('button',{name:'Connect to g1 input 1',exact:true}).click();await a.getByRole('button',{name:'Disconnect g1 input 1',exact:true}).click();await expect(a.locator('[data-target="g1"]')).toHaveCount(0);
 await a.getByRole('button',{name:'Default-off relay g1',exact:true}).click();await a.getByRole('button',{name:'Remove g1',exact:true}).click();await expect(a.locator('[data-node="g1"]')).toHaveCount(0);
 await a.locator('[data-add="RELAY-ON"]').click();await a.getByRole('button',{name:'Clear',exact:true}).click();await expect(a.locator('.circuit-gate')).toHaveCount(0);
 await reviewScreenshot(a, {path:`tmp/boolean-polish/${info.project.name}-workbench.png`});
});

test('complex propositions explain set operations and preserve component outlines',async({page},info)=>{
 await page.goto('/textbook/boolean/');const a=page.locator('[data-kind="models"]').first();
 await a.getByRole('button',{name:'[SUN ∨ RAIN]',exact:true}).click();
 await expect(a.getByRole('status')).toContainText('[SUN ∨ RAIN] = [SUN] ∪ [RAIN]');
 await expect(a.locator('[data-component-set]')).toHaveCount(2);
 expect(await a.locator('.boolean-proposition-outline:not(.is-component)').getAttribute('d')).toContain('Q');
 await reviewScreenshot(a, {path:`tmp/boolean-polish/${info.project.name}-sets.png`});
 await page.goto('/exercises/boolean/');
 expect(await page.locator('[data-variables="3"]').first().locator('.boolean-model-label').allTextContents()).toEqual(['M₁','M₂','M₃','M₄','M₅','M₆','M₇','M₈']);
});

test('pseudocode checks gaps, preserves answers, and honours reduced motion',async({page},info)=>{
 await page.goto('/exercises/formal-languages/');const a=page.locator('[data-logic-app="pseudocode-practice"]');
 await a.getByRole('button',{name:'Check',exact:true}).click();await expect(a.locator('input')).toHaveAttribute('aria-invalid','true');
 await a.locator('input').fill('def');await a.getByRole('button',{name:'Check',exact:true}).click();await expect(a.getByRole('status')).toContainText('Correct.');
 const answers=[['return'],['if','else'],['for','in'],['if','return']];
 for(let i=0;i<answers.length;i++){
  await a.locator('[data-level-picker] button').nth(i+1).click();for(let j=0;j<answers[i].length;j++)await a.locator('input').nth(j).fill(answers[i][j]);
  await a.getByRole('button',{name:'Check',exact:true}).click();await expect(a.getByRole('status')).toContainText('Correct.');
 }
 await a.locator('[data-level-picker] button').first().click();await expect(a.locator('input')).toHaveValue('def');
 // celebrate.js removes a burst 1200 ms after it appears. Wait for the burst
 // from the answers above to actually go, rather than sleeping for slightly
 // longer than that timer and hoping a loaded runner ran it on time.
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(a.locator('.logic-app__confetti')).toHaveCount(0);
 await a.getByRole('button',{name:'Check',exact:true}).click();
 await expect(a.getByRole('status')).toContainText('Correct.');
 await expect(a.locator('.logic-app__confetti')).toHaveCount(0);
 expect((await new AxeBuilder({page}).include('[data-logic-app="pseudocode-practice"]').analyze()).violations).toEqual([]);
 await reviewScreenshot(a, {path:`tmp/boolean-polish/${info.project.name}-pseudocode.png`});
});
