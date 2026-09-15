import { test, expect } from './fixtures.mjs';

test('glossary search matches terms, not definitions, and a fragment reveals a filtered term', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/textbook/glossary/');
  const input = page.getByRole('searchbox', { name: 'Find a term' });
  await input.fill('countermodel');
  await expect(page.locator('#countermodel')).toBeVisible();
  await expect(page.locator('#algorithm')).toBeHidden();
  await input.fill('cardinality');
  await expect(page.locator('#cardinality')).toBeVisible();
  await expect(page.locator('.glossary-entry:visible')).toHaveCount(1);
  // words that only appear in a definition must not match: matching them made
  // a query like "set" return most of the glossary
  await input.fill('finitely many steps');
  await expect(page.locator('#algorithm')).toBeHidden();
  await input.fill('bnf');   // a slug is a searchable alias for its term
  await expect(page.locator('#bnf')).toBeVisible();
  await input.fill('no-such-term-98765');
  await expect(page.getByRole('status')).toHaveText(/0 of .*Try another word/);
  await page.evaluate(() => { location.hash = 'countermodel'; });
  await expect(input).toHaveValue('');
  await expect(page.locator('#countermodel')).toBeVisible();
  await page.evaluate(() => { location.hash = '%invalid'; });
  expect(errors).toEqual([]);
});

test('term preview is keyboard accessible and opens the matching glossary entry', async ({ page, context }) => {
  await page.goto('/textbook/formal-languages/');
  const term = page.locator('main .glossary-term[href="/textbook/glossary/#algorithm"]').first();
  await term.scrollIntoViewIfNeeded();
  await term.focus();
  const preview = page.getByRole('tooltip');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveText(await term.getAttribute('data-glossary-definition'));
  const box = await preview.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
  await page.keyboard.press('Escape');
  await expect(preview).toBeHidden();
  await expect(term).toBeFocused();
  const target = await term.getAttribute('href');
  const tabOpened = context.waitForEvent('page');
  await term.press('Enter');
  const tab = await tabOpened;
  await tab.waitForLoadState();
  expect(new URL(tab.url()).pathname + new URL(tab.url()).hash).toBe(target);
  await expect(tab.locator('#algorithm')).toBeVisible();
});

test('hover preview remains open while the pointer moves onto it', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Touch has no persistent hover.');
  await page.goto('/textbook/formal-languages/');
  const term = page.locator('main .glossary-term[href="/textbook/glossary/#algorithm"]').first();
  await term.hover();
  const preview = page.getByRole('tooltip');
  await expect(preview).toBeVisible();
  await preview.hover();
  await expect(preview).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(preview).toBeHidden();
});

test('glossary and term links work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/textbook/glossary/#countermodel');
  await expect(page.locator('#countermodel')).toBeVisible();
  await expect(page.locator('.glossary-search')).toBeHidden();
  await expect(page.locator('#algorithm')).toBeVisible();
  await page.goto('/textbook/formal-languages/');
  const term = page.locator('main .glossary-term[href="/textbook/glossary/#algorithm"]').first();
  await expect(term).toHaveAttribute('title', /step-by-step procedure/);
  await expect(term).toHaveAttribute('href', '/textbook/glossary/#algorithm');
  await expect(term).toHaveAttribute('target', '_blank');
  await context.close();
});

test('reference pages are appendices and glossary links reach an explanation', async ({ page }) => {
  await page.goto('/textbook/glossary/');
  await expect(page.locator('.chapter__num')).toHaveText('Appendix B');
  await expect(page.locator('.breadcrumb-trail [aria-current="page"]')).toHaveText('Appendix B: Glossary');
  const link = page.locator('#proof-theory p:last-child a');
  await expect(link).toHaveAttribute('href', /\/textbook\/logic-and-ai\/#term-proof-theory-\d+$/);
  await link.click();
  const id = new URL(page.url()).hash.slice(1);
  await expect(page.locator(`[id="${id}"]`)).toHaveText(/proof theory/);
  await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
  await page.goto('/textbook/glossary/');
  await page.locator('#countermodel p:last-child a').click();
  // Which chapter defines a term moves as chapters are released; that it lands
  // on the passage explaining the term does not.
  await expect(page).toHaveURL(/\/textbook\/[a-z0-9-]+\/#term-countermodel-\d+$/);
  const countermodel = new URL(page.url()).hash.slice(1);
  await expect(page.locator(`[id="${countermodel}"]`)).toHaveText(/countermodel/i);
  await page.goto('/textbook/notation/');
  await expect(page.locator('.chapter__num')).toHaveText('Appendix A');
  await page.goto('/textbook/');
  for (const [path,letter] of [['notation','A'],['glossary','B']]) {
    const card = page.locator(`.chapter-card[href="/textbook/${path}/"]`);
    await expect(card.locator('.chapter-card__num')).toHaveText(letter);
    await expect(card.locator('.chapter-card__title')).toContainText('Appendix:');
  }
});
