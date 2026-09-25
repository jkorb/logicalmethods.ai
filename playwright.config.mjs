import { defineConfig } from '@playwright/test';
import { ci, budget } from './tests/browser/budget.mjs';

/* Reporting: CI reads the log as a record and keeps the diagnostics as
   artifacts; a local or agent run reads it as feedback and pays for every line.
   The dot reporter prints the same failure blocks — message, call log and code
   frame — without a line per passing test. The `github` reporter prints nothing
   to stdout at all (`printsToStdio()` is false); it only emits the annotations
   that put a failure on the right line in the GitHub UI. `json` feeds
   scripts/ci-summary.mjs, which writes the run summary a person or an agent
   reads instead of the raw log.

   Timing: budgets come from tests/browser/budget.mjs so that a slow runner
   cannot fail a check that a fast laptop passes. See docs/testing/ci-parity.md. */

export default defineConfig({
  testDir: './tests/browser',
  outputDir: './tmp/test-results',
  reporter: [
    ['dot'],
    ...(ci ? [['github'], ['json', { outputFile: 'tmp/playwright-results.json' }]] : []),
    ['html', { outputFolder: 'tmp/playwright-report', open: 'never' }]
  ],
  fullyParallel: true,
  forbidOnly: ci,
  /* A runner that stalls once should not fail a deploy; a test that only passes
     on the second try is still a defect. So CI retries once and reports the
     result as flaky — scripts/ci-summary.mjs names every flaky test in the job
     summary, so the retry buys a green deploy without hiding anything. Locally
     a failure is a failure, first time. */
  retries: ci ? 1 : 0,
  // Two workers on a shared runner: more of them shortens the wall clock but
  // starves each test of CPU, which is the timing flakiness we are removing.
  workers: ci ? 2 : undefined,
  timeout: budget(30_000),
  expect: { timeout: budget(5_000) },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    actionTimeout: budget(10_000),
    navigationTimeout: budget(30_000),
    trace: ci ? 'retain-on-failure' : 'off',
    screenshot: ci ? 'only-on-failure' : 'off'
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
  ],
  // serve.mjs reads from disk per request, so a server left running from an
  // earlier run is never stale and saves a startup on each local iteration.
  webServer: [{
    command: 'npm run serve:test',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !ci,
    timeout: budget(60_000)
  }, {
    // tmp/fixture-site: the site plus the sample Reveal.js deck, never deployed.
    command: 'npm run serve:test -- --fixture',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: !ci,
    timeout: budget(60_000)
  }]
});
