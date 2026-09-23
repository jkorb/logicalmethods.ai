/* Guards the rule that keeps CI green: a browser test measures the site, never
   the machine. Both halves of that rule are easy to break by habit — a fixed
   sleep reads as harmless, and a literal timeout reads as precise — so they are
   checked here rather than left to review. See docs/testing/ci-parity.md. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { budget, SLOW } from '../browser/budget.mjs';

const specs = async () => (await readdir('tests/browser')).filter(n => n.endsWith('.spec.mjs')).sort();

test('the CI budget scales, and only upwards', () => {
  const expectedScale = process.env.CI ? 3 : 1;
  assert.equal(SLOW, expectedScale, 'CI increases the budget; local runs keep the written value');
  assert.equal(budget(30000), 30000 * expectedScale);
  assert.ok(budget(1000) >= 1000, 'a budget may never shrink below its written value');
});

test('no browser spec waits for a duration', async () => {
  for (const name of await specs()) {
    const source = await readFile(`tests/browser/${name}`, 'utf8');
    assert.ok(!source.includes('waitForTimeout'),
      `${name}: waitForTimeout fails whenever the machine needs one millisecond more. ` +
      'Wait for the condition instead — expect(locator) and expect.poll retry.');
  }
});

/* A literal in setTimeout or a timeout option is a budget written for one
   machine. budget() is the same number, scaled where the machine is slower. */
test('per-test budgets scale with the machine', async () => {
  for (const name of await specs()) {
    const source = await readFile(`tests/browser/${name}`, 'utf8');

    for (const [line] of source.matchAll(/test\.setTimeout\([^)]*\)/g)) {
      assert.ok(line.includes('budget('),
        `${name}: ${line} — wrap the value in budget() so a slow runner gets more, not a failure`);
    }

    /* Short waits are a legitimate part of an assertion: they assert that
       something does NOT appear, and waiting the full budget for it would make
       the suite crawl. Longer ones are guarding against a slow machine and
       must scale. */
    for (const [line, ms] of source.matchAll(/timeout:\s*(\d+)/g)) {
      assert.ok(Number(ms) <= 3000,
        `${name}: ${line} — a timeout this long guards against a slow machine; use budget(${ms})`);
    }
  }
});

test('the budget module is the single source of the scale factor', async () => {
  const config = await readFile('playwright.config.mjs', 'utf8');
  assert.ok(config.includes("from './tests/browser/budget.mjs'"),
    'playwright.config.mjs must take its budgets from tests/browser/budget.mjs');
  for (const setting of ['timeout: budget(', 'actionTimeout: budget(', 'navigationTimeout: budget(']) {
    assert.ok(config.includes(setting), `playwright.config.mjs: ${setting}…) is missing`);
  }
});
