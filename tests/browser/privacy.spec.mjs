import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { globSync } from 'node:fs';

/* The site tells readers it contacts nobody. This is what keeps that true.

   The built pages address their own assets by absolute URL, so the site's own
   domain is rewritten to the local build exactly as the other specs do — that
   is still first party. Everything else is recorded and blocked, so a stray
   third-party request shows up as a failure rather than as traffic. */
const LOCAL = ['127.0.0.1', 'localhost', 'logicalmethods.ai', 'www.logicalmethods.ai'];

function watch(page) {
  const offsite = [];
  page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['logicalmethods.ai', 'www.logicalmethods.ai'].includes(url.hostname)) {
      await route.fulfill({ response: await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` }) });
    } else if (url.hostname === '127.0.0.1') {
      await route.continue();
    } else {
      offsite.push(`${route.request().resourceType()} ${url.href}`);
      await route.abort();
    }
  });
  return offsite;
}

const PAGES = ['/', '/about/', '/textbook/', '/textbook/formal-languages/', '/textbook/boolean/',
               '/textbook/glossary/', '/textbook/tools/', '/exercises/', '/exercises/preamble/',
               '/exercises/formal-languages/', '/slides/', '/slides/boolean/',
               '/tutoraat/', '/verdiepingspakketten/'];

for (const route of PAGES) {
  test(`no third-party requests on load: ${route}`, async ({ page }) => {
    const offsite = watch(page);
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    expect(offsite, `${route} fetched from somewhere else`).toEqual([]);
  });
}

test('released slides stay local and deferred slides expose no embed', async ({ page }) => {
  const offsite = watch(page);
  expect((await page.goto('/slides/logic-and-ai/')).status()).toBe(200);
  await expect(page.locator('[data-slide-deck]')).toHaveAttribute('data-ready', 'true');
  await page.getByLabel('Next slide', { exact: true }).click();
  await expect(page).toHaveURL(/#slide-2$/);
  expect((await page.goto('/slides/boolean/')).status()).toBe(200);
  await expect(page.locator('iframe, [data-embed], [data-slide-deck]')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('awaiting content and image review');
  expect(offsite).toEqual([]);
});

test('the built site links no font, script or style to another host', async () => {
  const files = globSync('tmp/site/**/*.html');
  expect(files.length).toBeGreaterThan(40);
  const offenders = [];
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    // both quote styles: the link this test exists to catch was single-quoted
    for (const [, tag, url] of html.matchAll(/<(script|link|img|source|iframe)\b[^>]*\b(?:src|href)=["'](https?:\/\/[^"']+)["']/g)) {
      if (!LOCAL.includes(new URL(url).hostname)) offenders.push(`${file}: <${tag}> ${url}`);
    }
  }
  expect(offenders).toEqual([]);
});

test('what the site says about storage matches what it stores', async ({ page }) => {
  watch(page);
  await page.goto('/exercises/preamble/');
  const keys = () => page.evaluate(() => Object.keys(localStorage).sort());
  expect(await keys()).toEqual([]);            // nothing before the reader acts
  expect(await page.evaluate(() => document.cookie)).toBe('');

  await page.locator('#theme-toggle').click();
  const answer = page.getByLabel('LaTeX for the box above');
  await answer.press('Enter');
  await page.getByRole('button', { name: 'End round' }).click();
  expect(await keys()).toEqual(['lm-latex-drill-easy', 'lm-theme']);

  // the builder writes only when a level is finished, so finish the first one
  await page.goto('/exercises/formal-languages/');
  await page.locator('[data-builder-atom]').fill('p');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: 'p', exact: true }).click();
  await page.getByRole('button', { name: /^Negation,/ }).click();
  await expect(page.locator('[data-builder-goal]')).toHaveAttribute('data-state', 'done');
  expect(await keys()).toContain('lm-builder-done');
  expect(await page.evaluate(() => document.cookie)).toBe('');
});
