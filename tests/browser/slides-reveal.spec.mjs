import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { parse } from 'yaml';
import { reviewScreenshot } from './review-screenshot.mjs';
import { baseTest as test, expect, routeToTestSite } from './fixtures.mjs';
import AxeBuilder from '@axe-core/playwright';

/* The Reveal.js deck framework, against the sample deck in
   tests/fixtures/reveal-deck/. scripts/build.mjs builds it into the fixture
   site only, which is never deployed; see docs/slides/reveal/testing.md. */
const DECK = 'http://127.0.0.1:4174/slides/reveal-fixture/';
const COUNT = 9;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
// Role queries: Reveal.js keeps its own hidden arrows, labelled "next slide".
const button = (scope, name) => scope.getByRole('button', { name, exact: true });

test.beforeEach(async ({ context }) => { await routeToTestSite(context, { offsite: 'abort' }); });

async function open(page, hash = '') {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  expect((await page.goto(DECK + hash)).status()).toBe(200);
  await expect(page.locator('[data-reveal-deck]')).toHaveAttribute('data-deck-ready', 'true');
  return errors;
}

test('the deck renders every slide from Markdown, with the book\'s shortcodes and apps', async ({ page }) => {
  const offsite = [];
  page.on('request', r => { if (!['127.0.0.1', 'logicalmethods.ai', 'www.logicalmethods.ai'].includes(new URL(r.url()).hostname)) offsite.push(r.url()); });
  const errors = await open(page);
  const slides = page.locator('.deck-canvas > .slides > section');
  await expect(slides).toHaveCount(COUNT);
  // Only slides are sections: an app's own <section> would be taken for a slide.
  await expect(page.locator('.deck-canvas .slides section')).toHaveCount(COUNT);
  for (let i = 1; i <= COUNT; i++) await expect(slides.nth(i - 1)).toHaveId(`slide-${i}`);
  await expect(page.locator('#slide-1')).toContainText('Reveal.js fixture');
  await expect(page.locator('#slide-3 .callout--definition')).toContainText('Boolean valuation');
  await expect(page.locator('#slide-4 .slide__column')).toHaveCount(2);
  await expect(page.locator('#slide-5 [role="region"][data-logic-app="sat"]')).toHaveAttribute('data-mounted', 'true');
  await expect(page.locator('#slide-6 [data-logic-app="boolean"]')).toHaveAttribute('data-mounted', 'true');
  await expect(page.locator('#slide-7 .highlight')).toContainText('num += 1');
  const ids = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id));
  expect(ids.length).toBe(new Set(ids).size);
  expect(errors).toEqual([]); expect(offsite).toEqual([]);
});

