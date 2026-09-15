import { test, expect } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';
import { POOLS, plain } from '../../assets/js/apps/latex-game.js';

/* The answer key comes from the app itself, so a symbol added to a pool is
   drilled here without the test having to be taught about it. */
const COMMAND = new Map(POOLS.hard.map(([show, answers]) => [plain(show), answers[0]]));

const drill = page => ({
  app: page.locator('.latex-game'),
  start: page.getByRole('button', { name: /Start|Play again/ }),
  skip: page.getByRole('button', { name: 'Skip' }),
  end: page.getByRole('button', { name: 'End round' }),
  answer: page.getByLabel('LaTeX for the box above'),
  symbol: page.locator('[data-game-symbol]'),
  score: page.locator('[data-game-score]'),
  best: page.locator('[data-game-best]'),
  time: page.locator('[data-game-time]'),
  status: page.locator('.latex-game__status')
});

// One correct answer for whatever is on screen; returns the symbol answered.
async function answerCorrectly({ answer, symbol }) {
  const shown = (await symbol.textContent()).trim();
  await answer.fill(COMMAND.get(shown));
  await answer.press('Enter');
  return shown;
}

test('the drill scores commands, rejects wrong ones, and stops on time', async ({ page }) => {
  await page.clock.install();
  await page.goto('/exercises/preamble/');
  const { start, skip, end, answer, symbol, score, time, status } = drill(page);

  await expect(skip).toBeDisabled();            // there is no round to skip in
  await expect(end).toBeDisabled();
  await expect(start).toBeEnabled();
  await expect(symbol).toHaveText('?');

  // the field is the start button: click in, press Enter, and you are playing
  await expect(answer).toHaveAttribute('placeholder', 'Press Enter to start');
  await answer.click();
  await answer.press('Enter');
  await expect(answer).toBeFocused();
  await expect(time).toHaveText('1:00');
  await expect(start).toBeDisabled();

  for (let round = 1; round <= 3; round++) {
    await answerCorrectly({ answer, symbol });
    await expect(score).toHaveText(String(round));
  }

  // a command that does not produce the symbol keeps the symbol and the score
  const stuck = (await symbol.textContent()).trim();
  await answer.fill('\\nosuchcommand');
  await answer.press('Enter');
  await expect(status).toContainText('not the LaTeX for this one');
  await expect(score).toHaveText('3');
  await expect(symbol).toHaveText(stuck);

  // and neither does the symbol itself: the task is to type the command
  await answer.fill(stuck);
  await answer.press('Enter');
  await expect(score).toHaveText('3');
  await expect(symbol).toHaveText(stuck);

  /* skipping moves on without scoring and without giving the answer away:
     the same prompt comes round again, so a reveal would waste it */
  await skip.click();
  await expect(status).toContainText('Skipped');
  await expect(status).not.toContainText(COMMAND.get(stuck));
  await expect(score).toHaveText('3');
  await expect(symbol).not.toHaveText(stuck);

  await page.clock.fastForward('01:00');
  await expect(time).toHaveText('0:00');
  await expect(status).toContainText('Time. Final score 3');
  await expect(status).toContainText('asks for 10');
  await expect(skip).toBeDisabled();
  await expect(end).toBeDisabled();
  await expect(start).toHaveAttribute('aria-label', 'Play again');
  // the field stays live, and focused, so Enter plays again
  await expect(answer).toBeEnabled();
  await expect(answer).toBeFocused();
  await expect(answer).toHaveAttribute('placeholder', 'Press Enter to replay');
});

test('the best score is kept per difficulty and survives a reload', async ({ page }) => {
  await page.clock.install();
  await page.goto('/exercises/preamble/');
  const { start, answer, symbol, score, best } = drill(page);

  await expect(best).toHaveText('0');
  await start.click();
  await answerCorrectly({ answer, symbol });
  await answerCorrectly({ answer, symbol });
  await expect(score).toHaveText('2');
  await page.clock.fastForward('01:00');
  await expect(best).toHaveText('2');

  // a harder level keeps its own best, and easy keeps its own after a reload
  await page.getByRole('radio', { name: 'Hard' }).check();
  await expect(best).toHaveText('0');
  await page.reload();
  await expect(drill(page).best).toHaveText('2');
});

test('the drill is inert and explains itself without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/exercises/preamble/');
  const { start, answer } = drill(page);
  await expect(start).toBeDisabled();
  await expect(answer).toBeDisabled();
  await expect(page.locator('[data-app-fallback]')).toContainText('Enable JavaScript');
  await expect(page.locator('[data-app-fallback] a')).toHaveAttribute('href', '/textbook/notation/#latex-cheat-sheet');
  await context.close();
});

