import {test, expect} from './fixtures.mjs';

async function checkGrowth(field) {
  await field.fill('p');
  const short = await field.evaluate(n => n.getBoundingClientRect().height);
  const line = await field.evaluate(n => parseFloat(getComputedStyle(n).lineHeight));
  expect(short).toBeLessThan(line * 2 + 8);
  await field.fill('p\nq\nr\np ∧ q');
  await expect.poll(() => field.evaluate(n => n.getBoundingClientRect().height)).toBeGreaterThan(short * 2);
  await field.fill('p');
  await expect.poll(() => field.evaluate(n => n.getBoundingClientRect().height)).toBeLessThan(short + 2);
}

test('content sizing covers dynamically inserted model inputs', async ({page}) => {
  await page.goto('/exercises/boolean/');
  const root = page.locator('[data-kind="model-exercise"][data-preset="custom"]');
  await root.getByRole('button', {name:'Edit inference',exact:true}).click();
  await checkGrowth(root.locator('textarea'));
});

test('content sizing covers flashcard fields revealed after loading', async ({page}) => {
  await page.goto('/study/flashcards/');
  const root = page.locator('[data-logic-app="flashcards"]');
  await root.getByRole('button', {name:'Settings',exact:true}).click();
  await root.getByLabel('4. Boolean algebra').check();
  await root.getByRole('button', {name:'Back',exact:true}).click();
  await root.getByRole('button', {name:'Start a round',exact:true}).click();
  await checkGrowth(root.locator('textarea'));
});

test('textarea fallback grows, shrinks and resizes a newly revealed field', async ({page}) => {
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = (...args) => args[0] === 'field-sizing' ? false : supports(...args);
  });
  await page.goto('/study/flashcards/');
  await page.addStyleTag({content:'textarea {field-sizing:fixed !important;}'});
  const root = page.locator('[data-logic-app="flashcards"]');
  await root.getByRole('button', {name:'Settings',exact:true}).click();
  await root.getByLabel('4. Boolean algebra').check();
  await root.getByRole('button', {name:'Back',exact:true}).click();
  await root.getByRole('button', {name:'Start a round',exact:true}).click();
  const field = root.locator('textarea');
  await expect.poll(() => field.evaluate(n => n.style.height)).not.toBe('');
  await checkGrowth(field);
});
