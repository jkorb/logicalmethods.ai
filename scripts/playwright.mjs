import { spawnSync } from 'node:child_process';
import path from 'node:path';
// Keep browser binaries with other ignored test artifacts, on macOS and CI alike.
const args = process.argv.slice(2);
const full = args.includes('--full');
const result = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', ...args.filter(arg => arg !== '--full')], {
  stdio: 'inherit',
  env: { ...process.env, ...(full ? { BROWSER_COVERAGE: 'full' } : {}), PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || path.resolve('tmp/playwright-browsers') }
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
