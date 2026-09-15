import { defineConfig } from '@playwright/test';

/* CI reads the log as a record and keeps the diagnostics as artifacts; a local
   or agent run reads it as feedback and pays for every line. The dot reporter
   prints the same failure blocks — message, call log and code frame — without a
   line per passing test, and skipping traces and screenshots also skips the
   attachment banners that point at them. Set CI=1 to get the full treatment. */
const ci = !!process.env.CI;

export default defineConfig({
  testDir: './tests/browser',
  outputDir: './tmp/test-results',
  reporter: [[ci ? 'list' : 'dot'], ['html', { outputFolder: 'tmp/playwright-report', open: 'never' }]],
  fullyParallel: true,
  forbidOnly: ci,
  retries: 0,
  workers: ci ? 2 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: ci ? 'retain-on-failure' : 'off',
    screenshot: ci ? 'only-on-failure' : 'off'
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
  ],
  // serve.mjs reads from disk per request, so a server left running from an
  // earlier run is never stale and saves a startup on each local iteration.
  webServer: { command: 'npm run serve:test', url: 'http://127.0.0.1:4173', reuseExistingServer: !ci }
});