/* The page-wide audit only ever sees the idle app, but everything interesting
   about this one appears after Start. */
test('a round in progress has no WCAG violations', async ({ page }) => {
  await page.goto('/exercises/preamble/');
  const { start, answer, symbol } = drill(page);
  await start.click();
  await answerCorrectly({ answer, symbol });
  await answer.fill('\\nosuchcommand');
  await answer.press('Enter');
  const { violations } = await new AxeBuilder({ page }).include('.latex-game')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
});

test('a round can be ended early, and the score still counts', async ({ page }) => {
  await page.clock.install();
  await page.goto('/exercises/preamble/');
  const { start, skip, end, answer, symbol, score, best, time, status } = drill(page);

  await start.click();
  await answerCorrectly({ answer, symbol });
  await expect(score).toHaveText('1');
  await expect(time).not.toHaveText('0:00');   // there is time left on the clock

  await end.click();
  await expect(status).toContainText('Round ended. Final score 1');
  await expect(best).toHaveText('1');
  await expect(skip).toBeDisabled();
  await expect(end).toBeDisabled();
  await expect(start).toHaveAttribute('aria-label', 'Play again');
  await expect(symbol).toHaveText('?');
});

test('medium asks for expressions and text commands, hard mixes everything in', async ({ page }) => {
  await page.goto('/exercises/preamble/');
  const { start, end, answer, symbol, score } = drill(page);

  // medium never repeats an easy prompt: it asks for what you build out of them
  const singles = new Set(POOLS.easy.map(([show]) => plain(show)));
  await page.getByRole('radio', { name: 'Medium' }).check();
  await start.click();
  for (let round = 1; round <= 6; round++) {
    const shown = (await symbol.textContent()).trim();
    expect(singles.has(shown), `${shown} is a single command, not an expression`).toBe(false);
    await answerCorrectly({ answer, symbol });
    await expect(score).toHaveText(String(round));
  }
  await end.click();

  await page.getByRole('radio', { name: 'Hard' }).check();
  await start.click();
  await answerCorrectly({ answer, symbol });
  await expect(score).toHaveText('1');
});

/* The box falls back through the system fonts, and a symbol no font can draw
   shows as an empty rectangle. Adding one must not be a silent failure. */
test('every character in every prompt has a glyph', async ({ page }) => {
  await page.goto('/exercises/preamble/');
  await page.evaluate(() => document.fonts.ready);
  const characters = [...new Set(POOLS.hard.flatMap(([show]) => [...plain(show)]))].filter(c => c.trim());
  expect(characters.length).toBeGreaterThan(80);   // a sanity check on the sweep itself
  const missing = await page.evaluate(list => {
    const family = getComputedStyle(document.querySelector('.latex-game__symbol')).fontFamily;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 90;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const draw = character => {
      ctx.clearRect(0, 0, 90, 90);
      ctx.font = `48px ${family}`;
      ctx.textBaseline = 'middle';
      ctx.fillText(character, 12, 45);
      return ctx.getImageData(0, 0, 90, 90).data.join(',');
    };
    // nothing has a glyph for plane 15, so its rendering is the missing one
    const notdef = draw(String.fromCodePoint(0xF0000));
    const empty = draw(' ');
    return list.filter(character => [notdef, empty].includes(draw(character)));
  }, characters);
  expect(missing).toEqual([]);
});

/* The keys sit next to the one already in use, and Tab is deliberately not one
   of them: it is how a keyboard user leaves the field. */
test('Shift+Enter skips, Escape ends the round, and Tab still moves on', async ({ page }) => {
  await page.clock.install();
  await page.goto('/exercises/preamble/');
  const { start, answer, symbol, score, status, skip, end } = drill(page);

  await answer.press('Enter');
  const first = (await symbol.textContent()).trim();
  await answer.fill('half an answer');
  await answer.press('Shift+Enter');
  await expect(symbol).not.toHaveText(first);      // moved on
  await expect(status).toContainText('Skipped');
  await expect(score).toHaveText('0');
  await expect(answer).toHaveValue('');

  await answerCorrectly({ answer, symbol });
  await expect(score).toHaveText('1');

  // Tab leaves the field rather than skipping, which is what Tab is for
  await answer.press('Tab');
  await expect(answer).not.toBeFocused();
  await expect(score).toHaveText('1');
  await expect(skip).toBeEnabled();

  await answer.press('Escape');
  await expect(status).toContainText('Round ended. Final score 1');
  await expect(end).toBeDisabled();
  await expect(start).toHaveAttribute('aria-label', 'Play again');

  // and Escape when there is no round to end does nothing
  await answer.press('Escape');
  await expect(status).toContainText('Round ended. Final score 1');
});
