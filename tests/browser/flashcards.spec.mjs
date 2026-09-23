import { test, expect } from './fixtures.mjs';
const app = page => page.locator('[data-logic-app="flashcards"]');
const button = (a, name) => a.getByRole('button', { name, exact: true });
const screen = (a, name) => a.locator(`[data-screen="${name}"]`);

test.beforeEach(async ({ page }) => { await page.goto('/study/flashcards/'); });

test('the app opens on a menu and shows one screen at a time', async ({ page }) => {
  const a = app(page);
  await expect(a).toHaveAttribute('data-mounted', 'true');
  await expect(screen(a, 'menu')).toBeVisible();
  for (const hidden of ['settings', 'study', 'boxes']) await expect(screen(a, hidden)).toBeHidden();
  await expect(button(a, 'Start a round')).toBeDisabled();
  await expect(button(a, 'Back')).toBeHidden();

  await button(a, 'Settings').click();
  await expect(screen(a, 'settings')).toBeVisible();
  await expect(screen(a, 'menu')).toBeHidden();
  await button(a, 'Back').click();
  await expect(screen(a, 'menu')).toBeVisible();
});

test('locked chapters cannot be chosen, and "all" takes the rest', async ({ page }) => {
  const a = app(page);
  await button(a, 'Settings').click();
  const locked = a.locator('[data-chapter][data-locked]');
  const chapters=JSON.parse(await a.locator('[data-chapters]').textContent());
  await expect(locked).toHaveCount(chapters.filter(c=>c.locked).length);
  for(const chapter of chapters) {
    const choice=a.locator('[data-chapter][value="'+chapter.id+'"]');
    if(chapter.locked)await expect(choice).toBeDisabled();
    else await expect(choice).toBeEnabled();
  }

  await a.locator('[data-all]').check();
  const open = a.locator('[data-chapter]:not([data-locked])');
  for (let i = 0; i < await open.count(); i++) await expect(open.nth(i)).toBeChecked();
  for(const choice of await locked.all())await expect(choice).not.toBeChecked();
  await expect(a.locator('[data-deck-line]')).toContainText('chapters');
});

test('a round draws a card, checks an answer and files it in a box', async ({ page }) => {
  const a = app(page);
  await button(a, 'Settings').click();
  await a.getByLabel('4. Boolean algebra').check();
  await button(a, 'Back').click();
  await button(a, 'Start a round').click();
  await expect(screen(a, 'study')).toBeVisible();
  await expect(a.locator('[data-clock]')).toBeHidden();      // no time limit by default
  expect((await a.locator('[data-front]').textContent()).trim()).not.toBe('');

  await a.getByLabel('Write the definition from memory').fill('not the definition');
  await button(a, 'Check').click();
  await expect(a.locator('[data-match]')).toHaveAttribute('data-same', 'false');
  await expect(a.locator('[data-back-text]')).not.toBeEmpty();
  // The suggested box after a miss is the first one; file it elsewhere anyway.
  await expect(button(a, 'Keep practising')).toHaveAttribute('data-suggested', 'true');
  await button(a, 'Getting there').click();

  await button(a, 'Back').click();
  await button(a, 'Card boxes').click();
  await expect(a.locator('[data-box-count="2"]')).toHaveText('1');
});

test('own cards are written first, then studied, and survive a save and load', async ({ page }) => {
  const a = app(page);
  await button(a, 'Add a card of my own').click();
  await a.getByLabel('The concept on the front').fill('Modus ponens');
  await button(a, 'Add').click();
  await expect(a.locator('[data-front]')).toHaveText('Modus ponens');
  await a.getByLabel('Write the definition in your own words').fill('From A and A → B, infer B.');
  await button(a, 'Save this card').click();
  await button(a, 'Start a round').click();
  await a.getByLabel('Write the definition from memory').fill('from a and a → b, infer b');
  await button(a, 'Check').click();
  await expect(a.locator('[data-match]')).toHaveAttribute('data-same', 'true');

  await button(a, 'Back').click();
  await button(a, 'Settings').click();
  const download = page.waitForEvent('download');
  await button(a, 'Save to a file').click();
  const saved = await download;
  expect(saved.suggestedFilename()).toMatch(/^logic-flashcards-\d{4}-\d{2}-\d{2}\.json$/);

  await button(a, 'Clear everything').click();
  await expect(a.locator('[data-deck-line]')).toContainText('No chapters chosen');
  await a.locator('[data-import]').setInputFiles(await saved.path());
  await expect(a.locator('[data-status]')).toContainText('Loaded 1 saved card');
});

test('a file the app did not write is refused by name, not by silence', async ({ page }) => {
  const a = app(page);
  await button(a, 'Settings').click();
  await a.locator('[data-import]').setInputFiles({ name: 'notes.json', mimeType: 'application/json',
    buffer: Buffer.from('{"kind":"something-else"}') });
  await expect(a.locator('[data-status]')).toContainText('not saved by the flashcards app');
});

test('a time limit shows a countdown, and F stays out of the answer field', async ({ page }) => {
  const a = app(page);
  await button(a, 'Settings').click();
  await a.getByLabel('4. Boolean algebra').check();
  await a.getByLabel('A countdown while you answer').selectOption('60');
  await button(a, 'Back').click();
  await button(a, 'Start a round').click();
  await expect(a.locator('[data-clock]')).toBeVisible();
  await expect(a.locator('[data-clock]')).toHaveText(/^[01]:[0-5]\d$/);
  await expect(button(a, 'Full screen')).toBeVisible();

  // Typing an f into a definition must not throw the reader into full screen.
  const answer = a.getByLabel('Write the definition from memory');
  await answer.fill('f');
  await page.keyboard.press('f');
  expect(await page.evaluate(() => document.fullscreenElement !== null)).toBe(false);
  await expect(answer).toHaveValue('ff');
});
