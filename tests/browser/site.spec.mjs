import { testPassword, useTestPassword } from './solution-password.mjs';
import { test, expect } from './fixtures.mjs';

for (const route of ['/', '/textbook/', '/textbook/boolean/', '/exercises/logic-and-ai/', '/slides/logic-and-ai/', '/tutoraat/', '/verdiepingspakketten/']) {
  test(`page and first-party assets: ${route}`, async ({ page }, testInfo) => {
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
    expect((await page.goto(route)).status()).toBe(200);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('body')).toBeVisible();
    expect(await page.title()).not.toBe('');
    // Figures are lazy-loaded, so force them to resolve before asserting they exist.
    await page.locator('img').evaluateAll(images => images.forEach(i => { i.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 15000 });
    expect(await page.locator('img').evaluateAll(images => images.filter(i => i.naturalWidth === 0).map(i => i.src))).toEqual([]);
    expect(failures).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('page.png') });
  });
}

test('the section links in the header reach a chapter', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main"]');
  await expect(nav.getByRole('link', { name: 'Textbook' })).toBeVisible();
  await nav.getByRole('link', { name: 'Textbook' }).click();
  await expect(page).toHaveURL(/\/textbook\/$/);
  await page.getByRole('link', { name: /Logic and AI/ }).first().click();
  await expect(page).toHaveURL(/\/textbook\/logic-and-ai\/$/);
  await expect(page.locator('main h1')).toBeVisible();
});

test('exercise solution rejects wrong password, opens with Enter, and closes', async ({ page }) => {
  await useTestPassword(page);
  await page.goto('/exercises/logic-and-ai/');
  // A local preview must never use the live site's (possibly older) passwords.
  const scriptURL = await page.locator('script[src*="/js/exercises."]').getAttribute('src');
  expect(scriptURL).toMatch(/^\/js\/exercises\.[a-f0-9]+\.js$/);
  const button = page.locator('button[aria-controls="definitionsSolution"]');
  const solution = page.locator('#definitionsSolution');
  await expect(solution).toBeHidden();
  await button.click();
  await expect(page.locator('#passwordModal')).toBeVisible();
  await page.locator('#passwordInput').fill('incorrect-test-password');
  await page.locator('#passwordSubmitButton').click();
  await expect(page.locator('#passwordError')).toContainText('does not match');
  await expect(solution).toBeHidden();
  await page.locator('#passwordInput').fill(testPassword);
  await page.locator('#passwordInput').press('Enter');
  await expect(solution).toHaveClass(/\bcollapse\b.*\bshow\b/);
  await expect(solution).toBeVisible();
  await expect(page.locator('#passwordModal')).toBeHidden();
  await button.click();
  await expect(solution).toBeHidden();
});

test('custom notation renders with the loaded faces', async ({ page }) => {
  await page.goto('/textbook/boolean/');
  await expect(page.locator('.excalifont').first()).toBeVisible();
  await expect(page.locator('.Boolean').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px Excalifont'))).toBe(true);
  // Logic symbols are text in the patched object-language face, not images.
  // Boolean algebra spells its connectives, so the quantifier chapter is the
  // one that exercises the added glyphs.
  expect(await page.evaluate(() => document.fonts.check('16px "Comic Shanns Logic"'))).toBe(true);
  expect((await page.goto('/textbook/fol/')).status()).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => /[∀∃∧∨→⊨]/.test(document.body.innerText))).toBe(true);
  expect(await page.locator('img[src*="/img/forall"], img[src*="/img/conjunction"]').count()).toBe(0);
});

test('preamble and chapters use Unicode math without KaTeX', async ({ page }) => {
  const katexRequests = [];
  page.on('request', r => { if (/katex/i.test(r.url())) katexRequests.push(r.url()); });
  for (const path of ['/exercises/preamble/', '/textbook/formal-languages/']) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.math-inline').first()).toBeVisible();
    expect(await page.locator('.math-inline').first().evaluate(el => getComputedStyle(el).fontFamily)).toContain('Comic');
    await expect(page.locator('.katex')).toHaveCount(0);
  }
  expect(katexRequests).toEqual([]);
});

