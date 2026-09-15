import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
test('notation practice checks both directions, shows answers and changes examples',async({page})=>{
  await page.goto('/exercises/formal-languages/');
  const app=page.locator('[data-logic-app="notation-practice"]');
  const field=app.getByLabel('Your formula');
  await field.fill('(¬p ∧ q)'); await field.press('Enter');
  await expect(app.getByRole('status')).toContainText('Correct');
  await app.locator('[data-notation-picker] summary').click();
  await app.getByRole('button', {name: 'Conventional notation', exact: true}).click();
  await field.fill('(¬p ∧ q)'); await field.press('Enter');
  await expect(app.getByRole('status')).toContainText('unnecessary');
  await field.fill('q ∧ ¬p'); await field.press('Enter');
  await expect(app.getByRole('status')).toContainText('changes the tree');
  await field.fill('\\neg p \\land q'); await field.press('Enter');
  await expect(app.getByRole('status')).toContainText('Correct');
  await app.getByRole('button',{name:'Next example'}).click();
  await expect(app.locator('[data-count]')).toHaveText('Example 2 of 12');
  await app.getByRole('button',{name:'Show answer'}).click();
  await expect(app.getByRole('status')).toHaveText('Answer: p ∨ q ∧ r');
  expect((await new AxeBuilder({page}).include('[data-logic-app="notation-practice"]').analyze()).violations).toEqual([]);
});
test('shunting steps support backward navigation, reject malformed input and remain independent',async({page})=>{
  await page.goto('/exercises/formal-languages/');
  const app=page.locator('[data-logic-app="shunting-yard"]');
  const next=app.getByRole('button',{name:'Next step',exact:true});
  while(await next.isEnabled()) await next.click();
  await expect(app.locator('[data-output]')).toHaveText('p q r ∧ ∨');
  await app.getByRole('button',{name:'Previous step'}).click();
  await expect(next).toBeEnabled();
  await app.getByLabel('Formula in conventional notation').fill('p ↔ q ↔ r');
  await app.getByRole('button',{name:'Start',exact:true}).click();
  await expect(app.getByRole('status')).toContainText('Bracket repeated');
  await expect(next).toBeDisabled();
  await app.getByLabel('Formula in conventional notation').fill('¬¬p');
  await app.getByRole('button',{name:'Start',exact:true}).click();
  while(await next.isEnabled()) await next.click();
  await expect(app.locator('[data-output]')).toHaveText('p ¬ ¬');
  await expect(page.locator('[data-logic-app="notation-practice"] [data-count]')).toHaveText('Example 1 of 12');
  expect((await new AxeBuilder({page}).include('[data-logic-app="shunting-yard"]').analyze()).violations).toEqual([]);
});
test('reasoning practice distinguishes support, records first answers and allows review',async({page})=>{
  // Twelve cases, review/restart and an axe audit took 26s locally and exceeded
  // 30s on the Linux runner. Give this complete scenario its own 90s budget.
  test.slow();
  await page.goto('/exercises/logic-and-ai/');
  const app=page.locator('[data-logic-app="reasoning-practice"]');
  await expect(app.locator('[data-count]')).toHaveText('Case 1 of 12');
  await app.locator('[data-choice="deductive"]').click();
  await expect(app.getByRole('status')).toContainText('Correct: Deductive guarantee');
  await app.getByRole('button',{name:'Next case'}).click();
  await app.locator('[data-choice="inductive"]').click();
  await expect(app.getByRole('status')).toContainText('98 out of 100');
  await app.getByRole('button',{name:'Next case'}).click();
  await app.locator('[data-choice="deductive"]').click();
  await expect(app.getByRole('status')).toContainText('Best assessment: Insufficient support');
  await expect(app.locator('[data-score]')).toHaveText('2 of 3 first answers correct');
  await app.getByRole('button',{name:'Previous case'}).click();
  await expect(app.locator('[data-choice="inductive"]')).toHaveAttribute('aria-pressed','true');
  await expect(app.locator('[data-choice="deductive"]')).toBeDisabled();
  await app.getByRole('button',{name:'Next case'}).click();
  const cases=JSON.parse(await app.locator('[data-cases]').textContent());
  for(let i=3;i<cases.length;i++) {
    await app.getByRole('button',{name:'Next case'}).click();
    await app.locator(`[data-choice="${cases[i].category}"]`).click();
  }
  await expect(app.locator('[data-score]')).toHaveText('11 of 12 first answers correct');
  expect((await new AxeBuilder({page}).include('[data-logic-app="reasoning-practice"]').analyze()).violations).toEqual([]);
  await app.getByRole('button',{name:'Try again'}).click();
  await expect(app.locator('[data-score]')).toHaveText('No answers yet');
  for(const route of ['logic-and-ai','formal-languages']) {
    await page.goto(`/exercises/${route}/`);
    const missing=await page.locator('.question.solved').evaluateAll(questions=>questions.filter(q=>!document.getElementById(`${q.id}Solution`)).map(q=>q.id));
    expect(missing).toEqual([]);
  }
});
test('reviewed content has a working gloss, plain promise and no duplicate app solutions',async({page})=>{
  await page.goto('/exercises/formal-languages/');
  await expect(page.locator('#ambiguity .glossary-term')).toHaveAttribute('href',/glossary\/#ambiguity$/);
  await expect(page.locator('#over-expressiveness .sentence-example, #over-expressiveness code')).toHaveCount(0);
  await expect(page.locator('#over-expressiveness .math-inline').first()).toContainText('If you behave well');
  await expect(page.locator('#omitting-brackets .btn-solution, #building-formulas .btn-solution')).toHaveCount(0);
  await expect(page.locator('#polish-notation')).toContainText('→∧p→pq¬q');
  await expect(page.locator('#polish-notation')).not.toContainText('CKpCpqNq');
  await page.goto('/exercises/logic-and-ai/');
  const sections=await page.locator('.question').evaluateAll(items=>items.map(el=>el.id));
  expect(sections.slice(-2)).toEqual(['research','discussion']);
  await expect(page.locator('#what-follows .btn-solution')).toHaveCount(0);
  await expect(page.locator('#recognizing-indicators > ol > li')).toHaveCount(4);
});
test('exercise formulas use Shanns and pages fit a phone width',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['preamble','logic-and-ai','formal-languages']) {
    await page.goto(`/exercises/${route}/`);
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.locator('.math-inline').first().evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Comic');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(page.locator('.katex')).toHaveCount(0);
  }
  const builder=page.locator('[data-logic-app="builder"]');
  for(const level of await builder.locator('.builder__level').all()) {
    await level.click(); await expect(builder.locator('[data-builder-goal]')).not.toContainText(/[₀-₉]/);
  }
});