test('keyboard, clicker, menu and URL navigation', async ({ page }) => {
  await open(page);
  const deck = page.locator('[data-reveal-deck]');
  await expect(page.getByLabel('Go to slide')).toContainText(`1 / ${COUNT} · Reveal.js fixture`);
  await expect(button(page, 'Previous slide')).toBeDisabled();
  await deck.focus();
  await page.keyboard.press('PageDown'); await expect(page).toHaveURL(/#slide-2$/);
  await page.keyboard.press('ArrowRight'); await expect(page).toHaveURL(/#slide-3$/);
  await page.keyboard.press('PageUp'); await expect(page).toHaveURL(/#slide-2$/);
  await page.keyboard.press('Space'); await expect(page).toHaveURL(/#slide-3$/);
  await page.keyboard.press('Shift+Space'); await expect(page).toHaveURL(/#slide-2$/);
  await expect(page.locator('#slide-2')).toBeVisible();
  await page.reload();
  await expect(deck).toHaveAttribute('data-deck-ready', 'true');
  await expect(page.locator('#slide-2')).toBeVisible();
  await expect(page.getByLabel('Go to slide')).toContainText('2 / 9 · Goals');
  await deck.focus(); await page.keyboard.press('End');
  await expect(page).toHaveURL(/#slide-9$/);
  await expect(button(page, 'Next slide')).toBeDisabled();
  await page.keyboard.press('Home'); await expect(page).toHaveURL(/#slide-1$/);
  await page.getByLabel('Go to slide').click();
  await page.locator('[data-deck-choice="4"]').click();
  await expect(page).toHaveURL(/#slide-4$/);
  await expect(page.locator('#slide-4')).toBeVisible();
  await expect(page.locator('#slide-3')).toBeHidden();
  await button(page, 'Next slide').click(); await expect(page).toHaveURL(/#slide-5$/);
  // A link to a slide works like the Excalidraw viewer's.
  await page.goto(DECK + '#slide-7');
  await expect(page.locator('#slide-7')).toBeVisible();
});

test('fragments step before the slide changes', async ({ page }) => {
  await open(page, '#slide-8');
  const fragments = page.locator('#slide-8 .fragment');
  await expect(fragments.nth(0)).not.toHaveClass(/visible/);
  await button(page, 'Next slide').click();
  await expect(fragments.nth(0)).toHaveClass(/visible/);
  await expect(page).toHaveURL(/#slide-8$/);
  await button(page, 'Next slide').click();
  await expect(fragments.nth(1)).toHaveClass(/visible/);
  await button(page, 'Next slide').click();
  await expect(page).toHaveURL(/#slide-9$/);
});

test('apps keep their own keys; a clicker still changes the slide', async ({ page }) => {
  await open(page, '#slide-5');
  const sat = page.locator('#slide-5 [data-logic-app="sat"]');
  const next = button(sat, 'Next step');
  await next.click();
  await expect(sat.getByRole('status')).not.toContainText('loading');
  await next.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');
  await expect(page).toHaveURL(/#slide-5$/);
  await expect(next).toBeFocused();
  await page.keyboard.press('PageDown');
  await expect(page).toHaveURL(/#slide-6$/);

  const circuit = page.locator('#slide-6 [data-logic-app="boolean"]');
  const toggle = button(circuit, 'Toggle INPUT₁');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/#slide-6$/);
  await page.keyboard.press('PageUp');
  await expect(page).toHaveURL(/#slide-5$/);

  // Typing in an app's field never changes the slide, whatever the key.
  await button(sat, 'Edit input').click();
  await sat.locator('textarea').pressSequentially(' f');
  await sat.locator('textarea').press('PageDown');
  await expect(sat.locator('textarea')).toHaveValue(/ f/);
  await expect(page).toHaveURL(/#slide-5$/);
});

const fits = slide => slide.scrollHeight <= slide.clientHeight && slide.scrollWidth <= slide.clientWidth;
// Regions of a freshly shown slide that would draw a scrollbar: none should,
// until an app's content unfolds.
const scrollbars = slide => [slide, ...slide.querySelectorAll('*')].filter(element => {
  const style = getComputedStyle(element);
  return (/auto|scroll/.test(style.overflowX) && element.scrollWidth > element.clientWidth)
    || (/auto|scroll/.test(style.overflowY) && element.scrollHeight > element.clientHeight);
}).map(element => `${element.tagName.toLowerCase()}.${element.className}`);

test('every slide is fitted to its canvas; on an app slide only the app is zoomed', async ({ page }) => {
  await open(page);
  for (let i = 1; i <= COUNT; i++) {
    await page.evaluate(i => { location.hash = `#slide-${i}`; }, i);
    await expect(page.locator(`#slide-${i}`)).toBeVisible();
    expect(await page.locator(`#slide-${i}`).evaluate(fits), `slide ${i} fits`).toBe(true);
    expect(await page.locator(`#slide-${i}`).evaluate(scrollbars), `slide ${i} scrolls nowhere`).toEqual([]);
  }
  // The circuit is too tall as it stands: its app is zoomed, its title is not.
  await page.evaluate(() => { location.hash = '#slide-6'; });
  const slide = page.locator('#slide-6');
  await expect(slide).toHaveAttribute('data-fit-scope', 'apps');
  const [title, app] = await slide.evaluate(s => [getComputedStyle(s.querySelector('h2')).zoom, getComputedStyle(s.querySelector('.logic-app')).zoom]);
  expect(title).toBe('1');
  // An app that grows while you step through it is fitted again.
  await page.evaluate(() => { location.hash = '#slide-5'; });
  const sat = page.locator('#slide-5 [data-logic-app="sat"]');
  await button(sat, 'Last step').click();
  await expect.poll(() => page.locator('#slide-5').evaluate(fits)).toBe(true);
  expect(Number(app)).toBeGreaterThan(0);
});

test('an app shows what a lecture walks through, not what a reader needs alone', async ({ page }) => {
  await open(page, '#slide-5');
  const sat = page.locator('#slide-5 [data-logic-app="sat"]');
  await expect(button(sat, 'Next step')).toBeVisible();
  for (const hidden of ['.sat-help', '.sat-example-description', '[data-alternative]']) await expect(sat.locator(hidden)).toBeHidden();
  await page.evaluate(() => { location.hash = '#slide-6'; });
  const circuit = page.locator('#slide-6 [data-logic-app="boolean"]');
  await expect(button(circuit, 'Toggle INPUT₁')).toBeVisible();
  for (const hidden of ['.boolean-app__utilities', '[data-export-image]', '.boolean-circuit__instruction']) await expect(circuit.locator(hidden)).toBeHidden();
});

test('a tree keeps its lines, and its nodes light up step by step', async ({ page }) => {
  await open(page, '#slide-7');
  const tree = page.locator('#slide-7 .syntax-tree');
  // Siblings sit on one line: the slide's list spacing must not shift a child.
  const tops = await tree.locator(':scope > ul > li > ul > li > span').evaluateAll(spans => spans.map(span => Math.round(span.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
  const node = label => tree.locator('span.tree-step', { hasText: new RegExp(`^${label}$`) });
  await expect(node('→')).not.toHaveClass(/visible/);
  const next = button(page, 'Next slide');
  await next.click();
  await expect(node('→')).toHaveClass(/current-fragment/);
  await next.click(); await next.click();
  // Equal steps light up together; earlier ones stay marked as visited.
  await expect(node('p')).toHaveClass(/current-fragment/);
  await expect(node('q')).toHaveClass(/current-fragment/);
  await expect(node('∧')).toHaveClass(/visible/);
  await expect(page).toHaveURL(/#slide-7$/);
});

test('the title slide carries the mascot and no author, and slide 2 the learning goals', async ({ page }) => {
  await open(page);
  await expect(page.locator('#slide-1 svg.mascot[data-pose="board"]')).toBeVisible();
  await expect(page.locator('#slide-1')).not.toContainText('Test fixture');
  await expect(page.locator('#slide-2 .callout--objectives')).toHaveCount(1);
});

test('the text of every slide can be read in order below the deck', async ({ page }) => {
  await open(page);
  const text = page.locator('[data-deck-text]');
  await text.locator('summary').click();
  const entries = text.locator('[data-deck-text-slides] > section');
  await expect(entries).toHaveCount(COUNT);
  await expect(entries.nth(0).locator('h2 a')).toHaveAttribute('href', '#slide-1');
  await expect(entries.nth(2)).toContainText('Boolean valuation');
  await expect(entries.nth(3)).toContainText('Figure: ');
  await expect(entries.nth(4)).toContainText('Interactive app: ');
  // Apps and pictures become words; nothing in the text is interactive or hidden.
  await expect(text.locator('[data-logic-app], svg:not(summary svg), .fragment')).toHaveCount(0);
  await expect(entries.nth(7)).toContainText('First this.');
  const ids = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id));
  expect(ids.length).toBe(new Set(ids).size);
  await text.locator('a[href="#slide-5"]').click();
  await expect(page.locator('#slide-5')).toBeVisible();
});

test('full screen, accessible controls and themes, narrow layout', async ({ page }, info) => {
  for (const scheme of ['light', 'dark']) {
    // The theme is set before first paint, so each scheme needs a fresh load.
    await page.emulateMedia({ colorScheme: scheme });
    await open(page);
    for (const slide of [2, 3, 5, 6]) {
      await page.evaluate(slide => { location.hash = `#slide-${slide}`; }, slide);
      await expect(page.locator(`#slide-${slide}`)).toBeVisible();
      // On the page the deck is a preview at the old viewer's width, so the
      // canvas is scaled down and an app's buttons can fall under 24px; full
      // screen, where a lecture is given, is audited for target size below.
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).disableRules(['target-size']).include('.reveal-deck').analyze();
      expect(violations.map(v => `slide ${slide}, ${scheme}: ${v.id}: ${v.help}`)).toEqual([]);
    }
    await reviewScreenshot(page.locator('.reveal-deck'), { path: info.outputPath(`deck-${scheme}.png`) });
  }
  await page.evaluate(() => { location.hash = '#slide-5'; });
  await expect(page.locator('#slide-5')).toBeVisible();
  await page.evaluate(() => { location.hash = '#slide-3'; });
  const formula = page.locator('#slide-3 .math-content');
  const size = await formula.evaluate(element => getComputedStyle(element).fontSize);
  await page.evaluate(() => { location.hash = '#slide-5'; });
  await page.getByRole('button', { name: 'Full screen', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.matches('[data-reveal-deck]'))).toBe(true);
  // The canvas is scaled up, not its contents: a formula keeps its size once
  // the page has refitted to the new window.
  await page.evaluate(() => { location.hash = '#slide-3'; });
  await page.evaluate(() => new Promise(done => { dispatchEvent(new Event('resize')); requestAnimationFrame(() => requestAnimationFrame(done)); }));
  expect(await formula.evaluate(element => getComputedStyle(element).fontSize)).toBe(size);
  await page.evaluate(() => { location.hash = '#slide-5'; });
  // The canvas grows to the width of the screen.
  await expect.poll(() => page.locator('.deck-canvas').evaluate(canvas => innerWidth - canvas.getBoundingClientRect().width)).toBeLessThan(1);
  if (info.project.name === 'desktop') {
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).include('.reveal-deck').analyze();
    expect(violations.map(v => `slide 5, full screen: ${v.id}: ${v.help}`)).toEqual([]);
  }
  await page.keyboard.press('PageDown'); await expect(page).toHaveURL(/#slide-6$/);
  await reviewScreenshot(page, { path: info.outputPath('fullscreen.png') });
  await page.getByRole('button', { name: 'Exit full screen', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBeNull();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
});

test('without JavaScript every slide is readable in sequence', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await routeToTestSite(context, { offsite: 'abort' });
  const page = await context.newPage();
  await page.goto(DECK);
  await expect(page.locator('.deck-canvas > .slides > section:visible')).toHaveCount(COUNT);
  await expect(page.locator('[data-deck-controls]:visible')).toHaveCount(0);
  await expect(page.locator('#slide-8 .fragment').first()).toBeVisible();
  await expect(page.locator('[data-deck-text]')).toBeHidden();
  await context.close();
});

/* Every real deck in the Reveal.js format, found from its front matter, so a
   migrated lecture is covered without editing this file. Hugo publishes a
   bundle at its lowercased name. */
const decks = readdirSync('content/slides', { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(`content/slides/${entry.name}/index.md`))
  .map(entry => {
    const source = readFileSync(`content/slides/${entry.name}/index.md`, 'utf8');
    return { slug: entry.name.toLowerCase(), data: parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '') || {} };
  })
  .filter(({ data }) => data.layout === 'reveal_slides' && data.build?.render !== 'never');

for (const { slug } of decks) {
  test(`${slug}: the deck loads locally, mounts its apps, and every slide fits`, async ({ page }, info) => {
    const errors = []; const offsite = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', r => { if (!['127.0.0.1', 'logicalmethods.ai', 'www.logicalmethods.ai'].includes(new URL(r.url()).hostname)) offsite.push(r.url()); });
    expect((await page.goto(`/slides/${slug}/`)).status()).toBe(200);
    await expect(page.locator('[data-reveal-deck]')).toHaveAttribute('data-deck-ready', 'true');
    const count = await page.locator('.deck-canvas > .slides > section').count();
    await expect(page.locator('.deck-canvas .slides section')).toHaveCount(count);
    await expect(page.locator('.deck-canvas [data-logic-app]:not([data-mounted])')).toHaveCount(0);
    await expect(page.locator('[data-deck-text-slides] > section')).toHaveCount(count);
    // Each slide is fitted to its canvas, but not below 40%: a slide that still
    // scrolls holds too much. On a phone an app takes its narrow, taller
    // layout, and a slide with an app may scroll there.
    const overflowing = [];
    const scrolling = [];
    for (let i = 1; i <= count; i++) {
      await page.evaluate(i => { location.hash = `#slide-${i}`; }, i);
      await expect(page.locator(`#slide-${i}`)).toBeVisible();
      if (info.project.name === 'mobile' && await page.locator(`#slide-${i} .logic-app`).count()) continue;
      if (!await page.locator(`#slide-${i}`).evaluate(fits)) overflowing.push(i);
      const regions = await page.locator(`#slide-${i}`).evaluate(scrollbars);
      if (regions.length) scrolling.push(`${i}: ${regions.join(', ')}`);
    }
    expect(overflowing, `slides that do not fit ${info.project.name}: cut them or split them`).toEqual([]);
    expect(scrolling, 'regions that show a scrollbar before anything unfolds').toEqual([]);
    expect(errors).toEqual([]); expect(offsite).toEqual([]);
  });
}
