import { test as base, expect } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import { parse } from 'yaml';

export const TEST_ORIGIN = 'http://127.0.0.1:4173';
const SITE_HOSTS = ['logicalmethods.ai', 'www.logicalmethods.ai'];

/* The normal Hugo test build keeps production absolute URLs, so a browser test
   must send them to the local artifact instead of the live site. A preview
   built with a localhost base URL would mask a missing rewrite, so this routing
   is what every suite shares rather than a different build.

   Third-party resources are stubbed; `npm run check:external` checks that they
   actually resolve. Pass `offsite: 'abort'` where the test needs the request to
   fail rather than succeed. `tests/browser/privacy.spec.mjs` deliberately does
   not use this helper: it records and aborts offsite requests to prove the site
   makes none, which is the opposite of stubbing them. */
export async function routeToTestSite(target, { offsite = 'stub' } = {}) {
  await target.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (SITE_HOSTS.includes(url.hostname)) {
      try {
        await route.fulfill({ response: await route.fetch({ url: `${TEST_ORIGIN}${url.pathname}${url.search}` }) });
      } catch (error) {
        // A page that navigates while a request is in flight disposes it. The
        // browser has abandoned the request either way, so there is nothing to
        // fulfil; anything else is a real failure and still throws.
        if (!/disposed|closed|Target (page|closed)/i.test(error.message)) throw error;
      }
    } else if (url.hostname === '127.0.0.1') await route.continue();
    else if (offsite === 'abort') await route.abort();
    else await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>External content stub</title>' });
  });
}

// The common case: every page in the test already points at the local build.
export const test = base.extend({
  page: async ({ page }, use) => {
    await routeToTestSite(page);
    await use(page);
  }
});

export { base as baseTest, expect };

/* Chapters as their front matter describes them, so a test can state an
   invariant instead of listing chapters. Hugo publishes a bundle at its
   lowercased name, which is why `FOL` is served from /textbook/fol/. */
export async function chapters(section) {
  const found = [];
  for (const entry of await readdir(`content/${section}`, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const source = await readFile(`content/${section}/${entry.name}/index.md`, 'utf8').catch(() => null);
    if (!source) continue;
    const data = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '') || {};
    if (data.build?.render === 'never') continue;
    found.push({ slug: entry.name.toLowerCase(), title: data.title ?? '', weight: data.weight ?? 0, locked: !!data.locked });
  }
  return found.sort((a, b) => a.weight - b.weight);
}