/* The boxed chapter contents is only useful while it is on screen, so a square
   in the corner carries the same list down the page. */
test('the chapter contents follows the reader once its box scrolls away', async ({ page }) => {
  await page.goto('/textbook/boolean/');
  const box = page.locator('.chapter .on-this-page');
  const mini = page.locator('.toc-mini');
  const toggle = page.getByRole('button', { name: 'Chapter contents' });
  const panel = page.locator('#toc-mini-panel');

  const sections = await box.locator('a').evaluateAll(links => links.map(a => a.getAttribute('href')));
  expect(sections.length).toBeGreaterThan(1);
  await expect(mini).toBeHidden();          // the box itself is still in view

  // put a section heading just below the header, so it is the one being read
  await page.evaluate(() => window.scrollTo(0,
    document.getElementById('models').getBoundingClientRect().top + window.scrollY - 100));
  await expect(toggle).toBeVisible();
  await expect(panel).toBeHidden();

  await toggle.click();
  await expect(panel).toBeVisible();
  expect(await panel.locator('a').evaluateAll(links => links.map(a => a.getAttribute('href'))))
    .toEqual(sections);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  // the copy tracks the section being read, exactly as the box does
  await expect(box.getByRole('link', { name: 'Models' })).toHaveAttribute('aria-current', 'true');
  await expect(panel.getByRole('link', { name: 'Models' })).toHaveAttribute('aria-current', 'true');

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await panel.getByRole('link').first().click();
  expect(new URL(page.url()).hash).toBe(sections[0]);
  await expect(panel).toBeHidden();         // the jump takes over from here

  // scrolling back to the box makes the copy redundant again
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(mini).toBeHidden();
});

/* A code block that scrolls sideways hides the ends of lines, and the language
   badge in the corner must not push them there. This caught a real regression:
   un-nesting the wrapper stopped .highlight's font-size applying twice, and the
   longest line stopped fitting. */
test('code blocks fit their column, and the language badge is clear of them', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  // Revised sources obey the current code layout convention; legacy chapters
  // retain their existing code and are covered by the page reflow checks.
  const routes = ['/textbook/logic-and-ai/', '/textbook/formal-languages/',
                  '/exercises/formal-languages/', '/assignments/assignment_3/'];
  const scrolling = [];
  let badges = 0;
  for (const route of routes) {
    expect((await page.goto(route)).status(), `Missing test page: ${route}`).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    scrolling.push(...await page.evaluate(here =>
      [...document.querySelectorAll('.highlight')]
        .filter(el => el.getBoundingClientRect().height > 0)
        .map((el, i) => ({ where: `${here} block ${i}`, over: Math.round(el.scrollWidth - el.clientWidth) }))
        .filter(row => row.over > 1)
        .map(row => `${row.where} overflows by ${row.over}px`), route));

    // the badge sits inside the block and above the first glyph, uncropped
    badges += await page.evaluate(() => {
      // a solution panel starts collapsed, and a hidden block has no geometry
      const shells = [...document.querySelectorAll('.code-block.has-lang-icon')]
        .filter(shell => shell.getBoundingClientRect().height > 0);
      for (const shell of shells) {
        const badge = shell.querySelector('.lang-badge').getBoundingClientRect();
        const box = shell.querySelector(':scope > .highlight').getBoundingClientRect();
        if (badge.top < box.top - 1 || badge.right > box.right + 1) throw new Error('badge outside the block');
        if (badge.width < 8 || badge.height < 8) throw new Error('badge collapsed');
        /* the padding box of <pre> starts above the text, so measure the text —
           walking the code box, not the shell, whose badge holds an SVG title */
        const walker = document.createTreeWalker(shell.querySelector(':scope > .highlight'), NodeFilter.SHOW_TEXT);
        let node; while ((node = walker.nextNode())) if (node.textContent.trim()) break;
        const range = document.createRange();
        range.selectNode(node);
        if (badge.bottom > range.getBoundingClientRect().top) throw new Error('badge overlaps the code');
      }
      return shells.length;
    });
  }
  expect(scrolling).toEqual([]);
  expect(badges, 'no language badges were checked').toBeGreaterThan(0);
});
